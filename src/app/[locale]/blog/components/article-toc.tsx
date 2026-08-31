"use client";

import { useTranslations } from "next-intl";
import { useActiveHeading } from "@/app/[locale]/blog/components/use-active-heading";
import type { TocEntry } from "@/libs/blog/toc";
import { cn } from "@/utils/cn";

interface ArticleTocProps {
  entries: readonly TocEntry[];
  className?: string;
}

export function ArticleToc({ entries, className }: ArticleTocProps) {
  const t = useTranslations();
  const activeId = useActiveHeading(entries, 80);

  if (entries.length < 2) {
    return null;
  }

  return (
    <nav aria-label={t("blog.article.toc")} className={className}>
      <h2 className="text-secondary mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
        {t("blog.article.toc")}
      </h2>
      <ul className="m-0 space-y-1 p-0">
        {entries.map((entry) => (
          <li key={entry.id} className={cn(entry.level === 3 && "pl-3")}>
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? "true" : undefined}
              className={cn(
                "block border-l py-1 pl-3 text-sm transition-colors",
                activeId === entry.id
                  ? "border-l-secondary text-foreground"
                  : "border-l-border text-muted-foreground hover:text-foreground"
              )}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
