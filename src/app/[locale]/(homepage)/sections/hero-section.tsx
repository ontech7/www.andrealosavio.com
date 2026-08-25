"use client";

import { Button } from "@/components/ui/button";
import { fadeInUpEnter } from "@/constants/motion";
import { CONTACT_HREF, SOCIAL_LINKS } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowDownIcon, CodeIcon } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { HomepageHeroDecoration } from "../components/hero-decoration";

interface HeroSectionProps {
  id: string;
  className?: string;
}

export function HeroSection({ id, className }: HeroSectionProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto flex h-[calc(100vh-4rem)] min-h-220 max-w-5xl items-start overflow-hidden px-6 pt-40 lg:min-h-[calc(100vh-4rem)]",
        "lg:items-center lg:pt-0",
        className
      )}
    >
      <div className="relative z-10">
        <p
          className={cn(
            fadeInUpEnter,
            "delay-100",
            "from-secondary-foreground to-secondary-foreground/0 text-foreground inline-flex items-center gap-2 rounded-l-full bg-linear-to-r py-3 pr-6 pl-3 text-sm"
          )}
        >
          <span
            className="bg-secondary size-2.5 shrink-0 animate-pulse rounded-full shadow-(--shadow-secondary)"
            aria-hidden="true"
          />
          {t("homepage.hero.availability")}
        </p>

        <h1
          className={cn(
            fadeInUpEnter,
            "delay-200",
            "mt-6 -mb-0.5 bg-(image:--text-gradient) bg-clip-text text-4xl font-bold text-transparent md:mb-0 md:text-7xl"
          )}
        >
          {t("homepage.hero.title")}
        </h1>
        <h2
          className={cn(
            fadeInUpEnter,
            "delay-300",
            "text-md mb-5 flex items-center gap-1.5 bg-(image:--text-gradient) bg-clip-text pb-1.5 leading-0 text-transparent md:text-xl"
          )}
        >
          <CodeIcon
            className="size-5 text-white md:-mb-0.5 md:size-5.5"
            aria-hidden="true"
          />
          {t("homepage.hero.subtitle")}
        </h2>

        <p
          className={cn(
            fadeInUpEnter,
            "delay-400",
            "text-muted-foreground mb-10 max-w-lg text-lg"
          )}
        >
          {t("homepage.hero.description")}
        </p>

        <div className={cn(fadeInUpEnter, "delay-500", "flex flex-wrap gap-3")}>
          <Button
            variant="gradient-outline"
            onClick={() => {
              document
                .getElementById("how-i-work")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {t("homepage.hero.ctaHowIWork")}
            <motion.span
              animate={{ y: [-2, 2, -2] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDownIcon className="size-4" aria-hidden="true" />
            </motion.span>
          </Button>
          <Button asChild variant="primary">
            <Link href={CONTACT_HREF}>{t("homepage.hero.ctaContact")}</Link>
          </Button>
        </div>

        <div
          className={cn(
            fadeInUpEnter,
            "delay-600",
            "mt-12 flex items-center gap-4"
          )}
        >
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.labelKey}
              href={social.href.replace("{lang}", locale)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(`common.${social.labelKey}`)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <social.Icon className="stroke-1" />
            </a>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute",
          "-right-65 translate-y-1/3 opacity-60",
          "md:-right-30 md:translate-y-1/6 md:opacity-80",
          "lg:top-1/2 lg:-right-30 lg:bottom-auto lg:-translate-y-1/2 lg:opacity-100"
        )}
      >
        <HomepageHeroDecoration />
      </div>
    </section>
  );
}
