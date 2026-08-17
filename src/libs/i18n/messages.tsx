import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

type Messages = Record<string, unknown>;

/**
 * Narrow a message catalog down to the given namespaces.
 * Unknown namespaces are skipped rather than serialized as `undefined`.
 */
export function pickMessages(
  messages: Messages,
  namespaces: readonly string[]
): Messages {
  const picked: Messages = {};

  for (const namespace of namespaces) {
    if (namespace in messages) {
      picked[namespace] = messages[namespace];
    }
  }

  return picked;
}

interface PageMessagesProps {
  namespaces: readonly string[];
  children: React.ReactNode;
}

/**
 * Provide a route's own translations to its Client Components.
 *
 * The root layout only ships `common` (header, footer, dialogs). Each route
 * adds its namespace here so a page never serializes catalogs it cannot use.
 * Routes without Client Components need no provider at all.
 */
export async function PageMessages({
  namespaces,
  children,
}: PageMessagesProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      messages={pickMessages(messages, ["common", ...namespaces])}
    >
      {children}
    </NextIntlClientProvider>
  );
}
