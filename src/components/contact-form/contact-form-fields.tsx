"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/cn";
import { LoaderIcon, MailIcon, SendIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import type { ContactFormStatus } from "../../hooks/use-contact-form";
import { FloatingInput } from "../ui/floating-input";
import { FloatingTextarea } from "../ui/floating-textarea";

interface ContactFormFieldsProps {
  status: ContactFormStatus;
  errorMessage: string;
  consent: boolean;
  setConsent: (value: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  textareaLabelKey: string;
  submitLabelKey: string;
  textareaRows: number;
  formClassName: string;
  submitAlignment: "center" | "end";
  serviceBadge?: React.ReactNode;
}

export function ContactFormFields({
  status,
  errorMessage,
  consent,
  setConsent,
  onSubmit,
  textareaLabelKey,
  submitLabelKey,
  textareaRows,
  formClassName,
  submitAlignment,
  serviceBadge,
}: ContactFormFieldsProps) {
  const t = useTranslations();
  const checkboxId = useId();

  return (
    <form
      onSubmit={onSubmit}
      className={formClassName}
      aria-busy={status === "loading"}
      noValidate
    >
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {serviceBadge}

      <FloatingInput
        label={t("services.contactForm.fullname")}
        icon={<UserIcon className="size-4" />}
        name="fullname"
        required
        aria-required="true"
        autoComplete="name"
        disabled={status === "loading"}
      />

      <FloatingInput
        label={t("services.contactForm.email")}
        type="email"
        icon={<MailIcon className="size-4" />}
        name="email"
        required
        aria-required="true"
        autoComplete="email"
        disabled={status === "loading"}
      />

      <FloatingTextarea
        label={t(textareaLabelKey)}
        name="challenge"
        rows={textareaRows}
        required
        aria-required="true"
        disabled={status === "loading"}
      />

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
          {t("services.contactForm.consent")}
        </label>
      </div>

      {status === "error" && errorMessage && (
        <p
          className="text-center text-sm text-red-500"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </p>
      )}

      <div
        className={cn(
          "flex",
          submitAlignment === "center"
            ? "justify-center pt-4"
            : "justify-end pt-2"
        )}
      >
        <Button
          variant="gradient-outline"
          type="submit"
          disabled={!consent || status === "loading"}
        >
          {status === "loading" ? (
            <>
              {t("services.contactForm.sending")}
              <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              {t(submitLabelKey)}
              <SendIcon className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
