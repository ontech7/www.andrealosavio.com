"use client";

import { useTranslations } from "next-intl";

export function BlogEmptyState() {
  const t = useTranslations();

  return (
    <p className="text-muted-foreground py-12 text-center text-sm">
      {t("blog.index.empty")}
    </p>
  );
}
