import { generateBreadcrumbSchema, schemaToJsonLd } from "@/utils/seo-schema";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.metadata" });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/privacy`,
      languages: {
        en: `${siteUrl}/en/privacy`,
        it: `${siteUrl}/it/privacy`,
        "x-default": `${siteUrl}/it/privacy`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/privacy`,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      alternateLocale: locale === "it" ? "en_US" : "it_IT",
      siteName: "Andrea Losavio",
      images: [
        {
          url: `${siteUrl}/images/og.jpg`,
          width: 1200,
          height: 630,
          alt: "Andrea Losavio - Software Engineer & Tech Partner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${siteUrl}/images/og.jpg`],
    },
  };
}

const sectionKeys = [
  "controller",
  "dataCollected",
  "purpose",
  "legalBasis",
  "dataProcessing",
  "retention",
  "rights",
  "cookies",
  "changes",
] as const;

const listItemKeys: Record<string, { key: string; items: readonly string[] }> =
  {
    dataCollected: {
      key: "items",
      items: ["fullname", "email", "message"],
    },
    purpose: {
      key: "items",
      items: ["respond", "confirmation"],
    },
    rights: {
      key: "items",
      items: [
        "access",
        "rectification",
        "erasure",
        "restriction",
        "portability",
        "objection",
        "withdraw",
      ],
    },
  };

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("metadata.title"), url: `${siteUrl}/${locale}/privacy` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-2 bg-(image:--text-gradient) bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mb-12 text-sm">
          {t("lastUpdated")}
        </p>

        <div className="space-y-8">
          {sectionKeys.map((sectionKey) => (
            <div key={sectionKey}>
              <h2 className="text-foreground mb-3 text-xl font-semibold">
                {t(`sections.${sectionKey}.title`)}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`sections.${sectionKey}.content`)}
              </p>

              {listItemKeys[sectionKey] && (
                <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                  {listItemKeys[sectionKey].items.map((itemKey) => (
                    <li key={itemKey}>
                      {t(
                        `sections.${sectionKey}.${listItemKeys[sectionKey].key}.${itemKey}`
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {sectionKey === "dataCollected" && (
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {t("sections.dataCollected.note")}
                </p>
              )}

              {sectionKey === "rights" && (
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {t("sections.rights.contact")}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
