import { MaximizeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { cn } from "@/utils/cn";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  animated?: boolean;
  className?: string;
}

export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
  animated,
  className,
}: FigureProps) {
  const t = useTranslations();

  return (
    <figure className={cn("my-8", className)}>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("blog.article.openImage", { alt })}
        className="group border-border focus-visible:ring-ring/50 relative block cursor-zoom-in overflow-hidden rounded-lg border outline-none focus-visible:ring-[3px]"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized={animated}
          className="block w-full"
        />
        <span className="bg-background/80 text-muted-foreground pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <MaximizeIcon aria-hidden="true" className="size-3.5" />
          {t("blog.article.openImageBadge")}
        </span>
      </a>
      {caption && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
