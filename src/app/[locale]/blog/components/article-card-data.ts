import type { BlogTag } from "@/constants/blog";
import { coverImageUrl } from "@/libs/blog/cover-image";
import type { BlogArticle } from "@/libs/blog/source";

/**
 * Il minimo che serve per disegnare una card, in campi serializzabili.
 *
 * L'indice del blog filtra e pagina lato client su tutti gli articoli, quindi
 * questo oggetto attraversa il confine server/client una volta per articolo:
 * e cio che tiene il payload della pagina proporzionale al numero di articoli
 * e non al peso del loro markup.
 */
export interface ArticleCardData {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  readingTime: number;
  tags: readonly BlogTag[];
  seriesPart: number | null;
  coverThumbUrl: string;
  coverHeroUrl: string;
  coverAlt: string;
}

export function toCardData(article: BlogArticle): ArticleCardData {
  const { frontmatter } = article;

  return {
    slug: article.slug,
    title: frontmatter.title,
    subtitle: frontmatter.subtitle,
    publishedAt: frontmatter.publishedAt,
    readingTime: article.readingTime,
    tags: frontmatter.tags,
    seriesPart: frontmatter.series?.part ?? null,
    coverThumbUrl: coverImageUrl(frontmatter, "thumb"),
    coverHeroUrl: coverImageUrl(frontmatter, "hero"),
    coverAlt: frontmatter.coverAlt ?? frontmatter.title,
  };
}
