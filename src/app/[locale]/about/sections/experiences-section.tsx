"use client";

import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ExperienceCard } from "../components/experience-card";
import { EXPERIENCE_ITEMS } from "../constants/experience-items";

interface ExperiencesSectionProps {
  id: string;
  className?: string;
}

export function ExperiencesSection({ id, className }: ExperiencesSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20",
        className
      )}
    >
      <motion.div
        className="mb-16 w-full text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="mb-4 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
        >
          {t.rich("about.experiences.title", {
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
          className="text-muted-foreground"
        >
          {t("about.experiences.subtitle")}
        </motion.p>
      </motion.div>

      <motion.div
        className="w-full space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {EXPERIENCE_ITEMS.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </motion.div>
    </section>
  );
}
