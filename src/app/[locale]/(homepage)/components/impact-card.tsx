"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { MotionStyle } from "motion/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import type { ImpactItem } from "../constants/impact-items";

interface ImpactCardProps {
  item: ImpactItem;
  style?: MotionStyle;
}

export function ImpactCard({ item }: ImpactCardProps) {
  const t = useTranslations("homepage");

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.6"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <div ref={ref} className="w-full">
      <motion.div
        className={cn(
          "flex w-full",
          item.position === "left"
            ? "justify-center md:justify-start"
            : "justify-center md:justify-end"
        )}
        style={{ opacity, y }}
      >
        <Card className="bg-card max-w-sm px-5 py-4">
          <CardContent className="flex items-start gap-3 p-0">
            <div className="mt-0.5 shrink-0">
              <item.icon className="text-muted-foreground size-5 stroke-[1.5]" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.rich(item.textKey, {
                highlight: (children) => (
                  <span className="text-secondary font-medium">{children}</span>
                ),
              })}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
