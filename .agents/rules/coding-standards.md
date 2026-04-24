# Coding Standards

Conventions agreed for this repository. Follow them so the codebase stays
coherent and easy to navigate.

## General

- **TypeScript strict mode is non-negotiable.** Do not weaken `tsconfig.json`.
- **No comments** inside `src/` except `/** JSDoc */` on exported functions and
  types in `src/libs/` and `src/utils/` where they aid IntelliSense.
- Prefer **self-documenting code**: clearer names over clever tricks or
  explanatory comments.
- Run `npx tsc --noEmit`, `npm run lint`, and `npm run format` before committing
  anything non-trivial.
- No `console.log` in committed code. `console.error` is allowed for genuine
  error logging paths (API routes).

## Formatting

- Prettier + `prettier-plugin-tailwindcss` is the source of truth. Do not
  reformat by hand.
- 2-space indentation, double quotes, trailing commas where Prettier emits them.

## Imports

- Absolute imports via `@/*` (mapped to `src/*` in `tsconfig.json`).
- Grouping: external packages first, then `@/…`, then relative imports.
- No default exports except where Next.js demands one (route files, `page.tsx`,
  `layout.tsx`, `not-found.tsx`, metadata routes). Library modules and
  components should use named exports.

## React / Next.js

- Server Components by default. Add `"use client"` only when the component needs
  state, effects, browser APIs, or interactive handlers.
- Prefer `async` Server Components for data fetching over `useEffect`.
- Page components live in `page.tsx` and export a named `generateMetadata` next
  to the default export.
- Route-local pieces (sections, cards, constants) belong next to the `page.tsx`
  that uses them (`app/[locale]/<route>/{components,sections,constants}`).
  Promote to `src/components/` only when at least two routes need them.
- Client fetchers should never leak secrets. Anything that talks to third
  parties goes through `src/app/api/*` or a server component.

## Components

- Named `export function MyComponent()` — no arrow + default export.
- Props interface declared above the component and named `<Component>Props`.
- Accept a `className` prop whenever the component renders an element; merge via
  `cn()` from `src/utils/cn.ts`.
- Variants for reusable UI primitives use `class-variance-authority` (see
  `src/components/ui/button.tsx` as the canonical example).

## Styling

- Tailwind utility classes only. Avoid inline `style` objects unless the value
  is runtime-dynamic (e.g. gradients backed by CSS variables).
- Design tokens live in `src/app/globals.css` as CSS custom properties and are
  consumed through Tailwind arbitrary values (`bg-(image:--text-gradient)`).
- Mobile-first: declare base classes for small screens, then `md:`/`lg:`
  overrides.

## Internationalization

- Call `useTranslations()` / `getTranslations({ locale })` **without** a
  namespace. Always pass fully-qualified keys: `t("about.hero.title")`,
  `t.rich("homepage.makingAnImpact.items.investment")`.
- Keep translation files flat enough to grep: one namespace per domain
  (`about.json`, `projects.json`, …).
- All localized strings live in `src/translations/<locale>/<namespace>.json`.
  Both locales must stay in sync structurally.
- Route between locales only through `@/libs/i18n/navigation` (`Link`,
  `useRouter`, `usePathname`).

## URL State

- `nuqs` for anything that should be shareable via URL (filters, sort order,
  tabs). Define parsers next to the consumer.
- Local ephemeral UI state (open/close, hovered, …) stays in `useState`.

## SEO / Metadata

- Each `page.tsx` exports `generateMetadata`. Include canonical URL and hreflang
  alternates for all supported locales plus `x-default`.
- Use the helpers in `src/utils/seo-schema.ts` to produce JSON-LD. Pass an array
  to `schemaToJsonLd` when a page emits multiple schemas so they share an
  `@graph`.

## API Routes

- Return `NextResponse.json` with an explicit HTTP status.
- Validate input aggressively and fail fast (`400` / `403` / `429`).
- Never echo user input into error responses — return generic messages and rely
  on `console.error` server-side for diagnostics.
- Security layers (origin check, rate limiting, CSRF, field validation, email
  format) must run in that order.

## Git Hygiene

- Commits should describe _why_, not _what_. The diff already shows the what.
- Keep feature work and refactors in separate commits where practical.
- Do not commit generated files (`.next/`), credentials, or email templates with
  hard-coded production data.

## Accessibility

- Every interactive element must be reachable via keyboard and expose a
  meaningful `aria-label` when its visual text is absent.
- Respect `prefers-reduced-motion` for long animations.
- Decorative images carry `aria-hidden="true"` and empty `alt`.
- See `.agents/skills/accessibility-compliance/SKILL.md` for the full WCAG 2.2
  checklist we target.
