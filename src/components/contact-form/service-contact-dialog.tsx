"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SERVICES } from "@/constants/services";
import { cn } from "@/utils/cn";
import {
  CheckCircleIcon,
  LoaderIcon,
  MailIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { FloatingInput } from "./floating-input";
import { FloatingTextarea } from "./floating-textarea";

type ServiceId = (typeof SERVICES)[number]["id"];
type FormStatus = "idle" | "loading" | "success" | "error";

interface ServiceContactDialogProps {
  serviceId: ServiceId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceContactDialog({
  serviceId,
  open,
  onOpenChange,
}: ServiceContactDialogProps) {
  const t = useTranslations("services");
  const locale = useLocale() as "it" | "en";
  const checkboxId = useId();
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const serviceTitle = t(`availableServices.${serviceId}.title`);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const data = {
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
      challenge: formData.get("challenge") as string,
      service: serviceTitle,
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
      setErrorMessage(t("contactForm.errorMessage"));
    }
  }

  function handleOpenChange(newOpen: boolean) {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form state when dialog closes
      setTimeout(() => {
        setStatus("idle");
        setConsent(false);
        setErrorMessage("");
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon className="mb-4 size-16 text-green-500" />
            <DialogTitle className="mb-3 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              {t("contactForm.successTitle")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground max-w-md text-sm">
              {t("contactForm.successMessage")}
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="bg-(image:--text-gradient) bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
                {t("serviceDialog.title", { service: serviceTitle })}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {t("serviceDialog.description")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
              {/* Service Badge */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  {t("serviceDialog.selectedService")}
                </span>
                <span className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-medium">
                  {serviceTitle}
                </span>
              </div>

              <FloatingInput
                label={t("contactForm.fullname")}
                icon={<UserIcon className="size-4" />}
                name="fullname"
                required
                disabled={status === "loading"}
              />

              <FloatingInput
                label={t("contactForm.email")}
                type="email"
                icon={<MailIcon className="size-4" />}
                name="email"
                required
                disabled={status === "loading"}
              />

              <FloatingTextarea
                label={t("serviceDialog.messageLabel")}
                name="challenge"
                rows={4}
                required
                disabled={status === "loading"}
              />

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id={checkboxId}
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  disabled={status === "loading"}
                />
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    "text-muted-foreground cursor-pointer text-sm leading-relaxed"
                  )}
                >
                  {t("contactForm.consent")}
                </label>
              </div>

              {/* Error Message */}
              {status === "error" && errorMessage && (
                <p className="text-center text-sm text-red-500">
                  {errorMessage}
                </p>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="gradient-outline"
                  type="submit"
                  disabled={!consent || status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      {t("contactForm.sending")}
                      <LoaderIcon className="size-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      {t("serviceDialog.submit")}
                      <SendIcon className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
