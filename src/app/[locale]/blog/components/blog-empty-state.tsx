"use client";

import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

interface BlogEmptyStateProps {
  className?: string;
}

export function BlogEmptyState({ className }: BlogEmptyStateProps) {
  const t = useTranslations();

  return (
    <p
      className={cn(
        "text-muted-foreground py-12 text-center text-sm",
        className
      )}
    >
      {t("blog.index.empty")}
    </p>
  );
}
