import { cn } from "@/utils/cn";
import { ArrowDownIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface HeroSectionProps {
  id: string;
  scoresId: string;
  className?: string;
}

export async function HeroSection({
  id,
  scoresId,
  className,
}: HeroSectionProps) {
  const t = await getTranslations();

  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-5xl px-6 pt-32 pb-16 md:pt-40 md:pb-24",
        className
      )}
    >
      <h1 className="mb-6 max-w-3xl bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-4xl font-bold text-balance text-transparent md:text-6xl">
        {t.rich("bestPractices.hero.title", {
          highlight: (children) => (
            <span className="bg-(image:--outline-gradient-light) bg-clip-text text-transparent">
              {children}
            </span>
          ),
        })}
      </h1>

      <p className="text-muted-foreground max-w-xl text-lg">
        {t("bestPractices.hero.description")}
      </p>

      <a
        href={`#${scoresId}`}
        className={cn(
          "bg-muted text-foreground mt-10 inline-flex items-center gap-3 rounded-lg px-5 py-2.5 text-sm",
          "hover:bg-muted/80 transition-colors",
          "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
        )}
      >
        {t("bestPractices.hero.cta")}
        <ArrowDownIcon className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
