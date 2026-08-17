"use client";

import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectItemProps {
  tags: readonly string[];
  sourceIndex: number;
  alphabeticalIndex: number;
  total: number;
  children: React.ReactNode;
}

export function ProjectItem({
  tags,
  sourceIndex,
  alphabeticalIndex,
  total,
  children,
}: ProjectItemProps) {
  const { selectedTags, sortOrder } = useProjectsFilter();

  const isMatching = selectedTags.every((tag) => tags.includes(tag));

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
