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
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    {
      path: "/best-practices",
      priority: 0.5,
      changeFrequency: "monthly" as const,
    },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.flatMap((route) => ({
    url: `https://${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((altLocale) => [
          altLocale,
          `https://${SITE_URL}/${altLocale}${route.path}`,
        ])
      ),
    },
  }));
}
