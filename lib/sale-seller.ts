import type { Sale, SaleAssignableUser, SaleSellerType } from "@/lib/api";
import { getAssignableUserLabel } from "@/lib/user-display";

export type SaleSellerFormValue = {
  sellerType: SaleSellerType;
  internalUserId: string;
  externalSellerId: string;
  externalSellerName: string;
};

export const NEW_EXTERNAL_SELLER_VALUE = "__new__";

export function getSaleSellerLabel(
  sale: Pick<Sale, "created_by" | "external_seller_name">,
  assignableUsers: SaleAssignableUser[] = []
): string {
  if (sale.external_seller_name?.trim()) {
    return sale.external_seller_name;
  }

  return getAssignableUserLabel(assignableUsers, sale.created_by);
}

export function isExternalSale(
  sale: Pick<Sale, "external_seller_id" | "external_seller_name">
): boolean {
  return Boolean(sale.external_seller_id || sale.external_seller_name?.trim());
}

export function createDefaultSaleSellerValue(currentUserId: string | null): SaleSellerFormValue {
  return {
    sellerType: "internal",
    internalUserId: currentUserId ?? "",
    externalSellerId: "",
    externalSellerName: "",
  };
}

export function saleToSellerFormValue(
  sale: Pick<Sale, "created_by" | "external_seller_id" | "external_seller_name">,
  currentUserId: string | null
): SaleSellerFormValue {
  if (isExternalSale(sale)) {
    return {
      sellerType: "external",
      internalUserId: sale.created_by ?? currentUserId ?? "",
      externalSellerId: sale.external_seller_id ?? NEW_EXTERNAL_SELLER_VALUE,
      externalSellerName:
        sale.external_seller_id ? "" : sale.external_seller_name ?? "",
    };
  }

  return {
    sellerType: "internal",
    internalUserId: sale.created_by ?? currentUserId ?? "",
    externalSellerId: "",
    externalSellerName: "",
  };
}

export function validateSaleSellerValue(
  value: SaleSellerFormValue,
  canAssignUser: boolean
): string | null {
  if (value.sellerType === "internal") {
    if (!value.internalUserId) {
      return "Seleccioná un vendedor del sistema.";
    }
    return null;
  }

  if (value.externalSellerId && value.externalSellerId !== NEW_EXTERNAL_SELLER_VALUE) {
    return null;
  }

  if (!value.externalSellerName.trim()) {
    return "Ingresá el nombre del vendedor externo.";
  }

  return null;
}

export function saleSellerValueToPayload(
  value: SaleSellerFormValue,
  canAssignUser: boolean
): Pick<
  import("@/lib/api").CreateSaleRequest,
  "seller_type" | "created_by" | "external_seller_id" | "external_seller_name"
> {
  if (value.sellerType === "external") {
    const payload = {
      seller_type: "external" as const,
    };

    if (value.externalSellerId && value.externalSellerId !== NEW_EXTERNAL_SELLER_VALUE) {
      return {
        ...payload,
        external_seller_id: value.externalSellerId,
      };
    }

    return {
      ...payload,
      external_seller_name: value.externalSellerName.trim(),
    };
  }

  if (canAssignUser && value.internalUserId) {
    return {
      seller_type: "internal",
      created_by: value.internalUserId,
    };
  }

  return { seller_type: "internal" };
}
