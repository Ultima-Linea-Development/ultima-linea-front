import { Collection } from "mongodb";
import {
  ExternalSellerDocument,
  ProductDocument,
  SupplierOrderLineItem,
} from "@/lib/server/models";
import { resolveExternalSeller } from "@/lib/server/external-sellers";
import { isAssignableStaffUser } from "@/lib/server/users";
import type { ResolvedSaleSeller } from "@/lib/server/sale-seller";
import { nonDeletedProductFilter } from "@/lib/server/products";

export type ProductReservationFields = {
  reserved_for_user_id?: string;
  reserved_for_external_seller_id?: string;
  reserved_for_external_seller_name?: string;
};

export type LineItemReservationInput = {
  product_id?: string;
  reserved?: boolean;
  reserved_seller_type?: "internal" | "external";
  reserved_for_user_id?: string;
  reserved_for_external_seller_id?: string;
  reserved_for_external_seller_name?: string;
};

export const PRODUCT_RESERVATION_UNSET_FIELDS = {
  reserved_for_user_id: "",
  reserved_for_external_seller_id: "",
  reserved_for_external_seller_name: "",
} as const;

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function lineItemHasReservation(
  item: Pick<
    LineItemReservationInput,
    "reserved" | "product_id"
  >
): boolean {
  return Boolean(item.reserved && item.product_id?.trim());
}

export function getReservedProductIds(
  items: Pick<LineItemReservationInput, "reserved" | "product_id">[]
): string[] {
  return items
    .filter(lineItemHasReservation)
    .map((item) => item.product_id!.trim())
    .filter(Boolean);
}

export function getLineItemReservationFields(
  item: Pick<
    LineItemReservationInput,
    | "reserved"
    | "reserved_for_user_id"
    | "reserved_for_external_seller_id"
    | "reserved_for_external_seller_name"
  >
): ProductReservationFields | null {
  if (!item.reserved) return null;

  return {
    reserved_for_user_id: trimOptional(item.reserved_for_user_id),
    reserved_for_external_seller_id: trimOptional(item.reserved_for_external_seller_id),
    reserved_for_external_seller_name: trimOptional(item.reserved_for_external_seller_name),
  };
}

type DefaultReservationSeller = {
  seller_user_id?: string;
  external_seller_id?: string;
  external_seller_name?: string;
};

async function resolveReservationSeller(
  externalSellers: Collection<ExternalSellerDocument>,
  input: LineItemReservationInput,
  defaultSeller?: DefaultReservationSeller
): Promise<ProductReservationFields | { error: string }> {
  const isExternal =
    input.reserved_seller_type === "external" ||
    Boolean(
      trimOptional(input.reserved_for_external_seller_id) ||
        trimOptional(input.reserved_for_external_seller_name)
    ) ||
    Boolean(
      !trimOptional(input.reserved_for_user_id) &&
        (trimOptional(defaultSeller?.external_seller_id) ||
          trimOptional(defaultSeller?.external_seller_name))
    );

  if (isExternal) {
    const externalSeller = await resolveExternalSeller(externalSellers, {
      id: trimOptional(input.reserved_for_external_seller_id) ?? defaultSeller?.external_seller_id,
      name:
        trimOptional(input.reserved_for_external_seller_name) ??
        defaultSeller?.external_seller_name,
    });

    if (!externalSeller) {
      return { error: "Vendedor externo de reserva inválido" };
    }

    return {
      reserved_for_external_seller_id: externalSeller.id,
      reserved_for_external_seller_name: externalSeller.name,
    };
  }

  const userId =
    trimOptional(input.reserved_for_user_id) ?? trimOptional(defaultSeller?.seller_user_id);

  if (!userId) {
    return { error: "Seleccioná un vendedor para la reserva" };
  }

  if (!(await isAssignableStaffUser(userId))) {
    return { error: "Vendedor de reserva inválido" };
  }

  return { reserved_for_user_id: userId };
}

export async function applyLineItemReservations<
  T extends LineItemReservationInput & { product_id?: string; shirt_name: string },
