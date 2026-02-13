import {
  generateOrganizationSchema,
  generatePersonSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FeedbackSection } from "./sections/feedback-section";
import { HeroSection } from "./sections/hero-section";
import { MakingAnImpactSection } from "./sections/making-an-impact-section";
import { QuoteSection } from "./sections/quote-section";
import { YouCouldBeNextSection } from "./sections/you-could-be-next-section";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepage.metadata" });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        it: `${siteUrl}/it`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}`,
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

export default async function HomePage() {
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  const personSchema = generatePersonSchema({
    name: "Andrea Losavio",
    jobTitle: "Software Engineer & Tech Partner",
    url: siteUrl,
    image: `${siteUrl}/images/og.jpg`,
    sameAs: [
      "https://github.com/ontech7",
      "https://www.linkedin.com/in/andrea-losavio/",
    ],
  });

  const organizationSchema = generateOrganizationSchema({
    name: "Andrea Losavio",
    url: siteUrl,
    logo: `${siteUrl}/images/og.jpg`,
    sameAs: [
      "https://github.com/ontech7",
      "https://www.linkedin.com/in/andrea-losavio/",
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd(organizationSchema),
        }}
      />
      <HeroSection id="hero" />
      <MakingAnImpactSection id="making-an-impact" />
      <YouCouldBeNextSection id="you-could-be-next" />
      <FeedbackSection id="feedback" />
      <QuoteSection id="quote" />
    </>
  );
}
