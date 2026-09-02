import { PROJECTS, type ProjectKind } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { getTranslations } from "next-intl/server";
import { ProjectCard } from "../components/project-card";
import { ProjectGroup } from "../components/project-group";
import { ProjectGroupHeading } from "../components/project-group-heading";
import { ProjectItem } from "../components/project-item";
import { ProjectsEmptyState } from "../components/projects-empty-state";
import { ProjectsFilter } from "../components/projects-filter";
import { ProjectsFilterProvider } from "../components/projects-filter-provider";

interface ProjectsSectionProps {
  id: string;
  className?: string;
}

const GROUPS: { kind: ProjectKind; key: string }[] = [
  { kind: "client", key: "clients" },
  { kind: "personal", key: "experiments" },
];

const FILTERABLE_PROJECTS = PROJECTS.filter(
  (project) => project.kind !== "product"
);

const ALL_TAGS = [
  ...new Set(FILTERABLE_PROJECTS.flatMap((p) => p.tags)),
].sort();
const ALL_ROLES = [
  ...new Set(FILTERABLE_PROJECTS.flatMap((p) => p.roles)),
].sort();

export async function ProjectsSection({ id, className }: ProjectsSectionProps) {
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
            <ProjectGroup key={kind} projects={projects}>
              <ProjectGroupHeading
                title={t(`projects.groups.${key}.title`)}
                subtitle={t(`projects.groups.${key}.subtitle`)}
              />

              <div
                className={cn(
                  "grid grid-cols-1 gap-6",
                  kind === "personal" && "md:grid-cols-2"
                )}
              >
                {projects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    tags={project.tags}
                    roles={project.roles}
                    sourceIndex={FILTERABLE_PROJECTS.indexOf(project)}
                    alphabeticalIndex={
                      alphabeticalIndexById.get(project.id) ?? 0
                    }
                    total={FILTERABLE_PROJECTS.length}
                  >
                    <ProjectCard project={project} />
                  </ProjectItem>
                ))}
              </div>
            </ProjectGroup>
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
