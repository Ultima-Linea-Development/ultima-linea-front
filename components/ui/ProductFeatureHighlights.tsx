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
  return "grid-cols-1 sm:grid-cols-2";
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
        className="mb-5 block text-xs tracking-[0.18em] text-muted-foreground sm:mb-6 sm:text-sm"
      >
        Características
      </Typography>
      <ul
        className={cn(
          "m-0 grid list-none gap-5 p-0 sm:gap-6",
          highlightsGridClass(n)
        )}
      >
        {features.map(({ id, label, value, Icon }) => (
          <li key={id} className="min-w-0">
            <div
              className={cn(
                "flex h-[11.5rem] w-full min-w-0 flex-col gap-3 border-2 border-border/90 bg-card px-5 py-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04]",
                "sm:h-[10.25rem] sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-0"
              )}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center self-start border border-border/80 bg-muted/50 sm:self-center"
                aria-hidden
              >
                <Icon className="h-8 w-8 shrink-0 text-foreground" />
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 overflow-hidden text-left sm:basis-0 sm:gap-2">
                <span className="shrink-0 text-sm font-normal leading-snug text-muted-foreground">
                  {label}
                </span>
                <span className="line-clamp-3 w-full text-lg font-bold uppercase leading-snug tracking-tight text-foreground [font-family:var(--font-archivo-black)] sm:text-xl">
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
