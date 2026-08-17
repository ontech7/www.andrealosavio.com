import { generateBreadcrumbSchema, schemaToJsonLd } from "@/utils/seo-schema";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaSection } from "./sections/cta-section";
import { HeroSection } from "./sections/hero-section";
import { PracticesSection } from "./sections/practices-section";
import { ScoresSection } from "./sections/scores-section";

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
    title: t("bestPractices.metadata.title"),
    description: t("bestPractices.metadata.description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/best-practices`,
      languages: {
        en: `${siteUrl}/en/best-practices`,
        it: `${siteUrl}/it/best-practices`,
        "x-default": `${siteUrl}/it/best-practices`,
      },
    },
    openGraph: {
      title: t("bestPractices.metadata.title"),
      description: t("bestPractices.metadata.description"),
      url: `${siteUrl}/${locale}/best-practices`,
      type: "article",
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
      title: t("bestPractices.metadata.title"),
      description: t("bestPractices.metadata.description"),
      images: [`${siteUrl}/images/og.jpg`],
    },
  };
}

export default async function BestPracticesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/best-practices`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("common.navigation.home"), url: `${siteUrl}/${locale}` },
    { name: t("bestPractices.metadata.title"), url: pageUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema]),
        }}
      />
      <HeroSection id="hero" scoresId="scores" />
      <ScoresSection id="scores" />
      <PracticesSection id="practices" />
      <CtaSection id="cta" />
    </>
  );
}
