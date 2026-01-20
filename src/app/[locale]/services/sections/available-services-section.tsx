"use client";

import { staggerContainerAnim } from "@/constants/motion";
import { SERVICES } from "@/constants/services";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { ServiceCard } from "../components/service-card";

interface AvailableServicesSectionProps {
  id: string;
  className?: string;
}

export function AvailableServicesSection({
  id,
  className,
}: AvailableServicesSectionProps) {
  return (
    <section id={id} className={cn("mx-auto max-w-5xl px-6 py-20", className)}>
      <motion.div
        className="flex flex-col gap-6"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            reversed={index % 2 !== 0}
          />
        ))}
      </motion.div>
    </section>
  );
}
