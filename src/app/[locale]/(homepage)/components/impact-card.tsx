"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import type { ImpactItem } from "../constants/impact-items";

interface ImpactCardProps {
  item: ImpactItem;
}

export function ImpactCard({ item }: ImpactCardProps) {
  const t = useTranslations("homepage");

  return (
    <div
      className={cn(
        "flex w-full",
        item.position === "left"
          ? "justify-center md:justify-start"
          : "justify-center md:justify-end"
      )}
    >
      <Card className="bg-card max-w-sm px-5 py-4">
        <CardContent className="flex items-start gap-3 p-0">
          <div className="mt-0.5 shrink-0">
            <item.icon className="text-muted-foreground size-5 stroke-[1.5]" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t.rich(item.textKey, {
              highlight: (children) => (
                <span className="text-secondary font-medium">{children}</span>
              ),
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
