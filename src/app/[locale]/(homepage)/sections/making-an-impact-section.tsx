"use client";

import { Card, CardContent } from "@/components/ui/card";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { IMPACT_TILES } from "../constants/impact-items";

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
      className={cn(
        "mx-auto max-w-5xl scroll-mt-20 px-6 py-10 md:py-14",
        className
      )}
    >
      <motion.div
        className="mb-10 text-center"
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
          className="text-muted-foreground mx-auto mt-4 max-w-md text-lg"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.makingAnImpact.subtitle")}
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {IMPACT_TILES.map((tile) => (
          <motion.div
            key={tile.id}
            className={cn("h-full", tile.className)}
            variants={fadeInUpAnim}
            transition={{ duration: 0.5 }}
          >
            {tile.kind === "kpi" ? (
              <Card
                className={cn(
                  "h-full px-5 py-5",
                  tile.featured
                    ? "from-secondary-foreground/40 border-secondary/30 bg-linear-to-br to-transparent"
                    : "bg-card"
                )}
              >
                <CardContent
                  className={cn(
                    "flex h-full flex-col p-0",
                    tile.featured ? "justify-between gap-6" : "gap-2"
                  )}
                >
                  <span
                    className={cn(
                      "from-secondary via-secondary/85 to-secondary/60 bg-linear-to-t bg-clip-text font-bold text-transparent",
                      tile.featured
                        ? "text-5xl leading-none md:text-6xl"
                        : "text-3xl leading-none md:text-4xl"
                    )}
                  >
                    {t(`homepage.makingAnImpact.kpis.${tile.id}.value`)}
                  </span>
                  <span
                    className={cn(
                      "text-muted-foreground leading-snug",
                      tile.featured ? "max-w-64 text-base" : "text-sm"
                    )}
                  >
                    {t(`homepage.makingAnImpact.kpis.${tile.id}.label`)}
                  </span>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card h-full px-5 py-5">
                <CardContent className="flex h-full flex-col gap-2 p-0">
                  <tile.icon
                    className="text-secondary size-5 shrink-0 stroke-[1.5]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-1 font-semibold">
                    {t(`homepage.makingAnImpact.outcomes.${tile.id}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(`homepage.makingAnImpact.outcomes.${tile.id}.text`)}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
