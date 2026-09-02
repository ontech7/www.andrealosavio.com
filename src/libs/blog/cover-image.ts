export type CoverVariant = "hero" | "thumb";

export const COVER_RASTER_WIDTH = 1200;
export const COVER_RASTER_HEIGHT = 630;

/** Qualita WebP: sopra 80 il file cresce senza che la scena migliori. */
export const COVER_RASTER_QUALITY = 78;

/**
 * Il path servito dalla route delle cover.
 *
 * `version` e un hash di cio che disegna la scena, non un numero di build: e
 * quello che rende onesto l'header `immutable`. Cambiare i tag di un articolo
 * cambia il glifo, quindi cambia l'hash, quindi cambia l'URL, e chi ha gia
 * l'immagine vecchia in cache ne chiede una nuova invece di tenersela un anno.
 */
export function coverImagePath(
  variant: CoverVariant,
  version: string,
  translationKey: string
): string {
  return `/images/blog-cover/${variant}/${version}/${translationKey}`;
}
