import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import type { BlogArticle } from "@/libs/blog/source";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { formatArticleDate } from "@/utils/format-date";
import { ArticleCover } from "./article-cover";

interface ArticleCardProps {
  article: BlogArticle;
  className?: string;
}

export async function ArticleCard({ article, className }: ArticleCardProps) {
  const t = await getTranslations({ locale: article.locale });
  const { frontmatter } = article;

  return (
    <article className={cn("group flex flex-col gap-3", className)}>
      <Link
        href={`/blog/${article.slug}`}
        className="block"
        aria-hidden="true"
        tabIndex={-1}
      >
        <ArticleCover
          slug={article.slug}
          kind={frontmatter.kind}
          title={frontmatter.title}
          cover={frontmatter.cover}
          coverAlt={frontmatter.coverAlt}
        />
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {t(`blog.kinds.${frontmatter.kind}` as never)}
        </Badge>
        {frontmatter.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline">
            {t(`blog.tags.${tag}` as never)}
          </Badge>
        ))}
      </div>

      <h3 className="text-foreground text-lg leading-snug font-semibold">
        <Link
          href={`/blog/${article.slug}`}
          className="group-hover:text-secondary transition-colors"
        >
          {frontmatter.title}
        </Link>
      </h3>

      <p className="text-muted-foreground text-sm">{frontmatter.subtitle}</p>

      <p className="text-muted-foreground text-xs">
        <time dateTime={frontmatter.publishedAt}>
          {formatArticleDate(frontmatter.publishedAt, article.locale)}
        </time>
        {" · "}
        {t("blog.article.readingTime", { minutes: article.readingTime })}
      </p>
    </article>
  );
}
