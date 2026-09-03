"use client";

import type { OpenSourceRepo } from "@/constants/products";
import { cn } from "@/utils/cn";
import { GithubIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface RepoCardProps {
  repo: OpenSourceRepo;
  className?: string;
}

export function RepoCard({ repo, className }: RepoCardProps) {
  const t = useTranslations();

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${repo.owner}/${repo.name}`}
      className={cn(
        "group border-border bg-card hover:border-secondary/60 flex h-full items-start gap-3 rounded-xl border p-4 transition-colors",
        "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
        className
      )}
    >
      <GithubIcon
        className="text-foreground mt-px size-5 shrink-0"
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-col">
        <h3 className="flex flex-col font-mono text-xs leading-snug">
          <span className="text-muted-foreground">{repo.owner}/</span>
          <span className="group-hover:text-secondary transition-colors">
            {repo.name}
          </span>
        </h3>

        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          {t(`projects.featured.openSource.items.${repo.id}.description`)}
        </p>
      </div>
    </a>
  );
}
