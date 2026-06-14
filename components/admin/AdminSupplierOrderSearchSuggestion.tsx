"use client";

import Typography from "@/components/ui/Typography";
import type { SupplierOrder } from "@/lib/api";
import { getSupplierOrderLabel, getSupplierOrderStatusLabel } from "@/lib/supplier-order-display";

type AdminSupplierOrderSearchSuggestionProps = {
  order: SupplierOrder;
};

export default function AdminSupplierOrderSearchSuggestion({
  order,
}: AdminSupplierOrderSearchSuggestionProps) {
  const orderedCount = order.items.filter((item) => item.ordered).length;

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <Typography variant="body2" as="span" className="truncate">
        {getSupplierOrderLabel(order)}
      </Typography>
      <Typography variant="caption" color="muted" as="span" className="truncate">
        {getSupplierOrderStatusLabel(order.status)} · {orderedCount}/{order.items.length} pedidas
      </Typography>
    </div>
  );
}
