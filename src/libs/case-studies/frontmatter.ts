export interface CaseStudyFrontmatter {
  project: string;
  title: string;
  summary: string;
  period: string;
  publishedAt: string;
  updatedAt?: string;
  cover: string;
  coverAlt: string;
  draft: boolean;
}

const SUMMARY_MIN_LENGTH = 120;
const SUMMARY_MAX_LENGTH = 170;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_COVER_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"];

function fail(source: string, message: string): never {
  throw new Error(`[case-studies] ${source}: ${message}`);
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

/**
 * Valida il frontmatter grezzo di un case study e lo normalizza. Lancia un
 * errore prefissato dal percorso del file al primo campo malformato: è ciò
 * che fa fallire il build invece di spedire metadati sbagliati.
 *
 * `period` è una stringa libera ("2024 — oggi", "primavera 2023"): è un
 * intervallo leggibile, non una data da confrontare.
 */
export function parseFrontmatter(
  data: unknown,
  source: string
): CaseStudyFrontmatter {
  if (typeof data !== "object" || data === null) {
    return fail(source, "frontmatter mancante o non valido");
  }

  const raw = data as Record<string, unknown>;

  const project = requireString(raw.project, "project", source);
  const title = requireString(raw.title, "title", source);
  const summary = requireString(raw.summary, "summary", source);

  if (
    summary.length < SUMMARY_MIN_LENGTH ||
    summary.length > SUMMARY_MAX_LENGTH
  ) {
    fail(
      source,
      `summary deve essere tra ${SUMMARY_MIN_LENGTH} e ${SUMMARY_MAX_LENGTH} caratteri, trovati ${summary.length}`
    );
  }

  const period = requireString(raw.period, "period", source);
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

  if (raw.draft !== undefined && typeof raw.draft !== "boolean") {
    fail(source, "draft deve essere true o false");
  }

  const cover = requireString(raw.cover, "cover", source);

  if (
    !ALLOWED_COVER_EXTENSIONS.some((extension) =>
      cover.toLowerCase().endsWith(extension)
    )
  ) {
    fail(
      source,
      `cover deve avere estensione ${ALLOWED_COVER_EXTENSIONS.join(", ")}: le piattaforme social non renderizzano SVG e la cover di un case study è una schermata reale`
    );
  }

  const coverAlt = requireString(
    raw.coverAlt,
    "coverAlt (obbligatorio, non opzionale come nel blog)",
    source
  );

  return {
    project,
    title,
    summary,
    period,
    publishedAt,
    ...(updatedAt && { updatedAt }),
    cover,
    coverAlt,
    draft: raw.draft === true,
  };
}
