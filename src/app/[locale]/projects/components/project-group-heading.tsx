"use client";

import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectGroupHeadingProps {
  title: string;
  subtitle: string;
}

export function ProjectGroupHeading({
  title,
  subtitle,
}: ProjectGroupHeadingProps) {
  const { selectedTags, selectedRoles } = useProjectsFilter();

  if (selectedTags.length > 0 || selectedRoles.length > 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">{subtitle}</p>
    </div>
  );
}
