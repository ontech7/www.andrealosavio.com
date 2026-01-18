import { FileUserIcon, GithubIcon, LinkedinIcon } from "lucide-react";

export const NAV_LINKS = [
  { href: "/", labelKey: "navigation.home" },
  { href: "/services", labelKey: "navigation.services" },
  { href: "/projects", labelKey: "navigation.projects" },
  { href: "/about", labelKey: "navigation.about" },
] as const;

export const FOOTER_LINKS = {
  general: {
    titleKey: "footer.sections.general",
    links: [
      { href: "/", labelKey: "footer.links.homepage" },
      { href: "/services", labelKey: "navigation.services" },
      { href: "/projects", labelKey: "navigation.projects" },
      { href: "/about", labelKey: "navigation.about" },
    ],
  },
  services: {
    titleKey: "footer.sections.services",
    links: [
      {
        href: "/services#validation-mvp",
        labelKey: "footer.links.validationMvp",
      },
      {
        href: "/services#audit-consulting",
        labelKey: "footer.links.auditConsulting",
      },
      {
        href: "/services#fractional-cto",
        labelKey: "footer.links.fractionalCto",
      },
      {
        href: "/services#technical-mentorship",
        labelKey: "footer.links.technicalMentorship",
      },
      {
        href: "/services#product-development",
        labelKey: "footer.links.productDevelopment",
      },
    ],
  },
  projects: {
    titleKey: "footer.sections.projects",
    links: [
      { href: "/projects#personal", labelKey: "footer.links.personalIdeas" },
      { href: "/projects#clients", labelKey: "footer.links.forClients" },
    ],
  },
} as const;

export const SOCIAL_LINKS = [
  {
    href: "https://github.com/ontech7",
    labelKey: "social.github",
    Icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/andrea-losavio/",
    labelKey: "social.linkedin",
    Icon: LinkedinIcon,
  },
  {
    href: "/documents/AndreaLosavio_CV_{lang}.pdf",
    labelKey: "social.cv",
    Icon: FileUserIcon,
  },
] as const;

export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "it", label: "IT" },
] as const;
