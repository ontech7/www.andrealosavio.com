"use client";

import { staggerContainerAnim } from "@/constants/motion";
import { PROJECTS } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import { ProjectCard } from "../components/project-card";
import { ProjectsFilter } from "../components/projects-filter";

interface ProjectsSectionProps {
  id: string;
  className?: string;
}

// Extract all unique tags from projects
const ALL_TAGS = [...new Set(PROJECTS.flatMap((p) => p.tags))].sort();

const sortOrderParser = parseAsStringLiteral(["none", "asc", "desc"] as const).withDefault("none");
const tagsParser = parseAsArrayOf(parseAsString, ",").withDefault([]);

export function ProjectsSection({ id, className }: ProjectsSectionProps) {
  const t = useTranslations("projects.items");

  const [selectedTags, setSelectedTags] = useQueryState("tags", tagsParser);
  const [sortOrder, setSortOrder] = useQueryState("sort", sortOrderParser);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = PROJECTS;

    // Filter by selected tags (show projects that have ALL selected tags)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((project) =>
        selectedTags.every((tag) => project.tags.includes(tag))
      );
    }

    if (sortOrder === "none") {
      return filtered;
    }

    // Sort alphabetically by name
    return [...filtered].sort((a, b) => {
      const nameA = t(`${a.id}.name`).toLowerCase();
      const nameB = t(`${b.id}.name`).toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [selectedTags, sortOrder, t]);

  const leftColumn = filteredAndSortedProjects.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredAndSortedProjects.filter((_, i) => i % 2 === 1);

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 pb-10 lg:pt-0 lg:pb-14", className)}
    >
      <ProjectsFilter
        tags={ALL_TAGS}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <motion.div
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn(
          "flex flex-col gap-6",
          "md:grid md:grid-cols-2 md:items-start"
        )}
      >
        {filteredAndSortedProjects.length === 0 ? (
          <p className="text-muted-foreground col-span-2 py-12 text-center">
            {t("noResults")}
          </p>
        ) : (
          <>
            {/* Mobile: single column */}
            <div className="flex flex-col gap-6 md:hidden">
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Desktop: masonry layout */}
            <div className="hidden flex-col gap-6 md:flex">
              {leftColumn.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="hidden flex-col gap-6 md:flex">
              {rightColumn.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
