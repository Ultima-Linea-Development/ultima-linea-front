"use client";

import Typography from "@/components/ui/Typography";
import AdminProductReservationBadge from "@/components/admin/AdminProductReservationBadge";
import type { ExternalSeller, SaleAssignableUser } from "@/lib/api";
import type { LineItemReservationFields } from "@/lib/product-reservation";

type AdminLineItemReservationCellProps = {
  item: LineItemReservationFields;
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

  return (
    <AdminProductReservationBadge
      product={item}
      assignableUsers={assignableUsers}
      externalSellers={externalSellers}
      size="sm"
    />
  );
}
