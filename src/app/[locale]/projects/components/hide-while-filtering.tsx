"use client";

import { useProjectsFilter } from "./projects-filter-provider";

export function HideWhileFiltering({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedTags, selectedRoles } = useProjectsFilter();

  if (selectedTags.length > 0 || selectedRoles.length > 0) {
    return null;
  }

  return <>{children}</>;
}
