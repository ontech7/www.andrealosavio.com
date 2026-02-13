import type { Organization, Person, BreadcrumbList } from "schema-dts";

interface GeneratePersonSchemaProps {
  name: string;
  jobTitle: string;
  url: string;
  image?: string;
  sameAs?: string[];
}

interface GenerateOrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate Person schema for Andrea Losavio
 */
export function generatePersonSchema({
  name,
  jobTitle,
  url,
  image,
  sameAs = [],
}: GeneratePersonSchemaProps): Person {
  return {
    "@type": "Person",
    name,
    jobTitle,
    url,
    ...(image && { image }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema({
  name,
  url,
  logo,
  sameAs = [],
}: GenerateOrganizationSchemaProps): Organization {
  return {
    "@type": "Organization",
    name,
    url,
    logo,
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Generate BreadcrumbList schema
 */
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

/**
 * Convert schema object to JSON-LD script string
 */
export function schemaToJsonLd<T>(schema: T): string {
  const jsonLd = {
    "@context": "https://schema.org",
    ...schema,
  };
  return JSON.stringify(jsonLd);
}
