"use client";

import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations();

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-100",
        "focus:bg-background focus:text-foreground focus:rounded-lg focus:px-4 focus:py-2",
        "focus:ring-ring/50 focus:ring-2 focus:outline-none",
        "text-sm font-medium"
      )}
    >
      {t("common.accessibility.skipToContent")}
    </a>
  );
}
