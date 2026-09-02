import { BLOG_RECENT_SIZE } from "@/constants/blog";
import { PageMessages } from "@/libs/i18n/messages";
import type { AppLocale } from "@/libs/i18n/utils";
import { getArticles, getTagCounts, getUsedTags } from "@/libs/blog/source";
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { toCardData } from "./components/article-card-data";
import { BlogFilterProvider } from "./components/blog-filter-provider";
import { ArticlesSection } from "./sections/articles-section";
import { HeroSection } from "./sections/hero-section";

interface PageProps {
  params: Promise<{ locale: AppLocale }>;
}

const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("blog.metadata.title"),
    description: t("blog.metadata.description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: {
        en: `${siteUrl}/en/blog`,
        it: `${siteUrl}/it/blog`,
        "x-default": `${siteUrl}/it/blog`,
      },
      types: {
        "application/rss+xml": `${siteUrl}/${locale}/blog/rss.xml`,
      },
    },
    openGraph: {
      title: t("blog.metadata.title"),
      description: t("blog.metadata.description"),
      url: `${siteUrl}/${locale}/blog`,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      alternateLocale: locale === "it" ? "en_US" : "it_IT",
      siteName: "Andrea Losavio",
      images: [
        {
          url: `${siteUrl}/images/og.jpg`,
          width: 1200,
          height: 630,
          alt: "Andrea Losavio - Senior Software Engineer & FDE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("blog.metadata.title"),
      description: t("blog.metadata.description"),
      images: [`${siteUrl}/images/og.jpg`],
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const articles = getArticles(locale);
  const tags = getUsedTags(locale);
  const tagCounts = getTagCounts(locale);
  const pageUrl = `${siteUrl}/${locale}/blog`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("common.navigation.home"), url: `${siteUrl}/${locale}` },
    { name: t("blog.index.title"), url: pageUrl },
  ]);

  const blogSchema = generateBlogSchema({
    url: pageUrl,
    name: t("blog.metadata.title"),
    description: t("blog.metadata.description"),
    author: {
      id: `${siteUrl}#person`,
      name: "Andrea Losavio",
      url: siteUrl,
    },
    inLanguage: locale,
    posts: articles.slice(0, BLOG_RECENT_SIZE).map((article) => ({
      url: `${siteUrl}/${locale}/blog/${article.slug}`,
      headline: article.frontmatter.title,
      datePublished: article.frontmatter.publishedAt,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, blogSchema]),
        }}
      />

      <PageMessages namespaces={["blog"]}>
        <HeroSection id="hero" locale={locale} />

        <BlogFilterProvider availableTags={tags}>
          <ArticlesSection
            tagCounts={tagCounts}
            articles={articles.map((article) => ({
              tags: article.frontmatter.tags,
              haystack: [
                article.frontmatter.title,
                article.frontmatter.subtitle,
                article.frontmatter.description,
              ]
                .join(" ")
                .toLowerCase(),
              article: toCardData(article),
            }))}
            className="pb-20 md:pb-24"
          />
        </BlogFilterProvider>
      </PageMessages>
    </>
  );
}
