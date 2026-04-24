import {
  generateOrganizationSchema,
  generatePersonSchema,
  generateWebSiteSchema,
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
  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("homepage.metadata.title"),
    description: t("homepage.metadata.description"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        it: `${siteUrl}/it`,
        "x-default": `${siteUrl}/it`,
      },
    },
    openGraph: {
      title: t("homepage.metadata.title"),
      description: t("homepage.metadata.description"),
      url: `${siteUrl}/${locale}`,
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
      title: t("homepage.metadata.title"),
      description: t("homepage.metadata.description"),
      images: [`${siteUrl}/images/og.jpg`],
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  const description = t("homepage.metadata.description");
  const sameAs = [
    "https://github.com/ontech7",
    "https://www.linkedin.com/in/andrea-losavio/",
  ];

  const personSchema = generatePersonSchema({
    name: "Andrea Losavio",
    jobTitle: "Software Engineer & Tech Partner",
    url: siteUrl,
    description,
    image: `${siteUrl}/images/og.jpg`,
    email: "business@andrealosavio.com",
    nationality: "Italian",
    alumniOf: [
      {
        name: "Politecnico di Milano",
        url: "https://www.polimi.it/",
      },
    ],
    knowsAbout: [
      "Software Engineering",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "React Native",
      "Expo",
      "Adobe Experience Manager",
      "Technical Leadership",
      "Fractional CTO",
      "MVP Development",
      "Product Development",
    ],
    knowsLanguage: ["Italian", "English"],
    address: {
      addressCountry: "IT",
    },
    sameAs,
    worksFor: {
      name: "Andrea Losavio",
      url: siteUrl,
    },
  });

  const organizationSchema = generateOrganizationSchema({
    name: "Andrea Losavio",
    url: siteUrl,
    logo: `${siteUrl}/images/og.jpg`,
    description,
    email: "business@andrealosavio.com",
    vatID: "IT12705460967",
    founder: { name: "Andrea Losavio", url: siteUrl },
    sameAs,
  });

  const webSiteSchema = generateWebSiteSchema({
    name: "Andrea Losavio",
    url: siteUrl,
    description,
    inLanguage: ["it-IT", "en-US"],
    publisher: { name: "Andrea Losavio", url: siteUrl },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([
            personSchema,
            organizationSchema,
            webSiteSchema,
          ]),
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
