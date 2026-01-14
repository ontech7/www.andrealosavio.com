"use client";

import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { ImpactCard } from "../components/impact-card";
import { SLine } from "../components/s-line";
import { IMPACT_ITEMS } from "../constants/impact-items";

interface MakingAnImpactSectionProps {
  id: string;
  className?: string;
}

export function MakingAnImpactSection({
  id,
  className,
}: MakingAnImpactSectionProps) {
  const t = useTranslations("homepage");

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 py-24 md:py-32", className)}
    >
      {/* Title */}
      <div className="mb-4 text-center">
        <h2 className="from-secondary via-secondary/75 to-secondary/50 bg-linear-to-t bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          {t("makingAnImpact.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-md bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-lg text-transparent">
          {t("makingAnImpact.subtitle")}
        </p>
      </div>

      {/* Impact Timeline */}
      <div className="relative flex flex-col items-center">
        <SLine inverted className="md:mr-72.5 md:w-72.5" />
        {IMPACT_ITEMS.map((item, index) => (
          <Fragment key={item.textKey}>
            <ImpactCard key={item.textKey} item={item} />
            {index !== IMPACT_ITEMS.length - 1 && (
              <SLine inverted={index % 2 === 1} className="w-145" />
            )}
          </Fragment>
        ))}
        <SLine className="md:mr-72.5 md:w-72.5" />
      </div>
    </section>
  );
}
