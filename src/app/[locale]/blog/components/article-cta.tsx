import { ContentCta } from "@/components/content-cta";
import type { AppLocale } from "@/libs/i18n/utils";
import { getTranslations } from "next-intl/server";

interface ArticleCtaProps {
  locale: AppLocale;
  className?: string;
}

export async function ArticleCta({ locale, className }: ArticleCtaProps) {
  const t = await getTranslations({ locale });

  return (
    <ContentCta
      title={t("blog.article.cta.title")}
      description={t("blog.article.cta.description")}
      action={t("blog.article.cta.action")}
      className={className}
    />
  );
}
