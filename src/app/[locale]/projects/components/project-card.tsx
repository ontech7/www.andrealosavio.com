import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/constants/projects";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowUpRightIcon, CircleQuestionMarkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  caseStudySlug?: string | null;
  className?: string;
}

export async function ProjectCard({
  project,
  caseStudySlug = null,
  className,
}: ProjectCardProps) {
  const t = await getTranslations();

  const name = t(`projects.items.${project.id}.name`);
  const externalUrl =
    project.websiteUrl ?? project.designUrl ?? project.githubUrl ?? null;

  const externalLabel =
    project.designUrl && !project.websiteUrl
      ? t("projects.items.common.checkDesign")
      : project.githubUrl && !project.websiteUrl
        ? t("projects.items.common.checkGitHub")
        : project.kind === "client"
          ? t("projects.items.common.clientSite")
          : t("projects.items.common.checkWebsite");

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
        className
      )}
    >
      <div className="relative aspect-3/2 overflow-hidden md:aspect-auto md:h-full">
        <Image
          src={project.image}
          alt=""
          width={600}
          height={400}
          sizes="(max-width: 768px) 100vw, 380px"
          className="size-full object-cover object-top"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex items-start gap-3">
          {project.logo ? (
            <Image
              src={project.logo}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <CircleQuestionMarkIcon
              className="text-muted-foreground size-10 shrink-0"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-base leading-tight font-semibold">{name}</h3>
            <p className="text-muted-foreground text-xs">
              {t(`projects.items.${project.id}.context`)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {project.roles.map((role) => (
            <span
              key={role}
              className="rounded-md p-px"
              style={{ background: "var(--border-gradient)" }}
            >
              <span className="bg-card text-foreground block rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                {role}
              </span>
            </span>
          ))}
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {t(`projects.items.${project.id}.contribution`)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-1">
          {caseStudySlug && (
            <Button variant="gradient-outline" asChild>
              <Link href={`/projects/${caseStudySlug}`}>
                {t("projects.items.common.readCaseStudy")}
              </Link>
            </Button>
          )}

          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex items-center gap-1 rounded-sm text-sm transition-colors outline-none focus-visible:ring-[3px]"
            >
              {externalLabel}
              <ArrowUpRightIcon className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
