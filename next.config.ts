import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn2.thecatapi.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
        pathname: "/cdn2.thecatapi.com/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/documents/:path*.pdf",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, follow",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Retired pages - the homepage is now the single entry point
      {
        source: "/:locale(it|en)/best-practices",
        destination: "/:locale#how-i-work",
        permanent: true,
      },
      {
        source: "/best-practices",
        destination: "/it#how-i-work",
        permanent: true,
      },
      {
        source: "/:locale(it|en)/services",
        destination: "/:locale#contact",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/it#contact",
        permanent: true,
      },
      // Legacy links
      {
        source: "/contattami",
        destination: "/it#contact",
        permanent: true,
      },
      {
        source: "/servizi",
        destination: "/it#contact",
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
