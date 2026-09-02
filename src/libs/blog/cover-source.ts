import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { primaryTag } from "./cover-layout";
import { coverImagePath, type CoverVariant } from "./cover-image";
import type { BlogFrontmatter } from "./frontmatter";

type CoverInput = Pick<
  BlogFrontmatter,
  "cover" | "translationKey" | "tags" | "coverAlt" | "title"
>;

const versions = new Map<string, string>();

/**
 * Hash di tutto cio che decide il disegno di una cover: la chiave che semina
 * archetipo e geometria, il tag che sceglie il glifo, e il contenuto del file
 * quando la cover e disegnata a mano. Sta nell'URL, quindi un disegno diverso
 * e un URL diverso.
 */
export function coverVersion(frontmatter: CoverInput): string {
  const { translationKey, tags, cover } = frontmatter;
  const cached = versions.get(translationKey);

  if (cached) {
    return cached;
  }

  const parts = [translationKey, primaryTag(tags)];

  if (cover?.endsWith(".svg")) {
    const file = path.join(process.cwd(), "public", cover.replace(/^\//, ""));

    if (fs.existsSync(file)) {
      parts.push(
        crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex")
      );
    }
  }

  const version = crypto
    .createHash("sha1")
    .update(parts.join("|"))
    .digest("hex")
    .slice(0, 10);

  versions.set(translationKey, version);

  return version;
}

/**
 * L'URL da mettere nel `src` di una card. Una cover gia raster nel frontmatter
 * viene servita com'e; tutto il resto passa dalla route che rasterizza.
 */
export function coverImageUrl(
  frontmatter: CoverInput,
  variant: CoverVariant
): string {
  if (frontmatter.cover && !frontmatter.cover.endsWith(".svg")) {
    return frontmatter.cover;
  }

  return coverImagePath(
    variant,
    coverVersion(frontmatter),
    frontmatter.translationKey
  );
}
