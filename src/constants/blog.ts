export const BLOG_TAGS = [
  "nextjs",
  "react",
  "typescript",
  "performance",
  "seo",
  "architecture",
  "ai",
  "devops",
  "mobile",
  "career",
  "business",
  "freelance",
  "events",
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

/** Quanti articoli mostra una pagina dell'indice del blog. */
export const BLOG_PAGE_SIZE = 6;

/**
 * Quanti articoli recenti entrano nelle superfici che li elencano tutti: il
 * feed RSS e il nodo Blog del JSON-LD. Senza un tetto crescono senza limite
 * con l'archivio, e nessuno dei due consumatori li legge oltre i primi.
 */
export const BLOG_RECENT_SIZE = 20;
