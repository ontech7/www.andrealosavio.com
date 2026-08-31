import type { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";
import { getTranslations } from "next-intl/server";

interface HeroSectionProps {
  id?: string;
  locale: AppLocale;
  className?: string;
}

export async function HeroSection({ id, locale, className }: HeroSectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-5xl px-4 pt-24 pb-12 sm:px-6 lg:px-8",
        className
      )}
    >
      <h1 className="bg-(image:--text-gradient) bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
        {t("blog.index.title")}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
        {t("blog.index.subtitle")}
      </p>
    </section>
  );
}
