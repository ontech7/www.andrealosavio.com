"use client";

import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface QuoteSectionProps {
  id: string;
  className?: string;
}

export function QuoteSection({ id, className }: QuoteSectionProps) {
  const t = useTranslations("homepage");

  return (
    <section
      id={id}
      className={cn(
        "mx-auto flex max-w-5xl flex-col items-center px-6 py-12 md:py-18",
        className
      )}
    >
      <motion.div
        className="flex w-full flex-col items-center"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Separator */}
        <motion.div
          className="border-border mb-12 w-50 border-t"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        />

        {/* Quote container */}
        <motion.div
          className="relative mx-6 text-center"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {/* Opening quote mark */}
          <Image
            src="/images/open-quote.svg"
            alt=""
            width={38}
            height={50}
            className="absolute -top-6 -left-5 size-10 md:-top-8 md:size-14"
            aria-hidden="true"
          />

          {/* Quote text */}
          <p className="mx-auto max-w-200 px-8 text-lg leading-relaxed md:px-14 md:text-xl">
            {t("quote.text")}
          </p>

          {/* Closing quote mark */}
          <Image
            src="/images/close-quote.svg"
            alt=""
            width={38}
            height={50}
            className="absolute -right-5 -bottom-6 size-10 md:-bottom-10 md:size-14"
            aria-hidden="true"
          />
        </motion.div>

        {/* Author */}
        <motion.p
          className="text-muted-foreground mt-10 max-w-100 text-center text-xs md:max-w-200 md:text-sm"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          — {t("quote.author")},{" "}
          <span className="underline">{t("quote.book")}</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
