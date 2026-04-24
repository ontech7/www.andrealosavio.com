# AGENTS.md

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
```

## Must-read docs (in this order)

1. [architecture.md](.agents/rules/architecture.md) — folder layout, routing,
   i18n, SEO, contact flow.
2. [coding-standards.md](.agents/rules/coding-standards.md) — conventions every
   PR must follow.
3. [seo.md](.agents/rules/SEO.md) — SEO practices, testing procedures, Search
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
- `public/llms.txt` is a static file. Do not recreate it as a Next.js route.
  URLs inside are hard-coded to `https://www.andrealosavio.com`.
- Page-local components/sections/constants stay next to their `page.tsx`.
  Promote to `src/components/` only when ≥ 2 routes consume them.
- Security layers in `/api/contact` run in a specific order (origin → rate-limit
  → CSRF → field validation → email send). Keep it that way.
- When touching translations, update **both** `src/translations/en/*.json` and
  `src/translations/it/*.json`.

## Quick orientation map

| I want to…                  | Start here                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Add a new page              | `src/app/[locale]/<route>/page.tsx`, plus `sitemap.ts`                                |
| Tweak the header / footer   | `src/components/layout/`                                                              |
| Add / reshape a translation | `src/translations/<locale>/<ns>.json` + `src/libs/i18n/request.ts` if a new namespace |
| Add JSON-LD to a page       | `src/utils/seo-schema.ts` helpers                                                     |
| Change the contact flow     | `src/app/api/contact/route.ts`, `src/libs/email/`, `src/libs/security/`               |
| Update OG metadata          | `generateMetadata` inside the relevant `page.tsx`                                     |
| Touch URL-driven filters    | `nuqs` parsers near the consumer (e.g. `projects-section.tsx`)                        |

## Available agent skills (load with the `skill` tool)

These skills live in the repo and can be invoked when the task matches. Paths
are absolute file URIs — open them to see the full instructions.

- [accessibility-compliance](.agents/skills/accessibility-compliance/SKILL.md) —
  WCAG 2.2 audits, ARIA patterns, screen-reader support.
- [fixing-motion-performance](.agents/skills/fixing-motion-performance/SKILL.md)
  — triage and fix animation performance regressions.
- [seo-audit](.agents/skills/seo-audit/SKILL.md) — technical SEO audits,
  meta/structured-data review.
- [vercel-react-best-practices](.agents/skills/vercel-react-best-practices/SKILL.md)
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
