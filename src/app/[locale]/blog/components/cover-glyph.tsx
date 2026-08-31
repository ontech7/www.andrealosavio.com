import type { BlogTag } from "@/constants/blog";

const GLYPH_PATHS: Record<BlogTag, React.ReactNode> = {
  nextjs: (
    <>
      <circle cx="50" cy="50" r="44" />
      <path d="M34 70 V30 L78 84" />
      <path d="M66 30 V50" />
    </>
  ),
  react: (
    <>
      <circle cx="50" cy="50" r="8" fill="currentColor" stroke="none" />
      <ellipse cx="50" cy="50" rx="44" ry="17" />
      <ellipse cx="50" cy="50" rx="44" ry="17" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="44" ry="17" transform="rotate(120 50 50)" />
    </>
  ),
  typescript: (
    <>
      <rect x="8" y="8" width="84" height="84" rx="12" />
      <path d="M20 44 H50 M35 44 V78" />
      <path d="M84 50 C84 40 58 40 58 50 C58 60 84 58 84 70 C84 80 60 80 58 72" />
    </>
  ),
  performance: (
    <>
      <path d="M10 76 A42 42 0 1 1 90 76" />
      <path d="M50 76 L74 40" />
      <circle cx="50" cy="76" r="6" fill="currentColor" stroke="none" />
    </>
  ),
  seo: (
    <>
      <circle cx="44" cy="44" r="30" />
      <path d="M66 66 L90 90" />
      <path d="M32 48 L41 38 L49 46 L58 33" />
    </>
  ),
  architecture: (
    <>
      <rect x="38" y="8" width="24" height="20" rx="4" />
      <rect x="8" y="62" width="24" height="20" rx="4" />
      <rect x="68" y="62" width="24" height="20" rx="4" />
      <path d="M50 28 V45 M20 62 V45 H80 V62" />
    </>
  ),
  ai: (
    <>
      <path d="M40 8 L48 32 L72 40 L48 48 L40 72 L32 48 L8 40 L32 32 Z" />
      <path d="M76 56 L80 68 L92 72 L80 76 L76 88 L72 76 L60 72 L72 68 Z" />
    </>
  ),
  devops: (
    <>
      <path d="M84 38 A36 36 0 1 0 86 60" />
      <path d="M66 22 L86 36 L66 48" />
    </>
  ),
  mobile: (
    <>
      <rect x="28" y="8" width="44" height="84" rx="10" />
      <path d="M43 20 H57" />
      <circle cx="50" cy="80" r="4" fill="currentColor" stroke="none" />
    </>
  ),
  career: (
    <>
      <path d="M10 80 L34 54 L50 68 L86 26" />
      <path d="M64 24 H88 V48" />
    </>
  ),
  business: <path d="M14 88 V58 M38 88 V36 M62 88 V66 M86 88 V20" />,
  freelance: (
    <>
      <path d="M52 8 H90 V46 L46 90 L8 52 Z" />
      <circle cx="72" cy="26" r="8" />
    </>
  ),
  events: (
    <>
      <rect x="38" y="8" width="24" height="48" rx="12" />
      <path d="M22 44 A28 28 0 0 0 78 44" />
      <path d="M50 72 V90 M34 90 H66" />
    </>
  ),
};

interface CoverGlyphProps {
  tag: BlogTag;
  x: number;
  y: number;
  size: number;
  strokeWidth?: number;
  paint?: string;
  fillPaint?: string;
}

export function CoverGlyph({
  tag,
  x,
  y,
  size,
  strokeWidth = 4,
  paint = "currentColor",
  fillPaint,
}: CoverGlyphProps) {
  const scale = size / 100;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      color={fillPaint}
      fill="none"
      stroke={paint}
      strokeWidth={strokeWidth / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPH_PATHS[tag]}
    </g>
  );
}
