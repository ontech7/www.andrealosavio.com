# Task Completion Checklist

After completing a coding task, perform the following steps:

## 1. Lint Check
```bash
npm run lint
```
Fix any ESLint errors or warnings before considering the task complete.

## 2. Format Code
```bash
npm run format
```
Ensure all modified files are properly formatted with Prettier.

## 3. Build Verification
```bash
npm run build
```
Verify the project builds successfully without TypeScript or build errors.

## 4. Translations
- If any user-facing text was added or modified, ensure translations exist in **both** `src/translations/it/` and `src/translations/en/`
- Never leave hardcoded strings in components

## 5. Design Fidelity
- Verify changes match the Figma design system
- Check responsive behavior (Desktop, Tablet, Mobile)
- Dark mode only — no light mode considerations

## 6. Code Quality Review
- No `any` or `unknown` types
- Named function exports (not default) for components
- Server components by default, client only when necessary
- No unnecessary abstractions or hooks

## Notes
- There is currently **no test suite** configured in this project
- README.md should be updated if architectural or setup changes were made
