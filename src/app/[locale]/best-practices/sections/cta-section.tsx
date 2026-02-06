"use client";

import { Button } from "@/components/ui/button";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface CtaSectionProps {
  id: string;
  className?: string;
}

export function CtaSection({ id, className }: CtaSectionProps) {
  const t = useTranslations("bestPractices");

  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-5xl px-6 py-16 lg:py-24",
        className
      )}
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
          className="mb-4 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
        >
          {t.rich("cta.title", {
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
          className="text-muted-foreground mx-auto mb-10 max-w-md text-base"
        >
          {t("cta.subtitle")}
        </motion.p>

        <motion.div variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
          <Button variant="gradient-primary" size="lg" asChild>
            <Link href="/services" className="flex items-center gap-2">
              <div
                className="bg-secondary size-2.5 shrink-0 animate-pulse rounded-full shadow-(--shadow-secondary)"
                aria-hidden="true"
              />
              {t("cta.button")}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
