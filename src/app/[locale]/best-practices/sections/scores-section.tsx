import {
  BUILD_STATS,
  LIGHTHOUSE_SCORES,
  MEASUREMENT,
  WEB_VITALS,
} from "@/constants/lighthouse";
import { cn } from "@/utils/cn";
import { InfoIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { ScoreRing } from "../components/score-ring";

interface ScoresSectionProps {
  id: string;
  className?: string;
}

export async function ScoresSection({ id, className }: ScoresSectionProps) {
  const t = await getTranslations();
  const format = await getFormatter();

  const measuredOn = format.dateTime(new Date(MEASUREMENT.date), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl scroll-mt-24 px-6 py-16", className)}
    >
      <h2 className="mb-3 bg-(image:--text-gradient) bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
        {t("bestPractices.scores.title")}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        {t("bestPractices.scores.intro")}
      </p>
      <p className="text-muted-foreground mb-12 max-w-xl text-sm">
        {t("bestPractices.scores.subtitle", {
          tool: MEASUREMENT.tool,
          url: MEASUREMENT.url,
          device: MEASUREMENT.device,
          date: measuredOn,
        })}
      </p>

      <div className="flex flex-wrap justify-center gap-10 md:gap-16">
        {LIGHTHOUSE_SCORES.map((entry, index) => (
          <ScoreRing
            key={entry.id}
            score={entry.score}
            label={t(`bestPractices.scores.categories.${entry.id}`)}
            delayMs={index * 150}
          />
        ))}
      </div>

      <div className="border-border mt-14 border-t pt-10">
        <h3 className="text-muted-foreground mb-5 font-mono text-xs tracking-[0.14em] uppercase">
          {t("bestPractices.scores.vitalsTitle")}
        </h3>

        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-(image:--border-gradient) sm:grid-cols-3">
          {WEB_VITALS.map((vital) => (
            <div key={vital.id} className="bg-card flex flex-col gap-1 p-5">
              <dt className="text-muted-foreground font-mono text-xs tracking-[0.1em] uppercase">
                {t(`bestPractices.scores.vitals.${vital.id}`)}
              </dt>
              <dd className="text-2xl font-semibold tabular-nums">
                {vital.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-muted-foreground mt-4 text-xs">
          {t("bestPractices.scores.vitalsHint")}
        </p>
      </div>

      <div className="border-border mt-10 flex flex-col gap-3 rounded-lg border border-dashed p-5">
        <p className="text-muted-foreground flex items-start gap-2.5 text-sm">
          <InfoIcon
            className="text-secondary mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          {t("bestPractices.scores.honesty")}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <h3 className="text-sm font-semibold">
          {t("bestPractices.scores.reproduceTitle")}
        </h3>
        <p className="text-muted-foreground max-w-2xl text-sm">
          {t("bestPractices.scores.reproduce")}
        </p>
        <p className="text-muted-foreground mt-1 font-mono text-xs">
          {t("bestPractices.scores.buildStat", {
            pages: BUILD_STATS.prerenderedPages,
            time: BUILD_STATS.buildTimeMs,
          })}
        </p>
      </div>
    </section>
  );
}
