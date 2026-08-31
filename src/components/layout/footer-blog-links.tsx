import { getArticles } from "@/libs/blog/source";
import { Link } from "@/libs/i18n/navigation";
import type { AppLocale } from "@/libs/i18n/utils";
import { getLocale, getTranslations } from "next-intl/server";

const FOOTER_ARTICLE_COUNT = 3;

export async function FooterBlogLinks() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale });
  const articles = getArticles(locale).slice(0, FOOTER_ARTICLE_COUNT);

  return (
    <ul className="space-y-2 p-0">
      {articles.map((article) => (
        <li key={article.slug}>
          <Link
            href={`/blog/${article.slug}`}
            className="text-muted-foreground hover:text-foreground line-clamp-2 text-sm transition-colors"
          >
            {article.frontmatter.title}
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/blog"
          className="text-foreground text-sm font-medium transition-colors hover:underline"
        >
          {t("common.footer.links.allArticles")}
        </Link>
      </li>
    </ul>
  );
}
