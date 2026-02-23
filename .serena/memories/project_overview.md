# Project Overview - www.andrealosavio.com

## Purpose
Personal portfolio website designed to generate leads and attract potential clients for Andrea Losavio, a Software Engineer & Tech Partner.

## Tech Stack

### Core Framework
- **Next.js 16.1.6** with App Router
- **React 19.2.3**
- **TypeScript 5**
- **Node.js 20+**

### Styling & UI
- **Tailwind CSS 4** with PostCSS
- **shadcn/ui** components (Radix UI based)
- **Motion (v12.26.1)** for animations
- **lucide-react** for icons
- **class-variance-authority** and **clsx** for conditional styling

### Internationalization
- **next-intl (v4.7.0)** for i18n
- Supported locales: **IT (Italian)** and **EN (English)**
- Default locale: EN

### Additional Libraries
- **nuqs** for query params state management
- **react-hook-form** for form handling
- **Resend API** for contact form email delivery
- **canvas-confetti** for interactive effects
- **schema-dts** for TypeScript Schema.org types

### Development Tools
- **ESLint 9** with Next.js config
- **Prettier 3.7.4** with Tailwind plugin
- **prettier-plugin-tailwindcss** for class sorting

## Project Structure

```
/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Internationalized routes
│   │   │   ├── (homepage)/       # Homepage route group
│   │   │   │   ├── sections/     # Homepage sections
│   │   │   │   └── components/   # Homepage-specific components
│   │   │   ├── services/         # Services page
│   │   │   ├── projects/         # Projects page
│   │   │   ├── about/            # About page
│   │   │   ├── best-practices/   # Best practices page
│   │   │   ├── privacy/          # Privacy policy page
│   │   │   ├── components/       # Locale-scoped shared components
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── not-found.tsx     # 404 page
│   │   ├── nuqs-provider.tsx     # Query params provider
│   │   ├── sitemap.ts            # Dynamic sitemap generation
│   │   └── robots.ts             # Dynamic robots.txt
│   ├── components/               # Global reusable components
│   │   ├── ui/                   # Primitive components (shadcn)
│   │   ├── layout/               # Layout components (header, footer)
│   │   ├── logo.tsx
│   │   ├── contact-form.tsx
│   │   ├── grid-layers.tsx
│   │   └── service-contact-dialog.tsx
│   ├── constants/                # Application constants
│   │   ├── motion.ts             # Animation constants
│   │   ├── navigation.ts         # Navigation menu items
│   │   ├── projects.ts           # Projects data
│   │   └── services.ts           # Services data
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # Tailwind class merger
│   │   └── seo-schema.ts         # SEO schema generators
│   ├── libs/                     # External libraries configuration
│   │   └── i18n/                 # Internationalization setup
│   ├── translations/             # Translation files
│   │   ├── en/                   # English translations
│   │   └── it/                   # Italian translations
│   └── proxy.ts                  # Proxy utilities
├── public/                       # Static assets
│   └── images/                   # Images (including og.jpg)
├── .agents/                      # Agent skills
├── .serena/                      # Serena MCP memories
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS configuration
├── .prettierrc.json              # Prettier configuration
├── package.json                  # Dependencies and scripts
├── README.md                     # Project documentation
└── SEO.md                        # Comprehensive SEO guide

```

## Pages
1. **Homepage** (`/[locale]`) - Hero, Impact, Feedback, Quote sections
2. **Services** (`/[locale]/services`) - Available services showcase
3. **Projects** (`/[locale]/projects`) - Portfolio with filtering
4. **About** (`/[locale]/about`) - Experience, hobbies, beyond code
5. **Best Practices** (`/[locale]/best-practices`) - Technical best practices showcase
6. **Privacy** (`/[locale]/privacy`) - Privacy policy

## Key Features

### SEO Optimization
- Multi-language sitemap (12 URLs: 6 pages × 2 languages)
- Dynamic robots.txt (blocks in dev, allows in production)
- Complete meta tags (title, description, canonical, hreflang)
- Open Graph images for social sharing (1200×630px)
- Schema.org JSON-LD markup:
  - Person schema (homepage)
  - Organization schema (homepage)
  - BreadcrumbList schema (other pages)
- Internationalization with hreflang tags
- Performance optimized (Core Web Vitals)

### Internationalization
- URL structure: `/it/page` and `/en/page`
- Separate translation files per locale
- Metadata localized per page

### Contact Form
- CSRF protection
- Email delivery via Resend API
- Form validation with react-hook-form

### Design System
- Figma design reference available
- Consistent component architecture
- Animation system with Motion
- Responsive grid layouts

## Environment Variables

### Required (Production)
- `NEXT_PUBLIC_SITE_URL` - Domain without https:// (**Critical for SEO!**)
  - Production: `www.andrealosavio.com`
  - Local: `localhost:3000`
- `RESEND_API_KEY` - API key from Resend
- `OWNER_EMAIL` - Email to receive contact form submissions
- `FROM_EMAIL` - Sender email for notifications
- `CSRF_SECRET` - Secret for CSRF protection (generate with `openssl rand -hex 32`)

### Optional
- `CAT_API_KEY` - API key from The Cat API

## Deployment
- **Platform**: Vercel
- **Domain**: www.andrealosavio.com
- **Critical**: Set `NEXT_PUBLIC_SITE_URL=www.andrealosavio.com` in Vercel environment variables

## System Information
- **Platform**: Darwin (macOS)
- **Node**: 20+
- **Package Manager**: npm
- **Git**: Yes (repository tracked)
