import { PROJECTS } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { getTranslations } from "next-intl/server";
import { ProjectCard } from "../components/project-card";
import { ProjectItem } from "../components/project-item";
import { ProjectsEmptyState } from "../components/projects-empty-state";
import { ProjectsFilter } from "../components/projects-filter";
import { ProjectsFilterProvider } from "../components/projects-filter-provider";

interface ProjectsSectionProps {
  id: string;
  className?: string;
}

const ALL_TAGS = [...new Set(PROJECTS.flatMap((p) => p.tags))].sort();

export async function ProjectsSection({ id, className }: ProjectsSectionProps) {
  const t = await getTranslations();

  const sortKeys = PROJECTS.map((project) => ({
    id: project.id,
    name: t(`projects.items.${project.id}.name`).toLowerCase(),
  }));

  const alphabeticalIndexById = new Map(
    sortKeys
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((project, index) => [project.id, index] as const)
  );

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 pb-10 lg:pt-0 lg:pb-14", className)}
    >
      <h2 className="sr-only">{t("projects.list.title")}</h2>

      <ProjectsFilterProvider availableTags={ALL_TAGS}>
        <ProjectsFilter tags={ALL_TAGS} />

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <ProjectItem
              key={project.id}
              tags={project.tags}
              sourceIndex={index}
              alphabeticalIndex={alphabeticalIndexById.get(project.id) ?? index}
              total={PROJECTS.length}
            >
              <ProjectCard project={project} />
            </ProjectItem>
          ))}
        </div>

        <ProjectsEmptyState
          projectTags={PROJECTS.map((project) => project.tags)}
          message={t("projects.items.common.noResults")}
        />
      </ProjectsFilterProvider>
    </section>
  );
}
