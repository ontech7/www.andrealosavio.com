import { BLOG_TAGS, type BlogTag } from "@/constants/blog";

export interface BlogSeries {
  id: string;
  part: number;
}

export interface BlogFaqEntry {
  q: string;
  a: string;
}

export interface BlogFrontmatter {
  title: string;
  subtitle: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  translationKey: string;
  tags: readonly BlogTag[];
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  series?: BlogSeries;
  takeaways: readonly string[];
  faq?: readonly BlogFaqEntry[];
}

const DESCRIPTION_MIN_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 170;
const TAKEAWAYS_MIN = 2;
const TAKEAWAYS_MAX = 5;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function fail(source: string, message: string): never {
  throw new Error(`[blog] ${source}: ${message}`);
}

function requireString(value: unknown, field: string, source: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    return fail(source, `${field} è obbligatorio e deve essere una stringa`);
  }

  return value.trim();
}

function toIsoDate(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10) === value ? value : null;
}

function parseSeries(value: unknown, source: string): BlogSeries {
  if (typeof value !== "object" || value === null) {
    return fail(source, "series deve essere un oggetto { id, part }");
  }

  const raw = value as Record<string, unknown>;
  const id = requireString(raw.id, "series.id", source);

  if (
    typeof raw.part !== "number" ||
    !Number.isInteger(raw.part) ||
    raw.part < 1
  ) {
    return fail(source, "series.part deve essere un intero maggiore di zero");
  }

  return { id, part: raw.part };
}

function parseFaq(value: unknown, source: string): BlogFaqEntry[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fail(source, "faq deve essere un array non vuoto quando è presente");
  }

  return value.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      return fail(source, `faq[${index}] deve essere un oggetto { q, a }`);
    }

    const raw = entry as Record<string, unknown>;

    return {
      q: requireString(raw.q, `faq[${index}].q`, source),
      a: requireString(raw.a, `faq[${index}].a`, source),
    };
  });
}

/**
 * Valida il frontmatter grezzo di un articolo e lo normalizza.
 * Lancia un errore descrittivo, prefissato dal percorso del file, appena trova
 * un problema: è ciò che fa fallire il build su contenuto malformato.
 */
export function parseFrontmatter(
  data: unknown,
  source: string
): BlogFrontmatter {
  if (typeof data !== "object" || data === null) {
    return fail(source, "frontmatter mancante o non valido");
  }

  const raw = data as Record<string, unknown>;

  const title = requireString(raw.title, "title", source);
  const subtitle = requireString(raw.subtitle, "subtitle", source);
  const description = requireString(raw.description, "description", source);

  if (
    description.length < DESCRIPTION_MIN_LENGTH ||
    description.length > DESCRIPTION_MAX_LENGTH
  ) {
    fail(
      source,
      `description deve essere tra ${DESCRIPTION_MIN_LENGTH} e ${DESCRIPTION_MAX_LENGTH} caratteri, trovati ${description.length}`
    );
  }

  const publishedAt = toIsoDate(raw.publishedAt);

  if (!publishedAt) {
    fail(
      source,
      "publishedAt deve essere una data valida in formato YYYY-MM-DD"
    );
  }

  let updatedAt: string | undefined;

  if (raw.updatedAt !== undefined) {
    const parsed = toIsoDate(raw.updatedAt);

    if (!parsed) {
      fail(
        source,
        "updatedAt deve essere una data valida in formato YYYY-MM-DD"
      );
    }

    if (parsed < publishedAt) {
      fail(source, "updatedAt non può precedere publishedAt");
    }

    updatedAt = parsed;
  }

  const translationKey = requireString(
    raw.translationKey,
    "translationKey",
    source
  );

  if (!Array.isArray(raw.tags) || raw.tags.length === 0) {
    fail(source, "tags deve essere un array non vuoto");
  }

  const tags = raw.tags.map((tag) => {
    if (
      typeof tag !== "string" ||
      !(BLOG_TAGS as readonly string[]).includes(tag)
    ) {
      return fail(
        source,
        `tag "${String(tag)}" non è nel vocabolario: ${BLOG_TAGS.join(", ")}`
      );
    }

    return tag as BlogTag;
  });

  let cover: string | undefined;
  let coverAlt: string | undefined;

  if (raw.cover !== undefined) {
    cover = requireString(raw.cover, "cover", source);
    coverAlt = requireString(
      raw.coverAlt,
      "coverAlt (obbligatorio quando è presente cover)",
      source
    );
  }

  if (
    !Array.isArray(raw.takeaways) ||
    raw.takeaways.length < TAKEAWAYS_MIN ||
    raw.takeaways.length > TAKEAWAYS_MAX
  ) {
    fail(
      source,
      `takeaways deve avere da ${TAKEAWAYS_MIN} a ${TAKEAWAYS_MAX} voci`
    );
  }

  const takeaways = raw.takeaways.map((item, index) =>
    requireString(item, `takeaways[${index}]`, source)
  );

  return {
    title,
    subtitle,
    description,
    publishedAt,
    ...(updatedAt && { updatedAt }),
    translationKey,
    tags,
    ...(cover && { cover, coverAlt }),
    draft: raw.draft === true,
    takeaways,
    ...(raw.series !== undefined && {
      series: parseSeries(raw.series, source),
    }),
    ...(raw.faq !== undefined && { faq: parseFaq(raw.faq, source) }),
  };
}
