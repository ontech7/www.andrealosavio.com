import { hasLocale, Locale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const namespaces = [
  "common",
  "homepage",
  "services",
  "projects",
  "about",
  "privacy",
] as const;

async function loadMessages(locale: Locale) {
  const messages: Record<string, Record<string, string>> = {};

  for (const ns of namespaces) {
    try {
      messages[ns] = (
        await import(`../../translations/${locale}/${ns}.json`)
      ).default;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[next-intl] Missing translation: ${locale}/${ns}.json - ${err}`
        );
      }
    }
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
