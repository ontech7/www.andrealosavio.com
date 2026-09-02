import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { COVER_HEIGHT, COVER_WIDTH } from "@/libs/blog/cover-layout";
import type { BlogFrontmatter } from "@/libs/blog/frontmatter";
import { cn } from "@/utils/cn";
import { CoverScene, type CoverVariant } from "./cover-scene";

function readInlineSvg(source: string): string | null {
  const file = path.join(process.cwd(), "public", source.replace(/^\//, ""));

  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

interface ArticleCoverProps {
  frontmatter: BlogFrontmatter;
  variant?: CoverVariant;
  className?: string;
  priority?: boolean;
}

export function ArticleCover({
  frontmatter,
  variant = "hero",
  className,
  priority = false,
}: ArticleCoverProps) {
  const { cover, coverAlt, title, tags, translationKey } = frontmatter;
  const frameClassName = cn(
    "border-border aspect-[1200/630] w-full overflow-hidden rounded-xl border",
    className
  );

  if (cover?.endsWith(".svg")) {
    const markup = readInlineSvg(cover);

    if (markup) {
      return (
        <div
          role="img"
          aria-label={coverAlt ?? title}
          className={cn(frameClassName, "[&>svg]:h-full [&>svg]:w-full")}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      );
    }
  }

  if (cover) {
    return (
      <Image
        src={cover}
        alt={coverAlt ?? title}
        width={COVER_WIDTH}
        height={COVER_HEIGHT}
        priority={priority}
        className={cn(frameClassName, "object-cover")}
      />
    );
  }

  return (
    <div role="img" aria-label={title} className={frameClassName}>
      <CoverScene
        translationKey={translationKey}
        tags={tags}
        variant={variant}
      />
    </div>
  );
}
