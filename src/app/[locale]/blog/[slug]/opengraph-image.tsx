import fs from "node:fs";
import path from "node:path";
import { getAllArticleParams, getArticle } from "@/libs/blog/source";
import type { AppLocale } from "@/libs/i18n/utils";
import { formatArticleDate } from "@/utils/format-date";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Andrea Losavio - Blog";

export function generateStaticParams() {
  return getAllArticleParams();
}

interface ImageProps {
  params: Promise<{ locale: AppLocale; slug: string }>;
}

function loadFont(file: string): Buffer {
  return fs.readFileSync(path.join(process.cwd(), "public", "fonts", file));
}

const dmSansRegular = loadFont("dm-sans-400.woff");
const dmSansBold = loadFont("dm-sans-700.woff");

function inlineCoverDataUri(cover: string): string | null {
  const file = path.join(process.cwd(), "public", cover.replace(/^\//, ""));

  if (!file.endsWith(".svg") || !fs.existsSync(file)) {
    return null;
  }

  return `data:image/svg+xml;base64,${fs.readFileSync(file).toString("base64")}`;
}

function titleFontSize(title: string, narrow: boolean): number {
  const scale = narrow ? 8 : 0;

  if (title.length > 90) {
    return 42 - scale;
  }

  if (title.length > 65) {
    return 50 - scale;
  }

  if (title.length > 45) {
    return 56 - scale;
  }

  return 62 - scale;
}

export default async function OpengraphImage({ params }: ImageProps) {
  const { locale, slug } = await params;
  const article = getArticle(locale, slug);

  if (!article) {
    return new ImageResponse(<div />, size);
  }

  const { frontmatter } = article;
  const bespokeCover = frontmatter.cover
    ? inlineCoverDataUri(frontmatter.cover)
    : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#05070c",
        fontFamily: "DM Sans",
      }}
    >
      {bespokeCover ? (
        <img
          src={bespokeCover}
          width={size.width}
          height={size.height}
          alt=""
          style={{ position: "absolute", top: 0, left: 300 }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: bespokeCover
            ? "linear-gradient(90deg, rgba(5,7,12,1) 44%, rgba(5,7,12,0.72) 56%, rgba(5,7,12,0) 74%)"
            : "radial-gradient(circle at 78% 18%, rgba(13,126,242,0.45), transparent 58%)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            color: "#5cb0ff",
            fontSize: 26,
          }}
        >
          {frontmatter.tags.slice(0, 3).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: bespokeCover ? "700px" : "900px",
            maxHeight: "380px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: titleFontSize(frontmatter.title, Boolean(bespokeCover)),
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {frontmatter.title}
          </div>
          <div style={{ color: "#bfbfbf", fontSize: bespokeCover ? 27 : 30 }}>
            {frontmatter.subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#bfbfbf",
            fontSize: 24,
          }}
        >
          <span>Andrea Losavio</span>
          <span>{formatArticleDate(frontmatter.publishedAt, locale)}</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "DM Sans",
          data: dmSansRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "DM Sans",
          data: dmSansBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
