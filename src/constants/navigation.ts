import { FileUserIcon, GithubIcon, LinkedinIcon } from "lucide-react";

export type NavLink = {
  readonly href: string;
  readonly labelKey: string;
  readonly external?: boolean;
};

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/", labelKey: "navigation.home" },
  { href: "/projects", labelKey: "navigation.projects" },
  { href: "/blog", labelKey: "navigation.blog" },
  { href: "/about", labelKey: "navigation.about" },
] as const;

export const CONTACT_HREF = "/#contact";

export const FOOTER_LINKS = {
  general: {
    titleKey: "footer.sections.general",
    links: [
      { href: "/", labelKey: "footer.links.homepage" },
      { href: "/projects", labelKey: "footer.links.projects" },
      { href: "/about", labelKey: "footer.links.about" },
      { href: "/llms.txt", labelKey: "footer.links.llmsTxt", external: true },
      { href: "/privacy", labelKey: "footer.links.privacyPolicy" },
    ] as readonly NavLink[],
  },
  blog: {
    titleKey: "footer.sections.blog",
    links: [
      { href: "/blog", labelKey: "footer.links.allArticles" },
    ] as readonly NavLink[],
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
