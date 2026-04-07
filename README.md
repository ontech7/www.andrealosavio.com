# Andrea Losavio - Portfolio Website

Personal portfolio website designed to generate leads and attract potential
clients.

## Tech Stack

- **Next.js 16.1.6** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (only required components)
- **next-intl** for internationalization (IT / EN)
- **Resend API** for contact form emails
- **Motion** for animations
- **nuqs** for query params state management

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.sample` to `.env` and configure the variables:

```bash
cp .env.sample .env
```

**Required variables:**

- `NEXT_PUBLIC_SITE_URL` - Your domain (without https://)
  - Local: `"localhost:3000"`
  - **Production: `"www.andrealosavio.com"`** ⚠️ Critical for SEO!
- `RESEND_API_KEY` - API key from [Resend](https://resend.com)
- `OWNER_EMAIL` - Email to receive contact form submissions
- `FROM_EMAIL` - Sender email for notifications
- `CSRF_SECRET` - Secret for CSRF protection (generate with
  `openssl rand -hex 32`)
- `CAT_API_KEY` - (Optional) API key from [The Cat API](https://thecatapi.com)

**Deployment (Vercel):**

Set these environment variables in your Vercel project settings:

1. Go to your project → Settings → Environment Variables
2. Add all variables from `.env.sample`
3. **Make sure to set `NEXT_PUBLIC_SITE_URL` to `www.andrealosavio.com`**
   (without https://)
4. Deploy!

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

All rights reserved. Empty commit.
