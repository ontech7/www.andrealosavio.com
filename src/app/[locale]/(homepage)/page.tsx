import { CONTACT_EMAIL, LINKEDIN_URL } from "@/constants/contact";
import { SERVICE_IDS } from "@/constants/services";
import {
  generateOrganizationSchema,
  generatePersonSchema,
  generateProfessionalServiceSchema,
  generateServiceCatalogSchema,
  generateWebSiteSchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import { PageMessages } from "@/libs/i18n/messages";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionConnector } from "./components/section-connector";
import { ContactSection } from "./sections/contact-section";
import { FeedbackSection } from "./sections/feedback-section";
import { HeroSection } from "./sections/hero-section";
import { HowIWorkSection } from "./sections/how-i-work-section";
import { MakingAnImpactSection } from "./sections/making-an-impact-section";
import { ProductsSection } from "./sections/products-section";

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
          alt: "Andrea Losavio - Senior Software Engineer & FDE",
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
  const sameAs = ["https://github.com/ontech7", LINKEDIN_URL];

  const personSchema = generatePersonSchema({
    name: "Andrea Losavio",
    jobTitle: "Senior Software Engineer & FDE",
    url: siteUrl,
    description,
    image: `${siteUrl}/images/og.jpg`,
    email: CONTACT_EMAIL,
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
    email: CONTACT_EMAIL,
    vatID: "IT12705460967",
    founder: { name: "Andrea Losavio", url: siteUrl },
    sameAs,
  });

  const catalogId = `${siteUrl}#catalog`;

  const serviceCatalogSchema = generateServiceCatalogSchema({
    providerId: `${siteUrl}#person`,
    catalogId,
    catalogName: t("common.services.title"),
    services: SERVICE_IDS.map((serviceId) => ({
      name: t(`common.services.items.${serviceId}`),
      url: `${siteUrl}/${locale}#contact`,
    })),
  });

  const professionalServiceSchema = generateProfessionalServiceSchema({
    name: "Andrea Losavio",
    url: `${siteUrl}/${locale}`,
    description,
    founderId: `${siteUrl}#person`,
    catalogId,
    areaServed: ["IT", "EU", "Worldwide"],
    email: CONTACT_EMAIL,
    sameAs: ["https://github.com/ontech7", LINKEDIN_URL],
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
            professionalServiceSchema,
            serviceCatalogSchema,
          ]),
        }}
      />
      <PageMessages namespaces={["homepage"]}>
        <HeroSection id="hero" />
        <HowIWorkSection id="how-i-work" />
        <SectionConnector />
        <MakingAnImpactSection id="impact" />
        <SectionConnector />
        <ProductsSection id="products" />
        <SectionConnector />
        <FeedbackSection id="feedback" />
        <SectionConnector />
        <ContactSection id="contact" />
      </PageMessages>
    </>
  );
}
