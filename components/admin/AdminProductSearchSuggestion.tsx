import Typography from "@/components/ui/Typography";
import AdminSearchSuggestionRow from "@/components/admin/AdminSearchSuggestionRow";
import type { Product } from "@/lib/api";
import { getProductPrimaryImageUrl } from "@/lib/admin-product-image";
import { getProductTotalStock } from "@/lib/product-inventory";

type AdminProductSearchSuggestionProps = {
  product: Product;
};

export default function AdminProductSearchSuggestion({ product }: AdminProductSearchSuggestionProps) {
  return (
    <AdminSearchSuggestionRow
      imageUrl={getProductPrimaryImageUrl(product)}
      trailing={`Stock ${getProductTotalStock(product)}`}
    >
      <Typography variant="body2" as="span">
        {product.name}
      </Typography>
    </AdminSearchSuggestionRow>
  );
}
