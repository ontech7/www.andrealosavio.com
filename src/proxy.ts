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
     * - favicon.ico, favicon.png, favicon.svg (browser icons)
     * - images/videos/documents/icons (assets in public folder)
     * - sitemap.xml, robots.txt (SEO files)
     * - .well-known (devtools)
     * - manifest.json, robots.txt (metadata files)
     */
    "/((?!api|trcp|_next/static|_next|icons|videos|images|documents|.well-known|favicon.ico|favicon.png|favicon.svg|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
