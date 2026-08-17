"use client";

import { GridLayers } from "@/components/grid-layers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fadeInUpEnter } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AboutHeroDecoration } from "../components/hero-decoration";
import { SKILL_ITEMS } from "../constants/skill-items";

interface HeroSectionProps {
  id: string;
  className?: string;
}

const ENGINEER_REGISTER_URL =
  "https://www.cni.it/proxy.php?w=dett_albo&u=albounico.wp?internalServletActionPath=/ExtStr2/do/ricercaRegistro/dettaglio.action&internalServletFrameDest=0&log=false&idDettaglio=LSVNDR96C27L049B";

const FAST_MEMO_URL = "https://fastmemo.vercel.app/";

const COOLIFY_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.ontech7.coolifyManager&hl=it";

export function HeroSection({ id, className }: HeroSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto flex max-w-5xl flex-col items-start overflow-hidden px-6 pt-16 md:min-h-[calc(70vh-4rem)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -top-60 flex items-center justify-center opacity-90">
        <GridLayers />
      </div>

      <div className="mb-20 w-full text-center">
        <h1
          className={cn(
            fadeInUpEnter,
            "delay-100",
            "mb-4 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          )}
        >
          {t.rich("about.hero.title", {
            highlight: (children) => (
              <span className="bg-(image:--outline-gradient-light) bg-clip-text text-transparent">
                {children}
              </span>
            ),
          })}
        </h1>
        <p className={cn(fadeInUpEnter, "delay-200", "text-muted-foreground")}>
          {t("about.hero.subtitle")}
        </p>
      </div>

      <div className="flex-start flex flex-col lg:flex-row lg:gap-8">
        <div
          className={cn(
            fadeInUpEnter,
            "delay-200",
            "relative mb-10 w-full max-w-84 shrink-0 self-center lg:-mt-2.5 lg:mb-0 lg:w-auto lg:max-w-none lg:self-auto"
          )}
        >
          <AboutHeroDecoration />
        </div>

        <div className="flex flex-1 flex-col">
          <div className={cn(fadeInUpEnter, "delay-150")}>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {t("about.hero.name")}
            </h2>
            <p className="text-muted-foreground mb-6">{t("about.hero.role")}</p>
          </div>

          <div className="text-muted-foreground mb-8 space-y-4 text-sm leading-relaxed md:text-base">
            <p className={cn(fadeInUpEnter, "delay-200")}>
              {t.rich("about.hero.bio1", {
                bold: (children) => (
                  <span className="font-semibold text-white">{children}</span>
                ),
                link: (children) => (
                  <a
                    href={ENGINEER_REGISTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-white/80"
                  >
                    {children}
                  </a>
                ),
              })}
            </p>
            <p className={cn(fadeInUpEnter, "delay-300")}>
              {t.rich("about.hero.bio2", {
                bold: (children) => (
                  <span className="font-semibold text-white">{children}</span>
                ),
              })}
            </p>
            <p className={cn(fadeInUpEnter, "delay-400")}>
              {t.rich("about.hero.bio3", {
                link: (children) => (
                  <a
                    href={FAST_MEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-white/80"
                  >
                    {children}
                  </a>
                ),
                linkPlayStore: (children) => (
                  <a
                    href={COOLIFY_PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-white/80"
                  >
                    {children}
                  </a>
                ),
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {SKILL_ITEMS.map((skill, index) => (
              <div
                key={skill.name}
                className="animate-in fade-in zoom-in-80 fill-mode-backwards duration-300"
                style={{ animationDelay: `${500 + index * 50}ms` }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex size-10 cursor-pointer items-center justify-center transition-transform hover:scale-110">
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{skill.name}</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
