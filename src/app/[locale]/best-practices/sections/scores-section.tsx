"use client";

import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { ZapIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ScoreRing } from "../components/score-ring";

interface ScoresSectionProps {
  id: string;
  className?: string;
}

export function ScoresSection({ id, className }: ScoresSectionProps) {
  const t = useTranslations("bestPractices");

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 py-16 lg:py-24", className)}
    >
      <motion.div
        className="text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="mb-3 bg-(image:--text-gradient) bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
        >
          {t.rich("scores.title", {
            highlight: (children) => (
              <span className="bg-(image:--outline-gradient-light) bg-clip-text text-transparent">
                {children}
              </span>
            ),
          })}
        </motion.h2>

        <motion.p
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground mx-auto mb-16 max-w-md text-sm"
        >
          {t("scores.subtitle")}
        </motion.p>
      </motion.div>

      {/* Score Rings */}
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
        <ScoreRing score={100} label={t("scores.performance")} delay={0} />
        <ScoreRing score={100} label={t("scores.accessibility")} delay={0.15} />
        <ScoreRing score={100} label={t("scores.bestPractices")} delay={0.3} />
        <ScoreRing score={100} label={t("scores.seo")} delay={0.45} />
      </div>

      {/* Build Time */}
      <motion.div
        className="mt-20 flex items-center justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span
          className="relative inline-flex rounded-full p-px"
          style={{ background: "var(--border-gradient)" }}
        >
          <div className="bg-background flex items-center gap-2.5 rounded-full border px-5 py-2.5">
            <ZapIcon className="size-4 text-yellow-400" strokeWidth={1.5} />
            <p className="text-muted-foreground text-sm">
              {t.rich("scores.buildTime", {
                pages: (children) => (
                  <span className="text-foreground font-semibold">
                    {children}
                  </span>
                ),
                time: (children) => (
                  <span className="bg-(image:--text-gradient) bg-clip-text font-semibold text-transparent">
                    {children}
                  </span>
                ),
              })}
            </p>
          </div>
        </span>
      </motion.div>
    </section>
  );
}
