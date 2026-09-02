import { PROJECTS, type ProjectKind } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";
import { ProjectCard } from "../components/project-card";
import { ProjectGroup } from "../components/project-group";
import { ProjectGroupHeading } from "../components/project-group-heading";
import { ProjectsEmptyState } from "../components/projects-empty-state";
import { ProjectsFilter } from "../components/projects-filter";
import { HideWhileFiltering } from "../components/hide-while-filtering";
import { ProjectsFilterProvider } from "../components/projects-filter-provider";
import { ProjectsGrid } from "../components/projects-grid";

interface ProjectsSectionProps {
  id: string;
  featured?: React.ReactNode;
  className?: string;
}

const GROUPS: { kind: ProjectKind; key: string }[] = [
  { kind: "client", key: "clients" },
  { kind: "personal", key: "experiments" },
];

const CLIENTS_VISIBLE = 3;

const FILTERABLE_PROJECTS = PROJECTS.filter(
  (project) => project.kind !== "product"
);

const ALL_TAGS = [
  ...new Set(FILTERABLE_PROJECTS.flatMap((p) => p.tags)),
].sort();
const ALL_ROLES = [
  ...new Set(FILTERABLE_PROJECTS.flatMap((p) => p.roles)),
].sort();

export async function ProjectsSection({
  id,
  featured,
  className,
}: ProjectsSectionProps) {
  const t = await getTranslations();

  const sortKeys = FILTERABLE_PROJECTS.map((project) => ({
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

      <ProjectsFilterProvider
        availableTags={ALL_TAGS}
        availableRoles={ALL_ROLES}
      >
        <ProjectsFilter tags={ALL_TAGS} roles={ALL_ROLES} />

        {GROUPS.map(({ kind, key }) => {
          const projects = FILTERABLE_PROJECTS.filter(
            (project) => project.kind === kind
          );

          return (
            <Fragment key={kind}>
              <ProjectGroup projects={projects}>
                <ProjectGroupHeading
                  title={t(`projects.groups.${key}.title`)}
                  subtitle={t(`projects.groups.${key}.subtitle`)}
                />

                <ProjectsGrid
                  projects={projects.map((project) => ({
                    tags: project.tags,
                    roles: project.roles,
                    alphabeticalIndex:
                      alphabeticalIndexById.get(project.id) ?? 0,
                  }))}
                  collapseAfter={
                    kind === "client" ? CLIENTS_VISIBLE : undefined
                  }
                  className={cn(kind === "personal" && "md:grid-cols-2")}
                >
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      layout={kind === "personal" ? "stacked" : "split"}
                    />
                  ))}
                </ProjectsGrid>
              </ProjectGroup>

              {kind === "client" && featured && (
                <HideWhileFiltering>{featured}</HideWhileFiltering>
              )}
            </Fragment>
          );
        })}

        <ProjectsEmptyState
          projects={FILTERABLE_PROJECTS.map((project) => ({
            tags: project.tags,
            roles: project.roles,
          }))}
          message={t("projects.items.common.noResults")}
        />
      </ProjectsFilterProvider>
    </section>
  );
}
