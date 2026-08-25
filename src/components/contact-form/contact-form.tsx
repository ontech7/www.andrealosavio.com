"use client";

import { Card } from "@/components/ui/card";
import { LINKEDIN_URL } from "@/constants/contact";
import { fadeInUpAnim } from "@/constants/motion";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { CheckCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useContactForm } from "../../hooks/use-contact-form";
import { ContactFormFields } from "./contact-form-fields";
import { DirectContactLinks } from "./direct-contact-links";

interface ContactFormProps {
  id?: string;
  title: string;
  description: string;
  topics?: React.ReactNode;
  className?: string;
}

export function ContactForm({
  id,
  title,
  description,
  topics,
  className,
}: ContactFormProps) {
  const t = useTranslations();

  const {
    status,
    errorMessage,
    consentError,
    consent,
    setConsent,
    onSubmitForm,
  } = useContactForm();

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
      <Card className="bg-background p-5 md:p-7">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon
              className="mb-4 size-16 text-green-500"
              aria-hidden="true"
            />
            <h2 className="mb-3 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-4xl">
              {t("common.contactForm.successTitle")}
            </h2>
            <p
              className="text-muted-foreground max-w-md text-sm md:text-base"
              role="status"
            >
              {t("common.contactForm.successMessage")}
            </p>
            <p className="text-muted-foreground mt-4 max-w-md text-sm">
              {t.rich("common.contactForm.successExplore", {
                projects: (children) => (
                  <Link
                    href="/projects"
                    className="text-foreground underline underline-offset-2"
                  >
                    {children}
                  </Link>
                ),
                linkedin: (children) => (
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
              })}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 text-center">
              <h2 className="mb-2 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
                {title}
              </h2>
              <p className="bg-(image:--text-gradient) bg-clip-text text-sm text-transparent md:text-base">
                {description}
              </p>
              {topics}
            </div>

            <ContactFormFields
              status={status}
              errorMessage={errorMessage}
              consentError={consentError}
              consent={consent}
              setConsent={setConsent}
              onSubmit={onSubmitForm}
              textareaLabelKey="common.contactForm.challenge"
              submitLabelKey="common.contactForm.submit"
              textareaRows={3}
              formClassName="space-y-4"
              submitAlignment="center"
            />

            <DirectContactLinks className="mt-4 mb-1" />
          </>
        )}
      </Card>
    </motion.div>
  );
}
