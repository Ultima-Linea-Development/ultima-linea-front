import { cn } from "@/lib/utils";

type AdminSizeStockChipProps = {
  size: string;
  stock: number;
  highlighted?: boolean;
  badgeAriaLabel?: string;
  className?: string;
};

export default function AdminSizeStockChip({
  size,
  stock,
  highlighted = false,
  badgeAriaLabel,
  className,
}: AdminSizeStockChipProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-baseline gap-1 rounded-sm bg-muted/40 px-1.5 py-1 leading-none",
        highlighted && "bg-muted",
        className
      )}
    >
      <span className="text-xs font-medium">{size}</span>
      <span
        className="text-[10px] font-medium text-muted-foreground tabular-nums"
        aria-label={badgeAriaLabel ?? `Stock ${stock}`}
      >
        {stock}
      </span>
    </span>
  );
}
