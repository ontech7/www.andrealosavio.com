import { CONTACT_EMAIL, LINKEDIN_URL } from "@/constants/contact";
import { SERVICES } from "@/constants/services";
import {
  generateBreadcrumbSchema,
  generateProfessionalServiceSchema,
  generateServiceCatalogSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import { PageMessages } from "@/libs/i18n/messages";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AvailableServicesSection } from "./sections/available-services-section";
import { HeroSection } from "./sections/hero-section";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("services.metadata.title"),
    description: t("services.metadata.description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/services`,
      languages: {
        en: `${siteUrl}/en/services`,
        it: `${siteUrl}/it/services`,
        "x-default": `${siteUrl}/it/services`,
      },
    },
    openGraph: {
      title: t("services.metadata.title"),
      description: t("services.metadata.description"),
      url: `${siteUrl}/${locale}/services`,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      alternateLocale: locale === "it" ? "en_US" : "it_IT",
      siteName: "Andrea Losavio",
      images: [
        {
          url: `${siteUrl}/images/og.jpg`,
          width: 1200,
          height: 630,
          alt: "Andrea Losavio - Senior Software Engineer & FDE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("services.metadata.title"),
      description: t("services.metadata.description"),
      images: [`${siteUrl}/images/og.jpg`],
    },
  };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/services`;

  const catalogId = `${pageUrl}#catalog`;
  const personId = `${siteUrl}#person`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("common.navigation.home"), url: `${siteUrl}/${locale}` },
    { name: t("services.availableServices.sectionTitle"), url: pageUrl },
  ]);

  const serviceCatalogSchema = generateServiceCatalogSchema({
    providerId: personId,
    catalogId,
    catalogName: t("services.availableServices.sectionTitle"),
    services: SERVICES.map((service) => ({
      name: t(`services.availableServices.${service.id}.title`),
      description: t(`services.availableServices.${service.id}.description`),
      url: `${pageUrl}#${service.id}`,
      ...(service.price && {
        price: String(service.price.amount),
        priceCurrency: "EUR",
      }),
    })),
  });

  const professionalServiceSchema = generateProfessionalServiceSchema({
    name: "Andrea Losavio",
    url: pageUrl,
    description: t("services.metadata.description"),
    founderId: personId,
    catalogId,
    areaServed: ["IT", "EU", "Worldwide"],
    priceRange: "€€",
    email: CONTACT_EMAIL,
    sameAs: ["https://github.com/ontech7", LINKEDIN_URL],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([
            breadcrumbSchema,
            professionalServiceSchema,
            serviceCatalogSchema,
          ]),
        }}
      />
      <PageMessages namespaces={["services"]}>
        <HeroSection id="hero" />
        <AvailableServicesSection id="service-list" />
      </PageMessages>
    </>
  );
}
