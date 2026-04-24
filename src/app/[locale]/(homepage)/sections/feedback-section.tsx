"use client";

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
    <section id={id} className={cn("mx-auto max-w-5xl px-6", className)}>
      <motion.div
        className="columns-1 gap-4 md:columns-2 lg:columns-3"
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
