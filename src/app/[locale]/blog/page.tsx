import { PageMessages } from "@/libs/i18n/messages";
import type { AppLocale } from "@/libs/i18n/utils";
import { getArticles, getUsedTags } from "@/libs/blog/source";
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArticleCard } from "./components/article-card";
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
  const pageUrl = `${siteUrl}/${locale}/blog`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("common.navigation.home"), url: `${siteUrl}/${locale}` },
    { name: t("blog.index.title"), url: pageUrl },
  ]);

  const blogSchema = generateBlogSchema({
    url: pageUrl,
    name: t("blog.metadata.title"),
    description: t("blog.metadata.description"),
    authorId: `${siteUrl}#person`,
    inLanguage: locale,
    posts: articles.map((article) => ({
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
            tags={tags}
            articles={articles.map((article) => ({
              slug: article.slug,
              tags: article.frontmatter.tags,
              card: <ArticleCard article={article} />,
            }))}
            className="pb-16"
          />
        </BlogFilterProvider>
      </PageMessages>
    </>
  );
}
