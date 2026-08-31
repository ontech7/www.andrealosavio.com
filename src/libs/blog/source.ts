import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogTag } from "@/constants/blog";
import { locales, type AppLocale } from "@/libs/i18n/utils";
import { parseFrontmatter, type BlogFrontmatter } from "./frontmatter";
import { countProseWords, readingTimeMinutes } from "./reading-time";
import { extractToc, type TocEntry } from "./toc";

export interface BlogArticle {
  slug: string;
  locale: AppLocale;
  frontmatter: BlogFrontmatter;
  body: string;
  readingTime: number;
  wordCount: number;
  toc: TocEntry[];
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "blog");

function readArticlesForLocale(locale: AppLocale): BlogArticle[] {
  const directory = path.join(CONTENT_ROOT, locale);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const source = `${locale}/${file}`;
      const parsed = matter(
        fs.readFileSync(path.join(directory, file), "utf8")
      );

      return {
        slug,
        locale,
        frontmatter: parseFrontmatter(parsed.data, source),
        body: parsed.content,
        readingTime: readingTimeMinutes(parsed.content),
        wordCount: countProseWords(parsed.content),
        toc: extractToc(parsed.content),
      };
    });
}

/**
 * Verifica gli invarianti che coinvolgono piu file: ogni articolo pubblicato
 * deve avere esattamente una controparte per locale, e nessun translationKey
 * puo ripetersi dentro lo stesso locale. Le bozze sono escluse dal controllo.
 */
export function assertConsistency(
  byLocale: Record<AppLocale, BlogArticle[]>
): void {
  const keysByLocale = {} as Record<AppLocale, Set<string>>;

  for (const locale of locales) {
    const seen = new Set<string>();

    for (const article of byLocale[locale] ?? []) {
      if (article.frontmatter.draft) {
        continue;
      }

      const key = article.frontmatter.translationKey;

      if (seen.has(key)) {
        throw new Error(
          `[blog] translationKey "${key}" usato da piu articoli nel locale "${locale}"`
        );
      }

      seen.add(key);
    }

    keysByLocale[locale] = seen;
  }

  for (const locale of locales) {
    for (const key of keysByLocale[locale]) {
      for (const other of locales) {
        if (other !== locale && !keysByLocale[other].has(key)) {
          throw new Error(
            `[blog] translationKey "${key}" esiste in "${locale}" ma manca in "${other}"`
          );
        }
      }
    }
  }
}

let cache: Record<AppLocale, BlogArticle[]> | null = null;

function loadAll(): Record<AppLocale, BlogArticle[]> {
  if (cache) {
    return cache;
  }

  const loaded = {} as Record<AppLocale, BlogArticle[]>;

  for (const locale of locales) {
    loaded[locale] = readArticlesForLocale(locale);
  }

  assertConsistency(loaded);
  cache = loaded;

  return cache;
}

function isVisible(article: BlogArticle): boolean {
  return !article.frontmatter.draft || process.env.NODE_ENV === "development";
}

function byNewestFirst(a: BlogArticle, b: BlogArticle): number {
  return b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt);
}

/**
 * Articoli visibili di un locale, dal piu recente. Le bozze compaiono solo in
 * sviluppo.
 */
export function getArticles(locale: AppLocale): BlogArticle[] {
  return loadAll()[locale].filter(isVisible).sort(byNewestFirst);
}

export function getArticle(
  locale: AppLocale,
  slug: string
): BlogArticle | null {
  return getArticles(locale).find((article) => article.slug === slug) ?? null;
}

/**
 * Slug della controparte nell'altra lingua, per hreflang e language switcher.
 */
export function getTranslatedSlug(
  translationKey: string,
  locale: AppLocale
): string | null {
  return (
    getArticles(locale).find(
      (article) => article.frontmatter.translationKey === translationKey
    )?.slug ?? null
  );
}

/**
 * Ordina i candidati per numero di tag in comune e poi per data. Se nessuno
 * condivide un tag, ripiega sui piu recenti.
 */
export function selectRelated(
  article: BlogArticle,
  candidates: BlogArticle[],
  limit: number
): BlogArticle[] {
  const others = candidates.filter(
    (candidate) => candidate.slug !== article.slug
  );

  const scored = others
    .map((candidate) => ({
      candidate,
      shared: candidate.frontmatter.tags.filter((tag) =>
        article.frontmatter.tags.includes(tag)
      ).length,
    }))
    .filter((entry) => entry.shared > 0)
    .sort(
      (a, b) => b.shared - a.shared || byNewestFirst(a.candidate, b.candidate)
    )
    .map((entry) => entry.candidate);

  return scored.length > 0
    ? scored.slice(0, limit)
    : others.sort(byNewestFirst).slice(0, limit);
}

export function getRelatedArticles(
  article: BlogArticle,
  limit = 3
): BlogArticle[] {
  return selectRelated(article, getArticles(article.locale), limit);
}

/**
 * Articoli della stessa serie, ordinati per numero di parte.
 */
export function getSeriesArticles(
  seriesId: string,
  locale: AppLocale
): BlogArticle[] {
  return getArticles(locale)
    .filter((article) => article.frontmatter.series?.id === seriesId)
    .sort(
      (a, b) =>
        (a.frontmatter.series?.part ?? 0) - (b.frontmatter.series?.part ?? 0)
    );
}

/**
 * Coppie locale/slug per generateStaticParams.
 */
export function getAllArticleParams(): { locale: AppLocale; slug: string }[] {
  return locales.flatMap((locale) =>
    getArticles(locale).map((article) => ({ locale, slug: article.slug }))
  );
}

/**
 * Tag effettivamente usati in un locale, nell'ordine del vocabolario.
 */
export function getUsedTags(locale: AppLocale): BlogTag[] {
  const used = new Set<BlogTag>();

  for (const article of getArticles(locale)) {
    for (const tag of article.frontmatter.tags) {
      used.add(tag);
    }
  }

  return [...used];
}
