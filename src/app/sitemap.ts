import { routing } from "@/libs/i18n/routing";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return [];
  }

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `https://${siteUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((altLocale) => [
              altLocale,
              `https://${siteUrl}/${altLocale}${route.path}`,
            ])
          ),
          "x-default": `https://${siteUrl}/${routing.defaultLocale}${route.path}`,
        },
      },
    }))
  );
}
