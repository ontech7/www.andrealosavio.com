import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project } from "@/constants/projects";
import { CircleQuestionMarkIcon, LinkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export async function ProjectCard({ project }: ProjectCardProps) {
  const t = await getTranslations();

  const name = t(`projects.items.${project.id}.name`);
  const externalUrl =
    project.websiteUrl || project.designUrl || project.githubUrl;

  return (
    <Card className="bg-background gap-4 p-5">
      <CardHeader className="flex flex-row items-center gap-3 px-0">
        {project.logo ? (
          <Image
            src={project.logo}
            alt={name}
            width={40}
            height={40}
            className="size-10 shrink-0"
          />
        ) : (
          <CircleQuestionMarkIcon className="text-muted-foreground size-10" />
        )}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base leading-none font-semibold">{name}</h3>
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-muted text-muted-foreground border-none px-1.5 py-0.5 text-[10px]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-0">
        <p className="text-muted-foreground text-sm">
          {t(`projects.items.${project.id}.description`)}
        </p>

        <div className="overflow-hidden rounded-lg">
          <Image
            src={project.image}
            alt={name}
            width={600}
            height={400}
            className="h-auto w-full"
          />
        </div>

        {externalUrl && (
          <Button variant="primary" className="self-end" asChild>
            <Link href={externalUrl} target="_blank" rel="noopener noreferrer">
              <LinkIcon className="size-4" />
              {project.designUrl
                ? t("projects.items.common.checkDesign")
                : project.githubUrl
                  ? t("projects.items.common.checkGitHub")
                  : t("projects.items.common.checkWebsite")}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
