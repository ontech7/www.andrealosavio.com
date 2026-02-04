import { routing } from "@/libs/i18n/routing";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function sitemap(): MetadataRoute.Sitemap {
  const isProduction =
    !SITE_URL.includes("test") &&
    !SITE_URL.includes("dev") &&
    !SITE_URL.includes("localhost");

  if (!isProduction) {
    return [];
  }

  const routes = [
    { path: "", priority: 1.0 },
    { path: "/services", priority: 0.9 },
    { path: "/projects", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
  ];

  return routes.flatMap((route) => ({
    url: `https://${SITE_URL}${route.path}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((altLocale) => [
          altLocale,
          `http://${SITE_URL}/${altLocale}${route.path}`,
        ])
      ),
    },
  }));
}
