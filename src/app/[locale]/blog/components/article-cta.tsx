import { SendIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className={cn("my-12", className)}>
      <Card className="bg-background items-center gap-4 p-6 text-center">
        <h2 className="m-0 bg-(image:--text-gradient) bg-clip-text text-xl font-bold text-transparent md:text-2xl">
          {t("blog.article.cta.title")}
        </h2>

        <p className="text-muted-foreground m-0 max-w-md text-sm">
          {t("blog.article.cta.description")}
        </p>

        <Button variant="gradient-outline" asChild>
          <Link href={CONTACT_HREF}>
            {t("blog.article.cta.action")}
            <SendIcon className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
