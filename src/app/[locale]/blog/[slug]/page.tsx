import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArticleCover } from "@/app/[locale]/blog/components/article-cover";
import { ArticleCta } from "@/app/[locale]/blog/components/article-cta";
import { ArticleMeta } from "@/app/[locale]/blog/components/article-meta";
import { ArticleQuickActions } from "@/app/[locale]/blog/components/article-quick-actions";
import { ArticleTakeaways } from "@/app/[locale]/blog/components/article-takeaways";
import { ArticleToc } from "@/app/[locale]/blog/components/article-toc";
import { ArticleTocMobile } from "@/app/[locale]/blog/components/article-toc-mobile";
import { ReadingProgress } from "@/app/[locale]/blog/components/reading-progress";
import { RelatedArticles } from "@/app/[locale]/blog/components/related-articles";
import { SeriesNavigation } from "@/app/[locale]/blog/components/series-navigation";
import { Link } from "@/libs/i18n/navigation";
import { PageMessages } from "@/libs/i18n/messages";
import { locales, type AppLocale } from "@/libs/i18n/utils";
import {
  getAllArticleParams,
  getArticle,
  getNextArticle,
  getRelatedArticles,
  getSeriesArticles,
  getTranslatedSlug,
} from "@/libs/blog/source";
import {
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ locale: AppLocale; slug: string }>;
}

export function generateStaticParams() {
  return getAllArticleParams();
}

const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

function articleUrl(locale: AppLocale, slug: string): string {
  return `${siteUrl}/${locale}/blog/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(locale, slug);

  if (!article) {
    return {};
  }

  const { frontmatter } = article;
  const url = articleUrl(locale, slug);

  const languages: Record<string, string> = {};

  for (const alternate of locales) {
    const alternateSlug =
      alternate === locale
        ? slug
        : getTranslatedSlug(frontmatter.translationKey, alternate);

    if (alternateSlug) {
      languages[alternate] = articleUrl(alternate, alternateSlug);
    }
  }

  languages["x-default"] = languages.it ?? url;

  const image =
    frontmatter.cover && !frontmatter.cover.endsWith(".svg")
      ? `${siteUrl}${frontmatter.cover}`
      : `${url}/opengraph-image`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: url,
      languages,
      types: {
        "application/rss+xml": `${siteUrl}/${locale}/blog/rss.xml`,
      },
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url,
      type: "article",
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt ?? frontmatter.publishedAt,
      authors: ["Andrea Losavio"],
      tags: [...frontmatter.tags],
      locale: locale === "it" ? "it_IT" : "en_US",
      alternateLocale: locale === "it" ? "en_US" : "it_IT",
      siteName: "Andrea Losavio",
      images: [
        { url: image, width: 1200, height: 630, alt: frontmatter.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [image],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const article = getArticle(locale, slug);

  if (!article) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const { frontmatter } = article;
  const url = articleUrl(locale, slug);

  const { default: ArticleBody } = await import(
    `@content/blog/${locale}/${slug}.mdx`
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("common.navigation.home"), url: `${siteUrl}/${locale}` },
    { name: t("blog.index.title"), url: `${siteUrl}/${locale}/blog` },
    { name: frontmatter.title, url },
  ]);

  const blogPostingSchema = generateBlogPostingSchema({
    url,
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt,
    image:
      frontmatter.cover && !frontmatter.cover.endsWith(".svg")
        ? `${siteUrl}${frontmatter.cover}`
        : `${url}/opengraph-image`,
    author: {
      id: `${siteUrl}#person`,
      name: "Andrea Losavio",
      url: siteUrl,
    },
    publisher: {
      id: `${siteUrl}#organization`,
      name: "Andrea Losavio",
      url: siteUrl,
    },
    inLanguage: locale,
    keywords: frontmatter.tags,
    wordCount: article.wordCount,
  });

  const schemas = frontmatter.faq
    ? [breadcrumbSchema, blogPostingSchema, generateFaqSchema(frontmatter.faq)]
    : [breadcrumbSchema, blogPostingSchema];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(schemas) }}
      />

      <PageMessages namespaces={["blog"]}>
        <ReadingProgress />

        <ArticleQuickActions nextSlug={getNextArticle(article)?.slug} />

        <article className="mx-auto max-w-5xl px-6 pt-24 pb-20 md:pb-24">
          <div className="xl:grid xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-10">
            <div className="xl:col-start-2">
              <div className="prose-article">
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-2 text-sm transition-colors"
                >
                  <ArrowLeftIcon
                    className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                  {t("blog.article.backToBlog")}
                </Link>

                <h1 className="mt-6 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-3xl leading-tight font-bold text-transparent md:text-4xl">
                  {frontmatter.title}
                </h1>

                <p className="text-muted-foreground mt-4 text-xl leading-relaxed">
                  {frontmatter.subtitle}
                </p>

                <ArticleMeta article={article} className="mt-6" />

                <ArticleCover
                  frontmatter={frontmatter}
                  priority
                  className="mt-8"
                />

                <ArticleTocMobile entries={article.toc} className="mt-8" />

                <ArticleTakeaways
                  items={frontmatter.takeaways}
                  locale={locale}
                />

                <ArticleBody />

                {frontmatter.series && (
                  <SeriesNavigation
                    articles={getSeriesArticles(frontmatter.series.id, locale)}
                    current={article}
                  />
                )}

                <ArticleCta locale={locale} />
              </div>

              <RelatedArticles
                articles={getRelatedArticles(article, 2)}
                locale={locale}
                className="mt-12"
              />
            </div>

            <div className="hidden xl:col-start-1 xl:row-start-1 xl:block">
              <ArticleToc entries={article.toc} className="sticky top-24" />
            </div>
          </div>
        </article>
      </PageMessages>
    </>
  );
}
