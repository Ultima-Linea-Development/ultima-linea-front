import { Collection } from "mongodb";
import { ExternalSellerDocument } from "@/lib/server/models";
import { isAdminRole } from "@/lib/roles";
import { resolveExternalSeller } from "@/lib/server/external-sellers";
import { isAssignableStaffUser } from "@/lib/server/users";

export type SaleSellerType = "internal" | "external";

export type ResolveSaleSellerInput = {
  seller_type?: SaleSellerType;
  created_by?: string;
  external_seller_id?: string;
  external_seller_name?: string;
};

export type ResolvedSaleSeller = {
  created_by: string;
  external_seller_id?: string;
  external_seller_name?: string;
};

type AuthContext = {
  user_id: string;
  role: string;
};

function isExternalSellerInput(input: ResolveSaleSellerInput): boolean {
  return (
    input.seller_type === "external" ||
    Boolean(input.external_seller_id?.trim() || input.external_seller_name?.trim())
  );
}

export async function resolveSaleSellerForCreate(
  auth: AuthContext,
  externalSellers: Collection<ExternalSellerDocument>,
  input: ResolveSaleSellerInput
): Promise<ResolvedSaleSeller | { error: string; status: number }> {
  if (isExternalSellerInput(input)) {
    const seller = await resolveExternalSeller(externalSellers, {
      id: input.external_seller_id,
      name: input.external_seller_name,
    });

    if (!seller) {
      return { error: "Vendedor externo inválido", status: 400 };
    }

    return {
      created_by: auth.user_id,
      external_seller_id: seller.id,
      external_seller_name: seller.name,
    };
  }

  let assignedUserId = auth.user_id;
  const requestedAssignee = input.created_by?.trim();

  if (requestedAssignee) {
    if (!isAdminRole(auth.role)) {
      return { error: "No tenés permiso para asignar ventas a otro usuario", status: 403 };
    }
    if (!(await isAssignableStaffUser(requestedAssignee))) {
      return { error: "Usuario asignado inválido", status: 400 };
    }
    assignedUserId = requestedAssignee;
  }

  return { created_by: assignedUserId };
}

export async function resolveSaleSellerForUpdate(
  auth: AuthContext,
  externalSellers: Collection<ExternalSellerDocument>,
  input: ResolveSaleSellerInput
): Promise<
  | {
      set: Partial<ResolvedSaleSeller>;
      unset: string[];
    }
  | { error: string; status: number }
> {
  if (input.seller_type === "external" || isExternalSellerInput(input)) {
    const seller = await resolveExternalSeller(externalSellers, {
      id: input.external_seller_id,
      name: input.external_seller_name,
    });

    if (!seller) {
      return { error: "Vendedor externo inválido", status: 400 };
    }

    return {
      set: {
        external_seller_id: seller.id,
        external_seller_name: seller.name,
      },
      unset: [],
    };
  }

  if (input.seller_type === "internal") {
    const set: Partial<ResolvedSaleSeller> = {};
    const unset = ["external_seller_id", "external_seller_name"];

    const requestedAssignee = input.created_by?.trim();
    if (requestedAssignee) {
      if (!isAdminRole(auth.role)) {
        return { error: "No tenés permiso para reasignar ventas", status: 403 };
      }
      if (!(await isAssignableStaffUser(requestedAssignee))) {
        return { error: "Usuario asignado inválido", status: 400 };
      }
      set.created_by = requestedAssignee;
    } else if (!isAdminRole(auth.role)) {
      set.created_by = auth.user_id;
    }

    return { set, unset };
  }

  const requestedAssignee = input.created_by?.trim();
  if (!requestedAssignee) {
    return { set: {}, unset: [] };
  }

  if (!isAdminRole(auth.role)) {
    return { error: "No tenés permiso para reasignar ventas", status: 403 };
  }
  if (!(await isAssignableStaffUser(requestedAssignee))) {
    return { error: "Usuario asignado inválido", status: 400 };
  }

  return {
    set: { created_by: requestedAssignee },
    unset: [],
  };
}

export function parseOptionalSaleText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function shouldUnsetOptionalSaleText(value: unknown): boolean {
  return typeof value === "string" && value.trim() === "";
}
