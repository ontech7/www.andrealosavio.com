import Image from "next/image";

import { cn } from "@/utils/cn";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
  className,
}: FigureProps) {
  return (
    <figure className={cn("my-8", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="border-border rounded-lg border"
      />
      {caption && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
