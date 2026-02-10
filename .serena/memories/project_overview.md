# Project Overview

## Purpose
Personal portfolio website for Andrea Losavio - designed to generate leads and attract potential clients.

## Tech Stack
- Next.js 16.1.6 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix primitives)
- next-intl for i18n (IT/EN)
- Resend API for contact form emails
- Motion for animations
- nuqs for query params state management
- react-hook-form for forms

## Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run lint:fix` - ESLint with auto-fix
- `npm run format` - Prettier formatting

## Code Style
- Named function exports (not default)
- kebab-case file names
- Server Components by default
- Client Components only when strictly required
- No `any` or `unknown` types
- All strings in /src/translations (next-intl)

## Structure
- `src/app/[locale]/` - Pages (homepage, about, projects, services, privacy)
- `src/components/` - Shared components (ui, layout, contact-form)
- `src/translations/` - i18n dictionaries (it/, en/)
- `src/constants/` - Shared constants
- `src/libs/` - External libs (i18n, email)
- `src/utils/` - Utilities (cn.ts)
