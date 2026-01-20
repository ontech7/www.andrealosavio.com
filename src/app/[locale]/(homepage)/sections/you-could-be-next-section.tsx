"use client";

import { GridLayers } from "@/components/grid-layers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { SERVICES } from "@/constants/services";
import { cn } from "@/utils/cn";
import { ChevronDown, Send } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface YouCouldBeNextSectionProps {
  id: string;
  className?: string;
}

export function YouCouldBeNextSection({
  id,
  className,
}: YouCouldBeNextSectionProps) {
  const t = useTranslations("homepage");

  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto mb-10 max-w-5xl overflow-hidden px-6",
        className
      )}
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <GridLayers />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <motion.div
          className="mb-12 text-center"
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
            {t("youCouldBeNext.title")}
          </motion.h2>
          <motion.p
            className="text-muted-foreground mx-auto mt-4 max-w-lg text-lg"
            variants={fadeInUpAnim}
            transition={{ duration: 0.5 }}
          >
            {t("youCouldBeNext.subtitle")}
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12"
          variants={staggerContainerAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Text */}
          <motion.div
            className="order-2 flex flex-col justify-between lg:order-1 lg:h-full"
            variants={fadeInUpAnim}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-muted-foreground mb-6 text-lg">
                {t("youCouldBeNext.leftText.line1")}{" "}
                <span className="font-semibold text-white">
                  {t("youCouldBeNext.leftText.line1Highlight")}
                </span>
                .
              </p>
              <p className="text-muted-foreground text-lg">
                {t("youCouldBeNext.leftText.line2")}
              </p>
            </div>

            {/* Not ready yet */}
            <div className="mt-12 lg:mt-auto lg:pt-12">
              <p className="text-muted-foreground text-sm">
                {t("youCouldBeNext.notReadyYet")}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("youCouldBeNext.keepScrolling")}{" "}
                <motion.span
                  className="inline-block align-middle"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown className="inline size-5" />
                </motion.span>
              </p>
            </div>
          </motion.div>

          {/* Right Card */}
          <motion.div
            className="order-1 lg:order-2"
            variants={fadeInUpAnim}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-background px-6 py-6">
              <CardContent className="flex flex-col gap-4 p-0">
                {/* Card Header */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {t("youCouldBeNext.challengeBox.title")}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {t("youCouldBeNext.challengeBox.subtitle")}
                  </p>
                </div>

                {/* Services Grid */}
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {SERVICES.map((service) => (
                    <Button key={service.id} variant="primary">
                      {t(`youCouldBeNext.challengeBox.services.${service.id}`)}
                    </Button>
                  ))}
                </div>

                {/* Divider with "or" */}
                <div className="flex items-center gap-4">
                  <div className="border-border h-px flex-1 border-t" />
                  <span className="text-muted-foreground text-sm">
                    {t("youCouldBeNext.challengeBox.or")}
                  </span>
                  <div className="border-border h-px flex-1 border-t" />
                </div>

                {/* Contact Button */}
                <Button
                  variant="gradient-outline"
                  className="[&_button]:w-full"
                >
                  {t("youCouldBeNext.challengeBox.contactMe")}
                  <Send className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
