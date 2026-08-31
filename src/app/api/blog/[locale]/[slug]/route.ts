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

const LABELS: Record<
  AppLocale,
  {
    author: string;
    published: string;
    updated: string;
    language: string;
    tags: string;
    readingTime: string;
    takeaways: string;
  }
> = {
  it: {
    author: "Autore",
    published: "Pubblicato",
    updated: "Aggiornato",
    language: "Lingua",
    tags: "Tag",
    readingTime: "Tempo di lettura",
    takeaways: "In breve",
  },
  en: {
    author: "Author",
    published: "Published",
    updated: "Updated",
    language: "Language",
    tags: "Tags",
    readingTime: "Reading time",
    takeaways: "In short",
  },
};

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
  const labels = LABELS[locale];

  const document = [
    `# ${frontmatter.title}`,
    "",
    `> ${frontmatter.subtitle}`,
    "",
    `- ${labels.author}: Andrea Losavio`,
    `- ${labels.published}: ${frontmatter.publishedAt}`,
    ...(frontmatter.updatedAt
      ? [`- ${labels.updated}: ${frontmatter.updatedAt}`]
      : []),
    `- ${labels.language}: ${locale}`,
    `- ${labels.tags}: ${frontmatter.tags.join(", ")}`,
    `- ${labels.readingTime}: ${article.readingTime} min`,
    "",
    `## ${labels.takeaways}`,
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
