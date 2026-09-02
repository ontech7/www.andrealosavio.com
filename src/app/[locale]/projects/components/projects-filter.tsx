"use client";

import { cn } from "@/utils/cn";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import { SortOrder, useProjectsFilter } from "./projects-filter-provider";

const SORT_OPTIONS = [
  { value: "none", labelKey: "projects.filter.sortOrderNone" },
  { value: "asc", labelKey: "projects.filter.sortOrderAsc" },
  { value: "desc", labelKey: "projects.filter.sortOrderDesc" },
] as const satisfies readonly { value: SortOrder; labelKey: string }[];

interface FilterChipGroupProps {
  label: string;
  values: readonly string[];
  selected: readonly string[];
  onToggle: (value: string) => void;
  variant: "role" | "tag";
}

function FilterChipGroup({
  label,
  values,
  selected,
  onToggle,
  variant,
}: FilterChipGroupProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {values.map((value) => {
          const isSelected = selected.includes(value);
          const display =
            variant === "role" ? t(`projects.roleLabels.${value}`) : value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              aria-pressed={isSelected}
              aria-label={t("common.accessibility.filterByTag", {
                tag: display,
              })}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors lg:text-[10px]",
                isSelected
                  ? "bg-foreground text-background"
                  : variant === "role"
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {display}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ProjectsFilterProps {
  tags: readonly string[];
  roles: readonly string[];
}

export function ProjectsFilter({ tags, roles }: ProjectsFilterProps) {
  const t = useTranslations();
  const {
    selectedTags,
    selectedRoles,
    sortOrder,
    toggleTag,
    toggleRole,
    changeSortOrder,
  } = useProjectsFilter();

  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const triggerId = useId();

  const activeSortOption =
    SORT_OPTIONS.find((option) => option.value === sortOrder) ??
    SORT_OPTIONS[0];

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
    <div className="mb-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
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
              id={triggerId}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-labelledby={`sort-label ${triggerId}`}
              className="bg-muted text-foreground flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            >
              <span>{t(activeSortOption.labelKey)}</span>
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
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={sortOrder === option.value}
                  onClick={() => {
                    changeSortOrder(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    sortOrder === option.value
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  )}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterChipGroup
        label={t("projects.filter.rolesLabel")}
        values={roles}
        selected={selectedRoles}
        onToggle={toggleRole}
        variant="role"
      />

      <FilterChipGroup
        label={t("projects.filter.tagsLabel")}
        values={tags}
        selected={selectedTags}
        onToggle={toggleTag}
        variant="tag"
      />
    </div>
  );
}
