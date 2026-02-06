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
  const t = await getTranslations({ locale, namespace: "services.metadata" });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/services`,
      languages: {
        en: `${siteUrl}/en/services`,
        it: `${siteUrl}/it/services`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/services`,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      siteName: "Andrea Losavio",
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function ServicesPage() {
  return (
    <>
      <HeroSection id="hero" />
      <AvailableServicesSection id="service-list" />
    </>
  );
}
