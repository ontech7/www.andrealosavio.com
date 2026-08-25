"use client";

import { CONTACT_EMAIL, LINKEDIN_URL } from "@/constants/contact";
import { cn } from "@/utils/cn";
import { track } from "@vercel/analytics";
import { LinkedinIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface DirectContactLinksProps {
  className?: string;
}

export function DirectContactLinks({ className }: DirectContactLinksProps) {
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex w-full items-center gap-4">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-sm">
          {t("common.contactForm.directTitle")}
        </span>
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={() => track("contact_direct", { channel: "email" })}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <MailIcon className="size-4" aria-hidden="true" />
          {t("common.contactForm.directEmail")}
        </a>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("contact_direct", { channel: "linkedin" })}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <LinkedinIcon className="size-4" aria-hidden="true" />
          {t("common.contactForm.directLinkedin")}
        </a>
      </div>

      <p className="text-muted-foreground font-mono text-xs">{CONTACT_EMAIL}</p>
    </div>
  );
}
