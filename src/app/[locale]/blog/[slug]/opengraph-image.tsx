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

export default async function OpengraphImage({ params }: ImageProps) {
  const { locale, slug } = await params;
  const article = getArticle(locale, slug);

  if (!article) {
    return new ImageResponse(<div />, size);
  }

  const { frontmatter } = article;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#111111",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(13,126,242,0.35), transparent 55%)",
        padding: "64px",
        fontFamily: "DM Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          color: "#0d7ef2",
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
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 62,
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
          data: loadFont("dm-sans-400.woff"),
          weight: 400,
          style: "normal",
        },
        {
          name: "DM Sans",
          data: loadFont("dm-sans-700.woff"),
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
