"use client";

import type { FeaturedProduct } from "@/constants/products";
import { cn } from "@/utils/cn";
import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ProductHighlightCardProps {
  product: FeaturedProduct;
  className?: string;
}

export function ProductHighlightCard({
  product,
  className,
}: ProductHighlightCardProps) {
  const t = useTranslations();
  const name = t(`common.products.items.${product.id}.name`);

  return (
    <a
      href={product.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={cn(
        "group border-border bg-card hover:border-secondary/60 relative flex h-full flex-col overflow-hidden rounded-xl border transition-colors",
        "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
        className
      )}
    >
      <div className="relative aspect-3/2 overflow-hidden">
        <Image
          src={product.image}
          alt=""
          width={904}
          height={603}
          sizes="(max-width: 768px) 100vw, 460px"
          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          aria-hidden="true"
        />
        <div className="from-card absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent" />

        <span className="bg-background/80 text-foreground absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs backdrop-blur-md">
          <DownloadIcon
            className="text-secondary size-3.5"
            aria-hidden="true"
          />
          {t("common.products.downloads")}
        </span>
      </div>

      <div className="relative -mt-7 flex flex-1 flex-col px-5 pb-5">
        <span
          className={cn(
            "border-border bg-background size-14 overflow-hidden rounded-xl border",
            product.logoFullBleed ? "block" : "flex items-center justify-center"
          )}
        >
          <Image
            src={product.logo}
            alt=""
            width={product.logoFullBleed ? 56 : 32}
            height={product.logoFullBleed ? 56 : 32}
            className={product.logoFullBleed ? "size-full" : "size-8"}
            aria-hidden="true"
          />
        </span>

        <h3 className="mt-4 text-xl font-semibold">{name}</h3>

        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {t(`common.products.items.${product.id}.tagline`)}
        </p>

        <span className="text-muted-foreground group-hover:text-secondary mt-auto flex items-center gap-1 pt-4 text-sm font-medium transition-colors">
          {t("common.products.visitSite")}
          <ArrowUpRightIcon
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
}
