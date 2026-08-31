"use client";

import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { useBlogFilter } from "./blog-filter-provider";

interface BlogFilterProps {
  tags: readonly string[];
  className?: string;
}

export function BlogFilter({ tags, className }: BlogFilterProps) {
  const t = useTranslations();
  const { selectedTags, toggleTag, clearTags } = useBlogFilter();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-muted-foreground text-sm">
        {t("blog.index.filter.tagsLabel")}
      </span>

      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label={t("blog.index.filter.tagsLabel")}
      >
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={isSelected}
              aria-label={t("common.accessibility.filterByTag", {
                tag: t(`blog.tags.${tag}` as never),
              })}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors",
                isSelected
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t(`blog.tags.${tag}` as never)}
            </button>
          );
        })}

        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={clearTags}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-md px-2 py-1 text-xs underline"
          >
            {t("blog.index.filter.clear")}
          </button>
        )}
      </div>
    </div>
  );
}
