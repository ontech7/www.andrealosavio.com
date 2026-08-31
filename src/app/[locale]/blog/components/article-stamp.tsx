import { CalendarIcon, ClockIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { BlogArticle } from "@/libs/blog/source";
import { cn } from "@/utils/cn";
import { formatArticleDate } from "@/utils/format-date";

interface ArticleStampProps {
  article: BlogArticle;
  className?: string;
}

export async function ArticleStamp({ article, className }: ArticleStampProps) {
  const t = await getTranslations({ locale: article.locale });
  const { publishedAt } = article.frontmatter;

  return (
    <p
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
        <time dateTime={publishedAt}>
          {formatArticleDate(publishedAt, article.locale)}
        </time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ClockIcon className="size-3.5 shrink-0" aria-hidden="true" />
        {t("blog.article.readingTime", { minutes: article.readingTime })}
      </span>
    </p>
  );
}
