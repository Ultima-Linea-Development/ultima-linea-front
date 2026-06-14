"use client";

import AdminSizeStockChip from "@/components/admin/AdminSizeStockChip";
import Typography from "@/components/ui/Typography";
import { getSaleQuantityTotal, getSaleSizeQuantityEntries } from "@/lib/sale-items";
import type { Sale } from "@/lib/api";
import { cn } from "@/lib/utils";

const VISIBLE_SIZE_LIMIT = 4;

type AdminSaleSizeQuantityProps = {
  sale: Sale;
  className?: string;
};

export default function AdminSaleSizeQuantity({ sale, className }: AdminSaleSizeQuantityProps) {
  const entries = getSaleSizeQuantityEntries(sale);

  if (entries.length === 0) {
    const total = getSaleQuantityTotal(sale);
    if (total <= 0) {
      return (
        <Typography variant="body2" className={className}>
          —
        </Typography>
      );
    }

    return (
      <Typography variant="body2" className={cn("tabular-nums", className)}>
        {total}
      </Typography>
    );
  }

  const visible = entries.slice(0, VISIBLE_SIZE_LIMIT);
  const hidden = entries.slice(VISIBLE_SIZE_LIMIT);

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
