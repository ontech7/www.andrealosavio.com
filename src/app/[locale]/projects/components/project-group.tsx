"use client";

import type { ProjectRole } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectGroupProps {
  projects: readonly {
    tags: readonly string[];
    roles: readonly ProjectRole[];
  }[];
  children: React.ReactNode;
}

export function ProjectGroup({ projects, children }: ProjectGroupProps) {
  const { selectedTags, selectedRoles } = useProjectsFilter();

  const hasMatch = projects.some(
    (project) =>
      selectedTags.every((tag) => project.tags.includes(tag)) &&
      selectedRoles.every((role) =>
        (project.roles as readonly string[]).includes(role)
      )
  );

  return <div className={cn("last:mb-0", hasMatch && "mb-12")}>{children}</div>;
}
