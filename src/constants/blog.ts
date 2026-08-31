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

export const BLOG_KINDS = ["tech", "business", "hybrid", "event"] as const;

export type BlogKind = (typeof BLOG_KINDS)[number];
