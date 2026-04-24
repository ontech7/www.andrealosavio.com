"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SERVICES } from "@/constants/services";
import { CheckCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useContactForm } from "../../hooks/use-contact-form";
import { ContactFormFields } from "./contact-form-fields";

type ServiceId = (typeof SERVICES)[number]["id"];

interface ContactFormDialogProps {
  serviceId: ServiceId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactFormDialog({
  serviceId,
  open,
  onOpenChange,
}: ContactFormDialogProps) {
  const t = useTranslations();

  const {
    status,
    errorMessage,
    consent,
    setConsent,
    onSubmitForm,
    reset,
    refreshCsrfToken,
  } = useContactForm();

  const serviceTitle = t(`services.availableServices.${serviceId}.title`);

  useEffect(() => {
    if (open) refreshCsrfToken();
  }, [open, refreshCsrfToken]);

  function handleOpenChange(newOpen: boolean) {
    onOpenChange(newOpen);
    if (!newOpen) setTimeout(reset, 200);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-background max-h-[90vh] w-[calc(100%-24px)] max-w-lg overflow-y-auto"
        closeLabel={t("common.accessibility.closeDialog")}
      >
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon
              className="mb-4 size-16 text-green-500"
              aria-hidden="true"
            />
            <DialogTitle className="mb-3 bg-(image:--text-gradient) bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              {t("services.contactForm.successTitle")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground max-w-md text-sm">
              {t("services.contactForm.successMessage")}
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="bg-(image:--text-gradient) bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
                {t("services.serviceDialog.title", { service: serviceTitle })}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {t("services.serviceDialog.description")}
              </DialogDescription>
            </DialogHeader>

            <ContactFormFields
              status={status}
              errorMessage={errorMessage}
              consent={consent}
              setConsent={setConsent}
              onSubmit={(e) => onSubmitForm(e, serviceTitle)}
              textareaLabelKey="services.serviceDialog.messageLabel"
              submitLabelKey="services.serviceDialog.submit"
              textareaRows={4}
              formClassName="mt-4 space-y-5"
              submitAlignment="end"
              serviceBadge={
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    {t("services.serviceDialog.selectedService")}
                  </span>
                  <span className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-medium">
                    {serviceTitle}
                  </span>
                </div>
              }
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
