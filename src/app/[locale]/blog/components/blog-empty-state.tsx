"use client";

import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

interface BlogEmptyStateProps {
  messageKey: "blog.index.empty" | "blog.index.noArticlesYet";
  className?: string;
}

export function BlogEmptyState({ messageKey, className }: BlogEmptyStateProps) {
  const t = useTranslations();

  return (
    <p
      className={cn(
        "text-muted-foreground py-12 text-center text-sm",
        className
      )}
    >
      {t(messageKey)}
    </p>
  );
}
