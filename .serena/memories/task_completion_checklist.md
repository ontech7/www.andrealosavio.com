# Task Completion Checklist

## Before Committing Code

### 1. Code Quality
- [ ] **Format code**: Run `npm run format` (Prettier)
- [ ] **Lint code**: Run `npm run lint` and fix all errors
- [ ] **TypeScript**: No TypeScript errors (checked during build)
- [ ] **Remove console logs**: Remove or replace `console.log()` with proper logging
- [ ] **Remove commented code**: Clean up unused commented code
- [ ] **Review changes**: Use `git diff` to review all changes

### 2. Build & Test
- [ ] **Build succeeds**: Run `npm run build` without errors
- [ ] **Manual testing**: Test changed functionality in browser
- [ ] **Cross-browser**: Test in Chrome, Firefox, Safari (if UI changes)
- [ ] **Responsive**: Test on mobile, tablet, desktop viewports
- [ ] **Both locales**: Test in both IT and EN languages (if applicable)

### 3. Functionality Specific Checks

#### If Modified Pages or Metadata
- [ ] **Meta tags**: Verify title, description, canonical URL
- [ ] **Open Graph**: Check OG image and social preview
- [ ] **Hreflang**: Verify alternate language links
- [ ] **Schema markup**: Validate JSON-LD with [Rich Results Test](https://search.google.com/test/rich-results)

#### If Modified Components
- [ ] **Props validation**: Ensure proper TypeScript types
- [ ] **Error states**: Handle loading, error, empty states
- [ ] **Accessibility**: Check keyboard navigation and screen reader support
- [ ] **Performance**: Check for unnecessary re-renders

#### If Modified Styles
- [ ] **Responsive**: Check all breakpoints (sm, md, lg, xl)
- [ ] **Dark mode**: Verify if dark mode is affected (if implemented)
- [ ] **Animation**: Test animations are smooth and accessible
- [ ] **Contrast**: Ensure sufficient color contrast (WCAG AA)

#### If Modified Forms
- [ ] **Validation**: Test all validation rules
- [ ] **Error messages**: Display clear, helpful error messages
- [ ] **Success state**: Verify success feedback
- [ ] **CSRF protection**: Ensure CSRF token is working

#### If Modified i18n
- [ ] **Translation keys**: Verify keys exist in both en/ and it/
- [ ] **Fallbacks**: Check fallback behavior for missing keys
- [ ] **URL structure**: Verify `/it/` and `/en/` routes work

#### If Modified Environment Variables
- [ ] **Documentation**: Update README.md and .env.sample
- [ ] **Vercel**: Update environment variables in Vercel dashboard
- [ ] **Local**: Update local .env file
- [ ] **Rebuild**: Run `npm run build` after env changes

### 4. Git Workflow
- [ ] **Meaningful commit**: Write descriptive commit message
  - Format: `type: description`
  - Types: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`
  - Example: `feat: add contact form validation`
- [ ] **Small commits**: Keep commits focused and atomic
- [ ] **Review changes**: Double-check `git status` and `git diff --staged`

### 5. Documentation
- [ ] **Update README**: If project setup or scripts changed
- [ ] **Update SEO.md**: If SEO-related changes
- [ ] **Code comments**: Add comments for complex logic
- [ ] **Component props**: Document component props with JSDoc (if complex)

## Before Deployment (Production)

### 1. Environment Variables (Vercel)
- [ ] **NEXT_PUBLIC_SITE_URL**: Set to `www.andrealosavio.com` (NO https://)
- [ ] **RESEND_API_KEY**: Valid API key configured
- [ ] **OWNER_EMAIL**: Correct recipient email
- [ ] **FROM_EMAIL**: Valid sender email
- [ ] **CSRF_SECRET**: Secure random string set
- [ ] **CAT_API_KEY**: (Optional) Set if using Cat API

### 2. Build & Deployment
- [ ] **Local production build**: Test with `npm run build && npm start`
- [ ] **No build warnings**: Address all build warnings
- [ ] **Push to main/master**: Merge to production branch
- [ ] **Vercel deployment**: Wait for Vercel deployment to complete
- [ ] **Check deployment logs**: Verify no errors in Vercel logs

### 3. Post-Deployment Verification

#### Core Functionality
- [ ] **Homepage loads**: https://www.andrealosavio.com
- [ ] **All pages load**: Test /services, /projects, /about, /best-practices, /privacy
- [ ] **Both locales**: Test /it/ and /en/ versions
- [ ] **Navigation works**: All menu items navigate correctly
- [ ] **Contact form**: Test form submission (check OWNER_EMAIL receives it)

#### SEO & Meta
- [ ] **Sitemap accessible**: https://www.andrealosavio.com/sitemap.xml
- [ ] **Sitemap has 12 URLs**: Verify correct pages and locales
- [ ] **robots.txt correct**: https://www.andrealosavio.com/robots.txt (Allow: /)
- [ ] **OG image loads**: https://www.andrealosavio.com/images/og.jpg (200 OK)
- [ ] **Social preview**: Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] **Schema valid**: Test with [Rich Results Test](https://search.google.com/test/rich-results)

#### Performance
- [ ] **PageSpeed Insights**: Score > 90 on https://pagespeed.web.dev/
- [ ] **LCP < 2.5s**: Largest Contentful Paint is good
- [ ] **INP < 200ms**: Interaction to Next Paint is good
- [ ] **CLS < 0.1**: Cumulative Layout Shift is minimal
- [ ] **Lighthouse audit**: Run in Chrome DevTools (Performance, SEO, Accessibility)

#### Mobile & Responsive
- [ ] **Mobile-friendly test**: https://search.google.com/test/mobile-friendly
- [ ] **Test on real device**: iPhone, Android, or tablet
- [ ] **Touch targets**: All buttons/links are easily tappable
- [ ] **No horizontal scroll**: Content fits viewport

### 4. Google Search Console (After Major Changes)
- [ ] **Submit sitemap**: Re-submit in Search Console if structure changed
- [ ] **Request indexing**: For new or significantly changed pages
- [ ] **Monitor coverage**: Check for indexing errors
- [ ] **Check Core Web Vitals**: Verify metrics are "Good"
- [ ] **International targeting**: Verify hreflang tags detected

### 5. Monitoring (Week After Deployment)
- [ ] **Check error logs**: Monitor Vercel logs for errors
- [ ] **Test contact form**: Verify emails are delivered
- [ ] **Analytics**: Check traffic in Google Analytics
- [ ] **Search Console**: Monitor impressions, clicks, CTR
- [ ] **Performance**: Re-check Core Web Vitals

## Quick Pre-Commit Commands

Run these commands in sequence before every commit:

```bash
npm run format      # Format code
npm run lint       # Check linting
npm run build      # Verify build succeeds
git add .          # Stage changes
git status         # Review staged files
git commit -m "type: description"
git push           # Push to remote
```

## Quick Pre-Deploy Checklist

Before merging to production:

```bash
npm run build      # Build must succeed
npm start          # Test production build locally
# Verify environment variables in Vercel dashboard
# Merge to main/master
# Monitor Vercel deployment
# Run post-deployment verification
```

## Troubleshooting

### Build Fails
1. Check TypeScript errors in console
2. Verify all imports are correct
3. Check for missing dependencies
4. Clear `.next` folder: `rm -rf .next && npm run build`

### Sitemap Not Working
1. Verify `NEXT_PUBLIC_SITE_URL` is set correctly (no https://)
2. Rebuild: `npm run build`
3. Check `src/app/sitemap.ts` for errors

### OG Image Not Showing
1. Verify image exists: `public/images/og.jpg`
2. Check image is 1200×630px
3. Clear social media cache (Facebook Debugger)
4. Verify URL includes https:// in metadata

### Contact Form Not Sending
1. Check RESEND_API_KEY is valid
2. Verify FROM_EMAIL is verified in Resend dashboard
3. Check Vercel function logs for errors
4. Test CSRF_SECRET is set

### Environment Variables Not Working
1. Prefix with `NEXT_PUBLIC_` for client-side access
2. Rebuild after changing variables
3. Restart dev server: Stop and `npm run dev`
4. In Vercel: Set variables and redeploy

## Best Practices Reminders

- **Small commits**: Each commit should be one logical change
- **Test locally**: Always test before pushing
- **Review changes**: Use `git diff` before committing
- **Meaningful messages**: Write clear, descriptive commit messages
- **Format & lint**: Always run before committing
- **Build succeeds**: Never push if build fails
- **Both locales**: Test IT and EN versions
- **Mobile-first**: Test responsive design
- **Accessibility**: Consider keyboard navigation and screen readers
- **Performance**: Keep bundle size small, optimize images
- **SEO**: Maintain proper meta tags and structure
