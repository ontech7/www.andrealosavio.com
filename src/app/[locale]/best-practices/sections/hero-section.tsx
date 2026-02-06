"use client";

import { GridLayers } from "@/components/grid-layers";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface HeroSectionProps {
  id: string;
  className?: string;
}

export function HeroSection({ id, className }: HeroSectionProps) {
  const t = useTranslations("bestPractices");

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto flex min-h-[calc(60vh-4rem)] max-w-5xl flex-col items-center justify-center overflow-hidden px-6 py-32",
        className
      )}
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60">
        <GridLayers />
      </div>

      <motion.div
        className="relative z-10 max-w-2xl text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="mb-6 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
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
          className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed md:text-lg"
        >
          {t("hero.subtitle")}
        </motion.p>
      </motion.div>
    </section>
  );
}
