import type { ExternalSeller, Product, SaleAssignableUser } from "@/lib/api";
import { getAssignableUserLabel } from "@/lib/user-display";

export type ProductReservationFields = {
  reserved_for_user_id?: string;
  reserved_for_external_seller_id?: string;
  reserved_for_external_seller_name?: string;
};

export type LineItemReservationFields = ProductReservationFields & {
  reserved?: boolean;
};

export function isProductReserved(product: ProductReservationFields): boolean {
  return Boolean(
    product.reserved_for_user_id?.trim() ||
      product.reserved_for_external_seller_id?.trim() ||
      product.reserved_for_external_seller_name?.trim()
  );
}

export function isLineItemReserved(
  item: LineItemReservationFields & { product_id?: string; productId?: string }
): boolean {
  const productId = item.product_id ?? item.productId;
  return Boolean(item.reserved && productId);
}

export function getProductReservationLabel(
  product: ProductReservationFields,
  assignableUsers: SaleAssignableUser[] = [],
  externalSellers: ExternalSeller[] = []
): string {
  if (product.reserved_for_external_seller_name?.trim()) {
    return product.reserved_for_external_seller_name.trim();
  }

  if (product.reserved_for_external_seller_id) {
    const external = externalSellers.find(
      (seller) => seller.id === product.reserved_for_external_seller_id
    );
    if (external?.name) return external.name;
  }

  if (product.reserved_for_user_id) {
    return getAssignableUserLabel(assignableUsers, product.reserved_for_user_id);
  }

  return "Vendedor desconocido";
}

export function getLineItemReservationLabel(
  item: LineItemReservationFields & { product_id?: string },
  assignableUsers: SaleAssignableUser[] = [],
  externalSellers: ExternalSeller[] = []
): string | null {
  if (!item.reserved) return null;
  return getProductReservationLabel(item, assignableUsers, externalSellers);
}

export function lineItemReservationToPayload(
  item: LineItemReservationFields & { productId?: string },
  sellerPayload?: {
    seller_type?: "internal" | "external";
    seller_user_id?: string;
    external_seller_id?: string;
    external_seller_name?: string;
  }
): LineItemReservationFields {
  if (!item.reserved || !item.productId) {
    return { reserved: false };
  }

  if (sellerPayload) {
    if (sellerPayload.seller_type === "external") {
      return {
        reserved: true,
        ...(sellerPayload.external_seller_id
          ? { reserved_for_external_seller_id: sellerPayload.external_seller_id }
          : {}),
        ...(sellerPayload.external_seller_name
          ? { reserved_for_external_seller_name: sellerPayload.external_seller_name }
          : {}),
      };
    }

    if (sellerPayload.seller_user_id) {
      return {
        reserved: true,
        reserved_for_user_id: sellerPayload.seller_user_id,
      };
    }
  }

  return {
    reserved: true,
    ...(item.reserved_for_user_id ? { reserved_for_user_id: item.reserved_for_user_id } : {}),
    ...(item.reserved_for_external_seller_id
      ? { reserved_for_external_seller_id: item.reserved_for_external_seller_id }
      : {}),
    ...(item.reserved_for_external_seller_name
      ? { reserved_for_external_seller_name: item.reserved_for_external_seller_name }
      : {}),
  };
}
