import { getArticles } from "@/libs/blog/source";
import { routing } from "@/libs/i18n/routing";
import { locales, type AppLocale } from "@/libs/i18n/utils";
import type { MetadataRoute } from "next";

interface SitemapRoute {
  pathByLocale: Record<AppLocale, string>;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified: Date;
}

function samePath(path: string): Record<AppLocale, string> {
  return Object.fromEntries(locales.map((locale) => [locale, path])) as Record<
    AppLocale,
    string
  >;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return [];
  }

  const now = new Date();

  const staticRoutes: SitemapRoute[] = [
    {
      pathByLocale: samePath(""),
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      pathByLocale: samePath("/projects"),
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: now,
    },
    {
      pathByLocale: samePath("/blog"),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      pathByLocale: samePath("/about"),
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: now,
    },
    {
      pathByLocale: samePath("/privacy"),
      priority: 0.3,
      changeFrequency: "yearly",
      lastModified: now,
    },
  ];

  const seenTranslationKeys = new Set<string>();
  const articleRoutes: SitemapRoute[] = [];

  for (const article of getArticles(routing.defaultLocale as AppLocale)) {
    const { translationKey, updatedAt, publishedAt } = article.frontmatter;

    if (seenTranslationKeys.has(translationKey)) {
      continue;
    }

    seenTranslationKeys.add(translationKey);

    const pathByLocale = {} as Record<AppLocale, string>;

    for (const locale of locales) {
      const match = getArticles(locale).find(
        (candidate) => candidate.frontmatter.translationKey === translationKey
      );

      if (match) {
        pathByLocale[locale] = `/blog/${match.slug}`;
      }
    }

    articleRoutes.push({
      pathByLocale,
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified: new Date(`${updatedAt ?? publishedAt}T00:00:00Z`),
    });
  }

  return [...staticRoutes, ...articleRoutes].flatMap((route) =>
    locales
      .filter((locale) => route.pathByLocale[locale] !== undefined)
      .map((locale) => ({
        url: `https://${siteUrl}/${locale}${route.pathByLocale[locale]}`,
        lastModified: route.lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales
                .filter((alt) => route.pathByLocale[alt] !== undefined)
                .map((alt) => [
                  alt,
                  `https://${siteUrl}/${alt}${route.pathByLocale[alt]}`,
                ])
            ),
            "x-default": `https://${siteUrl}/${routing.defaultLocale}${
              route.pathByLocale[routing.defaultLocale as AppLocale]
            }`,
          },
        },
      }))
  );
}
