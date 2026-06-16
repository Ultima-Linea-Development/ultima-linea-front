import Typography from "@/components/ui/Typography";
import AdminSearchSuggestionRow from "@/components/admin/AdminSearchSuggestionRow";
import type { Product, Sale } from "@/lib/api";
import { getProductImageUrlById } from "@/lib/admin-product-image";
import { getSalePrimaryLineItem, getSalePrimaryProductName, formatSaleSizesLabel } from "@/lib/sale-items";
import { formatPrice } from "@/lib/utils";

type AdminSaleSearchSuggestionProps = {
  sale: Sale;
  products?: Product[];
};

export default function AdminSaleSearchSuggestion({
  sale,
  products = [],
}: AdminSaleSearchSuggestionProps) {
  const primaryItem = getSalePrimaryLineItem(sale);
  const imageUrl = getProductImageUrlById(products, primaryItem?.product_id);

  return (
    <AdminSearchSuggestionRow
      imageUrl={imageUrl}
      trailing={`Talle ${formatSaleSizesLabel(sale)} · ${formatPrice(sale.total)}`}
    >
      <Typography variant="body2" as="span">
        {getSalePrimaryProductName(sale)}
      </Typography>
    </AdminSearchSuggestionRow>
  );
}
