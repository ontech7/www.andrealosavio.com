import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  return (
    <>
      <HeroSection id="hero" />
      <BeyondCodeSection id="beyond-code" />
      <ExperiencesSection id="experiences" />
    </>
  );
}
