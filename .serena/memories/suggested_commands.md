# Suggested Commands

## Development

### Start Development Server
```bash
npm run dev
```
- Starts Next.js development server on `http://localhost:3000`
- Hot reload enabled
- Use for local development and testing

### Build for Production
```bash
npm run build
```
- Creates optimized production build
- Validates TypeScript types
- Generates static pages
- Must succeed before deployment

### Start Production Server (Local)
```bash
npm start
```
- Serves production build locally
- Run after `npm run build`
- Use to test production build before deployment

## Code Quality

### Linting

#### Check for Lint Errors
```bash
npm run lint
```
- Runs ESLint on the entire codebase
- Checks `.js`, `.jsx`, `.ts`, `.tsx` files
- Reports errors and warnings
- Use before committing

#### Auto-fix Lint Errors
```bash
npm run lint:fix
```
- Automatically fixes fixable ESLint errors
- Applies code style corrections
- Review changes before committing

### Formatting

#### Format Code
```bash
npm run format
```
- Formats all files with Prettier
- Applies consistent code style
- Sorts Tailwind classes automatically
- **Run before every commit**

## Package Management

### Install Dependencies
```bash
npm install
```
- Installs all dependencies from `package.json`
- Run after cloning or when dependencies change
- Creates/updates `package-lock.json`

### Add New Package
```bash
npm install <package-name>
```
- Installs and adds to `dependencies`
- For dev dependencies: `npm install -D <package-name>`

### Update Dependencies
```bash
npm update
```
- Updates packages to latest compatible versions
- Respects semver ranges in `package.json`

## Environment Setup

### Copy Environment Variables
```bash
cp .env.sample .env
```
- Creates `.env` from template
- **Edit `.env` with your values**
- Required before first run

### Generate CSRF Secret
```bash
openssl rand -hex 32
```
- Generates random 32-byte hex string
- Use for `CSRF_SECRET` in `.env`

## Git Commands (Darwin/macOS)

### Check Status
```bash
git status
```
- Shows modified, staged, untracked files
- Check before committing

### Stage Changes
```bash
git add .
```
- Stages all changes for commit
- Or stage specific files: `git add <file>`

### Commit Changes
```bash
git commit -m "Descriptive commit message"
```
- Creates commit with message
- Follow conventional commits format

### Push to Remote
```bash
git push
```
- Pushes commits to remote repository
- Use after local commits

### Pull Latest Changes
```bash
git pull
```
- Fetches and merges remote changes
- Run before starting new work

### View Commit History
```bash
git log --oneline
```
- Shows commit history in compact format
- Use to review recent changes

### View Differences
```bash
git diff
```
- Shows unstaged changes
- `git diff --staged` for staged changes

## File Operations (Darwin/macOS)

### List Files
```bash
ls -la
```
- Lists all files including hidden ones
- Shows permissions and details

### Find Files
```bash
find . -name "*.tsx" -type f
```
- Finds files by name pattern
- Recursive search from current directory

### Search in Files
```bash
grep -r "pattern" src/
```
- Searches for text pattern in files
- `-r` for recursive search
- `-i` for case-insensitive

### View File Content
```bash
cat <file>
```
- Displays file content
- For large files: `less <file>`

### Change Directory
```bash
cd src/app
```
- Navigates to directory
- `cd ..` to go up one level
- `cd ~` to go to home directory

## Testing & Validation

### Test Sitemap (Local)
```bash
npm run build && npm start
curl http://localhost:3000/sitemap.xml
```
- Builds and starts production server
- Fetches sitemap to verify URLs

### Test robots.txt (Local)
```bash
curl http://localhost:3000/robots.txt
```
- Fetches robots.txt to verify content

### Check Environment Variable
```bash
echo $NEXT_PUBLIC_SITE_URL
```
- Displays value of environment variable
- Verify it's set correctly

## Production Verification

### Test Production Sitemap
```bash
curl https://www.andrealosavio.com/sitemap.xml
```
- Verifies sitemap is accessible
- Check for correct URLs

### Test OG Image
```bash
curl -I https://www.andrealosavio.com/images/og.jpg
```
- Checks if OG image loads (should return 200 OK)
- `-I` shows headers only

### Search for Pattern in Logs
```bash
grep "error" logs/*.log
```
- Searches for errors in log files
- Useful for debugging

## Clean Up

### Remove node_modules
```bash
rm -rf node_modules
```
- Deletes all installed packages
- Run before fresh install

### Remove Build Artifacts
```bash
rm -rf .next
```
- Deletes Next.js build cache
- Use when encountering build issues

### Clean Install
```bash
rm -rf node_modules package-lock.json && npm install
```
- Complete clean reinstall of dependencies
- Use when packages are corrupted

## Miscellaneous

### Check Node Version
```bash
node -v
```
- Displays installed Node.js version
- Should be 20+

### Check npm Version
```bash
npm -v
```
- Displays installed npm version

### Get Project Info
```bash
cat package.json
```
- Shows project metadata and scripts
- Lists all dependencies

### Create Directory
```bash
mkdir -p src/new-directory
```
- Creates directory (and parents with `-p`)

### Copy Files
```bash
cp source.txt destination.txt
```
- Copies file
- `-r` flag for directories

### Move/Rename Files
```bash
mv old-name.txt new-name.txt
```
- Renames or moves files

## Common Workflows

### Before Starting Work
```bash
git pull
npm install
npm run dev
```

### Before Committing
```bash
npm run format
npm run lint
npm run build
git add .
git commit -m "feat: descriptive message"
git push
```

### Fresh Clone Setup
```bash
npm install
cp .env.sample .env
# Edit .env with your values
npm run dev
```

### Deploy Check
```bash
npm run build
npm start
# Test locally, then push to trigger Vercel deployment
```
