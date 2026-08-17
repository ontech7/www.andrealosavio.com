import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface CtaSectionProps {
  id: string;
  className?: string;
}

export async function CtaSection({ id, className }: CtaSectionProps) {
  const t = await getTranslations();

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 pt-8 pb-24", className)}
    >
      <div className="rounded-lg bg-(image:--border-gradient) p-px">
        <div className="bg-card flex flex-col items-start gap-5 rounded-lg p-8 md:p-12">
          <h2 className="max-w-2xl bg-(image:--text-gradient) bg-clip-text text-2xl font-bold text-balance text-transparent md:text-3xl">
            {t("bestPractices.cta.title")}
          </h2>
          <p className="text-muted-foreground max-w-xl">
            {t("bestPractices.cta.description")}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              className={cn(
                "bg-muted text-foreground inline-flex items-center gap-3 rounded-lg px-5 py-2.5 text-sm",
                "hover:bg-muted/80 transition-colors",
                "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
              )}
            >
              {t("bestPractices.cta.button")}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="/services#contactForm"
              className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4 transition-colors"
            >
              {t("bestPractices.cta.secondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
