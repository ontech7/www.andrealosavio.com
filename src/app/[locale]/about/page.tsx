import { generateBreadcrumbSchema, schemaToJsonLd } from "@/utils/seo-schema";
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
  const t = await getTranslations({ locale, namespace: "about.metadata" });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        en: `${siteUrl}/en/about`,
        it: `${siteUrl}/it/about`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/about`,
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

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("metadata.title"), url: `${siteUrl}/${locale}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />
      {/* Preload images for faster rendering */}
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
