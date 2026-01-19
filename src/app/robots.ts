import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function robots(): MetadataRoute.Robots {
  const isProduction =
    !SITE_URL.includes("test") &&
    !SITE_URL.includes("dev") &&
    !SITE_URL.includes("localhost");

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://${SITE_URL}/sitemap.xml`,
  };
}
