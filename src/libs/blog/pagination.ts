/** Numero di pagina, oppure il salto reso come ellissi tra due numeri lontani. */
export type PaginationSlot = number | "gap";

/**
 * Quante pagine servono per `itemCount` elementi. Resta almeno 1, cosi la
 * paginazione si mostra anche con un solo articolo invece di sparire.
 */
export function pageCount(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

/**
 * Riporta `page` dentro [1, total]. Serve a difendersi dalla query string,
 * dove il numero arriva scritto a mano dall'utente.
 */
export function clampPage(page: number, total: number): number {
  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.min(Math.max(Math.trunc(page), 1), total);
}

/**
 * La finestra di numeri da mostrare: sempre la prima e l'ultima pagina, sempre
 * quella corrente con le due vicine, ed `"gap"` dove la sequenza salta. Fino a
 * sette pagine le elenca tutte, perche l'ellissi non risparmierebbe spazio.
 */
export function buildPageWindow(
  current: number,
  total: number
): PaginationSlot[] {
  const safeTotal = Math.max(1, Math.trunc(total));
  const safeCurrent = clampPage(current, safeTotal);

  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, index) => index + 1);
  }

  const wanted = new Set([
    1,
    safeTotal,
    safeCurrent - 1,
    safeCurrent,
    safeCurrent + 1,
  ]);

  if (safeCurrent <= 3) {
    [2, 3, 4].forEach((page) => wanted.add(page));
  }

  if (safeCurrent >= safeTotal - 2) {
    [safeTotal - 3, safeTotal - 2, safeTotal - 1].forEach((page) =>
      wanted.add(page)
    );
  }

  const pages = [...wanted]
    .filter((page) => page >= 1 && page <= safeTotal)
    .sort((a, b) => a - b);

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1
      ? (["gap", page] as PaginationSlot[])
      : [page]
  );
}

/**
 * La fetta di `items` che appartiene alla pagina `page`.
 */
export function pageSlice<T>(
  items: readonly T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize;

  return items.slice(start, start + pageSize);
}
