import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PROJECTS } from "@/constants/projects";
import { locales, type AppLocale } from "@/libs/i18n/utils";
import { parseFrontmatter, type CaseStudyFrontmatter } from "./frontmatter";

export interface CaseStudy {
  slug: string;
  locale: AppLocale;
  frontmatter: CaseStudyFrontmatter;
  body: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "case-studies");

function readForLocale(locale: AppLocale): CaseStudy[] {
  const directory = path.join(CONTENT_ROOT, locale);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const parsed = matter(
        fs.readFileSync(path.join(directory, file), "utf8")
      );

      return {
        slug: file.replace(/\.mdx$/, ""),
        locale,
        frontmatter: parseFrontmatter(parsed.data, `${locale}/${file}`),
        body: parsed.content,
      };
    });
}

/**
 * Invarianti che coinvolgono piu file: ogni case study pubblicato ha il
 * gemello nell'altra lingua sotto lo stesso slug, punta a un progetto che
 * esiste, ed e l'unico a puntare a quel progetto. Le bozze sono escluse.
 */
export function assertConsistency(
  byLocale: Record<AppLocale, CaseStudy[]>,
  projectIds: readonly string[]
): void {
  const slugsByLocale = {} as Record<AppLocale, Set<string>>;

  for (const locale of locales) {
    const slugs = new Set<string>();
    const projects = new Set<string>();

    for (const caseStudy of byLocale[locale] ?? []) {
      if (caseStudy.frontmatter.draft) {
        continue;
      }

      const { project } = caseStudy.frontmatter;

      if (!projectIds.includes(project)) {
        throw new Error(
          `[case-studies] ${locale}/${caseStudy.slug}.mdx: project "${project}" non esiste in PROJECTS`
        );
      }

      if (projects.has(project)) {
        throw new Error(
          `[case-studies] il progetto "${project}" ha piu di un case study nel locale "${locale}"`
        );
      }

      projects.add(project);
      slugs.add(caseStudy.slug);
    }

    slugsByLocale[locale] = slugs;
  }

  for (const locale of locales) {
    for (const slug of slugsByLocale[locale]) {
      for (const other of locales) {
        if (other !== locale && !slugsByLocale[other].has(slug)) {
          throw new Error(
            `[case-studies] "${slug}" esiste in "${locale}" ma manca in "${other}"`
          );
        }
      }
    }
  }
}

let cache: Record<AppLocale, CaseStudy[]> | null = null;

function loadAll(): Record<AppLocale, CaseStudy[]> {
  if (cache) {
    return cache;
  }

  const loaded = {} as Record<AppLocale, CaseStudy[]>;

  for (const locale of locales) {
    loaded[locale] = readForLocale(locale);
  }

  assertConsistency(
    loaded,
    PROJECTS.map((project) => project.id)
  );
  cache = loaded;

  return cache;
}

function isVisible(caseStudy: CaseStudy): boolean {
  return (
    !caseStudy.frontmatter.draft || process.env.NODE_ENV === "development"
  );
}

/** Case study visibili di un locale. Le bozze compaiono solo in sviluppo. */
export function getCaseStudies(locale: AppLocale): CaseStudy[] {
  return loadAll()[locale].filter(isVisible);
}

export function getCaseStudy(
  locale: AppLocale,
  slug: string
): CaseStudy | null {
  return getCaseStudies(locale).find((entry) => entry.slug === slug) ?? null;
}

/** Il case study di un progetto, se esiste. Alimenta il link sulla card. */
export function getCaseStudyForProject(
  locale: AppLocale,
  projectId: string
): CaseStudy | null {
  return (
    getCaseStudies(locale).find(
      (entry) => entry.frontmatter.project === projectId
    ) ?? null
  );
}

/** Coppie locale/slug per generateStaticParams. */
export function getAllCaseStudyParams(): {
  locale: AppLocale;
  slug: string;
}[] {
  return locales.flatMap((locale) =>
    getCaseStudies(locale).map((entry) => ({ locale, slug: entry.slug }))
  );
}
