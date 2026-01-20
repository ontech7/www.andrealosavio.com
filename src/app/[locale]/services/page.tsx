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

  return {
    title: t("title"),
    description: t("description"),
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
