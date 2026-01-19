"use client";

import { GridLayers } from "@/components/grid-layers";
import { Button } from "@/components/ui/button";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { CopyMinus, CopyPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { HobbyCard } from "../components/hobby-card";
import { HOBBY_ITEMS } from "../constants/hobby-items";

interface BeyondCodeSectionProps {
  id: string;
  className?: string;
}

export function BeyondCodeSection({ id, className }: BeyondCodeSectionProps) {
  const t = useTranslations("about");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20",
        className
      )}
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-90">
        <GridLayers />
      </div>

      {/* Title */}
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
          {t.rich("beyondCode.title", {
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
          {t("beyondCode.subtitle")}
        </motion.p>
      </motion.div>

      {/* Desktop Grid - 2 rows with different column proportions */}
      <motion.div
        className="hidden w-full flex-col gap-6 lg:flex"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {/* Row 1: narrower - wider - narrower */}
        <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-6">
          {HOBBY_ITEMS.slice(0, 3).map((hobby) => (
            <HobbyCard key={hobby.id} hobby={hobby} />
          ))}
        </div>

        {/* Row 2: wider - medium - wider */}
        <div className="grid grid-cols-[1.3fr_1fr_1.3fr] gap-6">
          {HOBBY_ITEMS.slice(3, 6).map((hobby) => (
            <HobbyCard key={hobby.id} hobby={hobby} />
          ))}
        </div>
      </motion.div>

      {/* Tablet/Mobile Grid - equal columns with expand/collapse */}
      <motion.div
        className="flex w-full flex-col gap-4 lg:hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {/* Always visible: first 2 cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {HOBBY_ITEMS.slice(0, 2).map((hobby) => (
            <HobbyCard key={hobby.id} hobby={hobby} />
          ))}
        </div>

        {/* Expandable: remaining cards */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {HOBBY_ITEMS.slice(2).map((hobby) => (
                  <HobbyCard key={hobby.id} hobby={hobby} animateDirectly />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show more/less button */}
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="primary" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? t("beyondCode.showLess") : t("beyondCode.showMore")}
            {isExpanded ? (
              <CopyMinus className="size-4" />
            ) : (
              <CopyPlus className="size-4" />
            )}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
