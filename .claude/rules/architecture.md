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
├── constants/                    cross-page constants (navigation, services, blog tags/accents, …)
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

Articles carry a single taxonomy axis: `tags`, drawn from the `BLOG_TAGS`
vocabulary. There is no `kind`/category field — it duplicated the tags without
adding meaning.

Covers have two paths. Without `cover:` in frontmatter,
`blog/components/article-cover.tsx` renders one of five scene archetypes built
by `buildCoverScene` in `libs/blog/cover-layout.ts`:

| Archetype | What it draws                                                          |
| --------- | ---------------------------------------------------------------------- |
| `isoChip` | raised isometric chip, circuit traces routed across a 2:1 iso grid      |
| `orbit`   | luminous disc ringed by tilted elliptical orbits                        |
| `horizon` | glowing horizon line, receding perspective grid, vertical light shafts  |
| `stack`   | glass tiles receding into depth behind the front one                    |
| `aurora`  | heavily blurred blue field behind a round glass tile                    |
| `flow`    | glowing wires branching from the subject to dim node pills              |
| `keys`    | a row of keycaps, only the one at the focus lit                         |
| `spline`  | a smooth glowing curve through the focus, with drop lines and nodes     |
| `beam`    | a cone of light thrown from the subject over a faint orthogonal grid    |

They are deliberately different compositions but share one grammar, and that
grammar is what makes them read as a set: a radial black-to-blue ground centred
on the subject, exactly one luminous subject at the focus, bloom, and a radial
depth mask that fades everything else away from it. Add an archetype by keeping
that grammar; a scene that abandons it will look foreign next to the others.

The article's `translationKey` seeds the archetype, one of three blue
temperatures, the focus position and all the geometry, so two articles sharing a
primary tag — and therefore the same glyph — differ in composition, not just in
detail. Seeding on `translationKey` also means the IT and EN versions share one
image, and the same build always produces the same scene.

Two generators carry a constraint worth knowing before touching them. Traces
(`isoChip`) are built in grid space and projected: each is locked to a single
quadrant and only steps outward on the two axes, which is what guarantees it
leaves the canvas instead of folding back on itself. The `spline` is two cubics
whose join sits exactly on the focus, with the second control point mirrored
through it — that reflection is what keeps the curve free of a kink where the
subject sits.

The glyph is always drawn upright and centred on the focus, never skewed onto a
plane: the marks carry interior detail (the N inside a circle, TS inside a
rounded square) and a projection matrix made them unreadable. The palette is
always black-to-blue — a white-ish gradient reads as Vercel, which is the one
thing these covers must not do. The cover never carries the article title, since
it sits inches from the HTML title in both the index and the article page.
`variant="thumb"` centres and enlarges the subject and thins the surroundings, so
the scene still reads at ~208px.

Every asset of an article lives in `public/images/blog/<translationKey>/`, one
folder per article pair, so the two locales share one set of files and the
directory does not turn into a flat pile as articles accumulate. Inside it the
names are generic (`cover.svg`, `live-proof.mp4`), because the folder already
carries the identity.

With `cover:` pointing at an SVG under that folder, the file is
inlined server-side instead — see the `blog-cover-designer` skill. SVG covers
never reach `openGraph.images` or the `BlogPosting` schema (social platforms
cannot render them): those keep pointing at the `opengraph-image` route, which
rasterises the same SVG through satori.

Inlining only happens on the article page, which shows one cover. The index
cards get the same drawing as WebP, from the route at
`src/app/images/blog-cover/[variant]/[version]/[key]/route.tsx`. It lives under
`app/images/` on purpose: that prefix is already excluded from the `src/proxy.ts`
matcher, so the route needs no matcher change and no locale segment (the scene is
seeded on `translationKey`, which both locales share). It renders `CoverScene` to
an SVG string and pipes it through `sharp`, statically at build time
(`force-static` + `generateStaticParams`), for both variants of every article
without a raster `cover:`. `react-dom/server` has to be imported dynamically
inside the handler: a static import of it anywhere under `app/` fails the build.

Two reasons the cards take the raster and not the SVG. An SVG loaded through
`<img>` is an isolated document, so it cannot see the page's fonts and any
`<text>` in a bespoke cover would fall back to a generic face. And the scenes
lean on `feGaussianBlur` over large areas, which the browser would repaint for
every visible card. The `<Image>` carries `unoptimized`, because the route
already emits the final format and size and running it through the Vercel image
optimizer would only bill a second transformation.

The `version` segment is a hash of everything that decides the drawing
(`cover-source.ts`): the `translationKey` that seeds the geometry, the primary
tag that picks the glyph, and the file contents when the cover is hand-drawn.
It is what makes the route's `immutable` cache header honest. Without it the URL
would stay the same after a retag or a redraw, and every returning visitor would
keep the old image for a year. Adding a tag that does not win the vocabulary
order leaves the hash alone, which is correct: the drawing did not change.

