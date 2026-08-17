import createMiddleware from "next-intl/middleware";
import type { ProxyConfig } from "next/server";
import { routing } from "./libs/i18n/routing";

export default createMiddleware(routing);

export const config: ProxyConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - trcp (tRPC routes)
     * - _next (static files)
     * - _vercel (analytics and speed insights scripts + beacons)
     * - favicon.ico, favicon.png, favicon.svg, apple-touch-icon.png (browser icons)
     * - images/videos/documents/icons (assets in public folder)
     * - sitemap.xml, robots.txt, llms.txt (SEO / LLM files)
     * - .well-known (devtools)
     * - manifest.json, robots.txt (metadata files)
     */
    "/((?!api|trcp|_next/static|_next|_vercel|icons|videos|images|documents|.well-known|favicon.ico|favicon.png|favicon.svg|apple-touch-icon.png|robots.txt|sitemap.xml|llms.txt|manifest.json).*)",
  ],
};
