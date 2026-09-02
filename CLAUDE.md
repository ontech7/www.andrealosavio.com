# CLAUDE.md

Minimum context an AI coding agent needs to work productively on this
repository. Skim this first, then follow the links to deeper docs.

## Project at a glance

- Personal portfolio / lead-gen site for Andrea Losavio
  (<https://www.andrealosavio.com>).
- **Next.js 16 App Router + React 19 + TypeScript (strict)**.
- Bilingual (IT default, EN) via `next-intl`. IT is the primary audience.
- Deployed on Vercel. All configuration ultimately flows from a single env var:
  `NEXT_PUBLIC_SITE_URL` (bare hostname, no scheme).

## Commands

```bash
npm run dev        # local dev server on http://localhost:3000
npm run build      # production build (requires NEXT_PUBLIC_SITE_URL)
npm run lint       # eslint
npm run lint:fix
npm run format     # prettier --write .
npx tsc --noEmit   # type check (run this after any TS edit)
npx vitest run      # unit tests, alias: npm test (src/libs/blog/* pure functions;
                     # components are not unit-tested, covered by tsc + lint +
                     # build + manual checks)
npm run indexnow   # ping IndexNow (Bing/Yandex/Seznam/Naver, NOT Google) with
                     # the URLs whose sitemap <lastmod> is within 7 days.
                     # Run it AFTER the deploy is live, never before: it refuses
                     # to submit URLs that are not yet fetchable.
                     # --all | --since=N | --dry-run | <url>...
```

## Must-read docs (in this order)

1. [architecture.md](.claude/rules/architecture.md) — folder layout, routing,
   i18n, SEO, contact flow.
2. [coding-standards.md](.claude/rules/coding-standards.md) — conventions every
   PR must follow.
3. [seo.md](.claude/rules/seo.md) — SEO practices, testing procedures, Search
   Console & Vercel configuration.
4. [README.md](README.md) — setup + env vars.

## Non-obvious rules to respect

- **No comments in `src/`**, except `/** JSDoc */` on exports inside `src/libs/`
  and `src/utils/`. Prefer self-documenting code.
- **Translation calls always use the root namespace**: `useTranslations()` /
  `getTranslations({ locale })` with **no** namespace argument, then pass
  fully-qualified keys such as `t("about.experiences.title")`. Do not
  reintroduce per-namespace hook calls.
- Locale-aware navigation must go through `@/libs/i18n/navigation` (not
  `next/link`). `Link`, `usePathname`, `useRouter`, `redirect` are re-exported
  there.
- `src/proxy.ts` is the Next.js 16 equivalent of `middleware.ts`. Do not add a
  `middleware.ts` file.
- **A file that must answer at the domain root needs two changes, not one**:
  drop it in `public/` **and** add it to the `matcher` exclusions in
  `src/proxy.ts`. Otherwise `next-intl` redirects it to `/it/<file>` and the
  caller gets a 307 instead of the file. This is why `favicon.*`, `robots.txt`,
  `sitemap.xml`, `llms.txt`, `BingSiteAuth.xml` and root-level `*.txt` (the
  IndexNow key) are all listed there. Search-engine ownership proofs fail
  silently when this is missed.
- `src/app/llms.txt/route.ts` generates the LLM briefing dynamically. It does
  not enumerate articles; it does list published case studies. There is no
  `public/llms.txt` anymore — do not add one back as a static file.
- `src/mdx-components.tsx` **must** stay at exactly that path (project root or
  `src` root — Next only looks in those two places for MDX component overrides).
  Moving it into `src/components/` silently breaks MDX rendering.
- MDX plugins in `next.config.ts` (`remarkPlugins`, `rehypePlugins`) must be
  passed as strings (or `[string, jsonSerializableOptions]` tuples), never
  function references — Turbopack ships the config to a Rust engine that cannot
  serialize functions. This is why `rehype-pretty-code` line styling is done in
  CSS instead of its `onVisitLine` callback API.
- Page-local components/sections/constants stay next to their `page.tsx`.
  Promote to `src/components/` only when ≥ 2 routes consume them.
- Security layers in `/api/contact` run in a specific order (origin → rate-limit
  → CSRF → field validation → email send). Keep it that way.
- When touching translations, update **both** `src/translations/en/*.json` and
  `src/translations/it/*.json`.
- **`content/case-studies/` must never be empty.** Turbopack resolves the case
  study page's dynamic MDX import at build time; with no `.mdx` matching the
  pattern the build fails, and empty directories fail identically. Keep at least
  one file, even a `draft: true` skeleton.

## Quick orientation map

| I want to…                  | Start here                                                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Add a new page              | `src/app/[locale]/<route>/page.tsx`, plus `sitemap.ts`                                                                              |
| Tweak the header / footer   | `src/components/layout/`                                                                                                            |
| Add / reshape a translation | `src/translations/<locale>/<ns>.json` + `src/libs/i18n/request.ts` if a new namespace                                               |
| Add JSON-LD to a page       | `src/utils/seo-schema.ts` helpers                                                                                                   |
| Change the contact flow     | `src/app/[locale]/(homepage)/sections/contact-section.tsx`, `src/app/api/contact/route.ts`, `src/libs/email/`, `src/libs/security/` |
| Update OG metadata          | `generateMetadata` inside the relevant `page.tsx`                                                                                   |
| Touch URL-driven filters    | hand-rolled context provider near the consumer, e.g. `projects-filter-provider.tsx` or `blog-filter-provider.tsx` (see below)       |
| Write a blog article        | `blog-ghostwriter` skill, or hand-write the `content/blog/{it,en}/` MDX pair                                                        |
| Write a case study          | `content/case-studies/{it,en}/` — MDX pair sharing one slug; `project:` must exist in `PROJECTS`                                    |
| Design an article cover     | `blog-cover-designer` skill; the automatic fallback lives in `blog/components/article-cover.tsx`                                    |
| Change how articles render  | `src/mdx-components.tsx`                                                                                                            |

## Available agent skills (load with the `skill` tool)

These skills live in the repo and can be invoked when the task matches. Paths
are absolute file URIs — open them to see the full instructions.

- [accessibility-compliance](.claude/skills/accessibility-compliance/SKILL.md) —
  WCAG 2.2 audits, ARIA patterns, screen-reader support.
- [blog-cover-designer](.claude/skills/blog-cover-designer/SKILL.md) — design a
  bespoke SVG cover for an article, when the automatic one is not enough.
- [blog-ghostwriter](.claude/skills/blog-ghostwriter/SKILL.md) — write, draft,
  or translate a paired IT/EN blog article for `content/blog/`.
- [fixing-motion-performance](.claude/skills/fixing-motion-performance/SKILL.md)
  — triage and fix animation performance regressions.
- [seo-audit](.claude/skills/seo-audit/SKILL.md) — technical SEO audits,
  meta/structured-data review.
- [vercel-react-best-practices](.claude/skills/vercel-react-best-practices/SKILL.md)
  — Vercel Engineering's React / Next.js performance guidelines.

User-scope skills (not in repo) to consider when relevant:

- `frontend-design` — polished, non-generic UI design for new components /
  pages.
- `find-skills` — when the user asks whether a skill exists.

## Workflow expectations

- Reason like a senior software architect: prefer small, reversible changes and
  call out trade-offs when they matter.
- Use `TodoWrite` to plan multi-step tasks.
- After substantial changes, run `npx tsc --noEmit` at minimum; `npm run lint`
  and `npm run build` for anything that touches routing, metadata, or i18n.
- Open questions belong in the PR description or in a follow-up issue — never
  silently assume.
