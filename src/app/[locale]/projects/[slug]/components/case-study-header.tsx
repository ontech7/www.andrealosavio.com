import { Button } from "@/components/ui/button";
import type { Project } from "@/constants/projects";
import type { CaseStudyFrontmatter } from "@/libs/case-studies/frontmatter";
import { Link } from "@/libs/i18n/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface CaseStudyHeaderProps {
  project: Project;
  frontmatter: CaseStudyFrontmatter;
}

export async function CaseStudyHeader({
  project,
  frontmatter,
}: CaseStudyHeaderProps) {
  const t = await getTranslations();
  const name = t(`projects.items.${project.id}.name`);

  return (
    <header className="mx-auto max-w-3xl px-6 pt-32 pb-10">
      <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
        <Link href="/projects">
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          {t("projects.metadata.title")}
        </Link>
      </Button>

      <div className="mb-6 flex items-center gap-3">
        {project.logo && (
          <Image
            src={project.logo}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0"
            aria-hidden="true"
          />
        )}
        <div>
          <p className="text-foreground text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">
            {t(`projects.items.${project.id}.context`)}
          </p>
        </div>
      </div>

      <h1 className="mb-5 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
        {frontmatter.title}
      </h1>

      <p className="text-muted-foreground mb-6">{frontmatter.summary}</p>

      <dl className="text-muted-foreground mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-foreground font-medium">
            {t("projects.caseStudy.period")}
          </dt>
          <dd>{frontmatter.period}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-foreground font-medium">
            {t("projects.caseStudy.roles")}
          </dt>
          <dd>{project.roles.join(", ")}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-foreground font-medium">
            {t("projects.caseStudy.stack")}
          </dt>
          <dd>{project.tags.join(", ")}</dd>
        </div>
      </dl>

      {project.websiteUrl && (
        <a
          href={project.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm transition-colors"
        >
          {t("projects.items.common.clientSite")}
          <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </a>
      )}
    </header>
  );
}
