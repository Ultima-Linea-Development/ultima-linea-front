import type { Commission } from "@/lib/api";
import {
  createDefaultSaleSellerValue,
  saleSellerValueToPayload,
  saleToSellerFormValue,
  validateSaleSellerValue,
  type SaleSellerFormValue,
} from "@/lib/sale-seller";

export function createDefaultCommissionSellerValue(currentUserId: string | null): SaleSellerFormValue {
  return createDefaultSaleSellerValue(currentUserId);
}

export function commissionToSellerFormValue(
  commission: Pick<Commission, "seller_user_id" | "external_seller_id" | "external_seller_name">,
  currentUserId: string | null
): SaleSellerFormValue {
  return saleToSellerFormValue(
    {
      created_by: commission.seller_user_id,
      external_seller_id: commission.external_seller_id,
      external_seller_name: commission.external_seller_name,
    },
    currentUserId
  );
}

export function validateCommissionSellerValue(
  value: SaleSellerFormValue,
  canAssignUser: boolean
): string | null {
  return validateSaleSellerValue(value, canAssignUser);
}

export function commissionSellerValueToPayload(
  value: SaleSellerFormValue,
  canAssignUser: boolean
) {
  const payload = saleSellerValueToPayload(value, canAssignUser);

  return {
    seller_type: payload.seller_type,
    seller_user_id: payload.created_by,
    external_seller_id: payload.external_seller_id,
    external_seller_name: payload.external_seller_name,
  };
}
