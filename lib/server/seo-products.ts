import { ensureIndexes, getProductsCollection } from "@/lib/server/db";
import { ProductDocument, productFromDoc } from "@/lib/server/models";
import { buildProductPath } from "@/lib/seo";
import { ensureProductSlugs } from "@/lib/server/products";

export type SitemapProductEntry = {
  slugPath: string;
  updatedAt?: Date;
};

export async function getActiveProductSitemapEntries(): Promise<SitemapProductEntry[]> {
  await ensureIndexes();

  const collection = await getProductsCollection<ProductDocument>();
  const docs = await collection
    .find({ is_active: true })
    .sort({ updated_at: -1, _id: -1 })
    .toArray();

  const products = docs.map(productFromDoc);
  await ensureProductSlugs(collection, products);

  return products.map((product) => ({
    slugPath: buildProductPath(product),
    updatedAt: product.updated_at,
  }));
}
