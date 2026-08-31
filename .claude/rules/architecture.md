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
- **URL state**: hand-rolled client context providers (no library — see [URL
  State](#url-state))
- **Content**: MDX (`@next/mdx`) with `gray-matter` frontmatter, for the blog
- **Email**: Resend + `@react-email/components`
- **SEO**: `schema-dts` JSON-LD helpers
- **Testing**: Vitest, for the pure functions in `src/libs/blog/`

## Folder Layout

```
content/
└── blog/
    ├── it/*.mdx                  Italian articles (frontmatter + MDX body)
    └── en/*.mdx                  English articles, paired by translationKey
                                   outside src/, reachable via the @content/*
                                   alias (see tsconfig.json)

src/
├── app/
│   ├── [locale]/                 i18n routes (IT / EN)
│   │   ├── (homepage)/           homepage route group (keeps URL clean)
│   │   │   ├── components/       page-local components (hero decoration, …)
│   │   │   ├── constants/        page-local data (impact/feedback items, …)
│   │   │   ├── sections/         page-local sections (hero, how-i-work, …)
│   │   │   └── page.tsx
│   │   ├── about/  projects/  privacy/         same convention
│   │   ├── blog/                 blog index + [slug] article page (see Blog)
│   │   ├── [...rest]/page.tsx    localized catch-all → 404
│   │   ├── layout.tsx            providers + html shell
│   │   └── not-found.tsx
│   ├── api/
│   │   ├── blog/[locale]/[slug]/route.ts   plain-Markdown article, for LLM crawlers
│   │   ├── contact/route.ts      contact form submission
│   │   └── csrf/route.ts         CSRF token issuance
│   ├── globals.css
│   ├── robots.ts / sitemap.ts    SEO metadata routes
│   └── llms.txt/route.ts         dynamic LLM briefing (lists published articles)
├── components/
│   ├── layout/                   header, footer, skip-link, cat vote dialog, …
│   ├── mdx/                      components usable inside article bodies (Callout, Figure, …)
│   └── ui/                       shadcn primitives (button, card, dialog, …)
├── constants/                    cross-page constants (navigation, services, blog tags/kinds, …)
├── libs/                         integrations / vendor logic
│   ├── blog/                     frontmatter validation, article source, RSS/markdown helpers
│   ├── email/                    Resend client + React Email templates
│   ├── i18n/                     next-intl routing, request config, helpers
│   └── security/                 CSRF + rate limiter
├── mdx-components.tsx            MDX component overrides — must stay at this exact path
├── translations/
│   ├── en/*.json
│   └── it/*.json                 per-namespace message files
├── types/                        ambient type declarations (css.d.ts, mdx.d.ts)
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
- Messages are split per namespace (`common`, `homepage`, `projects`, …) and
  loaded dynamically in `request.ts`.
- **Convention**: call hooks without a namespace. Pass the full key from the
  root (e.g. `t("about.experiences.title")`). Reasons:
  - A single `t` can reach any namespace → simpler cross-cutting components.
  - Fully qualified keys are greppable and safer against accidental collisions.
- Locale-aware links and navigation go through `@/libs/i18n/navigation` (`Link`,
  `useRouter`, `usePathname`, `redirect`).

## URL State

There is no URL-state library (no `nuqs`, not in `package.json`). Shareable UI
state (filter tags on `/projects` and `/blog`) is a hand-rolled client context
provider:

- On mount, it reads `window.location.search` and hydrates state from it.
- It re-syncs on the `popstate` event (back/forward navigation).
- Every state change writes the URL back with `window.history.replaceState`
  (no server round-trip, no history entry per keystroke).

See `src/app/[locale]/projects/components/projects-filter-provider.tsx` and
`src/app/[locale]/blog/components/blog-filter-provider.tsx` as the canonical
examples — copy one of them for a new filterable list rather than reaching for
a library.

## Blog

Articles are MDX files with YAML frontmatter under `content/blog/{it,en}/`,
outside `src/`, imported through the `@content/*` alias. Two reading paths
exist on purpose:

- **Frontmatter-only reads** (`src/libs/blog/source.ts`, via `gray-matter`)
  power the index, sitemap, RSS feed, and footer — cheap, no MDX compilation.
- **Full article reads** happen only on the article page
  (`src/app/[locale]/blog/[slug]/page.tsx`), which dynamic-imports the MDX
  file as a React component: `` await import(`@content/blog/${locale}/${slug}.mdx`) ``.

Both paths run at build time. The article page sets `dynamicParams = false`,
so only articles discovered at build time exist — there is no on-demand
rendering of unknown slugs.

Articles are localized in pairs, linked by a `translationKey` field in
frontmatter (not by matching slugs — slugs are independently localized, e.g.
`cache-nextjs-spiegata` / `nextjs-cache-explained`). `translationKey` drives
hreflang alternates, the sitemap's per-locale paths, and the language switcher.

Two build-time guards keep content honest:

- `src/libs/blog/frontmatter.ts` (`parseFrontmatter`) throws a descriptive
  error, prefixed with the source file, on any malformed field — this fails
  the build instead of shipping bad metadata.
- `src/libs/blog/source.ts` (`assertConsistency`) throws if a published
  article's `translationKey` has no counterpart in the other locale, so a
  half-translated pair fails the build rather than 404ing at runtime.

MDX plugins are configured in `next.config.ts`'s `withMDX` call
(`remarkPlugins`, `rehypePlugins`). Because Turbopack serializes this config
and hands it to a Rust engine, plugins must be passed as **strings** (or
`[string, jsonSerializableOptions]` tuples) — a function reference cannot
cross that boundary. This is why `rehype-pretty-code` line-highlighting uses
its data-attribute/CSS output instead of an `onVisitLine` callback.

`src/mdx-components.tsx` supplies the component overrides used by every `.mdx`
file (headings, code blocks, `<Callout>`, `<Figure>`, …). It **must** live at
exactly that path — the project root or the `src` root — because that is the
only place Next.js looks for it; nothing else wires it in.

The `blog` translation namespace is registered in `src/libs/i18n/request.ts`
alongside the others.

## SEO

- `src/app/sitemap.ts` generates the multi-locale sitemap from the route table
  and `routing.locales`, plus one entry pair per published article (real
  `lastModified` dates from frontmatter, not a per-build `new Date()`; each
  locale gets its own localized path instead of assuming identical slugs).
- `src/app/robots.ts` switches between allow/disallow based on
  `NEXT_PUBLIC_SITE_URL`.
- Per-page metadata (title, description, OpenGraph, Twitter, hreflang) lives in
  `generateMetadata` inside each `page.tsx`.
- JSON-LD helpers in `src/utils/seo-schema.ts` produce typed `schema-dts`
  objects for `Person`, `Organization`, `WebSite`, `BreadcrumbList`,
  `OfferCatalog`, `ItemList`, `ProfilePage`, `Blog`, `BlogPosting`, and
  `FAQPage` (the last emitted only when an article's frontmatter has a `faq`
  entry). Combine them with `schemaToJsonLd([...])` to emit a single `@graph`.
- `src/app/llms.txt/route.ts` generates the LLM briefing dynamically, including
  an "Articles" section built from published posts. There is no
  `public/llms.txt` static file anymore.

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
3. Forms refresh the CSRF token when retrying after an error (to survive
   long-idle sessions).

The form lives on the homepage (`#contact`). There is no dedicated services
route: `/services` 301-redirects to `/<locale>#contact`.

## Environment Variables

Set in `.env` locally and in Vercel for deploys. The required set is:

- `NEXT_PUBLIC_SITE_URL` — bare hostname (no `https://`, no trailing slash).
- `RESEND_API_KEY`, `OWNER_EMAIL`, `FROM_EMAIL` — contact form email.
- `CSRF_SECRET` — `openssl rand -hex 32`.
- `CAT_API_KEY` (optional) — used by `CatVoteDialog`.

See `docs/SEO.md` for the SEO-relevant configuration pitfalls.
