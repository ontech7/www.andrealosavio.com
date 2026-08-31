import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { BlogArticle } from "@/libs/blog/source";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";

interface SeriesNavigationProps {
  articles: readonly BlogArticle[];
  current: BlogArticle;
  className?: string;
}

export async function SeriesNavigation({
  articles,
  current,
  className,
}: SeriesNavigationProps) {
  if (articles.length < 2) {
    return null;
  }

  const t = await getTranslations({ locale: current.locale });
  const index = articles.findIndex((article) => article.slug === current.slug);
  const previous = index > 0 ? articles[index - 1] : null;
  const next = index < articles.length - 1 ? articles[index + 1] : null;

  return (
    <nav
      aria-label={t("blog.article.series.label", {
        part: index + 1,
        total: articles.length,
      })}
      className={cn("border-border my-10 rounded-xl border p-5", className)}
    >
      <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
        {t("blog.article.series.label", {
          part: index + 1,
          total: articles.length,
        })}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {previous && (
          <Link
            href={`/blog/${previous.slug}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            {previous.frontmatter.title}
          </Link>
        )}

        {next && (
          <Link
            href={`/blog/${next.slug}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors sm:ml-auto"
          >
            {next.frontmatter.title}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
}
