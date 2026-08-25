"use client";

import { CONTACT_EMAIL } from "@/constants/contact";
import { track } from "@vercel/analytics";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

export type ContactFormStatus = "idle" | "loading" | "success" | "error";

export function useContactForm() {
  const t = useTranslations();
  const locale = useLocale();

  const csrfTokenRef = useRef("");

  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [consentError, setConsentError] = useState(false);

  const [consent, setConsent] = useState(false);

  const refreshCsrfToken = useCallback(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((data) => {
        csrfTokenRef.current = data.token;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshCsrfToken();
  }, [refreshCsrfToken]);

  const onSubmitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>, service?: string) => {
      event.preventDefault();

      if (!consent) {
        setStatus("error");
        setConsentError(true);
        setErrorMessage(t("common.contactForm.consentRequired"));
        return;
      }

      setStatus("loading");
      setConsentError(false);
      setErrorMessage("");

      const formData = new FormData(event.currentTarget);
      const payload = {
        fullname: formData.get("fullname") as string,
        email: formData.get("email") as string,
        challenge: formData.get("challenge") as string,
        website: formData.get("website") as string,
        ...(service && { service }),
        locale,
        csrfToken: csrfTokenRef.current,
      };

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          setStatus("error");
          setErrorMessage(
            t(
              response.status === 429
                ? "common.contactForm.rateLimitMessage"
                : "common.contactForm.errorMessage",
              { email: CONTACT_EMAIL }
            )
          );
          refreshCsrfToken();
          return;
        }

        setStatus("success");
        track("contact_submit", { service: service ?? "generic", locale });
      } catch {
        setStatus("error");
        setErrorMessage(
          t("common.contactForm.errorMessage", { email: CONTACT_EMAIL })
        );
        refreshCsrfToken();
      }
    },
    [consent, locale, refreshCsrfToken, t]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setConsent(false);
    setConsentError(false);
    setErrorMessage("");
  }, []);

  const updateConsent = useCallback((value: boolean) => {
    setConsent(value);
    if (value) setConsentError(false);
  }, []);

  return {
    status,
    errorMessage,
    consentError,
    consent,
    setConsent: updateConsent,
    onSubmitForm,
    reset,
    refreshCsrfToken,
  };
}
