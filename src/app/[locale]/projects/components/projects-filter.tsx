"use client";

import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { ChevronDownIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

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
  const t = useTranslations("projects.filter");
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget)) {
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
      {/* Sort Select - First on mobile, left on desktop */}
      <motion.div
        variants={fadeInUpAnim}
        transition={{ duration: 0.5 }}
        className="order-1 flex flex-col gap-2"
      >
        <span className="text-muted-foreground text-sm">{t("sortLabel")}</span>
        <div ref={selectRef} className="relative" onBlur={handleBlur}>
          <span
            className="relative inline-flex rounded-lg p-px"
            style={{ background: "var(--border-gradient)" }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-muted text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            >
              <span>
                {sortOrder === "none"
                  ? t("sortOrderNone")
                  : sortOrder === "asc"
                    ? t("sortOrderAsc")
                    : t("sortOrderDesc")}
              </span>
              <ChevronDownIcon
                className={cn(
                  "size-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          </span>

          {/* Dropdown */}
          {isOpen && (
            <div className="border-border bg-card absolute left-0 z-10 mt-2 min-w-25 rounded-lg border p-1 shadow-lg">
              <button
                type="button"
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
                {t("sortOrderNone")}
              </button>
              <button
                type="button"
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
                {t("sortOrderAsc")}
              </button>
              <button
                type="button"
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
                {t("sortOrderDesc")}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tags - Second on mobile, right on desktop */}
      <motion.div
        variants={fadeInUpAnim}
        transition={{ duration: 0.5 }}
        className="order-2 flex flex-col gap-2"
      >
        <span className="text-muted-foreground text-sm">{t("tagsLabel")}</span>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagToggle(tag)}
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
