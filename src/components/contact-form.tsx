"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fadeInUpAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import {
  CheckCircleIcon,
  LoaderIcon,
  MailIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { FloatingInput } from "./ui/floating-input";
import { FloatingTextarea } from "./ui/floating-textarea";

interface ContactFormProps {
  id?: string;
  title: string;
  description: string;
  className?: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm({
  id,
  title,
  description,
  className,
}: ContactFormProps) {
  const t = useTranslations("services.contactForm");
  const locale = useLocale() as "it" | "en";
  const checkboxId = useId();
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const data = {
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
      challenge: formData.get("challenge") as string,
      website: formData.get("website") as string,
      locale,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(t("errorMessage"));
    }
  }

  if (status === "success") {
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
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon
              className="mb-4 size-16 text-green-500"
              aria-hidden="true"
            />
            <h3 className="mb-3 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-4xl">
              {t("successTitle")}
            </h3>
            <p
              className="text-muted-foreground max-w-md text-sm md:text-base"
              role="status"
            >
              {t("successMessage")}
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

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
      {/* Form Card */}
      <Card className="bg-background p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="mb-3 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-4xl">
            {title}
          </h3>
          <p className="bg-(image:--text-gradient) bg-clip-text text-sm text-transparent md:text-base">
            {description}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-xl space-y-6"
          aria-busy={status === "loading"}
          noValidate
        >
          {/* Honeypot field - hidden from real users */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <FloatingInput
            label={t("fullname")}
            icon={<UserIcon className="size-4" />}
            name="fullname"
            required
            aria-required="true"
            autoComplete="name"
            disabled={status === "loading"}
          />

          <FloatingInput
            label={t("email")}
            type="email"
            icon={<MailIcon className="size-4" />}
            name="email"
            required
            aria-required="true"
            autoComplete="email"
            disabled={status === "loading"}
          />

          <FloatingTextarea
            label={t("challenge")}
            name="challenge"
            rows={3}
            required
            aria-required="true"
            disabled={status === "loading"}
          />

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id={checkboxId}
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              disabled={status === "loading"}
            />
            <label
              htmlFor={checkboxId}
              className="text-muted-foreground cursor-pointer text-sm leading-relaxed"
            >
              {t("consent")}
            </label>
          </div>

          {/* Error Message */}
          {status === "error" && errorMessage && (
            <p
              className="text-center text-sm text-red-500"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="gradient-outline"
              type="submit"
              disabled={!consent || status === "loading"}
            >
              {status === "loading" ? (
                <>
                  {t("sending")}
                  <LoaderIcon
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  {t("submit")}
                  <SendIcon className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
