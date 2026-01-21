"use client";

import { useTranslations } from "next-intl";
import { CatVoteDialog } from "./cat-vote-dialog";

export function FooterCatCta() {
  const t = useTranslations("common");

  return (
    <p className="text-muted-foreground text-sm">
      {t("footer.cta.descriptionPart1")}
      <CatVoteDialog>
        <button
          type="button"
          className="text-foreground hover:text-foreground/80 cursor-pointer underline underline-offset-2 transition-colors"
        >
          {t("footer.cta.descriptionLink")}
        </button>
      </CatVoteDialog>
      {t("footer.cta.descriptionPart2")} 🐱
    </p>
  );
}
