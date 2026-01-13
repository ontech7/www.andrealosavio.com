import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./utils";

export const routing = defineRouting({
  locales: locales,
  defaultLocale: defaultLocale,
  localeDetection: true,
});
