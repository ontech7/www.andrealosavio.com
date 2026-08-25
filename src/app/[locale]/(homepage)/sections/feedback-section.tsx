"use client";

import { GridLayers } from "@/components/grid-layers";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { CircleHelp } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FEEDBACK_ITEMS } from "../constants/feedback-items";

interface FeedbackSectionProps {
  id: string;
  className?: string;
}

export function FeedbackSection({ id, className }: FeedbackSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto max-w-5xl scroll-mt-20 overflow-hidden px-6 py-10 md:py-14",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <GridLayers />
      </div>

      <motion.div
        className="relative z-10 mb-12 text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.youCouldBeNext.title")}
        </motion.h2>
        <motion.p
          className="text-muted-foreground mx-auto mt-4 max-w-lg text-lg"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.youCouldBeNext.subtitle")}
        </motion.p>
        <motion.p
          className="text-muted-foreground mx-auto mt-3 max-w-xl"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t.rich("homepage.youCouldBeNext.text", {
            highlight: (children) => (
              <span className="font-semibold text-white">{children}</span>
            ),
          })}
        </motion.p>
      </motion.div>

      <motion.div
        className="relative z-10 columns-1 gap-4 md:columns-2 lg:columns-3"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {FEEDBACK_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            className="mb-4 break-inside-avoid"
            variants={fadeInUpAnim}
            transition={{ duration: 0.5 }}
          >
            <Card className="px-5 py-4">
              <CardContent className="flex flex-col gap-3 p-0">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    {item.icon ? (
                      <Image
                        src={item.icon}
                        alt={t(`homepage.feedback.clients.${item.id}.name`)}
                        width={32}
                        height={32}
                        className="size-8"
                      />
                    ) : (
                      <CircleHelp className="text-muted-foreground size-8 stroke-[1.5]" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {t(`homepage.feedback.clients.${item.id}.name`)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t(`homepage.feedback.clients.${item.id}.description`)}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`homepage.feedback.clients.${item.id}.quote`)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
