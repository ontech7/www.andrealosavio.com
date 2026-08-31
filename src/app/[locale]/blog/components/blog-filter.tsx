"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import type { TagCount } from "@/libs/blog/source";
import { cn } from "@/utils/cn";
import { useBlogFilter } from "./blog-filter-provider";

interface BlogFilterProps {
  tagCounts: readonly TagCount[];
  resultCount: number;
  className?: string;
}

export function BlogFilter({
  tagCounts,
  resultCount,
  className,
}: BlogFilterProps) {
  const t = useTranslations();
  const { selectedTags, query, isFiltering, toggleTag, setQuery, clearAll } =
    useBlogFilter();
  const searchId = useId();

  return (
    <div className={cn("mb-8 flex flex-col gap-6", className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="order-1 flex flex-col gap-2">
          <label htmlFor={searchId} className="text-muted-foreground text-sm">
            {t("blog.index.filter.searchLabel")}
          </label>
          <span
            className="relative inline-flex rounded-lg p-px"
            style={{ background: "var(--border-gradient)" }}
          >
            <SearchIcon
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("blog.index.filter.searchPlaceholder")}
              className="bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/50 w-full rounded-lg py-2 pr-4 pl-10 text-sm outline-none focus-visible:ring-[3px] [&::-webkit-search-cancel-button]:hidden"
            />
          </span>
        </div>

        <div className="order-2 flex flex-col gap-2">
          <span className="text-muted-foreground text-sm">
            {t("blog.index.filter.tagsLabel")}
          </span>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label={t("blog.index.filter.tagsLabel")}
          >
            {tagCounts.map(({ tag, count }) => {
              const isSelected = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={isSelected}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors lg:text-[10px]",
                    isSelected
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {t(`blog.tags.${tag}` as never)}
                  <span
                    className={cn(
                      "ml-1.5 tabular-nums",
                      isSelected ? "opacity-60" : "opacity-50"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {t("blog.index.filter.results", { count: resultCount })}
        </p>

        {isFiltering && (
          <button
            type="button"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-sm transition-colors"
          >
            <XIcon className="size-3.5" aria-hidden="true" />
            {t("blog.index.filter.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
