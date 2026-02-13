import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BestPracticesSection } from "./sections/best-practices-section";
import { CtaSection } from "./sections/cta-section";
import { HeroSection } from "./sections/hero-section";
import { ScoresSection } from "./sections/scores-section";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "bestPractices.metadata",
  });

  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/best-practices`,
      languages: {
        en: `${siteUrl}/en/best-practices`,
        it: `${siteUrl}/it/best-practices`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/best-practices`,
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
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

export default function BestPracticesPage() {
  return (
    <>
      <HeroSection id="hero" />
      <ScoresSection id="scores" />
      <BestPracticesSection id="practices" />
      <CtaSection id="cta" />
    </>
  );
}
