"use client";

import { ContactForm } from "@/components/contact-form";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { SERVICES } from "@/constants/services";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ServiceCard } from "../components/service-card";

interface AvailableServicesSectionProps {
  id: string;
  className?: string;
}

export function AvailableServicesSection({
  id,
  className,
}: AvailableServicesSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 pb-10 lg:pt-0 lg:pb-14", className)}
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
          className="bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
        >
          {t("services.availableServices.sectionTitle")}
        </motion.h2>

        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            reversed={index % 2 !== 0}
          />
        ))}

        <motion.div
          variants={fadeInUpAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-sm">
            {t("services.contactForm.divider")}
          </span>
          <div className="bg-border h-px flex-1" />
        </motion.div>

        <ContactForm
          id="contactForm"
          title={t("services.contactForm.title")}
          description={t("services.contactForm.description")}
          className="scroll-mt-24"
        />
      </motion.div>
    </section>
  );
}
