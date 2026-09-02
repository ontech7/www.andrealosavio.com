"use client";

import { CalendarIcon, ClockIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";
import { formatArticleDate } from "@/utils/format-date";

interface ArticleStampProps {
  publishedAt: string;
  readingTime: number;
  className?: string;
}

export function ArticleStamp({
  publishedAt,
  readingTime,
  className,
}: ArticleStampProps) {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;

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
          {formatArticleDate(publishedAt, locale)}
        </time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ClockIcon className="size-3.5 shrink-0" aria-hidden="true" />
        {t("blog.article.readingTime", { minutes: readingTime })}
      </span>
    </p>
  );
}
