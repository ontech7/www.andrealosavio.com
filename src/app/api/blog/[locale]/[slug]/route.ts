import { getArticle, getArticles } from "@/libs/blog/source";
import { toPlainMarkdown } from "@/libs/blog/to-plain-markdown";
import { locales, type AppLocale } from "@/libs/i18n/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getArticles(locale).map((article) => ({ locale, slug: article.slug }))
  );
}

function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  const { locale, slug } = await params;

  if (!isAppLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  const article = getArticle(locale, slug);

  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  const { frontmatter } = article;

  const document = [
    `# ${frontmatter.title}`,
    "",
    `> ${frontmatter.subtitle}`,
    "",
    `- Autore: Andrea Losavio`,
    `- Pubblicato: ${frontmatter.publishedAt}`,
    ...(frontmatter.updatedAt
      ? [`- Aggiornato: ${frontmatter.updatedAt}`]
      : []),
    `- Lingua: ${locale}`,
    `- Tag: ${frontmatter.tags.join(", ")}`,
    `- Tempo di lettura: ${article.readingTime} min`,
    "",
    "## In breve",
    "",
    ...frontmatter.takeaways.map((item) => `- ${item}`),
    "",
    "---",
    "",
    toPlainMarkdown(article.body),
  ].join("\n");

  return new Response(document, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
