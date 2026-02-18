"use client";

import { Button } from "@/components/ui/button";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { Link } from "@/libs/i18n/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <section className="relative mx-auto flex h-[calc(100vh-4rem)] min-h-120 max-w-5xl items-center justify-center overflow-hidden px-6">
      <motion.div
        className="flex flex-col items-center text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        animate="visible"
      >
        {/* 404 code */}
        <motion.p
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="bg-(image:--text-gradient) bg-clip-text font-mono text-8xl font-bold text-transparent md:text-[10rem]"
        >
          {t("code")}
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="text-foreground mt-4 text-2xl font-bold md:text-4xl"
        >
          {t("title")}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground mt-4 max-w-sm"
        >
          {t("description")}
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUpAnim} transition={{ duration: 0.5 }}>
          <Button variant="gradient-outline" className="mt-8" asChild>
            <Link href="/">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              {t("backToHome")}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
