import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import type { BlogArticle } from "@/libs/blog/source";
import { cn } from "@/utils/cn";
import { formatArticleDate } from "@/utils/format-date";

interface ArticleMetaProps {
  article: BlogArticle;
  className?: string;
}

export async function ArticleMeta({ article, className }: ArticleMetaProps) {
  const t = await getTranslations({ locale: article.locale });
  const { frontmatter } = article;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {t(`blog.kinds.${frontmatter.kind}` as never)}
        </Badge>
        {frontmatter.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {t(`blog.tags.${tag}` as never)}
          </Badge>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">
        <time dateTime={frontmatter.publishedAt}>
          {t("blog.article.publishedOn", {
            date: formatArticleDate(frontmatter.publishedAt, article.locale),
          })}
        </time>
        {" · "}
        {t("blog.article.readingTime", { minutes: article.readingTime })}
        {frontmatter.updatedAt && (
          <>
            {" · "}
            <time dateTime={frontmatter.updatedAt}>
              {t("blog.article.updatedOn", {
                date: formatArticleDate(frontmatter.updatedAt, article.locale),
              })}
            </time>
          </>
        )}
      </p>
    </div>
  );
}
