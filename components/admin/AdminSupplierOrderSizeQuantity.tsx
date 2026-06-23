"use client";

import AdminSizeStockChip from "@/components/admin/AdminSizeStockChip";
import Typography from "@/components/ui/Typography";
import type { SupplierOrderLineItem } from "@/lib/api";
import { getSupplierOrderSizeQuantityEntries } from "@/lib/supplier-order-sizes";
import { cn } from "@/lib/utils";

const VISIBLE_SIZE_LIMIT = 4;

type AdminSupplierOrderSizeQuantityProps = {
  item: Pick<SupplierOrderLineItem, "quantity" | "sizes" | "quantity_by_sizes">;
  className?: string;
  showAll?: boolean;
};

export default function AdminSupplierOrderSizeQuantity({
  item,
  className,
  showAll = false,
}: AdminSupplierOrderSizeQuantityProps) {
  const entries = getSupplierOrderSizeQuantityEntries(item);

  if (entries.length === 0) {
    return (
      <Typography variant="body2" className={className}>
        —
      </Typography>
    );
  }

  const visible = showAll ? entries : entries.slice(0, VISIBLE_SIZE_LIMIT);
  const hidden = showAll ? [] : entries.slice(VISIBLE_SIZE_LIMIT);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2 pt-0.5", className)}>
      {visible.map(([size, quantity]) => (
        <AdminSizeStockChip
          key={size}
          size={size}
          stock={quantity}
          badgeAriaLabel={`Cantidad ${quantity}`}
        />
      ))}

      {hidden.length > 0 && (
        <div className="group relative shrink-0">
          <span
            className="inline-flex cursor-default rounded-sm bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground tabular-nums"
            tabIndex={0}
            aria-label={`${hidden.length} talles más`}
          >
            +{hidden.length}
          </span>
          <div
            role="tooltip"
            className="absolute left-0 top-full z-30 mt-1.5 hidden flex-wrap gap-x-1.5 gap-y-2 border border-border bg-background p-2 shadow-sm group-hover:flex group-focus-within:flex"
          >
            {hidden.map(([size, quantity]) => (
              <AdminSizeStockChip
                key={size}
                size={size}
                stock={quantity}
                badgeAriaLabel={`Cantidad ${quantity}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
