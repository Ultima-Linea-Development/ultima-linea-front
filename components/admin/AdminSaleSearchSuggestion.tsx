import Typography from "@/components/ui/Typography";
import type { Sale } from "@/lib/api";
import { formatSaleProductsLabel, formatSaleSizesLabel } from "@/lib/sale-items";
import { formatPrice } from "@/lib/utils";

type AdminSaleSearchSuggestionProps = {
  sale: Sale;
};

export default function AdminSaleSearchSuggestion({ sale }: AdminSaleSearchSuggestionProps) {
  return (
    <>
      <span className="min-w-0">
        <Typography variant="body2" as="span">
          {formatSaleProductsLabel(sale)}
        </Typography>
      </span>
      <span className="shrink-0 text-muted-foreground text-xs">
        Talle {formatSaleSizesLabel(sale)} · {formatPrice(sale.total)}
      </span>
    </>
  );
}
