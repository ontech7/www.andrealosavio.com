"use client";

import { Card } from "@/components/ui/card";
import { fadeInUpAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { CheckCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useContactForm } from "../../hooks/use-contact-form";
import { ContactFormFields } from "./contact-form-fields";

interface ContactFormProps {
  id?: string;
  title: string;
  description: string;
  className?: string;
}

export function ContactForm({
  id,
  title,
  description,
  className,
}: ContactFormProps) {
  const t = useTranslations();

  const { status, errorMessage, consent, setConsent, onSubmitForm } =
    useContactForm();

  return (
    <motion.div
      id={id}
      variants={fadeInUpAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
    >
      <Card className="bg-background p-4 md:p-8">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon
              className="mb-4 size-16 text-green-500"
              aria-hidden="true"
            />
            <h3 className="mb-3 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-4xl">
              {t("services.contactForm.successTitle")}
            </h3>
            <p
              className="text-muted-foreground max-w-md text-sm md:text-base"
              role="status"
            >
              {t("services.contactForm.successMessage")}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h3 className="mb-3 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-4xl">
                {title}
              </h3>
              <p className="bg-(image:--text-gradient) bg-clip-text text-sm text-transparent md:text-base">
                {description}
              </p>
            </div>

            <ContactFormFields
              status={status}
              errorMessage={errorMessage}
              consent={consent}
              setConsent={setConsent}
              onSubmit={onSubmitForm}
              textareaLabelKey="services.contactForm.challenge"
              submitLabelKey="services.contactForm.submit"
              textareaRows={3}
              formClassName="mx-auto max-w-xl space-y-6"
              submitAlignment="center"
            />
          </>
        )}
      </Card>
    </motion.div>
  );
}
