import { getTranslations } from "next-intl/server";
import type { BlogArticle } from "@/libs/blog/source";
import type { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";
import { ArticleCard } from "./article-card";

interface RelatedArticlesProps {
  articles: readonly BlogArticle[];
  locale: AppLocale;
  className?: string;
}

export async function RelatedArticles({
  articles,
  locale,
  className,
}: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  const t = await getTranslations({ locale });

  return (
    <section className={cn("border-border border-t pt-10", className)}>
      <h2 className="mb-6 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-2xl font-bold text-transparent">
        {t("blog.article.related")}
      </h2>

      <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
