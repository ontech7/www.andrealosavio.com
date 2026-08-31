"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildPageWindow } from "@/libs/blog/pagination";
import { cn } from "@/utils/cn";

interface BlogPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const slotClassName =
  "focus-visible:ring-ring/50 inline-flex size-10 shrink-0 items-center justify-center rounded-md text-sm tabular-nums transition-colors outline-none focus-visible:ring-[3px]";

const quietClassName =
  "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer disabled:pointer-events-none disabled:opacity-30";

function Ring({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className="rounded-md p-px"
      style={
        active ? { background: "var(--border-gradient-light)" } : undefined
      }
    >
      {children}
    </span>
  );
}

export function BlogPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: BlogPaginationProps) {
  const t = useTranslations();
  const slots = buildPageWindow(page, totalPages);

  return (
    <nav
      aria-label={t("blog.index.pagination.label")}
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <div className="flex items-center gap-0.5">
        <Ring>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label={t("blog.index.pagination.previous")}
            className={cn(slotClassName, quietClassName)}
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
          </button>
        </Ring>

        {slots.map((slot, index) =>
          slot === "gap" ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className={cn(slotClassName, "text-muted-foreground opacity-60")}
            >
              &hellip;
            </span>
          ) : (
            <Ring key={slot} active={slot === page}>
              <button
                type="button"
                onClick={() => onPageChange(slot)}
                aria-current={slot === page ? "page" : undefined}
                aria-label={t("blog.index.pagination.goToPage", { page: slot })}
                className={cn(
                  slotClassName,
                  slot === page
                    ? "bg-card text-foreground cursor-default font-semibold"
                    : quietClassName
                )}
              >
                {slot}
              </button>
            </Ring>
          )
        )}

        <Ring>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label={t("blog.index.pagination.next")}
            className={cn(slotClassName, quietClassName)}
          >
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </button>
        </Ring>
      </div>

      <p className="text-muted-foreground text-sm" aria-live="polite">
        {t("blog.index.pagination.status", { page, total: totalPages })}
      </p>
    </nav>
  );
}
