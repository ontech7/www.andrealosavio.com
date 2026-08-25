"use client";

import { ContactForm } from "@/components/contact-form";
import { SERVICE_IDS } from "@/constants/services";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

interface ContactSectionProps {
  id: string;
  className?: string;
}

export function ContactSection({ id, className }: ContactSectionProps) {
  const t = useTranslations();

  return (
    <section
      className={cn("mx-auto max-w-2xl px-6 pt-4 pb-20 md:pb-24", className)}
    >
      <ContactForm
        id={id}
        title={t("homepage.contact.title")}
        description={t("homepage.contact.description")}
        className="scroll-mt-24"
        topics={
          <ul className="mt-4 flex flex-wrap justify-center gap-1.5 p-0">
            {SERVICE_IDS.map((serviceId) => (
              <li
                key={serviceId}
                className="border-border text-muted-foreground mt-0 rounded-full border px-2.5 py-0.5 text-xs"
              >
                {t(`common.services.items.${serviceId}`)}
              </li>
            ))}
          </ul>
        }
      />
    </section>
  );
}
