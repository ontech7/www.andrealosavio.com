"use client";

import { ChevronDownIcon, ListIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { useActiveHeading } from "@/app/[locale]/blog/components/use-active-heading";
import type { TocEntry } from "@/libs/blog/toc";
import { cn } from "@/utils/cn";

interface ArticleTocMobileProps {
  entries: readonly TocEntry[];
  className?: string;
}

export function ArticleTocMobile({
  entries,
  className,
}: ArticleTocMobileProps) {
  const t = useTranslations();
  const activeId = useActiveHeading(entries, 120);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const listId = useId();
  const labelId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  if (entries.length < 2) {
    return null;
  }

  const activeIndex = entries.findIndex((entry) => entry.id === activeId);
  const active = activeIndex === -1 ? null : entries[activeIndex];

  return (
    <nav
      ref={containerRef}
      aria-label={t("blog.article.toc")}
      className={cn(
        "bg-background sticky top-16 z-30 pt-2 xl:hidden",
        className
      )}
    >
      <div
        className="rounded-xl p-px shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)]"
        style={{ background: "var(--border-gradient)" }}
      >
        <div className="bg-card/95 overflow-hidden rounded-xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-expanded={isOpen}
            aria-controls={listId}
            className="focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-inset"
          >
            <ListIcon className="text-secondary size-4 shrink-0" aria-hidden />

            {active && (
              <span id={labelId} className="sr-only">
                {t("blog.article.toc")}
              </span>
            )}

            <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
              {active ? active.title : t("blog.article.toc")}
            </span>

            {active && (
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {activeIndex + 1}/{entries.length}
              </span>
            )}

            <ChevronDownIcon
              className={cn(
                "text-muted-foreground size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                isOpen && "rotate-180"
              )}
              aria-hidden
            />
          </button>

          <ul
            id={listId}
            hidden={!isOpen}
            aria-labelledby={active ? labelId : undefined}
            className="border-border m-0 max-h-[55vh] list-none overflow-y-auto border-t p-2"
          >
            {entries.map((entry) => (
              <li key={entry.id} className={cn(entry.level === 3 && "pl-3")}>
                <a
                  href={`#${entry.id}`}
                  onClick={() => setIsOpen(false)}
                  aria-current={activeId === entry.id ? "true" : undefined}
                  className={cn(
                    "block border-l px-3 py-2 text-sm transition-colors",
                    activeId === entry.id
                      ? "border-l-secondary text-foreground bg-secondary/10"
                      : "border-l-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {entry.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
