# Architecture

High-level reference of how this Next.js portfolio is organized. Keep it up to
date when adding new routes, libraries, or cross-cutting concerns.

## Stack

- **Runtime**: Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS v4, `tw-animate-css`, CVA + `tailwind-merge`
- **UI primitives**: Radix UI + shadcn-style components under
  `src/components/ui`
- **Animation**: `motion` (Motion / Framer Motion successor)
- **i18n**: `next-intl` v4 (IT default, EN)
- **URL state**: `nuqs`
- **Email**: Resend + `@react-email/components`
- **SEO**: `schema-dts` JSON-LD helpers

## Folder Layout

```
src/
├── app/
│   ├── [locale]/                 i18n routes (IT / EN)
│   │   ├── (homepage)/           homepage route group (keeps URL clean)
│   │   │   ├── components/       page-local components (hero decoration, …)
│   │   │   ├── constants/        page-local data (impact/feedback items, …)
│   │   │   ├── sections/         page-local sections (hero, quote, …)
│   │   │   └── page.tsx
│   │   ├── about/  projects/  services/  privacy/    same convention
│   │   ├── [...rest]/page.tsx    localized catch-all → 404
│   │   ├── layout.tsx            providers + html shell
│   │   └── not-found.tsx
│   ├── api/
│   │   ├── contact/route.ts      contact form submission
│   │   └── csrf/route.ts         CSRF token issuance
│   ├── globals.css
│   ├── robots.ts / sitemap.ts    SEO metadata routes
│   └── llms.txt                  (served statically from public/llms.txt)
├── components/
│   ├── layout/                   header, footer, skip-link, cat vote dialog, …
│   └── ui/                       shadcn primitives (button, card, dialog, …)
├── constants/                    cross-page constants (navigation, services, …)
├── libs/                         integrations / vendor logic
│   ├── email/                    Resend client + React Email templates
│   ├── i18n/                     next-intl routing, request config, helpers
│   └── security/                 CSRF + rate limiter
├── translations/
│   ├── en/*.json
│   └── it/*.json                 per-namespace message files
├── utils/                        pure utilities (cn, SEO JSON-LD helpers)
└── proxy.ts                      Next.js 16 Proxy (replaces middleware.ts)
```

## Routing

- Every user-facing page lives under `app/[locale]/`.
- The homepage uses a route group `(homepage)` so it sits at `/` without an
  extra URL segment.
- Page-local files (`components/`, `sections/`, `constants/`) stay next to the
  `page.tsx` that consumes them. Anything used by ≥ 2 routes is promoted to
  `src/components/` or `src/constants/`.
- `[locale]/[...rest]/page.tsx` calls `notFound()` so unknown localized paths
  return a translated 404.
- Unlocalized paths and assets are filtered out in `src/proxy.ts` via the
  `matcher` regex.

## Internationalization

- Config: `src/libs/i18n/{routing.ts,request.ts,navigation.ts,utils.ts}`. The
  plugin entry is wired in `next.config.ts` via
  `createNextIntlPlugin("./src/libs/i18n/request.ts")`.
- Messages are split per namespace (`common`, `homepage`, `services`, …) and
  loaded dynamically in `request.ts`.
- **Convention**: call hooks without a namespace. Pass the full key from the
  root (e.g. `t("about.experiences.title")`). Reasons:
  - A single `t` can reach any namespace → simpler cross-cutting components.
  - Fully qualified keys are greppable and safer against accidental collisions.
- Locale-aware links and navigation go through `@/libs/i18n/navigation` (`Link`,
  `useRouter`, `usePathname`, `redirect`).

## URL State

`nuqs` is used for shareable UI state (e.g. filters on `/projects`). The
`NuqsAdapter` is mounted directly in `src/app/[locale]/layout.tsx` — there is no
wrapper component.

## SEO

- `src/app/sitemap.ts` generates the multi-locale sitemap from the route table
  and `routing.locales`.
- `src/app/robots.ts` switches between allow/disallow based on
  `NEXT_PUBLIC_SITE_URL`.
- Per-page metadata (title, description, OpenGraph, Twitter, hreflang) lives in
  `generateMetadata` inside each `page.tsx`.
- JSON-LD helpers in `src/utils/seo-schema.ts` produce typed `schema-dts`
  objects for `Person`, `Organization`, `WebSite`, `BreadcrumbList`,
  `OfferCatalog`, `ItemList`, and `ProfilePage`. Combine them with
  `schemaToJsonLd([...])` to emit a single `@graph`.
- `public/llms.txt` is the static LLM briefing. Update it whenever public
  information about Andrea changes.

## Contact Form Flow

1. Client loads `/api/csrf` → receives a signed token (HMAC, see
   `libs/security/csrf.ts`).
2. Submission hits `/api/contact`:
   - Rejects requests from origins outside `*.andrealosavio.com`.
   - Applies per-IP rate limiting (`libs/security/rate-limiter.ts`).
   - Silently succeeds when the honeypot field `website` is filled.
   - Validates CSRF, required fields, and email format.
   - Sends a confirmation email to the sender (`ClientConfirmationEmail`).
   - Sends a notification email to the owner (`OwnerNotificationEmail`).
3. Forms refresh the CSRF token when retrying after an error and when the
   service dialog re-opens (to survive long-idle sessions).

## Environment Variables

Set in `.env` locally and in Vercel for deploys. The required set is:

- `NEXT_PUBLIC_SITE_URL` — bare hostname (no `https://`, no trailing slash).
- `RESEND_API_KEY`, `OWNER_EMAIL`, `FROM_EMAIL` — contact form email.
- `CSRF_SECRET` — `openssl rand -hex 32`.
- `CAT_API_KEY` (optional) — used by `CatVoteDialog`.

See `docs/SEO.md` for the SEO-relevant configuration pitfalls.
