# Project Overview: www.andrealosavio.com

## Purpose
Personal portfolio website for Andrea Losavio, designed to generate leads and attract potential clients.
Dark mode only (no light/dark toggle). Must follow Figma design system 1:1.

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router, server-first architecture)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **UI Library**: shadcn/ui (new-york style, Lucide icons)
- **i18n**: next-intl v4.7 — locales: `it` (Italian), `en` (English, default)
- **Animations**: Motion (framer-motion successor)
- **Forms**: react-hook-form + Resend API for emails
- **Query State**: nuqs v2
- **Formatting/Linting**: Prettier + ESLint (next config)

## Architecture

### Routing
- App Router with `[locale]` dynamic segment
- Proxy/middleware in `src/proxy.ts` handles i18n locale detection via `next-intl/middleware`
- Pages: Homepage `(homepage)`, Services, Projects, About, Best Practices, Privacy
- API routes: `/api/contact` (email), `/api/csrf` (CSRF token)

### Source Structure (under `src/`)
```
app/
  [locale]/
    (homepage)/       # Homepage (route group)
      sections/       # Page sections (hero, feedback, etc.)
      components/     # Page-scoped components
      constants/      # Page-scoped constants
    services/         # Services page
    projects/         # Projects page
    about/            # About page
    best-practices/   # Best Practices page
    privacy/          # Privacy page
    layout.tsx        # Root layout (fonts, metadata)
  api/
    contact/route.ts  # Contact form API
    csrf/route.ts     # CSRF token API
components/
  ui/                 # shadcn primitives (button, card, dialog, etc.)
  layout/             # Layout components (header, footer, etc.)
  contact-form.tsx    # Shared contact form
  grid-layers.tsx     # Grid overlay
  logo.tsx            # Logo component
constants/            # Shared constants (navigation, projects, services, motion)
utils/                # Utilities (cn.ts for classnames)
libs/
  i18n/               # next-intl config (routing, request, utils)
  email/              # Resend email templates
  security/           # CSRF + rate limiting
translations/
  it/                 # Italian translations (JSON per namespace)
  en/                 # English translations (JSON per namespace)
```

### Path Alias
- `@/*` → `./src/*`

### Design System (globals.css)
- Dark theme only (`color-scheme: dark`)
- Custom CSS variables for colors, gradients, radii
- Fonts: DM Sans (sans), DM Mono (mono)
- Custom breakpoints: sm(480), md(768), lg(900), xl(1024), 2xl(1200), 3xl(1400)
- Custom scrollbar styling
- Reduced motion accessibility support

### Key Patterns
- Pages are composed of **sections** (server components by default)
- Each page folder has: `sections/`, `components/`, `constants/`, `page.tsx`
- Motion animations use shared variants from `constants/motion.ts` (fadeInUpAnim, staggerContainerAnim)
- `generateMetadata` used for per-page SEO with translations
- `generateStaticParams` for static locale generation
