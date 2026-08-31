import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { CONTACT_HREF } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import type { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";

interface ArticleCtaProps {
  locale: AppLocale;
  className?: string;
}

export async function ArticleCta({ locale, className }: ArticleCtaProps) {
  const t = await getTranslations({ locale });

  return (
    <section
      className={cn(
        "border-border bg-card/50 my-12 rounded-xl border p-6 text-center",
        className
      )}
    >
      <h2 className="text-foreground text-xl font-bold">
        {t("blog.article.cta.title")}
      </h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        {t("blog.article.cta.description")}
      </p>
      <Button asChild className="mt-5">
        <Link href={CONTACT_HREF}>{t("blog.article.cta.action")}</Link>
      </Button>
    </section>
  );
}
