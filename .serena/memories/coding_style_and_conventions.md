# Coding Style & Conventions

## File Naming
- **kebab-case** for all file names: `contact-form.tsx`, `hero-section.tsx`
- Components live in `.tsx` files, constants/utils in `.ts` files

## Component Conventions
- **Named function exports** (no default exports for components):
  ```tsx
  export function ComponentName() {}
  ```
- Exception: page components use `export default async function PageName()`
- **Server Components by default** — only use `"use client"` when strictly required
- Props defined as interfaces above the component: `interface ComponentNameProps { ... }`
- Avoid unnecessary abstraction and over-engineering

## TypeScript
- Strict mode enabled
- No `any` or `unknown` — use discriminated unions, well-defined interfaces
- `as const` assertions for constant arrays/objects
- Types should improve readability, not reduce it

## Styling
- Tailwind CSS v4 classes directly in JSX
- `cn()` utility from `@/utils/cn` for conditional classes (clsx + tailwind-merge)
- shadcn/ui components customized to match Figma design
- No inline styles unless absolutely necessary

## Internationalization
- ALL user-facing strings in `/src/translations/{locale}/*.json`
- Never hardcode text in components
- Use `useTranslations("namespace")` in client components
- Use `getTranslations({ locale, namespace })` in server components
- Translation keys use dot notation: `"section.title"`, `"section.description"`

## Animation Patterns
- Use Motion library (`motion` package, successor to framer-motion)
- Shared animation variants in `src/constants/motion.ts`
- Common pattern: `fadeInUpAnim` with `whileInView` and `viewport={{ once: true }}`
- Stagger animations via `staggerContainerAnim`

## Imports
- Path alias `@/*` for all src imports
- Group: external libraries → internal modules → relative imports
- Lucide icons imported individually: `import { IconName } from "lucide-react"`

## Constants Pattern
- Shared constants in `src/constants/` (navigation, projects, services, motion)
- Page-scoped constants in `app/[locale]/[page]/constants/`
- Use `as const` for readonly constant arrays/objects
- Translation keys stored in constants, resolved at render time

## Prettier Configuration
- Print width: 80
- Semicolons: yes
- Double quotes (not single)
- Trailing commas: es5
- Bracket spacing: yes
- Arrow parens: always
- Tailwind CSS plugin for class sorting

## Hooks Policy
- Custom hooks only if **indispensable**
- Prefer logic inside components if it doesn't harm readability
- No speculative "just in case" hooks
