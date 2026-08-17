import { cn } from "@/utils/cn";
import { getTranslations } from "next-intl/server";
import { PracticeCard } from "../components/practice-card";
import {
  PRACTICE_GROUPS,
  PRACTICE_ITEM_KEYS,
} from "../constants/practice-areas";

interface PracticesSectionProps {
  id: string;
  className?: string;
}

export async function PracticesSection({
  id,
  className,
}: PracticesSectionProps) {
  const t = await getTranslations();

  return (
    <section id={id} className={cn("mx-auto max-w-5xl px-6 py-16", className)}>
      <h2 className="mb-3 bg-(image:--text-gradient) bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
        {t("bestPractices.practices.title")}
      </h2>
      <p className="text-muted-foreground mb-14 max-w-xl text-sm">
        {t("bestPractices.practices.subtitle")}
      </p>

      <div className="flex flex-col gap-14">
        {PRACTICE_GROUPS.map((group, groupIndex) => {
          const offset = PRACTICE_GROUPS.slice(0, groupIndex).reduce(
            (total, previous) => total + previous.areas.length,
            0
          );

          return (
            <div key={group.id} className="flex flex-col gap-6">
              <div className="border-secondary/40 border-l-2 pl-5">
                <h3 className="text-xl font-semibold">
                  {t(`bestPractices.practices.groups.${group.id}.title`)}
                </h3>
                <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
                  {t(`bestPractices.practices.groups.${group.id}.subtitle`)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {group.areas.map((area, areaIndex) => (
                  <PracticeCard
                    key={area}
                    index={offset + areaIndex + 1}
                    title={t(`bestPractices.practices.${area}.title`)}
                    items={PRACTICE_ITEM_KEYS.filter((key) =>
                      t.has(`bestPractices.practices.${area}.items.${key}`)
                    ).map((key) =>
                      t(`bestPractices.practices.${area}.items.${key}`)
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
