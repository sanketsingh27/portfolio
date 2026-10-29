import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const data = getPortfolio();
  if (!data.settings.siteUrl) return [];
  const routes = [
    "",
    "/about",
    "/projects",
    "/writing",
    "/credentials",
    "/contact",
    "/book",
    "/log",
    ...data.projects.map((item) => `/projects/${item.id}`),
    ...data.credentials.map((item) => `/credentials/${item.id}`),
    ...data.logs.map((item) => `/log/${item.date}`),
  ];
  return routes.map((route) => ({
    url: new URL(route, data.settings.siteUrl).href,
  }));
}
