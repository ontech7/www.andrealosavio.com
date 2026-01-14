"use client";

import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowDownIcon, ArrowRightIcon, CodeIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface HeroSectionProps {
  id: string;
  className?: string;
}

export function HeroSection({ id, className }: HeroSectionProps) {
  const t = useTranslations("homepage");
  const locale = useLocale();

  return (
    <section
      id={id}
      className={cn(
        "mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-6",
        className
      )}
    >
      {/* Main */}
      <div>
        {/* CTAs (1) */}
        <Button variant="gradient-primary" size="lg" className="mb-6">
          <div className="bg-secondary size-2.5 shrink-0 rounded-full shadow-(--shadow-secondary)" />
          {t("hero.ctaDiscussVision")}
          <ArrowRightIcon className="size-4" />
        </Button>

        {/* Title */}
        <h1 className="mb-0.5 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-7xl">
          {t("hero.title")}
        </h1>
        <h4 className="mb-5 flex items-center gap-1.5 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text pb-1.5 text-lg leading-0 text-transparent md:text-xl">
          <CodeIcon className="-mb-0.5 size-5.5 text-white" />
          {t("hero.subtitle")}
        </h4>

        <p className="text-muted-foreground mb-10 max-w-md">
          {t("hero.description")}
        </p>

        {/* CTAs (2) */}
        <Button asChild variant="gradient-outline" className="mr-3">
          <Link href="/#making-an-impact">
            {t("hero.ctaZeroToOne")}
            <ArrowDownIcon className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="primary">
          <Link href="/about">{t("hero.ctaMoreAboutMe")}</Link>
        </Button>

        {/* Social Links */}
        <div className="mt-12 flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.labelKey}
              href={social.href.replace("{lang}", locale)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(`hero.${social.labelKey}`)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <social.Icon className="stroke-1" />
            </a>
          ))}
        </div>
      </div>

      {/* Decoration */}
    </section>
  );
}
