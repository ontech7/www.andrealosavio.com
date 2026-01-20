"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fadeInUpAnim } from "@/constants/motion";
import { cn } from "@/utils/cn";
import { MailIcon, SendIcon, UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { FloatingInput } from "./floating-input";
import { FloatingTextarea } from "./floating-textarea";

interface ContactFormProps {
  title: string;
  description: string;
  className?: string;
}

export function ContactForm({
  title,
  description,
  className,
}: ContactFormProps) {
  const t = useTranslations("services.contactForm");
  const checkboxId = useId();
  const [consent, setConsent] = useState(false);

  return (
    <motion.div
      variants={fadeInUpAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
    >
      {/* Form Card */}
      <Card className="bg-background p-8">
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
        <form className="mx-auto max-w-xl space-y-6">
          <FloatingInput
            label={t("fullname")}
            icon={<UserIcon className="size-4" />}
            name="fullname"
            required
          />

          <FloatingInput
            label={t("email")}
            type="email"
            icon={<MailIcon className="size-4" />}
            name="email"
            required
          />

          <FloatingTextarea
            label={t("challenge")}
            name="challenge"
            rows={3}
            required
          />

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id={checkboxId}
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
            />
            <label
              htmlFor={checkboxId}
              className="text-muted-foreground cursor-pointer text-sm leading-relaxed"
            >
              {t("consent")}
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button variant="gradient-outline" type="submit">
              {t("submit")}
              <SendIcon className="size-4" />
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
