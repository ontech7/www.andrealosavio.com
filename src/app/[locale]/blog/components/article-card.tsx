import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import type { BlogArticle } from "@/libs/blog/source";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArticleCover } from "./article-cover";
import { ArticleStamp } from "./article-stamp";
import { ArticleTag } from "./article-tag";

interface ArticleCardProps {
  article: BlogArticle;
  className?: string;
}

export async function ArticleCard({ article, className }: ArticleCardProps) {
  const t = await getTranslations({ locale: article.locale });
  const { frontmatter } = article;

  return (
    <Card className={cn("group relative gap-4 p-4", className)}>
      <ArticleCover
        frontmatter={frontmatter}
        variant="thumb"
        className="transition-transform duration-500 group-hover:scale-[1.02]"
      />

      <div className="flex flex-1 flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {frontmatter.tags.slice(0, 2).map((tag) => (
            <ArticleTag key={tag}>{t(`blog.tags.${tag}` as never)}</ArticleTag>
          ))}
          {frontmatter.series && (
            <span className="text-muted-foreground text-xs">
              {t("blog.index.seriesPart", { part: frontmatter.series.part })}
            </span>
          )}
        </div>

        <h3 className="text-lg leading-snug font-semibold text-white">
          <Link
            href={`/blog/${article.slug}`}
            className="focus-visible:ring-ring/50 group-hover:text-secondary rounded-sm transition-colors outline-none after:absolute after:inset-0 focus-visible:ring-[3px]"
          >
            {frontmatter.title}
          </Link>
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {frontmatter.subtitle}
        </p>

        <ArticleStamp article={article} className="mt-auto pt-1" />
      </div>
    </Card>
  );
}
