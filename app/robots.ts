import type { MetadataRoute } from "next";
import { resolvePublicSiteUrl } from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site-origin";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = resolvePublicSiteUrl(await getSiteOrigin());

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login", "/logout", "/api/"],
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
