import { cn } from "@/lib/utils";

type AdminSizeStockChipProps = {
  size: string;
  stock: number;
  highlighted?: boolean;
  className?: string;
};

export default function AdminSizeStockChip({
  size,
  stock,
  highlighted = false,
  className,
}: AdminSizeStockChipProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex min-w-[1.75rem] items-center justify-center rounded-sm bg-muted/40 px-2 py-1 text-xs font-medium leading-none",
          highlighted && "bg-muted"
        )}
      >
        {size}
      </span>
      <span
        className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-100 px-1 text-[10px] font-semibold leading-none text-green-800 tabular-nums"
        aria-label={`Stock ${stock}`}
      >
        {stock}
      </span>
    </span>
  );
}
