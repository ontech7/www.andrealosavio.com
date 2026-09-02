# SEO Guide — www.andrealosavio.com

This guide documents every SEO practice implemented on the site and provides
detailed instructions on how to test and configure each aspect.

---

## Table of Contents

1. [Implemented SEO Practices](#implemented-seo-practices)
2. [Testing and Verification](#testing-and-verification)
3. [Google Search Console Setup](#google-search-console-setup)
4. [Vercel (Deployment) Setup](#vercel-deployment-setup)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)
6. [Troubleshooting](#troubleshooting)

---

## Implemented SEO Practices

### 1. Multi-language XML Sitemap

**What it does**: Automatically generates a sitemap with every URL on the site
in both languages (IT/EN), plus one entry pair per published blog article.

**Implementation**:

- File: `src/app/sitemap.ts`
- Static pages: `lastModified` is a hard-coded date per route, updated by hand
  when that page's content changes.
- Blog articles: `lastModified` comes from the article's own frontmatter
  (`updatedAt` or `publishedAt`) — not a per-build `new Date()`, so the date
  only changes when the content actually does.
- Each locale gets its own path (`pathByLocale`) built from the article's
  localized slug, resolved through `translationKey` — the sitemap does not
  assume IT and EN share the same slug.
- Includes: priority, changeFrequency, lastModified
- Supports hreflang alternates

**Pages included** (static routes; blog articles are appended dynamically,
one pair of URLs per published `translationKey`):

```
https://www.andrealosavio.com/it
https://www.andrealosavio.com/en
https://www.andrealosavio.com/it/projects
https://www.andrealosavio.com/en/projects
https://www.andrealosavio.com/it/blog
https://www.andrealosavio.com/en/blog
https://www.andrealosavio.com/it/about
https://www.andrealosavio.com/en/about
https://www.andrealosavio.com/it/privacy
https://www.andrealosavio.com/en/privacy
```

**How to test**:

1. Open: `https://www.andrealosavio.com/sitemap.xml`
2. Verify that all URLs are present
3. Verify the XML format is valid
4. Tool:
   [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

### 2. Dynamic robots.txt

**What it does**: Blocks crawlers in development, allows crawling in production.

**Implementation**:

- File: `src/app/robots.ts`
- Blocks everything in localhost/test/dev
- Allows everything in production
- Includes a reference to the sitemap

**How to test**:

1. Open: `https://www.andrealosavio.com/robots.txt`
2. Verify the contents:

   ```
   User-agent: *
   Allow: /

   Sitemap: https://www.andrealosavio.com/sitemap.xml
   ```

3. Tool: [Robots.txt Tester](https://technicalseo.com/tools/robots-txt/)

---

### 3. Optimized Meta Tags

**What it does**: Every page has complete meta tags for SEO and social sharing.

**Implementation**: Each page (`page.tsx`) exposes:

- `<title>` — unique per page, optimized for keywords
- `<meta name="description">` — compelling description (150–160 characters)
- Canonical URL — preferred URL to avoid duplicates
- Hreflang alternates — links to every localized version

**Example**:

```tsx
return {
  title: "Andrea Losavio - Senior Software Engineer & FDE",
  description: "Full-stack developer specializing in...",
  alternates: {
    canonical: "https://www.andrealosavio.com/en",
    languages: {
      en: "https://www.andrealosavio.com/en",
      it: "https://www.andrealosavio.com/it",
    },
  },
};
```

**How to test**:

1. Open any page
2. View Page Source (Ctrl+U)
3. Look for the `<meta>` tags
4. Tool: [Meta Tags Checker](https://metatags.io/)

---

### 4. Open Graph Images (Social Sharing)

**What it does**: When the site is shared on social media, a preview image is
displayed.

**Implementation**:

- Image: `public/images/og.jpg` (1200×630px)
- Configured on every page
- Supports: Facebook, Twitter, LinkedIn, WhatsApp

**Metadata**:

```tsx
openGraph: {
  images: [{
    url: "https://www.andrealosavio.com/images/og.jpg",
    width: 1200,
    height: 630,
    alt: "Andrea Losavio - Senior Software Engineer & FDE",
  }],
}
```

**How to test**:

1. **Facebook Sharing Debugger**:
   - URL: https://developers.facebook.com/tools/debug/
   - Enter: `https://www.andrealosavio.com/en`
   - Click "Scrape Again" if needed
   - Verify the OG image is shown

2. **Twitter Card Validator**:
   - URL: https://cards-dev.twitter.com/validator
   - Enter: `https://www.andrealosavio.com/en`
   - Verify the `summary_large_image` card

3. **LinkedIn Post Inspector**:
   - URL: https://www.linkedin.com/post-inspector/
   - Enter the URL and check the preview

---

### 5. Schema.org JSON-LD Markup

**What it does**: Provides Google with structured data for rich snippets and
Knowledge Graph.

**Implementation**:

#### 5.1 Homepage — Person Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Andrea Losavio",
  "jobTitle": "Senior Software Engineer & FDE",
  "url": "https://www.andrealosavio.com",
  "image": "https://www.andrealosavio.com/images/og.jpg",
  "sameAs": [
    "https://github.com/ontech7",
    "https://www.linkedin.com/in/andrea-losavio/"
  ]
}
```

#### 5.2 Homepage — Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Andrea Losavio",
  "url": "https://www.andrealosavio.com",
  "logo": "https://www.andrealosavio.com/images/og.jpg",
  "sameAs": [
    "https://github.com/ontech7",
    "https://www.linkedin.com/in/andrea-losavio/"
  ]
}
```

#### 5.3 All Other Pages — BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.andrealosavio.com/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Projects",
      "item": "https://www.andrealosavio.com/en/projects"
    }
  ]
}
```

**How to test**:

1. **Rich Results Test (Google)**:
   - URL: https://search.google.com/test/rich-results
   - Enter: `https://www.andrealosavio.com/en`
   - Verify: Person and Organization schemas are valid
2. **Schema Markup Validator**:
   - URL: https://validator.schema.org/
   - Enter your URL
   - Verify: no errors, no warnings

3. **Manually in the Browser**:
   - Open: `https://www.andrealosavio.com/en`
   - View Page Source (Ctrl+U)
   - Look for: `<script type="application/ld+json">`
   - Copy the JSON and validate it on jsonlint.com

---

### 6. Internationalization (i18n) SEO

**What it does**: Signals to Google the localized versions of the site.

**Implementation**:

- Hreflang tags on every page
- URL structure: `/it/page` and `/en/page`
- Default locale: IT
- Supported locales: IT, EN

**Hreflang example**:

```html
<link
  rel="alternate"
  hreflang="en"
  href="https://www.andrealosavio.com/en/projects"
/>
<link
  rel="alternate"
  hreflang="it"
  href="https://www.andrealosavio.com/it/projects"
/>
```

**How to test**:

1. Tool:
   [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
2. Confirm that every page has hreflang tags for both IT and EN
3. Google Search Console → International Targeting

---

### 7. Performance & Core Web Vitals

**What it does**: A fast site results in better ranking.

**Implementations**:

- Next.js Image optimization
- Static Generation (SSG)
- Font optimization (DM Sans, DM Mono)
- Lazy loading for images
- Preload of critical resources

**Target metrics**:

- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1

**How to test**:

1. **PageSpeed Insights**:
   - URL: https://pagespeed.web.dev/
   - Test: `https://www.andrealosavio.com/en`
   - Verify: score > 90 (Desktop & Mobile)

2. **WebPageTest**:
   - URL: https://www.webpagetest.org/
   - Test Location: Italy (for the target audience)
   - Verify: Core Web Vitals

3. **Chrome DevTools**:
   - F12 → Lighthouse tab
   - Run an audit for Performance, SEO, Best Practices

---

### 8. Blog Structured Data — BlogPosting & FAQPage

**What it does**: Each article page carries its own structured data, in
addition to the `BreadcrumbList` every non-homepage page already emits.

**Implementation**:

- Helpers: `generateBlogPostingSchema` and `generateFaqSchema` in
  `src/utils/seo-schema.ts`.
- Wired in `src/app/[locale]/blog/[slug]/page.tsx`: every article emits
  `BreadcrumbList` + `BlogPosting`; `FAQPage` is added only when the article's
  frontmatter has a `faq` array.
- `BlogPosting` inlines `author` and `publisher` with `@id`, `name` and `url`.
  Referencing the homepage entities by bare `@id` does **not** work: crawlers
  evaluate each page's structured data on its own, so a node declared only on
  another page resolves to nothing and the Rich Results Test reports
  "Missing field name" and "Missing field url". The `@id` is kept so the two
  pages still describe the same entity.
- Dates in JSON-LD go through `toIsoDateTime` in `src/utils/seo-schema.ts`.
  Frontmatter stores `YYYY-MM-DD`, but schema.org wants full ISO 8601 with a
  timezone, otherwise the Rich Results Test reports "Invalid datePublished
  value" and "Missing timezone".

**How to test**:

1. Open an article, e.g. `https://www.andrealosavio.com/it/blog/<slug>`.
2. View Page Source, find the `<script type="application/ld+json">` block.
3. Paste the JSON into [Schema Markup Validator](https://validator.schema.org/)
   or [Rich Results Test](https://search.google.com/test/rich-results).
4. Confirm `@type` includes `BreadcrumbList` and `BlogPosting` (and `FAQPage`
   for articles with FAQ content).

---

### 9. RSS Feed

**What it does**: Publishes a per-locale RSS 2.0 feed of blog articles.

**Implementation**:

- Route: `src/app/[locale]/blog/rss.xml/route.ts`, statically generated
  (`dynamic = "force-static"`, `dynamicParams = false`).
- One feed per locale: `/it/blog/rss.xml`, `/en/blog/rss.xml`.
- Capped at the `BLOG_RECENT_SIZE` newest articles (20, in
  `src/constants/blog.ts`). A feed is a "what's new" surface, not an archive:
  readers poll it and only ever show the top of it, so letting it grow with the
  archive costs bandwidth on every poll and buys nothing.
- Linked from each article's metadata via
  `alternates.types["application/rss+xml"]`.

**How to test**:

```bash
curl -s https://www.andrealosavio.com/it/blog/rss.xml | grep -c "<item>"
```

Should return the number of published Italian articles, or 20 once there are
more than that.

---

### 10. Plain-Markdown Article URLs (LLM crawlers)

**What it does**: Serves every article as plain Markdown at a `.md` URL,
alongside the normal HTML page, for LLM/agent crawlers that prefer Markdown
over HTML parsing.

**Implementation**:

- `next.config.ts` rewrites `/:locale(it|en)/blog/:slug.md` to
  `/api/blog/:locale/:slug`.
- Handler: `src/app/api/blog/[locale]/[slug]/route.ts`. Returns
  `Content-Type: text/markdown; charset=utf-8` and
  `X-Robots-Tag: noindex, follow` — indexable pages stay the HTML versions;
  this is a machine-readable mirror, not a duplicate to rank.
- `src/app/llms.txt/route.ts` points at `/en/blog` and at the feed, and does
  not enumerate articles (it replaces the old static `public/llms.txt`, which no
  longer exists). The briefing exists so a model can say who Andrea is and what
  he does; a list of every article title grows without limit and answers a
  question nobody asked it. Crawlers that want the articles follow the blog
  link, the sitemap or the feed.

**How to test**:

```bash
curl -sI https://www.andrealosavio.com/it/blog/<slug>.md | grep -i "content-type\|x-robots"
# Expect: Content-Type: text/markdown; charset=utf-8
#         X-Robots-Tag: noindex, follow

curl -s https://www.andrealosavio.com/llms.txt | grep -c "## Articles"
# Expect: 0 — the briefing links the blog, it does not list articles
```

---

### 11. Case Study Structured Data

**What it does**: Each case study page emits `BreadcrumbList` + `CreativeWork`.

**Implementation**:

- Helper: `generateCaseStudySchema` in `src/utils/seo-schema.ts`.
- `CreativeWork`, not `Article`: a case study is delivered work, not a
  journalistic piece, and `BlogPosting` belongs to the blog.
- `author` is inlined with name and url — the same lesson as `BlogPosting`:
  crawlers evaluate each page on its own, so an `@id` pointing at a node
  declared on another page resolves to nothing.
- The client sits in `about` as an `Organization`.
- Covers are validated as raster in `parseFrontmatter` (`.webp`, `.png`,
  `.jpg`, `.jpeg`). Unlike the blog there is no `opengraph-image` route to
  rasterise an SVG here, so the frontmatter guard is what stops a blank social
  preview from shipping.
- Sitemap: one URL pair per published case study, `lastModified` from
  frontmatter, `samePath` because the slug is shared across locales.
- `/projects`' `ItemList` points at the case study when one exists, and now
  carries the contribution text rather than the client's own description.
- Drafts emit nothing anywhere: no page, no sitemap entry, no `llms.txt` line.

**How to test**: open a case study, copy the JSON-LD block, and check it on
the Rich Results Test. Confirm `@type` includes `BreadcrumbList` and
`CreativeWork`.

---

## Testing and Verification

### Full Pre-deploy Checklist

Before considering the site "SEO-ready", verify:

- [ ] **Sitemap**
  - [ ] Reachable at `/sitemap.xml`
  - [ ] Contains every URL
  - [ ] Valid XML format
- [ ] **robots.txt**
  - [ ] Reachable at `/robots.txt`
  - [ ] Allows crawling (`Allow: /`)
  - [ ] Includes a link to the sitemap

- [ ] **Meta Tags** (per page)
  - [ ] Unique title (< 60 characters)
  - [ ] Unique description (150–160 characters)
  - [ ] Correct canonical URL
  - [ ] Hreflang alternates (IT/EN)

- [ ] **Open Graph**
  - [ ] OG image loads correctly
  - [ ] Correct preview on Facebook
  - [ ] Correct preview on Twitter
  - [ ] Correct preview on LinkedIn

- [ ] **Schema Markup**
  - [ ] Valid Person schema (homepage)
  - [ ] Valid Organization schema (homepage)
  - [ ] Breadcrumb schema on other pages
  - [ ] Valid BlogPosting schema on articles (FAQPage too, when the article
        has FAQ content)
  - [ ] No errors on the Schema Validator

- [ ] **Blog**
  - [ ] RSS feed reachable at `/it/blog/rss.xml` and `/en/blog/rss.xml`
  - [ ] Every article reachable at its `.md` URL with `text/markdown` and
        `X-Robots-Tag: noindex, follow`
  - [ ] `/llms.txt` lists published articles

- [ ] **Case Studies**
  - [ ] Every published case study's cover is a raster file that actually
        exists (`.webp`, `.png`, `.jpg`, `.jpeg`) — the build fails naming the
        file if one is missing, but confirm the image itself loads
  - [ ] `BreadcrumbList` + `CreativeWork` are both valid on the Rich Results
        Test
  - [ ] Drafts emit nothing: no page, no sitemap entry, no `llms.txt` line

- [ ] **Performance**
  - [ ] PageSpeed score > 90
  - [ ] LCP < 2.5s
  - [ ] INP < 200ms
  - [ ] CLS < 0.1

- [ ] **Mobile**
  - [ ] Responsive design
  - [ ] Touch targets > 48px
  - [ ] No horizontal scroll

### Automated Tools

Use these tools for quick checks:

1. **SEO Site Checkup**: https://seositecheckup.com/
2. **SEO Analyzer**: https://www.seobility.net/en/seocheck/
3. **Lighthouse CI**: integrate into GitHub Actions

---

## Google Search Console Setup

### Step 1: Verify Ownership of the Site

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add property"**
3. Choose **"Domain property"**
4. Enter: `www.andrealosavio.com`
5. **Verify via DNS**:
   - Google provides a TXT record
   - Go to your DNS provider (e.g. Cloudflare, Vercel)
   - Add the TXT record
   - Back in Search Console, click "Verify"

### Step 2: Submit the Sitemap

1. In the side menu → **Sitemaps**
2. Under "Add a new sitemap":
   ```
   https://www.andrealosavio.com/sitemap.xml
   ```
3. Click **"Submit"**
4. Wait 24–48 hours for the first crawl
5. Verify the status shows **"Success"** (with the number of discovered URLs)

### Step 3: Request Indexing of the Main Pages

To speed up indexing:

1. Menu → **URL Inspection**
2. Enter URLs one at a time:
   - `https://www.andrealosavio.com/it`
   - `https://www.andrealosavio.com/en`
   - `https://www.andrealosavio.com/it/projects`
   - `https://www.andrealosavio.com/en/projects`
3. Click **"Request indexing"**
4. Repeat for every important URL

### Step 4: Configure International Targeting

1. Menu → **Settings** → **International targeting**
2. Verify that the hreflang tags are picked up correctly
3. Do not set a target country (global site)

### Step 5: Monitor Core Web Vitals

1. Menu → **Experience** → **Core Web Vitals**
2. Verify all URLs are "Good" (green)
3. If issues appear, use PageSpeed Insights for details

### Step 6: Verify Coverage

1. Menu → **Coverage** (or **Indexing**)
2. Monitor:
   - **Indexed pages**: should match the sitemap count
   - **Errors**: should be 0
   - **Excluded**: verify no important pages are excluded

### Step 7: Monitor Rich Results

1. Menu → **Enhancements** → **Rich results**
2. Verify the following appear:
   - **Person** rich result (homepage)
   - **Breadcrumb** (other pages)
3. If there are errors, use the Rich Results Test to debug

---

## Vercel (Deployment) Setup

### CRITICAL Environment Variables

**IMPORTANT**: The site will NOT work correctly without this configuration.

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the **www.andrealosavio.com** project
3. **Settings** → **Environment Variables**
4. Add/update:

```bash
NEXT_PUBLIC_SITE_URL = www.andrealosavio.com
```

**COMMON MISTAKES**:

```bash
# WRONG — do not include https://
NEXT_PUBLIC_SITE_URL = https://www.andrealosavio.com

# WRONG — do not use localhost in production
NEXT_PUBLIC_SITE_URL = localhost:3000

# CORRECT
NEXT_PUBLIC_SITE_URL = www.andrealosavio.com
```

5. Save and **Redeploy** the site

### Deployment Verification

After deployment, verify:

```bash
# Sitemap must contain the correct URLs
curl https://www.andrealosavio.com/sitemap.xml | grep "www.andrealosavio.com"

# OG images must point to the correct domain
curl -I https://www.andrealosavio.com/images/og.jpg
# Must return 200 OK
```

---

## Monitoring and Maintenance

### KPIs to Track

**Google Search Console (weekly)**:

- Impressions (views in results)
- Clicks (clicks from results)
- CTR (Click-Through Rate)
- Average position

**Google Analytics 4 (weekly)**:

- Organic traffic
- Bounce rate
- Pages per session
- Conversions (contact form submissions)

**Performance (monthly)**:

- Core Web Vitals (Search Console)
- PageSpeed Insights score
- Mobile usability

### Maintenance Schedule

**Every week**:

- [ ] Check for errors in Search Console
- [ ] Verify newly indexed pages
- [ ] Monitor the position of the main keywords

**Every month**:

- [ ] Full PageSpeed audit
- [ ] Check for broken links
- [ ] Update the sitemap if new pages are added
- [ ] Review competitors

**Every quarter**:

- [ ] Full SEO audit (with external tools)
- [ ] Update meta descriptions if needed
- [ ] Revisit the keyword strategy
- [ ] Verify backlinks

---

## Troubleshooting

### Issue: Empty or missing sitemap

**Symptom**: `/sitemap.xml` returns 404 or an empty XML.

**Cause**: `NEXT_PUBLIC_SITE_URL` is not configured or contains "localhost".

**Fix**:

1. Verify the local `.env` or Vercel env vars
2. Ensure `NEXT_PUBLIC_SITE_URL = www.andrealosavio.com`
3. Redeploy

**Debug**:

```bash
# Verify locally
npm run build
npm start
curl http://localhost:3000/sitemap.xml
```

---

### Issue: OG image not showing on social networks

**Symptom**: When sharing a link no preview image is displayed.

**Cause**:

1. Social network cache
2. Wrong image URL
3. Image not accessible

**Fix**:

1. Test on Facebook Debugger (force cache refresh)
2. Verify `https://www.andrealosavio.com/images/og.jpg` loads
3. Check dimensions: 1200×630px
4. Check format: JPG or PNG (not SVG)

**Debug**:

```bash
# Verify the image exists
curl -I https://www.andrealosavio.com/images/og.jpg
# Must return: 200 OK
```

---

### Issue: Schema markup reports errors

**Symptom**: Rich Results Test returns errors.

**Common causes**:

1. Missing URL in the schema
2. Missing `@context`
3. Wrong data type

**Fix**:

1. Use the Rich Results Test for details
2. Verify the JSON-LD in the browser (View Source)
3. Copy the JSON and test it on jsonlint.com
4. Compare against the examples in this guide

---

### Issue: Google does not index the pages

**Symptom**: `site:www.andrealosavio.com` returns no results.

**Cause**:

1. The site is too new (< 2 weeks)
2. robots.txt blocks crawling
3. A noindex tag was added by mistake
4. The sitemap was not submitted

**Fix**:

1. Verify robots.txt allows crawling
2. Verify there are no `<meta name="robots" content="noindex">`
3. Submit the sitemap in Search Console
4. Use "Request indexing" for the main pages
5. **Be patient**: the first indexing can take 1–4 weeks

**Debug**:

```bash
# Verify robots.txt
curl https://www.andrealosavio.com/robots.txt

# Verify meta robots
curl https://www.andrealosavio.com/en | grep "noindex"
# Should return nothing
```

---

### Issue: Core Web Vitals are not "Good"

**Symptom**: Search Console shows URLs in yellow/red.

**Cause**: Performance issues (LCP, INP, CLS).

**Fix**:

1. Use PageSpeed Insights for details
2. Optimize images (WebP, lazy loading)
3. Reduce unnecessary JavaScript
4. Use `font-display: swap`
5. Preload critical resources

**Debug**:

```bash
# Performance test
npm run build
npm start
# Open Chrome DevTools → Lighthouse
# Run a Performance audit
```

---

## Useful Resources

### Free SEO Tools

- [Google Search Console](https://search.google.com/search-console)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)

### Documentation

- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Open Graph Protocol](https://ogp.me/)

### Community & Learning

- [r/SEO](https://www.reddit.com/r/SEO/)
- [Search Engine Journal](https://www.searchenginejournal.com/)
- [Moz Blog](https://moz.com/blog)