>(
  externalSellers: Collection<ExternalSellerDocument>,
  items: T[],
  defaultSeller?: DefaultReservationSeller
): Promise<{ items: T[] } | { error: string }> {
  const resolvedItems: T[] = [];

  for (const item of items) {
    if (!item.reserved || !trimOptional(item.product_id)) {
      resolvedItems.push({
        ...item,
        reserved: false,
        reserved_for_user_id: undefined,
        reserved_for_external_seller_id: undefined,
        reserved_for_external_seller_name: undefined,
      });
      continue;
    }

    const reservation = await resolveReservationSeller(externalSellers, item, defaultSeller);
    if ("error" in reservation) {
      return { error: `${reservation.error} (${item.shirt_name})` };
    }

    resolvedItems.push({
      ...item,
      reserved: true,
      ...reservation,
      reserved_seller_type: undefined,
    });
  }

  return { items: resolvedItems };
}

export async function syncProductReservationsFromItems(
  products: Collection<ProductDocument>,
  items: Array<LineItemReservationInput & { product_id?: string }>
): Promise<void> {
  const reservedByProductId = new Map<string, ProductReservationFields>();

  for (const item of items) {
    if (!lineItemHasReservation(item)) continue;

    const productId = item.product_id!.trim();
    const reservation = getLineItemReservationFields(item);
    if (reservation) {
      reservedByProductId.set(productId, reservation);
    }
  }

  const now = new Date();

  for (const [productId, reservation] of reservedByProductId) {
    await products.updateOne(
      { _id: productId, ...nonDeletedProductFilter },
      {
        $set: {
          ...reservation,
          updated_at: now,
        },
      }
    );
  }
}

export async function clearProductReservations(
  products: Collection<ProductDocument>,
  productIds: string[]
): Promise<void> {
  const uniqueIds = [...new Set(productIds.map((id) => id.trim()).filter(Boolean))];
  if (uniqueIds.length === 0) return;

  await products.updateMany(
    { _id: { $in: uniqueIds }, ...nonDeletedProductFilter },
    {
      $unset: PRODUCT_RESERVATION_UNSET_FIELDS,
      $set: { updated_at: new Date() },
    }
  );
}

export async function reconcileProductReservations(
  products: Collection<ProductDocument>,
  previousItems: Array<LineItemReservationInput & { product_id?: string }>,
  nextItems: Array<LineItemReservationInput & { product_id?: string }>
): Promise<void> {
  const previousReserved = new Set(getReservedProductIds(previousItems));
  const nextReserved = new Set(getReservedProductIds(nextItems));

  const toClear = [...previousReserved].filter((productId) => !nextReserved.has(productId));
  await clearProductReservations(products, toClear);
  await syncProductReservationsFromItems(products, nextItems);
}

export function validateProductReservationForSale(
  product: ProductReservationFields & { name?: string },
  seller: ResolvedSaleSeller
): string | null {
  const reservedForUser = trimOptional(product.reserved_for_user_id);
  const reservedForExternalId = trimOptional(product.reserved_for_external_seller_id);
  const reservedForExternalName = trimOptional(product.reserved_for_external_seller_name);

  if (!reservedForUser && !reservedForExternalId && !reservedForExternalName) {
    return null;
  }

  const saleExternalId = trimOptional(seller.external_seller_id);
  const saleExternalName = trimOptional(seller.external_seller_name);

  if (reservedForExternalId || reservedForExternalName) {
    if (saleExternalId && reservedForExternalId && saleExternalId === reservedForExternalId) {
      return null;
    }

    if (
      saleExternalName &&
      reservedForExternalName &&
      saleExternalName.toLocaleLowerCase() === reservedForExternalName.toLocaleLowerCase()
    ) {
      return null;
    }

    const reservedLabel = reservedForExternalName ?? "otro vendedor externo";
    return `${product.name ?? "Este producto"} está reservado para ${reservedLabel}.`;
  }

  if (reservedForUser && seller.created_by === reservedForUser) {
    return null;
  }

  return `${product.name ?? "Este producto"} está reservado para otro vendedor del sistema.`;
}
