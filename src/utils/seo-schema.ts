import type {
  Blog,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  ItemList,
  OfferCatalog,
  Organization,
  Person,
  ProfessionalService,
  ProfilePage,
  Service,
  WebSite,
} from "schema-dts";

interface GeneratePersonSchemaProps {
  name: string;
  jobTitle: string;
  url: string;
  description?: string;
  image?: string;
  email?: string;
  telephone?: string;
  nationality?: string;
  alumniOf?: { name: string; url?: string }[];
  knowsAbout?: string[];
  knowsLanguage?: string[];
  address?: {
    addressCountry: string;
    addressRegion?: string;
    addressLocality?: string;
  };
  sameAs?: string[];
  worksFor?: { name: string; url?: string };
}

export function generatePersonSchema({
  name,
  jobTitle,
  url,
  description,
  image,
  email,
  telephone,
  nationality,
  alumniOf,
  knowsAbout,
  knowsLanguage,
  address,
  sameAs = [],
  worksFor,
}: GeneratePersonSchemaProps): Person {
  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name,
    jobTitle,
    url,
    ...(description && { description }),
    ...(image && { image }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(nationality && { nationality }),
    ...(alumniOf && {
      alumniOf: alumniOf.map((a) => ({
        "@type": "EducationalOrganization" as const,
        name: a.name,
        ...(a.url && { url: a.url }),
      })),
    }),
    ...(knowsAbout && knowsAbout.length > 0 && { knowsAbout }),
    ...(knowsLanguage && knowsLanguage.length > 0 && { knowsLanguage }),
    ...(address && {
      address: {
        "@type": "PostalAddress" as const,
        ...address,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(worksFor && {
      worksFor: {
        "@type": "Organization" as const,
        name: worksFor.name,
        ...(worksFor.url && { url: worksFor.url }),
      },
    }),
  };
}

interface GenerateOrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description?: string;
  email?: string;
  vatID?: string;
  founder?: { name: string; url?: string };
  sameAs?: string[];
}

export function generateOrganizationSchema({
  name,
  url,
  logo,
  description,
  email,
  vatID,
  founder,
  sameAs = [],
}: GenerateOrganizationSchemaProps): Organization {
  return {
    "@type": "Organization",
    "@id": `${url}#organization`,
    name,
    url,
    logo,
    ...(description && { description }),
    ...(email && { email }),
    ...(vatID && { vatID }),
    ...(founder && {
      founder: {
        "@type": "Person" as const,
        name: founder.name,
        ...(founder.url && { url: founder.url }),
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

interface GenerateWebSiteSchemaProps {
  name: string;
  url: string;
  description?: string;
  inLanguage?: string | string[];
  publisher?: { name: string; url: string };
}

export function generateWebSiteSchema({
  name,
  url,
  description,
  inLanguage,
  publisher,
}: GenerateWebSiteSchemaProps): WebSite {
  return {
    "@type": "WebSite",
    "@id": `${url}#website`,
    name,
    url,
    ...(description && { description }),
    ...(inLanguage && { inLanguage }),
    ...(publisher && {
      publisher: {
        "@type": "Organization" as const,
        name: publisher.name,
        url: publisher.url,
      },
    }),
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface ServiceOffer {
  name: string;
  description?: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
}

interface GenerateServiceCatalogSchemaProps {
  providerId: string;
  catalogName: string;
  catalogId: string;
  services: ServiceOffer[];
}

export function generateServiceCatalogSchema({
  providerId,
  catalogName,
  catalogId,
  services,
}: GenerateServiceCatalogSchemaProps): OfferCatalog {
  return {
    "@type": "OfferCatalog",
    "@id": catalogId,
    name: catalogName,
    itemListElement: services.map((s) => ({
      "@type": "Offer" as const,
      ...(s.price && {
        price: s.price,
        priceCurrency: s.priceCurrency ?? "EUR",
      }),
      itemOffered: {
        "@type": "Service" as const,
        name: s.name,
        ...(s.description && { description: s.description }),
        ...(s.url && { url: s.url }),
        provider: { "@id": providerId },
      },
    })),
  };
}

interface GenerateProfessionalServiceSchemaProps {
  name: string;
  url: string;
  description: string;
  founderId: string;
  catalogId: string;
  areaServed?: string[];
  priceRange?: string;
  email?: string;
  sameAs?: string[];
}

/**
 * The business entity behind the freelance work. Ties the offer catalog and the
 * `Person` entity declared on the homepage into one connected graph.
 */
export function generateProfessionalServiceSchema({
  name,
  url,
  description,
  founderId,
  catalogId,
  areaServed,
  priceRange,
  email,
  sameAs = [],
}: GenerateProfessionalServiceSchemaProps): ProfessionalService {
  return {
    "@type": "ProfessionalService",
    "@id": `${url}#professionalservice`,
    name,
    url,
    description,
    founder: { "@id": founderId },
    hasOfferCatalog: { "@id": catalogId },
    ...(areaServed && areaServed.length > 0 && { areaServed }),
    ...(priceRange && { priceRange }),
    ...(email && { email }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Standalone Service schema (one service)
 */
export function generateServiceSchema({
  name,
  description,
  providerName,
  providerUrl,
  url,
  areaServed,
  serviceType,
}: {
  name: string;
  description: string;
  providerName: string;
  providerUrl: string;
  url?: string;
  areaServed?: string;
  serviceType?: string;
}): Service {
  return {
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Person" as const,
      name: providerName,
      url: providerUrl,
    },
    ...(url && { url }),
    ...(areaServed && { areaServed }),
    ...(serviceType && { serviceType }),
  };
}

interface ItemListEntry {
  name: string;
  description?: string;
  url?: string;
  image?: string;
}

export function generateItemListSchema({
  name,
  description,
  items,
}: {
  name: string;
  description?: string;
  items: ItemListEntry[];
}): ItemList {
  return {
    "@type": "ItemList",
    name,
    ...(description && { description }),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      item: {
        "@type": "CreativeWork" as const,
        name: item.name,
        ...(item.description && { description: item.description }),
        ...(item.url && { url: item.url }),
        ...(item.image && { image: item.image }),
      },
    })),
  };
}

export function generateProfilePageSchema({
  url,
  name,
  description,
  mainEntityPersonId,
}: {
  url: string;
  name: string;
  description: string;
  mainEntityPersonId: string;
}): ProfilePage {
  return {
    "@type": "ProfilePage",
    url,
    name,
    description,
    mainEntity: { "@id": mainEntityPersonId },
  };
}

interface SchemaEntityReference {
  id: string;
  name: string;
  url: string;
}

function toIsoDateTime(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00Z`;
}

interface GenerateBlogPostingSchemaProps {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  author: SchemaEntityReference;
  publisher: SchemaEntityReference;
  inLanguage: string;
  keywords: readonly string[];
  wordCount: number;
}

/**
 * Schema di un singolo articolo.
 *
 * `author` e `publisher` sono inlineati con nome e url, non ridotti a un
 * `@id` verso la homepage: ogni pagina viene valutata da sola dai crawler, e
 * un riferimento che punta a un nodo dichiarato altrove risulta privo di
 * `name` e `url`. L'`@id` resta, cosi le entita restano le stesse.
 */
export function generateBlogPostingSchema({
  url,
  headline,
  description,
  datePublished,
  dateModified,
  image,
  author,
  publisher,
  inLanguage,
  keywords,
  wordCount,
}: GenerateBlogPostingSchemaProps): BlogPosting {
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline,
    description,
    datePublished: toIsoDateTime(datePublished),
    dateModified: toIsoDateTime(dateModified ?? datePublished),
    image,
    author: {
      "@type": "Person",
      "@id": author.id,
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": publisher.id,
      name: publisher.name,
      url: publisher.url,
    },
    inLanguage,
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
    wordCount,
  };
}

/**
 * FAQPage, emesso solo quando l'articolo dichiara domande nel frontmatter.
 */
export function generateFaqSchema(
  entries: readonly { q: string; a: string }[]
): FAQPage {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question" as const,
      name: entry.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: entry.a,
      },
    })),
  };
}

interface GenerateBlogSchemaProps {
  url: string;
  name: string;
  description: string;
  author: SchemaEntityReference;
  inLanguage: string;
  posts: readonly { url: string; headline: string; datePublished: string }[];
}

/**
 * Schema dell'indice del blog, con i post elencati come BlogPosting ridotti.
 * `author` e inlineato per la stessa ragione di `generateBlogPostingSchema`.
 */
export function generateBlogSchema({
  url,
  name,
  description,
  author,
  inLanguage,
  posts,
}: GenerateBlogSchemaProps): Blog {
  return {
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name,
    description,
    inLanguage,
    author: {
      "@type": "Person",
      "@id": author.id,
      name: author.name,
      url: author.url,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting" as const,
      "@id": `${post.url}#article`,
      url: post.url,
      headline: post.headline,
      datePublished: toIsoDateTime(post.datePublished),
    })),
  };
}

export function schemaToJsonLd<T>(schema: T | T[]): string {
  if (Array.isArray(schema)) {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schema,
    });
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    ...schema,
  });
}
