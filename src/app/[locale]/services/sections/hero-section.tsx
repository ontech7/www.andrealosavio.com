"use client";

import { Button } from "@/components/ui/button";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { ArrowDownIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ServicesHeroDecoration } from "../components/hero-decoration";

interface HeroSectionProps {
  id: string;
  className?: string;
}

export function HeroSection({ id, className }: HeroSectionProps) {
  const t = useTranslations("services");

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-start overflow-hidden px-6 pt-40 md:min-h-[calc(70vh-4rem)]",
        "lg:items-center lg:pt-0",
        className
      )}
    >
      {/* Main */}
      <motion.div
        className="relative z-10 max-w-lg"
        variants={staggerContainerAnim}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="mb-7.5 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
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
          className="text-muted-foreground mb-10 max-w-md"
        >
          {t("hero.description")}
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
          <Button
            variant="primary"
            onClick={() => {
              document
                .getElementById("service-list")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {t("hero.ctaCheckOut")}
            <motion.span
              animate={{ y: [-2, 2, -2] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDownIcon className="size-4" />
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Decoration */}
      <div
        className={cn(
          "pointer-events-none absolute",
          "-right-50 translate-y-4/7 opacity-60",
          "md:-right-30 md:opacity-80",
          "lg:top-1/2 lg:right-0 lg:bottom-auto lg:-translate-y-1/2 lg:opacity-100"
        )}
      >
        <ServicesHeroDecoration />
      </div>
    </section>
  );
}
