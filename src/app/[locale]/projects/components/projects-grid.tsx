"use client";

import { Button } from "@/components/ui/button";
import type { ProjectRole } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { CopyMinus, CopyPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Children, useState } from "react";
import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectsGridProps {
  projects: readonly {
    tags: readonly string[];
    roles: readonly ProjectRole[];
    alphabeticalIndex: number;
  }[];
  collapseAfter?: number;
  className?: string;
  children: React.ReactNode;
}

export function ProjectsGrid({
  projects,
  collapseAfter,
  className,
  children,
}: ProjectsGridProps) {
  const t = useTranslations();
  const { selectedTags, selectedRoles, sortOrder } = useProjectsFilter();
  const [expanded, setExpanded] = useState(false);

  const cards = Children.toArray(children);

  const matching = projects
    .map((project, index) => ({ ...project, index }))
    .filter(
      (project) =>
        selectedTags.every((tag) => project.tags.includes(tag)) &&
        selectedRoles.every((role) =>
          (project.roles as readonly string[]).includes(role)
        )
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.alphabeticalIndex - b.alphabeticalIndex;
      if (sortOrder === "desc")
        return b.alphabeticalIndex - a.alphabeticalIndex;
      return a.index - b.index;
    });

  const isCollapsed =
    !expanded && collapseAfter !== undefined && matching.length > collapseAfter;

  const visible = isCollapsed ? matching.slice(0, collapseAfter) : matching;

  return (
    <>
      <div className={cn("grid grid-cols-1 gap-6", className)}>
        {visible.map((project) => (
          <div key={project.index}>{cards[project.index]}</div>
        ))}
      </div>

      {(isCollapsed || expanded) && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded
              ? t("projects.list.showLess")
              : t("projects.list.showMore")}
            {expanded ? (
              <CopyMinus className="size-4" aria-hidden="true" />
            ) : (
              <CopyPlus className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      )}
    </>
  );
}
