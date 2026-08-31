import type { AppLocale } from "@/libs/i18n/utils";

/**
 * Formatta una data ISO (YYYY-MM-DD) in forma estesa e localizzata.
 * Interpreta la data come UTC per evitare che il fuso sposti il giorno.
 */
export function formatArticleDate(iso: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
