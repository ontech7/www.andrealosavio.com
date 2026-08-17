/**
 * Format an amount as a locale-aware EUR price without decimals.
 * IT renders `2.500 €`, EN renders `€2,500`.
 *
 * `useGrouping` is forced because the Italian default (`"min2"`) leaves
 * four-digit amounts ungrouped, rendering `2500 €` instead of `2.500 €`.
 */
export function formatEuro(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(amount);
}
