import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
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

  const label = t("blog.article.series.label", {
    part: index + 1,
    total: articles.length,
  });

  return (
    <div className={cn("my-10", className)}>
      <Card className="bg-background gap-4 p-5">
        <nav aria-label={label} className="flex flex-col gap-4">
          <p className="text-secondary m-0 text-xs font-semibold tracking-[0.2em] uppercase">
            {label}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {previous && (
              <Link
                href={`/blog/${previous.slug}`}
                className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeftIcon
                  className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {t("blog.article.series.previous")}:
                </span>
                {previous.frontmatter.title}
              </Link>
            )}

            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm transition-colors sm:ml-auto sm:text-right"
              >
                <span className="sr-only">
                  {t("blog.article.series.next")}:
                </span>
                {next.frontmatter.title}
                <ArrowRightIcon
                  className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </nav>
      </Card>
    </div>
  );
}
