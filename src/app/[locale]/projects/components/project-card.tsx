import { Card } from "@/components/ui/card";
import type { Project } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { ArrowUpRightIcon, CircleQuestionMarkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  layout?: "split" | "stacked";
  className?: string;
}

export async function ProjectCard({
  project,
  layout = "split",
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
        "gap-0 overflow-hidden",
        layout === "split" &&
          "md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-3/2 overflow-hidden",
          layout === "split" && "md:aspect-auto md:h-full"
        )}
      >
        <Image
          src={project.image}
          alt=""
          width={600}
          height={400}
          sizes={
            layout === "split"
              ? "(max-width: 768px) 100vw, 380px"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 480px"
          }
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
                {t(`projects.roleLabels.${role}`)}
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
