"use client";

import { Button } from "@/components/ui/button";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SectionConnector } from "../components/section-connector";
import { HOW_I_WORK_STEPS } from "../constants/how-i-work-items";

interface HowIWorkSectionProps {
  id: string;
  className?: string;
}

export function HowIWorkSection({ id, className }: HowIWorkSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-5xl scroll-mt-20 px-6 pb-10 md:pb-14",
        className
      )}
    >
      <SectionConnector className="mb-8" />

      <motion.div
        className="mb-14 flex flex-col items-center text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.span
          className="text-secondary text-xs tracking-[0.2em] uppercase"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.howIWork.eyebrow")}
        </motion.span>
        <motion.h2
          className="mt-3 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.howIWork.title")}
        </motion.h2>
        <motion.p
          className="text-muted-foreground mx-auto mt-4 max-w-md text-lg"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.howIWork.subtitle")}
        </motion.p>
      </motion.div>

      <div className="flex flex-col gap-16 md:gap-24">
        {HOW_I_WORK_STEPS.map((step, index) => (
          <motion.article
            key={step.id}
            className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
            variants={staggerContainerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className={cn(index % 2 === 1 && "md:order-2")}
              variants={fadeInUpAnim}
              transition={{ duration: 0.5 }}
            >
              <div
                className={cn(
                  "border-border overflow-hidden rounded-xl border",
                  step.frameClassName
                )}
              >
                <Image
                  src={step.image}
                  alt={t(`homepage.howIWork.steps.${step.id}.alt`)}
                  width={step.width}
                  height={step.height}
                  sizes="(max-width: 768px) 100vw, 480px"
                  className={step.imageClassName}
                />
              </div>
            </motion.div>

            <motion.div
              className={cn(index % 2 === 1 && "md:order-1")}
              variants={fadeInUpAnim}
              transition={{ duration: 0.5 }}
            >
              <span className="border-border text-muted-foreground inline-block rounded-full border px-3 py-1 text-xs">
                {t(`homepage.howIWork.steps.${step.id}.tag`)}
              </span>
              <h3 className="mt-4 text-2xl font-bold md:text-3xl">
                {t(`homepage.howIWork.steps.${step.id}.title`)}
              </h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {t(`homepage.howIWork.steps.${step.id}.text`)}
              </p>
            </motion.div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="mt-14 flex justify-center"
        variants={fadeInUpAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="gradient-outline" asChild>
          <Link href="/about">
            {t("homepage.howIWork.cta")}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
