# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This project is a **personal portfolio website** designed to **generate leads**
and attract potential clients. The website must be visually impactful,
performant, and aligned with modern web best practices.

The design system and UI specifications are defined in Figma:
[https://www.figma.com/design/1f4uJbwdNlmM1lAxob0hn2/Andrea-Losavio-2.0---Design-System](https://www.figma.com/design/1f4uJbwdNlmM1lAxob0hn2/Andrea-Losavio-2.0---Design-System).
Use screenshots for retrieving design information. It should be 1:1. Same
spacing, same fonts, same colors, same everything.

The final output should strictly follow the Figma design while maintaining high
code quality and long-term maintainability.

## Tech Stack

- **Next.js 16.1.1** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (only required components)
- **next-intl** for internationalization (IT / EN)
- **Resend API** for contact form emails

## Project Architecture

The project follows a **server-first architecture**. It must be responsive to
Desktop, Tablet and Mobile. The project is dark mode by default. There is no
such thing as "light" and "dark" mode.

### Source Structure

```text
├── app                # App Router pages and layouts
│   ├── [page]
│   │   ├── components # Page-scoped components
│   │   ├── hooks
│   │   ├── utils
│   │   └── page.tsx
├── components         # Shared reusable components
│   ├── ui             # Primitive components (shadcn)
├── hooks              # Custom hooks (only if strictly necessary)
├── libs               # External libraries and vendor logic
├── utils              # Utilities (including cn.ts)
├── constants          # Shared constants (e.g. routes)
├── translations       # i18n dictionaries (it / en)
├── public             # General assets
```

## Component Rules

- Components **must be exported as named functions**

  ```ts
  export function ComponentName() {}
  ```

- File names must be **kebab-case**

  ```
  component-name.tsx
  ```

- Prefer **Server Components** by default
- Use **Client Components only when strictly required**
- Avoid unnecessary abstraction

## shadcn/ui Usage

- Install components using `npx shadcn@latest add [component]`
- Use **shadcn/ui components whenever possible**
- Only install and include components that are actually needed
- Customize styles to match the Figma design system
- Avoid duplicating shadcn primitives
- Use [Lucide icons](https://lucide.dev/icons/) whenever is possible.

## TypeScript Standards

- Types must always be correct and explicit
- **Avoid `any` and `unknown`**
- Prefer:
  - discriminated unions
  - well-defined interfaces
  - inferred generics where appropriate

- Types should improve readability, not reduce it

## Internationalization (i18n)

- The site is multilingual:
  - Italian (`it`)
  - English (`en`)

- Use **next-intl**
- All user-facing strings must live in `/src/translations`
- Do not hardcode strings inside components
- IMPORTANT: ALWAYS create translations when generating text

## Performance & Optimization

- Optimize only where it makes sense
- Balance:
  - code readability
  - architectural simplicity
  - performance

- Avoid premature optimization
- Prefer clear, maintainable code over clever tricks

## Hooks Policy

- Custom hooks must be created **only if indispensable**
- If logic can live inside a component without harming readability, do not
  extract it
- No speculative or “just in case” hooks

## Design Fidelity

- Follow the Figma design **as closely as possible**
- Respect:
  - spacing
  - typography
  - colors
  - layout behavior

- Always apply UI/UX best practices expected from a **10+ years experienced
  software engineer**

## Coding Style & Philosophy

- Code style should remain consistent with the author's personal coding approach
- Prefer clarity over over-engineering
- Avoid unnecessary indirection
- Write code that is easy to reason about and evolve

## Documentation

- The `README.md` must always be kept **up to date**
- Any relevant architectural or setup change should be reflected in the README

## AI Behavior Guidelines

When generating or modifying code:

- Respect all rules in this document
- Do not introduce libraries, patterns, or abstractions that are not explicitly
  requested
- Always consider whether a solution fits the project philosophy before applying
  it
- Think like a senior engineer working on a long-lived codebase
