import { ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import type { BlogArticle } from "@/libs/blog/source";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArticleCover } from "./article-cover";
import { ArticleStamp } from "./article-stamp";
import { ArticleTag } from "./article-tag";

interface ArticleFeaturedProps {
  article: BlogArticle;
  className?: string;
}

export async function ArticleFeatured({
  article,
  className,
}: ArticleFeaturedProps) {
  const t = await getTranslations({ locale: article.locale });
  const { frontmatter } = article;

  return (
    <Card
      className={cn(
        "group relative grid grid-cols-1 gap-6 p-5 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-8 md:p-6",
        className
      )}
    >
      <ArticleCover
        frontmatter={frontmatter}
        priority
        className="transition-transform duration-500 group-hover:scale-[1.02]"
      />

      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {frontmatter.tags.map((tag) => (
            <ArticleTag key={tag}>{t(`blog.tags.${tag}` as never)}</ArticleTag>
          ))}
        </div>

        <h2 className="text-2xl leading-tight font-bold text-white md:text-3xl">
          <Link
            href={`/blog/${article.slug}`}
            className="focus-visible:ring-ring/50 rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-[3px]"
          >
            {frontmatter.title}
          </Link>
        </h2>

        <p className="text-muted-foreground leading-relaxed md:text-lg">
          {frontmatter.subtitle}
        </p>

        <ArticleStamp article={article} />

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
