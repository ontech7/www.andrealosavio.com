import type {
  BreadcrumbList,
  ItemList,
  OfferCatalog,
  Organization,
  Person,
  ProfilePage,
  Service,
  WebSite,
} from "schema-dts";

/* -------------------------------------------------------------------------- */
/*  Person                                                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Organization                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  WebSite (enables brand association + potential search box in sitelinks)   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Breadcrumb                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Service / OfferCatalog (for /services page)                               */
/* -------------------------------------------------------------------------- */

interface ServiceOffer {
  name: string;
  description: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
}

interface GenerateServiceCatalogSchemaProps {
  providerName: string;
  providerUrl: string;
  catalogName: string;
  services: ServiceOffer[];
}

export function generateServiceCatalogSchema({
  providerName,
  providerUrl,
  catalogName,
  services,
}: GenerateServiceCatalogSchemaProps): OfferCatalog {
  return {
    "@type": "OfferCatalog",
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
        description: s.description,
        ...(s.url && { url: s.url }),
        provider: {
          "@type": "Person" as const,
          name: providerName,
          url: providerUrl,
        },
      },
    })),
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

/* -------------------------------------------------------------------------- */
/*  ItemList (for /projects page)                                             */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  ProfilePage (for /about page)                                             */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  JSON-LD rendering                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Convert a schema object (or array of schemas) to a JSON-LD string.
 * When an array is passed, emits a single `@graph` block — which is the
 * recommended way to declare multiple connected entities on a single page
 * (e.g. Person + Organization + WebSite on the homepage).
 */
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
