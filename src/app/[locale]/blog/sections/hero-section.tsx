import { RssIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GridLayers } from "@/components/grid-layers";
import { Button } from "@/components/ui/button";
import { fadeInUpEnter } from "@/constants/motion";
import type { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";

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
        "relative mx-auto flex max-w-5xl flex-col items-center overflow-hidden px-6 pt-28 pb-14 text-center md:pt-32",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -top-80 flex items-center justify-center opacity-80">
        <GridLayers />
      </div>

      <span
        className={cn(
          fadeInUpEnter,
          "delay-100",
          "text-secondary relative text-xs tracking-[0.2em] uppercase"
        )}
      >
        {t("blog.index.eyebrow")}
      </span>

      <h1
        className={cn(
          fadeInUpEnter,
          "delay-150",
          "relative mt-3 max-w-2xl bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
        )}
      >
        {t.rich("blog.index.headline", {
          highlight: (children) => (
            <span className="bg-(image:--outline-gradient-light) bg-clip-text text-transparent">
              {children}
            </span>
          ),
        })}
      </h1>

      <p
        className={cn(
          fadeInUpEnter,
          "delay-200",
          "text-muted-foreground relative mt-4 max-w-xl text-lg"
        )}
      >
        {t("blog.index.subtitle")}
      </p>

      <div className={cn(fadeInUpEnter, "delay-300", "relative mt-8")}>
        <Button variant="gradient-outline" size="sm" asChild>
          <a href={`/${locale}/blog/rss.xml`}>
            <RssIcon className="size-4" aria-hidden="true" />
            {t("blog.index.rss")}
          </a>
        </Button>
      </div>
    </section>
  );
}
