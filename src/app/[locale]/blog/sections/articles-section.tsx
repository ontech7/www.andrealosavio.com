"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { BLOG_PAGE_SIZE } from "@/constants/blog";
import { clampPage, pageCount, pageSlice } from "@/libs/blog/pagination";
import type { TagCount } from "@/libs/blog/source";
import { cn } from "@/utils/cn";
import type { ArticleCardData } from "../components/article-card-data";
import { ArticleCard } from "../components/article-card";
import { ArticleFeatured } from "../components/article-featured";
import { BlogEmptyState } from "../components/blog-empty-state";
import { BlogFilter } from "../components/blog-filter";
import { useBlogFilter } from "../components/blog-filter-provider";
import { BlogPagination } from "../components/blog-pagination";

export interface ArticleEntry {
  tags: readonly string[];
  haystack: string;
  article: ArticleCardData;
}

interface ArticlesSectionProps {
  tagCounts: readonly TagCount[];
  articles: readonly ArticleEntry[];
  className?: string;
}

export function ArticlesSection({
  tagCounts,
  articles,
  className,
}: ArticlesSectionProps) {
  const t = useTranslations();
  const { selectedTags, query, page, isFiltering, setPage } = useBlogFilter();
  const listRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim().toLowerCase();

  const visible = articles.filter((article) => {
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => article.tags.includes(tag));

    const matchesQuery =
      normalizedQuery === "" || article.haystack.includes(normalizedQuery);

    return matchesTags && matchesQuery;
  });

  const [first, ...rest] = visible;
  const showFeatured = !isFiltering && first !== undefined;
  const gridArticles = showFeatured ? rest : visible;

  const totalPages = pageCount(gridArticles.length, BLOG_PAGE_SIZE);
  const currentPage = clampPage(page, totalPages);
  const pageArticles = pageSlice(gridArticles, currentPage, BLOG_PAGE_SIZE);

  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
  }, [currentPage, page, setPage]);

  const goToPage = (next: number) => {
    setPage(next);

    const reducesMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    listRef.current?.scrollIntoView({
      behavior: reducesMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section className={cn("mx-auto max-w-5xl px-6", className)}>
      {articles.length > 0 && (
        <BlogFilter tagCounts={tagCounts} resultCount={visible.length} />
      )}

      {visible.length === 0 ? (
        <BlogEmptyState
          messageKey={
            articles.length === 0
              ? "blog.index.noArticlesYet"
              : "blog.index.empty"
          }
        />
      ) : (
        <>
          {showFeatured && (
            <div className="mb-12">
              <p className="text-secondary mb-3 text-xs tracking-[0.2em] uppercase">
                {t("blog.index.featuredLabel")}
              </p>
              <ArticleFeatured article={first.article} />
            </div>
          )}

          <div ref={listRef} className="scroll-mt-24">
            {showFeatured && gridArticles.length > 0 && (
              <div className="border-border mb-8 border-t pt-8">
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  {t("blog.index.allArticles")}
                </h2>
              </div>
            )}

            {pageArticles.length > 0 && (
              <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2">
                {pageArticles.map((article) => (
                  <ArticleCard
                    key={article.article.slug}
                    article={article.article}
                  />
                ))}
              </div>
            )}

            {gridArticles.length > 0 && (
              <BlogPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                className="mt-10"
              />
            )}
          </div>
        </>
      )}
    </section>
  );
}
