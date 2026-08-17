"use client";

import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectsEmptyStateProps {
  projectTags: readonly (readonly string[])[];
  message: string;
}

export function ProjectsEmptyState({
  projectTags,
  message,
}: ProjectsEmptyStateProps) {
  const { selectedTags } = useProjectsFilter();

  const hasMatch = projectTags.some((tags) =>
    selectedTags.every((tag) => tags.includes(tag))
  );

  if (hasMatch) {
    return null;
  }

  return <p className="text-muted-foreground py-12 text-center">{message}</p>;
}
