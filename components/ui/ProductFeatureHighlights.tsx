import type { IconType } from "react-icons";
import Typography from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export type ProductFeatureItem = {
  id: string;
  label: string;
  value: string;
  Icon: IconType;
};

type ProductFeatureHighlightsProps = {
  features: ProductFeatureItem[];
  className?: string;
};

/** Máximo 2 columnas: en la columna lateral del PDP 3 columnas dejan ~100px por celda y el texto colapsa letra a letra. */
function highlightsGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  return "grid-cols-2";
}

export default function ProductFeatureHighlights({
  features,
  className,
}: ProductFeatureHighlightsProps) {
  if (features.length === 0) return null;

  const n = features.length;

  return (
    <section
      aria-label="Características del producto"
      className={cn("w-full min-w-0", className)}
    >
      <Typography
        variant="caption"
        uppercase
        className="mb-3 block text-[11px] tracking-[0.16em] text-muted-foreground sm:mb-4 sm:text-xs"
      >
        Características
      </Typography>
      <ul
        className={cn(
          "m-0 grid list-none gap-3 p-0 sm:gap-3.5",
          highlightsGridClass(n)
        )}
      >
        {features.map(({ id, label, value, Icon }) => (
          <li key={id} className="min-w-0">
            <div
              className={cn(
                "flex h-[5.25rem] w-full min-w-0 flex-row items-start gap-2 border-2 border-border/90 bg-card px-2.5 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04]",
                "sm:h-[6rem] sm:flex-row sm:items-center sm:gap-3 sm:px-3.5 sm:py-2"
              )}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center self-start border border-border/80 bg-muted/50 sm:h-11 sm:w-11 sm:self-center"
                aria-hidden
              >
                <Icon className="h-5 w-5 shrink-0 text-foreground sm:h-6 sm:w-6" />
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-start gap-1 overflow-hidden text-left sm:basis-0 sm:justify-center sm:gap-1.5">
                <span className="shrink-0 text-xs font-normal leading-tight text-muted-foreground sm:text-[13px]">
                  {label}
                </span>
                <span className="line-clamp-2 w-full text-sm font-bold uppercase leading-tight tracking-tight text-foreground [font-family:var(--font-archivo-black)] sm:text-base">
                  {value}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
