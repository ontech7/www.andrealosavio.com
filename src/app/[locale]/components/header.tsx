"use client";

import { NAV_LINKS } from "@/constants/navigation";
import { Link, usePathname } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("common");

  return (
    <header className="bg-background/80 fixed top-0 right-0 left-0 z-50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label={t("accessibility.homeLink")}>
            <Logo />
          </Link>

          {/* Desktop Navigation + Language Switcher */}
          <div className="hidden items-center gap-2 md:flex">
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-foreground rounded-lg px-4 py-2 text-base transition-colors",
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
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-border border-t py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
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
        )}
      </div>
    </header>
  );
}
