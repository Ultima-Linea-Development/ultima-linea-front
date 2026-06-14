import type { Product } from "@/lib/api";
import { buildProductJsonLd } from "@/lib/seo";

type ProductJsonLdProps = {
  product: Product;
  siteOrigin: string;
};

export default function ProductJsonLd({ product, siteOrigin }: ProductJsonLdProps) {
  const jsonLd = buildProductJsonLd(product, siteOrigin);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
