"use client";

import { usePathname, useRouter } from "@/libs/i18n/navigation";
import { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";
import { useLocale } from "next-intl";
import { useTransition } from "react";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
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
        {/* EN Button */}
        <button
          onClick={() => handleLocaleChange("en")}
          className={cn(
            "relative z-10 rounded-full px-3 py-1 text-sm font-medium",
            isEnglish
              ? "bg-foreground text-background"
              : "bg-transparent text-foreground"
          )}
        >
          EN
        </button>

        {/* IT Button */}
        <button
          onClick={() => handleLocaleChange("it")}
          className={cn(
            "relative z-10 rounded-full px-3 py-1 text-sm font-medium",
            !isEnglish
              ? "bg-foreground text-background"
              : "bg-transparent text-foreground"
          )}
        >
          IT
        </button>
      </div>
    </div>
  );
}
