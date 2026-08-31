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
