"use client";

import { cn } from "@/utils/cn";
import { motion } from "motion/react";

interface ScoreRingProps {
  score: number;
  label: string;
  delay?: number;
}

const RING_SIZE = 120;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;

export function ScoreRing({ score, label, delay = 0 }: ScoreRingProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative">
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-white/10"
          />
          {/* Animated progress circle — uses pathLength for GPU-accelerated animation */}
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            className="text-secondary"
            strokeDasharray="1"
            strokeDashoffset="0"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: score / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeOut" }}
          />
        </svg>

        {/* Score number */}
        <motion.span
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "text-2xl font-bold text-white"
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.6 }}
        >
          {score}
        </motion.span>
      </div>

      <span className="text-muted-foreground text-sm font-medium">
        {label}
      </span>
    </motion.div>
  );
}
