# Andrea Losavio - Portfolio Website

Personal portfolio website designed to generate leads and attract potential
clients.

## Tech Stack

- **Next.js 16.1.6** (App Router)
- **React 19.2**
- **TypeScript 5**
- **Tailwind CSS 4**
- **shadcn/ui** for UI components
- **next-intl** for internationalization (IT / EN)
- **Motion** for animations
- **Zod** + **React Hook Form** for form validation
- **nuqs** for query params state management

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # App Router pages and layouts
│   └── [locale]/           # Internationalized routes
│       ├── (homepage)/     # Homepage route group
│       │   ├── components/ # Page-scoped components
│       │   └── sections/   # Page sections
│       └── components/     # Locale-specific shared components
├── components/             # Shared reusable components
│   └── ui/                 # Primitive components (shadcn)
├── constants/              # Shared constants
├── libs/                   # External libraries and vendor logic
│   └── i18n/               # Internationalization config
├── translations/           # i18n dictionaries
│   ├── en/                 # English translations
│   └── it/                 # Italian translations
└── utils/                  # Utility functions
```

## Available Scripts

| Script     | Description               |
| ---------- | ------------------------- |
| `dev`      | Start development server  |
| `build`    | Build for production      |
| `start`    | Start production server   |
| `lint`     | Run ESLint                |
| `lint:fix` | Run ESLint with auto-fix  |
| `format`   | Format code with Prettier |

## Design

The design system is defined in Figma:
[Andrea Losavio 2.0 - Design System](https://www.figma.com/design/1f4uJbwdNlmM1lAxob0hn2/Andrea-Losavio-2.0---Design-System)

## License

All rights reserved.
