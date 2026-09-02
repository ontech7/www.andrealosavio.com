import { ContentCta } from "@/components/content-cta";
import { PROJECTS } from "@/constants/projects";
import {
  getCaseStudy,
  getAllCaseStudyParams,
} from "@/libs/case-studies/source";
import { PageMessages } from "@/libs/i18n/messages";
import type { AppLocale } from "@/libs/i18n/utils";
import {
  generateBreadcrumbSchema,
  generateCaseStudySchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CaseStudyHeader } from "./components/case-study-header";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllCaseStudyParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = getCaseStudy(locale as AppLocale, slug);

  if (!caseStudy) {
    return {};
  }

  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/projects/${slug}`;
  const { title, summary, cover, coverAlt } = caseStudy.frontmatter;

  return {
    title: `${title} | Andrea Losavio`,
    description: summary,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${siteUrl}/en/projects/${slug}`,
        it: `${siteUrl}/it/projects/${slug}`,
        "x-default": `${siteUrl}/it/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description: summary,
      url: pageUrl,
      type: "article",
      locale: locale === "it" ? "it_IT" : "en_US",
      alternateLocale: locale === "it" ? "en_US" : "it_IT",
      siteName: "Andrea Losavio",
      images: [
        { url: `${siteUrl}${cover}`, width: 1200, height: 630, alt: coverAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [`${siteUrl}${cover}`],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const caseStudy = getCaseStudy(locale as AppLocale, slug);

  if (!caseStudy) {
    notFound();
  }

  const project = PROJECTS.find(
    (entry) => entry.id === caseStudy.frontmatter.project
  );

  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/projects/${slug}`;
  const name = t(`projects.items.${project.id}.name`);

  const { default: Content } = await import(
    `@content/case-studies/${locale}/${slug}.mdx`
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("common.navigation.home"), url: `${siteUrl}/${locale}` },
    {
      name: t("projects.metadata.title"),
      url: `${siteUrl}/${locale}/projects`,
    },
    { name, url: pageUrl },
  ]);

  const caseStudySchema = generateCaseStudySchema({
    url: pageUrl,
    name: caseStudy.frontmatter.title,
    description: caseStudy.frontmatter.summary,
    datePublished: caseStudy.frontmatter.publishedAt,
    dateModified: caseStudy.frontmatter.updatedAt,
    image: `${siteUrl}${caseStudy.frontmatter.cover}`,
    author: {
      id: `${siteUrl}#person`,
      name: "Andrea Losavio",
      url: siteUrl,
    },
    about: { name, ...(project.websiteUrl && { url: project.websiteUrl }) },
    inLanguage: locale === "it" ? "it-IT" : "en-US",
    keywords: [...project.roles, ...project.tags],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, caseStudySchema]),
        }}
      />
      <PageMessages namespaces={["projects", "blog"]}>
        <CaseStudyHeader
          project={project}
          frontmatter={caseStudy.frontmatter}
        />
        <article className="mx-auto max-w-3xl px-6 pb-20">
          <div className="prose-article">
            <Content />
          </div>
          <ContentCta
            title={t("projects.caseStudy.cta.title")}
            description={t("projects.caseStudy.cta.description")}
            action={t("projects.caseStudy.cta.action")}
          />
        </article>
      </PageMessages>
    </>
  );
}