The index (`blog/page.tsx`) reuses the page grammar of `/projects`: a centred
hero (eyebrow, gradient headline, `GridLayers` backdrop, RSS button), then two
clearly separated blocks. First the newest article, under an `In evidenza` /
`Featured` eyebrow, as a full-width featured `Card`. Then a hairline rule, an
`All articles` heading, and a two-column grid of `ArticleCard`s. That grid is
`auto-rows-fr`, not `items-start`, so every card is as tall as the tallest one on
the page, across rows and not just within a row: `Card` is already `h-full` and
`ArticleStamp` already `mt-auto`, so the date line settles on the bottom edge and
a short subtitle just leaves more air above it. `related-articles.tsx` renders
the same cards and carries the same rule. Both card shells are the shared `Card`,
so the blog inherits the gradient hairline border used everywhere else; the filter is the same shape as `projects-filter`
(labelled search inside a `--border-gradient` wrapper, `bg-muted` tag chips that
flip to `bg-foreground` when selected). Filtering is client-side over
pre-rendered cards: the search box is matched against title/subtitle/description
and combined as OR across tags, AND with the query. The featured block, its rule
and its heading are all suppressed while any filter is active, so a filtered
page is just the result list.

Article tags are `article-tag.tsx`, not a bare `Badge`: the same `p-px` wrapper
over `--border-gradient` that `Card` uses, so a tag pill is a hairline-gradient
ring rather than a grey outline. The cards, the featured block and the article
page's `ArticleMeta` all go through it.

The grid is paginated client-side at `BLOG_PAGE_SIZE` (6) articles per page, and
the pagination always renders, down to `Page 1 of 1`, so the control does not
appear and disappear as articles accumulate. The current page is marked with the
same gradient ring over `bg-card`, never a white fill: the filled-chip treatment
belongs to the tag filter, and reusing it here made the pagination read as a
second filter. The pure helpers live in
`src/libs/blog/pagination.ts` (`pageCount`, `clampPage`, `buildPageWindow`,
`pageSlice`) and are unit-tested; `buildPageWindow` keeps the first, the last and
the current page with its two neighbours, collapsing the rest into `"gap"`
slots rendered as ellipses. The page number is the third piece of URL state in
`blog-filter-provider.tsx`, written as `?page=N` and omitted on page 1. Changing
a tag or the query resets it to 1, and a page number that outlives its result set
(a stale `?page=7` in a shared link) is clamped during render and written back to
the URL, rather than showing an empty grid. Because pagination is client-side
there is no per-page route to crawl, and the canonical URL remains
`/{locale}/blog`. Only the featured card and the current page of six render into
the HTML, though: the other articles reach the browser as data, and crawlers
discover them through the sitemap and the `Blog` JSON-LD, not by walking the
index.

That data is the reason `page.tsx` hands `ArticlesSection` a plain
`ArticleCardData` per article (`article-card-data.ts`) instead of a rendered
`<ArticleCard>`. Passing a server-rendered node puts the whole element tree,
inline cover included, into the RSC payload of every article, whether or not it
is ever shown: measured on 507 articles per locale that was 13.3 MB of HTML,
26 KB per article, against 728 KB and 1.1 KB per article once the cards became
client components fed by data. `ArticleCard`, `ArticleFeatured` and
`ArticleStamp` are therefore `"use client"`, and one card object carries both
cover URLs (`coverThumbUrl`, `coverHeroUrl`) so the featured article does not
need a second serialized object per article. Anything added to
`ArticleCardData` is paid once per article on every visit to the index, so keep
it to what a card actually draws. The `Blog` JSON-LD on the same page lists
only the `BLOG_RECENT_SIZE` newest posts, for the same reason: it grew by a
`BlogPosting` node per article and was the second heaviest thing on the index
once the cards stopped being the first.

`article-quick-actions.tsx` is the floating control that appears bottom-right
once the reader is past 60% of the viewport height. Collapsed it is a single
`button`; hovering the group, focusing into it, or tapping it reveals three
labelled actions (back to top, jump to the TL;DR, next article), and it collapses
on mouse leave, on blur, on Escape and on a pointer press outside. The `next`
target comes from `getNextArticle` in `source.ts`: the following part of the
series when there is one still unread, otherwise the first related article, so it
agrees with what the page recommends at the bottom. It is `inert` while hidden,
which keeps it out of the tab order instead of leaving invisible buttons
focusable, and the TL;DR jump relies on the `id="tldr"` and `scroll-mt-24` that
`article-takeaways.tsx` carries for exactly this reason.

The article page keeps the same vocabulary: `Card` for the series navigation
and the closing CTA (the margin goes on a wrapper, never on the `Card`, whose
gradient border is a separate outer element), `Button variant="gradient-outline"`
for the CTA action, and `ArticleStamp` for the date/reading-time line shared by
the cards. The TL;DR box (`article-takeaways.tsx`) is the one bespoke piece: it
borrows the `contact-cta-outline` trick — a conic gradient rotated through a
registered `@property` angle over a 1px padding ring — as `.tldr-outline` in
`globals.css`, but slower, counter-clockwise and without the white spike, so it
reads as a relative of the "Contattami" ring rather than a copy of it.

The homepage does not give the blog a section of its own. A dedicated block
between two `SectionConnector`s read as an orphan while scrolling, since every
other homepage section is announced by its own heading. The entry point is
instead a second link in the products section's existing CTA row,
`Read the blog` next to `See all the projects`, so the homepage gains a route to
`/blog` without gaining a block. `FooterBlogLinks` still lists recent articles in
the footer, and the header carries the `Blog` nav item, so the homepage is the
third of three doors rather than the only one. Nothing on the homepage reads the
article index.

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
