import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn2.thecatapi.com",
      },
    ],
  },
  async redirects() {
    return [
      // Removed links
      {
        source: "/best-practices",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/:locale(it|en)/best-practices",
        destination: "/:locale/services",
        permanent: true,
      },
      // Legacy links
      {
        source: "/contattami",
        destination: "/it/services",
        permanent: true,
      },
      {
        source: "/servizi",
        destination: "/it/services",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/it/projects",
        permanent: true,
      },
      {
        source: "/chi-sono",
        destination: "/it/about",
        permanent: true,
      },
      {
        source: "/files/AndreaLosavio_CV_Ita.pdf",
        destination: "/documents/AndreaLosavio_CV_it.pdf",
        permanent: true,
      },
      {
        source: "/files/AndreaLosavio_CV_Eng.pdf",
        destination: "/documents/AndreaLosavio_CV_en.pdf",
        permanent: true,
      },
      {
        source: "/cookie-policy",
        destination: "/it/privacy",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/it/privacy",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/libs/i18n/request.ts");

export default withNextIntl(nextConfig);
