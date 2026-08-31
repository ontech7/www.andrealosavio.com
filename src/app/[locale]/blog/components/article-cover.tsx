import Image from "next/image";
import type { BlogKind } from "@/constants/blog";
import { cn } from "@/utils/cn";

const KIND_HUES = {
  tech: 210,
  business: 160,
  hybrid: 265,
  event: 25,
} as const satisfies Record<BlogKind, number>;

function hashSlug(slug: string): number {
  let hash = 5381;

  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 33) ^ slug.charCodeAt(index);
  }

  return Math.abs(hash);
}

interface ArticleCoverProps {
  slug: string;
  kind: BlogKind;
  title: string;
  cover?: string;
  coverAlt?: string;
  className?: string;
  priority?: boolean;
}

export function ArticleCover({
  slug,
  kind,
  title,
  cover,
  coverAlt,
  className,
  priority = false,
}: ArticleCoverProps) {
  if (cover) {
    return (
      <Image
        src={cover}
        alt={coverAlt ?? title}
        width={1200}
        height={630}
        priority={priority}
        className={cn(
          "border-border aspect-[1200/630] w-full rounded-xl border object-cover",
          className
        )}
      />
    );
  }

  const hash = hashSlug(slug);
  const hue = KIND_HUES[kind];
  const rotation = hash % 45;
  const offset = 20 + (hash % 40);
  const radius = 30 + (hash % 25);

  return (
    <div
      role="img"
      aria-label={title}
      className={cn(
        "border-border aspect-[1200/630] w-full overflow-hidden rounded-xl border",
        className
      )}
    >
      <svg
        viewBox="0 0 1200 630"
        className="h-full w-full"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`cover-${slug}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={`hsl(${hue} 85% 20%)`} />
            <stop offset="100%" stopColor={`hsl(${hue} 85% 45%)`} />
          </linearGradient>
          <pattern
            id={`grid-${slug}`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 L0 0 0 40"
              fill="none"
              stroke="rgba(191,191,191,0.08)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="1200" height="630" fill="#111111" />
        <rect width="1200" height="630" fill={`url(#grid-${slug})`} />
        <g transform={`rotate(${rotation} 600 315)`} opacity="0.85">
          <circle
            cx={600 + offset}
            cy={315 - offset}
            r={180 + radius}
            fill={`url(#cover-${slug})`}
            opacity="0.55"
          />
          <circle
            cx={600 - offset}
            cy={315 + offset}
            r={120 + radius}
            fill={`url(#cover-${slug})`}
            opacity="0.35"
          />
        </g>
      </svg>
    </div>
  );
}
