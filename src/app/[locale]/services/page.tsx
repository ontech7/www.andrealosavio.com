import {
  generateBreadcrumbSchema,
  generateServiceCatalogSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
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
          alt: "Andrea Losavio - Software Engineer & Tech Partner",
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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("services.metadata.title"), url: pageUrl },
  ]);

  const serviceCatalogSchema = generateServiceCatalogSchema({
    providerName: "Andrea Losavio",
    providerUrl: siteUrl,
    catalogName: t("services.metadata.title"),
    services: [
      {
        name: t("services.availableServices.collaboration.title"),
        description: t("services.availableServices.collaboration.description"),
        url: `${pageUrl}#collaboration`,
      },
      {
        name: t("services.availableServices.validationMvp.title"),
        description: t("services.availableServices.validationMvp.description"),
        url: `${pageUrl}#validationMvp`,
        price: "2500",
        priceCurrency: "EUR",
      },
      {
        name: t("services.availableServices.auditConsulting.title"),
        description: t(
          "services.availableServices.auditConsulting.description"
        ),
        url: `${pageUrl}#auditConsulting`,
        price: "60",
        priceCurrency: "EUR",
      },
      {
        name: t("services.availableServices.fractionalCto.title"),
        description: t("services.availableServices.fractionalCto.description"),
        url: `${pageUrl}#fractionalCto`,
        price: "800",
        priceCurrency: "EUR",
      },
      {
        name: t("services.availableServices.technicalMentorship.title"),
        description: t(
          "services.availableServices.technicalMentorship.description"
        ),
        url: `${pageUrl}#technicalMentorship`,
        price: "55",
        priceCurrency: "EUR",
      },
      {
        name: t("services.availableServices.productDevelopment.title"),
        description: t(
          "services.availableServices.productDevelopment.description"
        ),
        url: `${pageUrl}#productDevelopment`,
        price: "7000",
        priceCurrency: "EUR",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, serviceCatalogSchema]),
        }}
      />
      <HeroSection id="hero" />
      <AvailableServicesSection id="service-list" />
    </>
  );
}
