"use client";

import { usePathname, useRouter } from "@/libs/i18n/navigation";
import { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const isEnglish = locale === "en";

  function handleLocaleChange(newLocale: AppLocale) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div
      role="group"
      aria-label={t("common.accessibility.languageSwitcher")}
      className={cn(
        "relative rounded-full p-px",
        isPending && "pointer-events-none opacity-60",
        className
      )}
      style={{
        background: "var(--border-gradient)",
      }}
    >
      <div className="bg-muted relative flex items-center rounded-full p-1">
        <button
          type="button"
          onClick={() => handleLocaleChange("en")}
          aria-pressed={isEnglish}
          aria-label={t("common.accessibility.switchToEnglish")}
          className={cn(
            "relative z-10 rounded-full px-3 py-1 text-sm font-medium",
            isEnglish
              ? "bg-foreground text-background"
              : "text-foreground bg-transparent"
          )}
        >
          EN
        </button>

        <button
          type="button"
          onClick={() => handleLocaleChange("it")}
          aria-pressed={!isEnglish}
          aria-label={t("common.accessibility.switchToItalian")}
          className={cn(
            "relative z-10 rounded-full px-3 py-1 text-sm font-medium",
            !isEnglish
              ? "bg-foreground text-background"
              : "text-foreground bg-transparent"
          )}
        >
          IT
        </button>
      </div>
    </div>
  );
}
