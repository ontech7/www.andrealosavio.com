import { BLOG_RECENT_SIZE } from "@/constants/blog";
import { getArticles } from "@/libs/blog/source";
import { locales, type AppLocale } from "@/libs/i18n/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toRfc822(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toUTCString();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  const articles = getArticles(locale).slice(0, BLOG_RECENT_SIZE);
  const feedUrl = `${siteUrl}/${locale}/blog/rss.xml`;

  const items = articles
    .map((article) => {
      const url = `${siteUrl}/${locale}/blog/${article.slug}`;

      return [
        "    <item>",
        `      <title>${escapeXml(article.frontmatter.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(article.frontmatter.description)}</description>`,
        `      <pubDate>${toRfc822(article.frontmatter.publishedAt)}</pubDate>`,
        ...article.frontmatter.tags.map(
          (tag) => `      <category>${escapeXml(tag)}</category>`
        ),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>Andrea Losavio - Blog</title>`,
    `    <link>${siteUrl}/${locale}/blog</link>`,
    `    <description>${escapeXml(
      locale === "it"
        ? "Appunti di sviluppo, librerie provate, notizie e pensieri sparsi."
        : "Development notes, libraries I have tried, news and scattered thoughts."
    )}</description>`,
    `    <language>${locale}</language>`,
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
