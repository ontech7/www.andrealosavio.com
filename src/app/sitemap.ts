import { getArticles, getTranslatedSlug } from "@/libs/blog/source";
import { getCaseStudies } from "@/libs/case-studies/source";
import { routing } from "@/libs/i18n/routing";
import { locales, type AppLocale } from "@/libs/i18n/utils";
import type { MetadataRoute } from "next";

interface SitemapRoute {
  pathByLocale: Partial<Record<AppLocale, string>>;
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

const HOMEPAGE_LAST_MODIFIED = new Date("2026-08-25T00:00:00Z");
const PROJECTS_LAST_MODIFIED = new Date("2026-08-25T00:00:00Z");
const ABOUT_LAST_MODIFIED = new Date("2026-08-17T00:00:00Z");
const PRIVACY_LAST_MODIFIED = new Date("2026-08-25T00:00:00Z");
const BLOG_INDEX_FALLBACK_LAST_MODIFIED = new Date("2026-08-31T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return [];
  }

  const seenTranslationKeys = new Set<string>();
  const articleRoutes: SitemapRoute[] = [];
  let latestArticleDate = new Date(0);

  for (const article of getArticles(routing.defaultLocale as AppLocale)) {
    const { translationKey, updatedAt, publishedAt } = article.frontmatter;

    if (seenTranslationKeys.has(translationKey)) {
      continue;
    }

    seenTranslationKeys.add(translationKey);

    const pathByLocale: Partial<Record<AppLocale, string>> = {};

    for (const locale of locales) {
      const slug = getTranslatedSlug(translationKey, locale);

      if (slug) {
        pathByLocale[locale] = `/blog/${slug}`;
      }
    }

    const lastModified = new Date(`${updatedAt ?? publishedAt}T00:00:00Z`);

    if (lastModified > latestArticleDate) {
      latestArticleDate = lastModified;
    }

    articleRoutes.push({
      pathByLocale,
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified,
    });
  }

  const caseStudyRoutes: SitemapRoute[] = getCaseStudies(
    routing.defaultLocale as AppLocale
  ).map((caseStudy) => {
    const { updatedAt, publishedAt } = caseStudy.frontmatter;

    return {
      pathByLocale: samePath(`/projects/${caseStudy.slug}`),
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: new Date(`${updatedAt ?? publishedAt}T00:00:00Z`),
    };
  });

  const staticRoutes: SitemapRoute[] = [
    {
      pathByLocale: samePath(""),
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: HOMEPAGE_LAST_MODIFIED,
    },
    {
      pathByLocale: samePath("/projects"),
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: PROJECTS_LAST_MODIFIED,
    },
    {
      pathByLocale: samePath("/blog"),
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified:
        articleRoutes.length > 0
          ? latestArticleDate
          : BLOG_INDEX_FALLBACK_LAST_MODIFIED,
    },
    {
      pathByLocale: samePath("/about"),
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: ABOUT_LAST_MODIFIED,
    },
    {
      pathByLocale: samePath("/privacy"),
      priority: 0.3,
      changeFrequency: "yearly",
      lastModified: PRIVACY_LAST_MODIFIED,
    },
  ];

  return [...staticRoutes, ...caseStudyRoutes, ...articleRoutes].flatMap(
    (route) =>
      locales
        .filter((locale) => route.pathByLocale[locale] !== undefined)
        .map((locale) => {
          const defaultPath =
            route.pathByLocale[routing.defaultLocale as AppLocale];

          return {
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
                ...(defaultPath !== undefined
                  ? {
                      "x-default": `https://${siteUrl}/${routing.defaultLocale}${defaultPath}`,
                    }
                  : {}),
              },
            },
          };
        })
  );
}
