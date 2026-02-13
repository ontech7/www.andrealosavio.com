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
  const t = await getTranslations({ locale, namespace: "projects.metadata" });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/projects`,
      languages: {
        en: `${siteUrl}/en/projects`,
        it: `${siteUrl}/it/projects`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/projects`,
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

export default async function ProjectsPage() {
  return (
    <>
      <HeroSection id="hero" />
      <Suspense>
        <ProjectsSection id="projects" />
      </Suspense>
    </>
  );
}
