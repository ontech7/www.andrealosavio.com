"use client";

import { ArrowRightIcon } from "lucide-react";
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

interface ArticleFeaturedProps {
  article: ArticleCardData;
  className?: string;
}

export function ArticleFeatured({ article, className }: ArticleFeaturedProps) {
  const t = useTranslations();

  return (
    <Card
      className={cn(
        "group relative grid grid-cols-1 gap-6 p-5 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-8 md:p-6",
        className
      )}
    >
      <Image
        src={article.coverHeroUrl}
        alt={article.coverAlt}
        width={COVER_RASTER_WIDTH}
        height={COVER_RASTER_HEIGHT}
        unoptimized
        priority
        className="border-border aspect-[1200/630] w-full overflow-hidden rounded-xl border object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />

      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.tags.map((tag) => (
            <ArticleTag key={tag}>{t(`blog.tags.${tag}` as never)}</ArticleTag>
          ))}
        </div>

        <h2 className="text-2xl leading-tight font-bold text-white md:text-3xl">
          <Link
            href={`/blog/${article.slug}`}
            className="focus-visible:ring-ring/50 rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-[3px]"
          >
            {article.title}
          </Link>
        </h2>

        <p className="text-muted-foreground leading-relaxed md:text-lg">
          {article.subtitle}
        </p>

        <ArticleStamp
          publishedAt={article.publishedAt}
          readingTime={article.readingTime}
        />

        <span className="text-muted-foreground group-hover:text-secondary mt-1 inline-flex items-center gap-2 text-sm font-medium transition-colors">
          {t("blog.index.readMore")}
          <ArrowRightIcon
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Card>
  );
}
