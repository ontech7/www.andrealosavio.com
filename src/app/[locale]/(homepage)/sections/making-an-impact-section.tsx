"use client";

import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { ImpactCard } from "../components/impact-card";
import { SLine } from "../components/s-line";
import { IMPACT_ITEMS } from "../constants/impact-items";

interface MakingAnImpactSectionProps {
  id: string;
  className?: string;
}

export function MakingAnImpactSection({
  id,
  className,
}: MakingAnImpactSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl scroll-mt-20 px-6", className)}
    >
      <motion.div
        className="mb-4 text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="from-secondary via-secondary/75 to-secondary/50 bg-linear-to-t bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.makingAnImpact.title")}
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-md bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-lg text-transparent"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.makingAnImpact.subtitle")}
        </motion.p>
      </motion.div>

      <div className="relative flex flex-col items-center">
        <SLine inverted className="md:mr-72.5 md:w-72.5" />
        {IMPACT_ITEMS.map((item, index) => (
          <Fragment key={item.textKey}>
            <ImpactCard item={item} />
            {index !== IMPACT_ITEMS.length - 1 && (
              <SLine inverted={index % 2 === 1} className="w-40 md:w-145" />
            )}
          </Fragment>
        ))}
        <SLine className="md:mr-72.5 md:w-72.5" />
      </div>
    </section>
  );
}
