"use client";

import { cn } from "@/utils/cn";
import { BlogEmptyState } from "../components/blog-empty-state";
import { BlogFilter } from "../components/blog-filter";
import { useBlogFilter } from "../components/blog-filter-provider";

interface ArticlesSectionProps {
  tags: readonly string[];
  articles: readonly {
    slug: string;
    tags: readonly string[];
    card: React.ReactNode;
  }[];
  className?: string;
}

export function ArticlesSection({
  tags,
  articles,
  className,
}: ArticlesSectionProps) {
  const { selectedTags } = useBlogFilter();

  const visible = articles.filter(
    (article) =>
      selectedTags.length === 0 ||
      selectedTags.every((tag) => article.tags.includes(tag))
  );

  return (
    <section
      className={cn("mx-auto max-w-5xl px-4 sm:px-6 lg:px-8", className)}
    >
      <BlogFilter tags={tags} className="mb-8" />

      {visible.length === 0 ? (
        <BlogEmptyState
          messageKey={
            selectedTags.length === 0
              ? "blog.index.noArticlesYet"
              : "blog.index.empty"
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {visible.map((article) => (
            <div key={article.slug}>{article.card}</div>
          ))}
        </div>
      )}
    </section>
  );
}
