"use client";

import Typography from "@/components/ui/Typography";
import type { ExternalSeller, SaleAssignableUser } from "@/lib/api";
import { getProductReservationLabel } from "@/lib/product-reservation";
import { formatSupplierOrderSizesDisplay } from "@/lib/supplier-order-sizes";

type AdminLineItemReservationCellProps = {
  item: {
    reserved?: boolean;
    reservation_entries?: Array<{
      size: string;
      quantity: number;
      reserved_for_user_id?: string;
      reserved_for_external_seller_id?: string;
      reserved_for_external_seller_name?: string;
    }>;
    reserved_quantity_by_sizes?: Record<string, number>;
    reserved_sizes?: string[];
    sizes?: string;
    reserved_for_user_id?: string;
    reserved_for_external_seller_id?: string;
    reserved_for_external_seller_name?: string;
  };
  assignableUsers?: SaleAssignableUser[];
  externalSellers?: ExternalSeller[];
};

export default function AdminLineItemReservationCell({
  item,
  assignableUsers = [],
  externalSellers = [],
}: AdminLineItemReservationCellProps) {
  if (!item.reserved) {
    return (
      <Typography variant="body2" color="muted">
        —
      </Typography>
    );
  }

  if (item.reservation_entries && item.reservation_entries.length > 0) {
    const labels = item.reservation_entries.map((entry) => {
      const sellerLabel = getProductReservationLabel(entry, assignableUsers, externalSellers);
      const sizeLabel =
        entry.quantity === 1 ? entry.size : `${entry.size} (${entry.quantity})`;
      return `${sizeLabel} · ${sellerLabel}`;
    });

    return (
      <Typography variant="body2" className="text-amber-900">
        {labels.join(" · ")}
      </Typography>
    );
  }

  const sizesLabel =
    item.reserved_quantity_by_sizes &&
    Object.keys(item.reserved_quantity_by_sizes).length > 0
      ? formatSupplierOrderSizesDisplay(item.reserved_quantity_by_sizes)
      : item.reserved_sizes && item.reserved_sizes.length > 0
        ? formatSupplierOrderSizesDisplay(
            Object.fromEntries(item.reserved_sizes.map((size) => [size, 1]))
          )
        : item.sizes?.trim() || "—";

  const sellerLabel = getProductReservationLabel(item, assignableUsers, externalSellers);

  return (
    <Typography variant="body2" className="text-amber-900">
      {sizesLabel}
      {sellerLabel ? ` · ${sellerLabel}` : ""}
    </Typography>
  );
}
