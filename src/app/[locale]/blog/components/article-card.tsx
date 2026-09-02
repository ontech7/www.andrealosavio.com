"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import {
  COVER_RASTER_HEIGHT,
  COVER_RASTER_WIDTH,
} from "@/libs/blog/cover-image";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import type { ArticleCardData } from "./article-card-data";
import { ArticleStamp } from "./article-stamp";
import { ArticleTag } from "./article-tag";

interface ArticleCardProps {
  article: ArticleCardData;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const t = useTranslations();

  return (
    <Card className={cn("group relative gap-4 p-4", className)}>
      <Image
        src={article.coverThumbUrl}
        alt={article.coverAlt}
        width={COVER_RASTER_WIDTH}
        height={COVER_RASTER_HEIGHT}
        unoptimized
        loading="lazy"
        className="border-border aspect-[1200/630] w-full overflow-hidden rounded-xl border object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />

      <div className="flex flex-1 flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {article.tags.slice(0, 2).map((tag) => (
            <ArticleTag key={tag}>{t(`blog.tags.${tag}` as never)}</ArticleTag>
          ))}
          {article.seriesPart !== null && (
            <span className="text-muted-foreground text-xs">
              {t("blog.index.seriesPart", { part: article.seriesPart })}
            </span>
          )}
        </div>

        <h3 className="text-lg leading-snug font-semibold text-white">
          <Link
            href={`/blog/${article.slug}`}
            className="focus-visible:ring-ring/50 group-hover:text-secondary rounded-sm transition-colors outline-none after:absolute after:inset-0 focus-visible:ring-[3px]"
          >
            {article.title}
          </Link>
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {article.subtitle}
        </p>

        <ArticleStamp
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
          className="mt-auto pt-1"
        />
      </div>
    </Card>
  );
}
