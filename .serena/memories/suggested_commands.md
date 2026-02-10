# Suggested Commands

## Development
```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run start        # Start production server
```

## Code Quality
```bash
npm run lint         # Run ESLint (JS/JSX/TS/TSX)
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Run Prettier on all files
```

## shadcn/ui
```bash
npx shadcn@latest add [component]   # Add a shadcn component
```

## System Utilities (macOS/Darwin)
```bash
git status           # Check git status
git log --oneline    # View commit history
git diff             # View changes
```

## Notes
- No test framework is currently configured (no test script in package.json)
- The project uses ESLint flat config (`eslint.config.mjs`) with next core-web-vitals + TypeScript rules
- Prettier config: double quotes, semicolons, trailing commas (es5), 80 char print width, Tailwind CSS plugin
