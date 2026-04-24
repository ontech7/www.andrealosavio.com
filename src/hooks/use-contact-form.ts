"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

export type ContactFormStatus = "idle" | "loading" | "success" | "error";

export function useContactForm() {
  const t = useTranslations();
  const locale = useLocale();

  const csrfTokenRef = useRef("");

  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      setStatus("loading");
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
        if (!response.ok) throw new Error("Failed to send message");
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage(t("services.contactForm.errorMessage"));
        refreshCsrfToken();
      }
    },
    [locale, refreshCsrfToken, t]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setConsent(false);
    setErrorMessage("");
  }, []);

  return {
    status,
    errorMessage,
    consent,
    setConsent,
    onSubmitForm,
    reset,
    refreshCsrfToken,
  };
}
