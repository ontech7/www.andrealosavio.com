"use client";

import type { ServicePrice as ServicePriceValue } from "@/constants/services";
import { cn } from "@/utils/cn";
import { formatEuro } from "@/utils/format-price";
import { useLocale, useTranslations } from "next-intl";

interface ServicePriceProps {
  price: ServicePriceValue | null;
  className?: string;
}

export function ServicePrice({ price, className }: ServicePriceProps) {
  const t = useTranslations();
  const locale = useLocale();

  const value = price
    ? t(price.from ? "services.pricing.from" : "services.pricing.flat", {
        price: formatEuro(price.amount, locale),
        unit: t(`services.pricing.units.${price.unit}`),
      })
    : t("services.pricing.onRequest");

  return (
    <p className={cn("text-sm", className)}>
      <span className="text-muted-foreground">
        {t("services.pricing.label")}:{" "}
      </span>
      <span className="text-foreground font-medium">{value}</span>
    </p>
  );
}
