# Coding Style and Conventions

## General Guidelines

### Language & Framework
- **TypeScript** with strict mode enabled
- **Next.js 16+** App Router (no Pages Router)
- **React 19** with Server Components by default
- Use `"use client"` directive only when necessary (interactivity, hooks, browser APIs)

## File Organization

### Naming Conventions
- **Files**: kebab-case for all files
  - Components: `hero-section.tsx`, `service-card.tsx`
  - Utils: `seo-schema.ts`, `cn.ts`
  - Constants: `motion.ts`, `navigation.ts`
- **Components**: PascalCase for component names
  - Export: `export function HeroSection() { ... }`
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Types/Interfaces**: PascalCase with descriptive names

### Component Structure
```tsx
// 1. Imports (grouped)
import { type ComponentType } from "react";
import { externalLibrary } from "external-lib";
import { internalUtil } from "@/utils/util";

// 2. Types/Interfaces
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Component
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Implementation
  return <div>...</div>;
}
```

### File Location Patterns
- **Page-scoped components**: `src/app/[locale]/{page}/components/`
- **Page sections**: `src/app/[locale]/{page}/sections/`
- **Global components**: `src/components/`
- **UI primitives**: `src/components/ui/` (shadcn)
- **Layout components**: `src/components/layout/`

## TypeScript

### Strict Mode
- `strict: true` in tsconfig.json
- Always provide explicit types for function parameters
- Use `interface` for object shapes, `type` for unions/intersections
- Prefer type inference for return types when obvious

### Type Definitions
```tsx
// Good: Explicit parameter types
export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // ...
}

// Good: Interface for props
interface HeroSectionProps {
  title: string;
  description?: string;
}

// Good: Type for unions
type Locale = "en" | "it";
```

### Async/Await Pattern
```tsx
// Server Components: async/await
export async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "..." });
  // ...
}
```

## React Patterns

### Server Components (Default)
- Use by default for all components
- No `"use client"` directive needed
- Can use async/await directly
- Access to server-side APIs

### Client Components
- Add `"use client"` at the top only when needed:
  - Using React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document)
  - Event handlers
  - Animation libraries (Motion)

```tsx
"use client";

import { useState } from "react";

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  // ...
}
```

### Component Composition
- Small, focused components
- Extract sections into separate files
- Use composition over prop drilling

## Styling

### Tailwind CSS
- **Version**: Tailwind CSS 4
- **Class organization**: Use Prettier plugin for automatic sorting
- **Conditional classes**: Use `cn()` utility from `src/utils/cn.ts`

```tsx
import { cn } from "@/utils/cn";

<div className={cn(
  "base-classes here",
  condition && "conditional-classes",
  anotherCondition ? "true-classes" : "false-classes"
)} />
```

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test on mobile devices

### Motion Animations
- Use `motion` library (v12+)
- Animation constants in `src/constants/motion.ts`
- Prefer CSS transforms over layout properties

## Internationalization (i18n)

### Translation Keys
- Organized by namespace: `"homepage.metadata.title"`
- Files in `src/translations/{locale}/`
- Use `getTranslations()` in Server Components
- Use `useTranslations()` in Client Components

```tsx
// Server Component
const t = await getTranslations({ locale, namespace: "homepage.metadata" });
const title = t("title");

// Client Component
const t = useTranslations("homepage.metadata");
const title = t("title");
```

### Localized Routes
- All routes under `[locale]` folder
- URL structure: `/it/services`, `/en/services`
- Generate metadata per locale with hreflang

## Code Quality

### ESLint Configuration
- Next.js recommended rules
- TypeScript support enabled
- Configured in `eslint.config.mjs`

### Prettier Configuration
```json
{
  "printWidth": 80,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "singleQuote": false,
  "proseWrap": "always"
}
```

### Best Practices
- **Semicolons**: Always use
- **Quotes**: Double quotes for strings
- **Line length**: Max 80 characters
- **Trailing commas**: ES5 style
- **Arrow functions**: Always use parentheses around parameters
- **Imports**: Organize in logical groups (React, external, internal)

## Path Aliases
- Use `@/*` for absolute imports from `src/`
- Example: `import { cn } from "@/utils/cn"`

## Comments & Documentation
- Add JSDoc comments for complex functions
- Explain "why" not "what" in comments
- Document non-obvious behavior
- Keep comments up to date

## Constants & Configuration
- Extract magic numbers and strings to constants
- Group related constants in files under `src/constants/`
- Use TypeScript enums sparingly (prefer const objects or unions)

## Forms
- Use `react-hook-form` for form state management
- Implement proper validation
- Handle loading and error states
- Provide user feedback

## Performance
- Lazy load components when appropriate
- Optimize images with Next.js Image component
- Use static generation (SSG) by default
- Minimize client-side JavaScript

## SEO
- Every page must have unique metadata
- Include canonical URLs
- Add hreflang for i18n
- Use proper semantic HTML
- Include Schema.org structured data where appropriate

## Git Workflow
- Descriptive commit messages
- Small, focused commits
- Branch naming: `feature/`, `fix/`, `refactor/`
