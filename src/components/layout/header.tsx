"use client";

import { NAV_LINKS, SOCIAL_LINKS } from "@/constants/navigation";
import { Link, usePathname } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Logo } from "../logo";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const locale = useLocale();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 fixed top-0 right-0 left-0 z-50 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label={t("accessibility.homeLink")}>
            <Logo />
          </Link>

          {/* Desktop Navigation + Language Switcher */}
          <div className="hidden items-center gap-2 md:flex">
            <nav aria-label={t("accessibility.mainNavigation")} className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-foreground rounded-lg px-4 py-1.5 text-base transition-colors",
                      isActive ? "bg-muted" : "hover:bg-muted/60"
                    )}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher className="ml-4" />
          </div>

          {/* Mobile Menu Button */}
          <LanguageSwitcher className="mr-6 ml-auto md:hidden" />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground p-2 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              mobileMenuOpen
                ? t("accessibility.closeMenu")
                : t("accessibility.openMenu")
            }
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-navigation">
            <nav aria-label={t("accessibility.mobileNavigation")} className="border-border border-t py-4 md:hidden">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "text-foreground rounded-lg px-4 py-3 text-base transition-colors",
                        isActive ? "bg-muted" : "hover:bg-muted/60"
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Social Links */}
            <div className="flex items-center gap-4 px-4 pb-6" role="list" aria-label={t("accessibility.socialLinks")}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.labelKey}
                  href={social.href.replace("{lang}", locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                  aria-label={t(social.labelKey)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.Icon className="stroke-1" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
