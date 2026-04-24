"use client";

import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { ChevronDownIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";

export type SortOrder = "none" | "asc" | "desc";

interface ProjectsFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export function ProjectsFilter({
  tags,
  selectedTags,
  onTagToggle,
  sortOrder,
  onSortChange,
}: ProjectsFilterProps) {
  const t = useTranslations();
  const tCommon = useTranslations();

  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainerAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      <motion.div
        variants={fadeInUpAnim}
        transition={{ duration: 0.5 }}
        className="order-1 flex flex-col gap-2"
      >
        <span id="sort-label" className="text-muted-foreground text-sm">
          {t("projects.filter.sortLabel")}
        </span>
        <div
          ref={selectRef}
          className="relative"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        >
          <span
            className="relative inline-flex rounded-lg p-px"
            style={{ background: "var(--border-gradient)" }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-labelledby="sort-label"
              className="bg-muted text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            >
              <span>
                {sortOrder === "none"
                  ? t("projects.filter.sortOrderNone")
                  : sortOrder === "asc"
                    ? t("projects.filter.sortOrderAsc")
                    : t("projects.filter.sortOrderDesc")}
              </span>
              <ChevronDownIcon
                className={cn(
                  "size-4 transition-transform",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
          </span>

          {isOpen && (
            <div
              id={listboxId}
              role="listbox"
              aria-labelledby="sort-label"
              className="border-border bg-card absolute left-0 z-10 mt-2 min-w-25 rounded-lg border p-1 shadow-lg"
            >
              <button
                type="button"
                role="option"
                aria-selected={sortOrder === "none"}
                onClick={() => {
                  onSortChange("none");
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  sortOrder === "none"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                )}
              >
                {t("projects.filter.sortOrderNone")}
              </button>
              <button
                type="button"
                role="option"
                aria-selected={sortOrder === "asc"}
                onClick={() => {
                  onSortChange("asc");
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  sortOrder === "asc"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                )}
              >
                {t("projects.filter.sortOrderAsc")}
              </button>
              <button
                type="button"
                role="option"
                aria-selected={sortOrder === "desc"}
                onClick={() => {
                  onSortChange("desc");
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  sortOrder === "desc"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                )}
              >
                {t("projects.filter.sortOrderDesc")}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={fadeInUpAnim}
        transition={{ duration: 0.5 }}
        className="order-2 flex flex-col gap-2"
      >
        <span className="text-muted-foreground text-sm">
          {t("projects.filter.tagsLabel")}
        </span>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={t("projects.filter.tagsLabel")}
        >
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagToggle(tag)}
                aria-pressed={isSelected}
                aria-label={tCommon("common.accessibility.filterByTag", {
                  tag,
                })}
                className={cn(
                  "cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors lg:text-[10px]",
                  isSelected
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
