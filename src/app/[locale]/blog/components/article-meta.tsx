import { CalendarIcon, ClockIcon, PencilLineIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { BlogArticle } from "@/libs/blog/source";
import { cn } from "@/utils/cn";
import { formatArticleDate } from "@/utils/format-date";
import { ArticleTag } from "./article-tag";

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
        {frontmatter.tags.map((tag) => (
          <ArticleTag key={tag}>{t(`blog.tags.${tag}` as never)}</ArticleTag>
        ))}
      </div>

      <p className="text-muted-foreground m-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
          <time dateTime={frontmatter.publishedAt}>
            {t("blog.article.publishedOn", {
              date: formatArticleDate(frontmatter.publishedAt, article.locale),
            })}
          </time>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <ClockIcon className="size-4 shrink-0" aria-hidden="true" />
          {t("blog.article.readingTime", { minutes: article.readingTime })}
        </span>

        {frontmatter.updatedAt && (
          <span className="inline-flex items-center gap-1.5">
            <PencilLineIcon className="size-4 shrink-0" aria-hidden="true" />
            <time dateTime={frontmatter.updatedAt}>
              {t("blog.article.updatedOn", {
                date: formatArticleDate(frontmatter.updatedAt, article.locale),
              })}
            </time>
          </span>
        )}
      </p>
    </div>
  );
}
