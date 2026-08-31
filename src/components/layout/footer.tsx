import { FOOTER_LINKS, SOCIAL_LINKS } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { FooterBlogLinks } from "./footer-blog-links";
import { FooterCatCta } from "./footer-cat-cta";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-4">
                <h3 className="bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-2xl font-bold text-transparent">
                  Andrea Losavio
                </h3>
                <p className="text-muted-foreground text-xs leading-tight">
                  {t("common.footer.tagline")}
                </p>

                <ul
                  className="mt-4 flex items-center gap-4 p-0"
                  aria-label={t("common.accessibility.socialLinks")}
                >
                  {SOCIAL_LINKS.map((social) => (
                    <li key={social.labelKey}>
                      <a
                        href={social.href.replace("{lang}", locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t(`common.${social.labelKey}`)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <social.Icon className="stroke-1" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <nav
              aria-label={t("common.accessibility.footerNavigation")}
              className="lg:col-span-6"
            >
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <div>
                  <h4 className="text-foreground mb-3 text-sm font-semibold">
                    {t(`common.${FOOTER_LINKS.general.titleKey}`)}
                  </h4>
                  <ul className="space-y-2 p-0">
                    {FOOTER_LINKS.general.links.map((link) => (
                      <li key={link.href}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                          >
                            {t(`common.${link.labelKey}`)}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                          >
                            {t(`common.${link.labelKey}`)}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-foreground mb-3 text-sm font-semibold">
                    {t(`common.${FOOTER_LINKS.blog.titleKey}`)}
                  </h4>
                  <FooterBlogLinks />
                </div>

                <div>
                  <h4 className="text-foreground mb-3 text-sm font-semibold">
                    {t(`common.${FOOTER_LINKS.projects.titleKey}`)}
                  </h4>
                  <ul className="space-y-2 p-0">
                    {FOOTER_LINKS.projects.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                          {t(`common.${link.labelKey}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>

            <div className="lg:col-span-3">
              <div>
                <h4 className="text-foreground mb-3 text-xl font-bold">
                  {t("common.footer.cta.title")}
                </h4>
                <FooterCatCta />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-border border-t py-8">
        <p className="text-muted-foreground mx-auto flex max-w-67.5 flex-col gap-3 text-center text-sm font-normal md:max-w-max md:flex-row">
          {t("common.footer.copyright", { year: currentYear })}
          <span aria-hidden="true" className="text-muted-foreground">
            ―
          </span>
          {t("common.footer.vat", { vatNumber: "12705460967" })}
        </p>
      </div>
    </footer>
  );
}
