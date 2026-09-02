import type { BlogFrontmatter } from "./frontmatter";

export type CoverVariant = "hero" | "thumb";

export const COVER_RASTER_WIDTH = 1200;
export const COVER_RASTER_HEIGHT = 630;

/** Qualita WebP: sopra 80 il file cresce senza che la scena migliori. */
export const COVER_RASTER_QUALITY = 78;

/**
 * L'URL dell'immagine di copertina da mettere in un `<img>`.
 *
 * Le cover vettoriali, sia quelle disegnate a mano sia le scene generate dallo
 * `translationKey`, passano dalla route che le rasterizza in WebP: cosi non
 * dipendono dai font della pagina e non costano nulla da disegnare. Una cover
 * gia raster nel frontmatter viene servita com'e.
 */
export function coverImageUrl(
  frontmatter: Pick<BlogFrontmatter, "cover" | "translationKey">,
  variant: CoverVariant
): string {
  const { cover, translationKey } = frontmatter;

  if (cover && !cover.endsWith(".svg")) {
    return cover;
  }

  return `/images/blog-cover/${variant}/${translationKey}`;
}
