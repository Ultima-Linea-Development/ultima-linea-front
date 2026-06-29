import { cn } from "@/lib/utils";

type AdminSizeStockChipProps = {
  size: string;
  stock: number;
  highlighted?: boolean;
  reserved?: boolean;
  badgeAriaLabel?: string;
  className?: string;
};

export default function AdminSizeStockChip({
  size,
  stock,
  highlighted = false,
  reserved = false,
  badgeAriaLabel,
  className,
}: AdminSizeStockChipProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex min-w-[1.75rem] items-center justify-center rounded-sm px-2 py-1 text-xs font-medium leading-none",
          reserved
            ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300"
            : "bg-muted/40",
          highlighted && !reserved && "bg-muted"
        )}
        title={reserved ? `Talle ${size} reservado` : undefined}
      >
        {size}
      </span>
      <span
        className={cn(
          "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none tabular-nums",
          reserved ? "bg-amber-200 text-amber-900" : "bg-green-100 text-green-800"
        )}
        aria-label={badgeAriaLabel ?? (reserved ? `Talle ${size} reservado, stock ${stock}` : `Stock ${stock}`)}
      >
        {stock}
      </span>
    </span>
  );
}
