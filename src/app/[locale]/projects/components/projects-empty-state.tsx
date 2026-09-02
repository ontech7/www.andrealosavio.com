"use client";

import type { ProjectRole } from "@/constants/projects";
import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectsEmptyStateProps {
  projects: readonly {
    tags: readonly string[];
    roles: readonly ProjectRole[];
  }[];
  message: string;
}

export function ProjectsEmptyState({
  projects,
  message,
}: ProjectsEmptyStateProps) {
  const { selectedTags, selectedRoles } = useProjectsFilter();

  const hasMatch = projects.some(
    (project) =>
      selectedTags.every((tag) => project.tags.includes(tag)) &&
      selectedRoles.every((role) =>
        (project.roles as readonly string[]).includes(role)
      )
  );

  if (hasMatch) {
    return null;
  }

  return <p className="text-muted-foreground py-12 text-center">{message}</p>;
}
