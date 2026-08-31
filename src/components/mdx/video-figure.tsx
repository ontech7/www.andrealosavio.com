"use client";

import { MaximizeIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { cn } from "@/utils/cn";

interface VideoFigureProps {
  mp4: string;
  webm?: string;
  poster?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function VideoFigure({
  mp4,
  webm,
  poster,
  alt,
  caption,
  width = 960,
  height = 540,
  className,
}: VideoFigureProps) {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || shouldReduceMotion) {
      return;
    }

    void video.play().catch(() => {});
  }, [shouldReduceMotion]);

  return (
    <figure className={cn("group my-8", className)}>
      <div className="border-border relative overflow-hidden rounded-lg border">
        <video
          ref={videoRef}
          width={width}
          height={height}
          poster={poster}
          controls
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
          className="block w-full"
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
        <a
          href={mp4}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("blog.article.openImage", { alt })}
          className="bg-background/80 text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-3 right-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs opacity-0 backdrop-blur-sm transition-opacity outline-none group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px]"
        >
          <MaximizeIcon aria-hidden="true" className="size-3.5" />
          {t("blog.article.openImageBadge")}
        </a>
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
