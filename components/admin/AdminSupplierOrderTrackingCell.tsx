"use client";

import Typography from "@/components/ui/Typography";
import AdminTextLink from "@/components/admin/AdminTextLink";
import type { SupplierOrder } from "@/lib/api";

type AdminSupplierOrderTrackingCellProps = {
  order: Pick<SupplierOrder, "tracking_number" | "tracking_link">;
};

export default function AdminSupplierOrderTrackingCell({
  order,
}: AdminSupplierOrderTrackingCellProps) {
  const trackingNumber = order.tracking_number?.trim();
  const trackingLink = order.tracking_link?.trim();

  if (!trackingNumber && !trackingLink) {
    return <Typography variant="body2">—</Typography>;
  }

  const label = trackingNumber ?? "Ver seguimiento";

  if (trackingLink) {
    return (
      <AdminTextLink
        href={trackingLink}
        target="_blank"
        rel="noopener noreferrer"
        tone="default"
        className="block max-w-full truncate"
      >
        <Typography variant="body2" as="span" className="truncate">
          {label}
        </Typography>
      </AdminTextLink>
    );
  }

  return (
    <Typography variant="body2" className="truncate">
      {trackingNumber}
    </Typography>
  );
}
