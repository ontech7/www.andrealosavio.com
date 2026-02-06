"use client";

import { staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import {
  AccessibilityIcon,
  CodeIcon,
  GaugeIcon,
  PaletteIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { PracticeCard } from "../components/practice-card";
import { fadeInUpAnim } from "@/constants/motion";

interface BestPracticesSectionProps {
  id: string;
  className?: string;
}

const PRACTICE_KEYS = [
  "accessibility",
  "performance",
  "seo",
  "security",
  "codeQuality",
  "uxDesign",
] as const;

const PRACTICE_ICONS = {
  accessibility: AccessibilityIcon,
  performance: GaugeIcon,
  seo: SearchIcon,
  security: ShieldCheckIcon,
  codeQuality: CodeIcon,
  uxDesign: PaletteIcon,
} as const;

const ITEM_KEYS = ["item1", "item2", "item3", "item4", "item5", "item6"] as const;

export function BestPracticesSection({ id, className }: BestPracticesSectionProps) {
  const t = useTranslations("bestPractices");

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 py-16 lg:py-24", className)}
    >
      <motion.div
        className="mb-16 text-center"
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
          {t.rich("practices.title", {
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
          className="text-muted-foreground mx-auto max-w-lg text-sm"
        >
          {t("practices.subtitle")}
        </motion.p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {PRACTICE_KEYS.map((key, index) => (
          <PracticeCard
            key={key}
            icon={PRACTICE_ICONS[key]}
            title={t(`practices.${key}.title`)}
            items={ITEM_KEYS.map((itemKey) =>
              t(`practices.${key}.items.${itemKey}`)
            )}
            index={index}
          />
        ))}
      </motion.div>
    </section>
  );
}
