"use client";

import { cn } from "@/utils/cn";
import { motion } from "motion/react";

interface SectionConnectorProps {
  className?: string;
}

export function SectionConnector({ className }: SectionConnectorProps) {
  return (
    <motion.div
      className={cn(
        "via-secondary/50 mx-auto h-20 w-px origin-top bg-linear-to-b from-transparent to-transparent",
        className
      )}
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-hidden="true"
    />
  );
}
