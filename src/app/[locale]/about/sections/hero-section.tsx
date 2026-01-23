"use client";

import { GridLayers } from "@/components/grid-layers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AboutHeroDecoration } from "../components/hero-decoration";
import { SKILL_ITEMS } from "../constants/skill-items";

interface HeroSectionProps {
  id: string;
  className?: string;
}

const ENGINEER_REGISTER_URL =
  "https://areariservata.tuttoingegnere.it/PortaleCNI/it/albo_unico.wp;jsessionid=729985FD4418ACF62E0735FD65425DB0?internalServletActionPath=/ExtStr2/do/ricercaRegistro/dettaglio.action&internalServletFrameDest=1&log=false&idDettaglio=ANDREA.LOSAVIO.MI34249";

const FAST_MEMO_URL = "https://fastmemo.vercel.app/";

export function HeroSection({ id, className }: HeroSectionProps) {
  const t = useTranslations("about");

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto flex max-w-5xl flex-col items-start overflow-hidden px-6 pt-16 md:min-h-[calc(70vh-4rem)]",
        className
      )}
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 -top-60 flex items-center justify-center opacity-90">
        <GridLayers />
      </div>

      {/* Title  */}
      <motion.div
        className="mb-20 w-full text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="mb-4 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
        >
          {t.rich("hero.title", {
            highlight: (children) => (
              <span className="bg-(image:--outline-gradient-light) bg-clip-text text-transparent">
                {children}
              </span>
            ),
          })}
        </motion.h1>
        <motion.p
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground"
        >
          {t("hero.subtitle")}
        </motion.p>
      </motion.div>

      <div className="flex-start flex flex-col lg:flex-row lg:gap-8">
        {/* Image */}
        <motion.div
          className="relative mb-10 w-full max-w-103.25 shrink-0 self-center lg:-mt-2.5 lg:mb-0 lg:w-auto lg:max-w-none lg:self-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AboutHeroDecoration />
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex flex-1 flex-col"
          variants={staggerContainerAnim}
          initial="hidden"
          animate="visible"
        >
          {/* Name and Role */}
          <motion.div
            variants={fadeInUpAnim}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {t("hero.name")}
            </h2>
            <p className="text-muted-foreground mb-6">{t("hero.role")}</p>
          </motion.div>

          {/* Bio */}
          <div className="text-muted-foreground mb-8 space-y-4 text-sm leading-relaxed md:text-base">
            <motion.p variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
              {t.rich("hero.bio1", {
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
            </motion.p>
            <motion.p variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
              {t.rich("hero.bio2", {
                bold: (children) => (
                  <span className="font-semibold text-white">{children}</span>
                ),
              })}
            </motion.p>
            <motion.p variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
              {t.rich("hero.bio3", {
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
              })}
            </motion.p>
          </div>

          {/* Tech Stack */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.5,
                },
              },
            }}
          >
            {SKILL_ITEMS.map((skill) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
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
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
