"use client";

import { fadeInUpAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

interface PracticeCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  index: number;
}

export function PracticeCard({ icon: Icon, title, items, index }: PracticeCardProps) {
  return (
    <motion.div
      variants={fadeInUpAnim}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div
        className={cn(
          "rounded-lg bg-(image:--border-gradient) p-px",
          "transition-all duration-300",
          "hover:bg-(image:--border-gradient-light)"
        )}
      >
        <div className="flex h-full flex-col gap-4 rounded-lg bg-card p-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
              <Icon className="size-5 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>

          {/* Items */}
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
