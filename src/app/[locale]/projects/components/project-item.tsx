"use client";

import type { ProjectRole } from "@/constants/projects";
import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectItemProps {
  tags: readonly string[];
  roles: readonly ProjectRole[];
  sourceIndex: number;
  alphabeticalIndex: number;
  total: number;
  children: React.ReactNode;
}

export function ProjectItem({
  tags,
  roles,
  sourceIndex,
  alphabeticalIndex,
  total,
  children,
}: ProjectItemProps) {
  const { selectedTags, selectedRoles, sortOrder } = useProjectsFilter();

  const isMatching =
    selectedTags.every((tag) => tags.includes(tag)) &&
    selectedRoles.every((role) => roles.includes(role as ProjectRole));

  const order =
    sortOrder === "asc"
      ? alphabeticalIndex
      : sortOrder === "desc"
        ? total - 1 - alphabeticalIndex
        : sourceIndex;

  return (
    <div hidden={!isMatching} style={{ order }}>
      {children}
    </div>
  );
}
