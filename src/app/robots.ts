import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getPortfolio().settings.siteUrl;
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(siteUrl ? { sitemap: new URL("/sitemap.xml", siteUrl).href } : {}),
  };
}
