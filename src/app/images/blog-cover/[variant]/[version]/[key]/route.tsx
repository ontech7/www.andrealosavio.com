import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { CoverScene } from "@/app/[locale]/blog/components/cover-scene";
import {
  COVER_RASTER_QUALITY,
  COVER_RASTER_WIDTH,
  type CoverVariant,
} from "@/libs/blog/cover-image";
import { coverVersion } from "@/libs/blog/cover-source";
import { getArticles } from "@/libs/blog/source";
import { locales } from "@/libs/i18n/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

const VARIANTS: CoverVariant[] = ["hero", "thumb"];

interface RouteParams {
  params: Promise<{ variant: string; version: string; key: string }>;
}

export function generateStaticParams() {
  const seen = new Map<string, string>();

  for (const locale of locales) {
    for (const article of getArticles(locale)) {
      const { translationKey, cover } = article.frontmatter;

      if (!cover || cover.endsWith(".svg")) {
        seen.set(translationKey, coverVersion(article.frontmatter));
      }
    }
  }

  return VARIANTS.flatMap((variant) =>
    [...seen.entries()].map(([key, version]) => ({ variant, version, key }))
  );
}

async function sceneMarkup(
  key: string,
  variant: CoverVariant
): Promise<string | null> {
  for (const locale of locales) {
    const article = getArticles(locale).find(
      (candidate) => candidate.frontmatter.translationKey === key
    );

    if (!article) {
      continue;
    }

    const { cover, tags } = article.frontmatter;

    if (cover?.endsWith(".svg")) {
      const file = path.join(process.cwd(), "public", cover.replace(/^\//, ""));

      return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    }

    const { renderToStaticMarkup } = await import("react-dom/server");

    return renderToStaticMarkup(
      <CoverScene translationKey={key} tags={tags} variant={variant} />
    );
  }

  return null;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { variant, key } = await params;

  if (!VARIANTS.includes(variant as CoverVariant)) {
    return new Response("Not found", { status: 404 });
  }

  const markup = await sceneMarkup(key, variant as CoverVariant);

  if (!markup) {
    return new Response("Not found", { status: 404 });
  }

  const webp = await sharp(Buffer.from(markup), { density: 200 })
    .resize(COVER_RASTER_WIDTH)
    .webp({ quality: COVER_RASTER_QUALITY })
    .toBuffer();

  return new Response(new Uint8Array(webp), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
