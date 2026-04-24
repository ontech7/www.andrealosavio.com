import { PROJECTS } from "@/constants/projects";
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { HeroSection } from "./sections/hero-section";
import { ProjectsSection } from "./sections/projects-section";

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
    title: t("projects.metadata.title"),
    description: t("projects.metadata.description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/projects`,
      languages: {
        en: `${siteUrl}/en/projects`,
        it: `${siteUrl}/it/projects`,
        "x-default": `${siteUrl}/it/projects`,
      },
    },
    openGraph: {
      title: t("projects.metadata.title"),
      description: t("projects.metadata.description"),
      url: `${siteUrl}/${locale}/projects`,
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
      title: t("projects.metadata.title"),
      description: t("projects.metadata.description"),
      images: [`${siteUrl}/images/og.jpg`],
    },
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const tItems = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/projects`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/${locale}` },
    { name: t("projects.metadata.title"), url: pageUrl },
  ]);

  const itemListSchema = generateItemListSchema({
    name: t("projects.metadata.title"),
    description: t("projects.metadata.description"),
    items: PROJECTS.map((project) => ({
      name: tItems(`projects.items.${project.id}.name` as never),
      description: tItems(`projects.items.${project.id}.description` as never),
      url:
        project.websiteUrl ?? project.githubUrl ?? project.designUrl ?? pageUrl,
      image: `${siteUrl}${project.image}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, itemListSchema]),
        }}
      />
      <HeroSection id="hero" />
      <Suspense>
        <ProjectsSection id="projects" />
      </Suspense>
    </>
  );
}
