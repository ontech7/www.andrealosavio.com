import {
  generateBreadcrumbSchema,
  generatePersonSchema,
  generateProfilePageSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EXPERIENCE_ITEMS } from "./constants/experience-items";
import { HOBBY_ITEMS } from "./constants/hobby-items";
import { SKILL_ITEMS } from "./constants/skill-items";
import { BeyondCodeSection } from "./sections/beyond-code-section";
import { ExperiencesSection } from "./sections/experiences-section";
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
    title: t("about.metadata.title"),
    description: t("about.metadata.description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        en: `${siteUrl}/en/about`,
        it: `${siteUrl}/it/about`,
        "x-default": `${siteUrl}/it/about`,
      },
    },
    openGraph: {
      title: t("about.metadata.title"),
      description: t("about.metadata.description"),
      url: `${siteUrl}/${locale}/about`,
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
      title: t("about.metadata.title"),
      description: t("about.metadata.description"),
      images: [`${siteUrl}/images/og.jpg`],
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/about`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("about.metadata.title"), url: pageUrl },
  ]);

  const personSchema = generatePersonSchema({
    name: "Andrea Losavio",
    jobTitle: "Software Engineer & Tech Partner",
    url: siteUrl,
    description: t("about.metadata.description"),
    image: `${siteUrl}/images/og.jpg`,
    email: "business@andrealosavio.com",
    nationality: "Italian",
    alumniOf: [
      { name: "Politecnico di Milano", url: "https://www.polimi.it/" },
    ],
    knowsAbout: SKILL_ITEMS.map((s) => s.name),
    knowsLanguage: ["Italian", "English"],
    address: { addressCountry: "IT" },
    sameAs: [
      "https://github.com/ontech7",
      "https://www.linkedin.com/in/andrea-losavio/",
    ],
    worksFor: { name: "Andrea Losavio", url: siteUrl },
  });

  const profilePageSchema = generateProfilePageSchema({
    url: pageUrl,
    name: t("about.metadata.title"),
    description: t("about.metadata.description"),
    mainEntityPersonId: `${siteUrl}#person`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([
            breadcrumbSchema,
            personSchema,
            profilePageSchema,
          ]),
        }}
      />
      {HOBBY_ITEMS.map((hobby) => (
        <link
          key={hobby.id}
          rel="preload"
          href={hobby.image}
          as="image"
          type="image/png"
        />
      ))}
      {EXPERIENCE_ITEMS.map((experience) => (
        <link
          key={experience.id}
          rel="preload"
          href={experience.logo}
          as="image"
          type="image/svg+xml"
        />
      ))}
      {SKILL_ITEMS.map((skill) => (
        <link
          key={skill.name}
          rel="preload"
          href={skill.icon}
          as="image"
          type="image/svg+xml"
        />
      ))}
      <HeroSection id="hero" />
      <BeyondCodeSection id="beyond-code" />
      <ExperiencesSection id="experiences" />
    </>
  );
}
