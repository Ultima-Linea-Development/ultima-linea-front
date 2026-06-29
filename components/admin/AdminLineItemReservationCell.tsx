"use client";

import Typography from "@/components/ui/Typography";
import type { ExternalSeller, SaleAssignableUser } from "@/lib/api";
import {
  getLineItemReservationLabel,
  type LineItemReservationFields,
} from "@/lib/product-reservation";
import { formatSupplierOrderSizesDisplay } from "@/lib/supplier-order-sizes";

type AdminLineItemReservationCellProps = {
  item: LineItemReservationFields & {
    reserved_sizes?: string[];
    reserved_quantity_by_sizes?: Record<string, number>;
    sizes?: string;
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

  const sellerLabel = getLineItemReservationLabel(item, assignableUsers, externalSellers);
  const sizesLabel =
    item.reserved_quantity_by_sizes &&
    Object.keys(item.reserved_quantity_by_sizes).length > 0
      ? formatSupplierOrderSizesDisplay(item.reserved_quantity_by_sizes)
      : item.reserved_sizes && item.reserved_sizes.length > 0
        ? formatSupplierOrderSizesDisplay(
            Object.fromEntries(item.reserved_sizes.map((size) => [size, 1]))
          )
        : item.sizes?.trim() || "—";

  return (
    <Typography variant="body2" className="text-amber-900">
      {sizesLabel}
      {sellerLabel ? ` · ${sellerLabel}` : ""}
    </Typography>
  );
}
