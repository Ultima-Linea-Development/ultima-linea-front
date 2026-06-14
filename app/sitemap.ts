import type { MetadataRoute } from "next";
import { PUBLIC_STATIC_PATHS, resolvePublicSiteUrl } from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site-origin";
import { getActiveProductSitemapEntries } from "@/lib/server/seo-products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = resolvePublicSiteUrl(await getSiteOrigin());
  if (!origin) return [];

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_PATHS.map((path) => ({
    url: `${origin}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const products = await getActiveProductSitemapEntries();
    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${origin}/product/${product.slugPath}`,
      lastModified: product.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
