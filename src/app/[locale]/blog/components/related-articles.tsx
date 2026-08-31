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
      <h2 className="text-foreground mb-6 text-xl font-bold">
        {t("blog.article.related")}
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
