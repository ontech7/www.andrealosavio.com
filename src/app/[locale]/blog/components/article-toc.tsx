"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { TocEntry } from "@/libs/blog/toc";
import { cn } from "@/utils/cn";

interface ArticleTocProps {
  entries: readonly TocEntry[];
  className?: string;
}

export function ArticleToc({ entries, className }: ArticleTocProps) {
  const t = useTranslations();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length < 2) {
      return;
    }

    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) {
    return null;
  }

  return (
    <nav aria-label={t("blog.article.toc")} className={className}>
      <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
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
