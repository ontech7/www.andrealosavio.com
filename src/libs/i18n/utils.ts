export type AppLocale = (typeof locales)[number];
export const locales = ["it", "en"] as const;
export const defaultLocale = "it";
