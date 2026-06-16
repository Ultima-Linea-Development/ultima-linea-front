import type { Product } from "@/lib/api";

export function getProductPrimaryImageUrl(
  product?: Pick<Product, "image_urls"> | null
): string | undefined {
  return product?.image_urls?.[0];
}

export function getProductImageUrlById(
  products: Product[],
  productId?: string
): string | undefined {
  if (!productId) return undefined;

  return getProductPrimaryImageUrl(products.find((product) => product.id === productId));
}
