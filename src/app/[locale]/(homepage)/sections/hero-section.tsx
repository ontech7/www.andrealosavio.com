"use client";

import { Button } from "@/components/ui/button";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { SOCIAL_LINKS } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowDownIcon, ArrowRightIcon, CodeIcon } from "lucide-react";
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
      {/* Main */}
      <motion.div
        className="relative z-10"
        variants={staggerContainerAnim}
        initial="hidden"
        animate="visible"
      >
        {/* CTAs (1) */}
        <motion.div variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
          <Button variant="gradient-primary" size="lg" asChild>
            <Link href="/services" className="flex items-center gap-2">
              <div className="bg-secondary size-2.5 shrink-0 animate-pulse rounded-full shadow-(--shadow-secondary)" />
              {t("homepage.hero.ctaDiscussVision")}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="mt-6 -mb-0.5 bg-(image:--text-gradient) bg-clip-text text-4xl font-bold text-transparent md:mb-0 md:text-7xl"
        >
          {t("homepage.hero.title")}
        </motion.h1>
        <motion.h4
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="text-md mb-5 flex items-center gap-1.5 bg-(image:--text-gradient) bg-clip-text pb-1.5 leading-0 text-transparent md:text-xl"
        >
          <CodeIcon className="size-5 text-white md:-mb-0.5 md:size-5.5" />
          {t("homepage.hero.subtitle")}
        </motion.h4>

        <motion.p
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground mb-10 max-w-md"
        >
          {t("homepage.hero.description")}
        </motion.p>

        {/* CTAs (2) */}
        <motion.div variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
          <Button
            variant="gradient-outline"
            className="mr-3"
            onClick={() => {
              document
                .getElementById("making-an-impact")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {t("homepage.hero.ctaZeroToOne")}
            <motion.span
              animate={{ y: [-2, 2, -2] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDownIcon className="size-4" />
            </motion.span>
          </Button>
          <Button asChild variant="primary">
            <Link href="/about">{t("homepage.hero.ctaMoreAboutMe")}</Link>
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="mt-12 flex items-center gap-4"
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
        </motion.div>
      </motion.div>

      {/* Decoration */}
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
