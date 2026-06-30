"use client";

import Box from "@/components/layout/Box";
import AdminLineItemReservationField from "@/components/admin/AdminLineItemReservationField";
import AdminLineItemSizeReservationFields from "@/components/admin/AdminLineItemSizeReservationFields";
import type { ExternalSeller, SaleAssignableUser } from "@/lib/api";
import type { SizeStockRow } from "@/lib/product-inventory";
import { createDefaultSaleSellerValue } from "@/lib/sale-seller";
import { stockRowsToOrderSizeRows } from "@/lib/product-catalog-reservation";
import type { SupplierOrderSizeReservationRow } from "@/lib/supplier-order-sizes";

type AdminProductReservationFieldsProps = {
  idPrefix: string;
  reserveProduct: boolean;
  onReserveProductChange: (reserveProduct: boolean) => void;
  reservationRows: SupplierOrderSizeReservationRow[];
  onReservationRowsChange: (rows: SupplierOrderSizeReservationRow[]) => void;
  stockRows: SizeStockRow[];
  assignableUsers: SaleAssignableUser[];
  externalSellers: ExternalSeller[];
  canAssignUser: boolean;
  currentUserId?: string | null;
  disabled?: boolean;
};

export default function AdminProductReservationFields({
  idPrefix,
  reserveProduct,
  onReserveProductChange,
  reservationRows,
  onReservationRowsChange,
  stockRows,
  assignableUsers,
  externalSellers,
  canAssignUser,
  currentUserId = null,
  disabled = false,
}: AdminProductReservationFieldsProps) {
  const orderSizeRows = stockRowsToOrderSizeRows(stockRows);

  return (
    <Box display="flex" direction="col" gap="3" align="stretch" className="w-full min-w-0 self-stretch">
      <AdminLineItemReservationField
        idPrefix={idPrefix}
        reserved={reserveProduct}
        onReservedChange={onReserveProductChange}
        reservationSellerValue={createDefaultSaleSellerValue(currentUserId)}
        onReservationSellerChange={() => {}}
        assignableUsers={assignableUsers}
        externalSellers={externalSellers}
        canAssignUser={canAssignUser}
        currentUserId={currentUserId}
        disabled={disabled}
        showSellerField={false}
      />

      {reserveProduct ? (
        <AdminLineItemSizeReservationFields
          idPrefix={`${idPrefix}-sizes`}
          reservationRows={reservationRows}
          onReservationRowsChange={onReservationRowsChange}
          orderSizeRows={orderSizeRows}
          disabled={disabled}
          showSellerField
          assignableUsers={assignableUsers}
          externalSellers={externalSellers}
          canAssignUser={canAssignUser}
          currentUserId={currentUserId}
        />
      ) : null}
    </Box>
  );
}
