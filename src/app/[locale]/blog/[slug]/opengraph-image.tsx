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

function titleFontSize(title: string): number {
  if (title.length > 90) {
    return 42;
  }

  if (title.length > 65) {
    return 50;
  }

  if (title.length > 45) {
    return 56;
  }

  return 62;
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

  if (bespokeCover) {
    return new ImageResponse(
      <img src={bespokeCover} width={size.width} height={size.height} alt="" />,
      size
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#05070c",
        backgroundImage:
          "radial-gradient(circle at 78% 18%, rgba(13,126,242,0.45), transparent 58%)",
        padding: "64px",
        fontFamily: "DM Sans",
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
          maxWidth: "900px",
          maxHeight: "380px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: titleFontSize(frontmatter.title),
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {frontmatter.title}
        </div>
        <div style={{ color: "#bfbfbf", fontSize: 30 }}>
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
