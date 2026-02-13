# SEO Guide - www.andrealosavio.com

Questa guida documenta tutte le pratiche SEO implementate nel sito e fornisce
istruzioni dettagliate per testare e configurare ogni aspetto.

---

## Indice

1. [Pratiche SEO Implementate](#pratiche-seo-implementate)
2. [Testing e Verifica](#testing-e-verifica)
3. [Configurazione Google Search Console](#configurazione-google-search-console)
4. [Configurazione Vercel (Deployment)](#configurazione-vercel-deployment)
5. [Monitoraggio e Maintenance](#monitoraggio-e-maintenance)
6. [Troubleshooting](#troubleshooting)

---

## Pratiche SEO Implementate

### 1. Sitemap XML Multi-lingua

**Cosa fa**: Genera automaticamente una sitemap con tutte le URL del sito in
entrambe le lingue (IT/EN).

**Implementazione**:

- File: `src/app/sitemap.ts`
- Genera 12 URL (6 pagine × 2 lingue)
- Include: priority, changeFrequency, lastModified
- Supporta hreflang alternates

**Pagine incluse**:

```
https://www.andrealosavio.com/it
https://www.andrealosavio.com/en
https://www.andrealosavio.com/it/services
https://www.andrealosavio.com/en/services
https://www.andrealosavio.com/it/projects
https://www.andrealosavio.com/en/projects
https://www.andrealosavio.com/it/about
https://www.andrealosavio.com/en/about
https://www.andrealosavio.com/it/best-practices
https://www.andrealosavio.com/en/best-practices
https://www.andrealosavio.com/it/privacy
https://www.andrealosavio.com/en/privacy
```

**Come testare**:

1. Apri: `https://www.andrealosavio.com/sitemap.xml`
2. Verifica che ci siano 12 URL
3. Verifica formato XML corretto
4. Tool:
   [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

### 2. robots.txt Dinamico

**Cosa fa**: Blocca i crawler in development, permette crawling in production.

**Implementazione**:

- File: `src/app/robots.ts`
- Blocca tutto in localhost/test/dev
- Permette tutto in production
- Include riferimento alla sitemap

**Come testare**:

1. Apri: `https://www.andrealosavio.com/robots.txt`
2. Verifica contenuto:

   ```
   User-agent: *
   Allow: /

   Sitemap: https://www.andrealosavio.com/sitemap.xml
   ```

3. Tool: [Robots.txt Tester](https://technicalseo.com/tools/robots-txt/)

---

### 3. Meta Tags Ottimizzati

**Cosa fa**: Ogni pagina ha meta tags completi per SEO e social sharing.

**Implementazione**: Ogni pagina (`page.tsx`) ha:

- `<title>` - Unico per pagina, ottimizzato per keywords
- `<meta name="description">` - Descrizione compelling (150-160 caratteri)
- Canonical URL - URL preferito per evitare duplicati
- Hreflang alternates - Link alle versioni linguistiche

**Esempio**:

```tsx
return {
  title: "Andrea Losavio - Software Engineer & Tech Partner",
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

**Come testare**:

1. Apri qualsiasi pagina
2. View Page Source (Ctrl+U)
3. Cerca `<meta>` tags
4. Tool: [Meta Tags Checker](https://metatags.io/)

---

### 4. Open Graph Images (Social Sharing)

**Cosa fa**: Quando condividi il sito su social media, appare un'immagine di
preview.

**Implementazione**:

- Immagine: `public/images/og.jpg` (1200×630px)
- Configurato su tutte le 6 pagine
- Supporta: Facebook, Twitter, LinkedIn, WhatsApp

**Metadata**:

```tsx
openGraph: {
  images: [{
    url: "https://www.andrealosavio.com/images/og.jpg",
    width: 1200,
    height: 630,
    alt: "Andrea Losavio - Software Engineer & Tech Partner",
  }],
}
```

**Come testare**:

1. **Facebook Sharing Debugger**:
   - URL: https://developers.facebook.com/tools/debug/
   - Inserisci: `https://www.andrealosavio.com/en`
   - Clicca "Scrape Again" se necessario
   - Verifica che appaia l'immagine OG

2. **Twitter Card Validator**:
   - URL: https://cards-dev.twitter.com/validator
   - Inserisci: `https://www.andrealosavio.com/en`
   - Verifica "summary_large_image" card

3. **LinkedIn Post Inspector**:
   - URL: https://www.linkedin.com/post-inspector/
   - Inserisci URL e verifica preview

---

### 5. Schema.org JSON-LD Markup

**Cosa fa**: Fornisce a Google dati strutturati per rich snippets e Knowledge
Graph.

**Implementazione**:

#### 5.1 Homepage - Person Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Andrea Losavio",
  "jobTitle": "Software Engineer & Tech Partner",
  "url": "https://www.andrealosavio.com",
  "image": "https://www.andrealosavio.com/images/og.jpg",
  "sameAs": [
    "https://github.com/ontech7",
    "https://www.linkedin.com/in/andrea-losavio/"
  ]
}
```

#### 5.2 Homepage - Organization Schema

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

#### 5.3 Tutte le altre pagine - BreadcrumbList Schema

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
      "name": "Services",
      "item": "https://www.andrealosavio.com/en/services"
    }
  ]
}
```

**Come testare**:

1. **Rich Results Test (Google)**:
   - URL: https://search.google.com/test/rich-results
   - Inserisci: `https://www.andrealosavio.com/en`
   - Verifica: Person e Organization schema validi
2. **Schema Markup Validator**:
   - URL: https://validator.schema.org/
   - Inserisci il tuo URL
   - Verifica: Nessun errore, nessun warning

3. **Manualmente nel Browser**:
   - Apri: `https://www.andrealosavio.com/en`
   - View Page Source (Ctrl+U)
   - Cerca: `<script type="application/ld+json">`
   - Copia il JSON e validalo su jsonlint.com

---

### 6. Internationalization (i18n) SEO

**Cosa fa**: Segnala a Google le versioni linguistiche del sito.

**Implementazione**:

- Hreflang tags in ogni pagina
- URL structure: `/it/page` e `/en/page`
- Default locale: EN
- Supported locales: IT, EN

**Hreflang example**:

```html
<link
  rel="alternate"
  hreflang="en"
  href="https://www.andrealosavio.com/en/services"
/>
<link
  rel="alternate"
  hreflang="it"
  href="https://www.andrealosavio.com/it/services"
/>
```

**Come testare**:

1. Tool:
   [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
2. Verifica che ogni pagina abbia hreflang per IT e EN
3. Google Search Console → International Targeting

---

### 7. Performance & Core Web Vitals

**Cosa fa**: Sito veloce = migliore ranking.

**Implementazioni**:

- Next.js Image optimization
- Static Generation (SSG)
- Font optimization (DM Sans, DM Mono)
- Lazy loading immagini
- Preload critical resources

**Target Metriche**:

- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1

**Come testare**:

1. **PageSpeed Insights**:
   - URL: https://pagespeed.web.dev/
   - Testa: `https://www.andrealosavio.com/en`
   - Verifica: Score > 90 (Desktop & Mobile)

2. **WebPageTest**:
   - URL: https://www.webpagetest.org/
   - Test Location: Italy (per target audience)
   - Verifica: Core Web Vitals

3. **Chrome DevTools**:
   - F12 → Lighthouse Tab
   - Run audit per Performance, SEO, Best Practices

---

## Testing e Verifica

### Checklist Completa Pre-Deploy

Prima di considerare il sito "SEO-ready", verifica:

- [ ] **Sitemap**
  - [ ] Accessibile su `/sitemap.xml`
  - [ ] Contiene tutte le 12 URL
  - [ ] Formato XML valido
- [ ] **robots.txt**
  - [ ] Accessibile su `/robots.txt`
  - [ ] Permette crawling (`Allow: /`)
  - [ ] Include link a sitemap

- [ ] **Meta Tags** (per ogni pagina)
  - [ ] Title unico (< 60 caratteri)
  - [ ] Description unica (150-160 caratteri)
  - [ ] Canonical URL corretto
  - [ ] Hreflang alternates (IT/EN)

- [ ] **Open Graph**
  - [ ] OG image si carica correttamente
  - [ ] Preview corretta su Facebook
  - [ ] Preview corretta su Twitter
  - [ ] Preview corretta su LinkedIn

- [ ] **Schema Markup**
  - [ ] Person schema valido (homepage)
  - [ ] Organization schema valido (homepage)
  - [ ] Breadcrumb schema su altre pagine
  - [ ] Nessun errore su Schema Validator

- [ ] **Performance**
  - [ ] PageSpeed score > 90
  - [ ] LCP < 2.5s
  - [ ] INP < 200ms
  - [ ] CLS < 0.1

- [ ] **Mobile**
  - [ ] Responsive design
  - [ ] Touch targets > 48px
  - [ ] No horizontal scroll

### Tool Automatici

Usa questi tool per verifiche rapide:

1. **SEO Site Checkup**: https://seositecheckup.com/
2. **SEO Analyzer**: https://www.seobility.net/en/seocheck/
3. **Lighthouse CI**: Integra nei GitHub Actions

---

## Configurazione Google Search Console

### Step 1: Verifica Proprietà del Sito

1. Vai su [Google Search Console](https://search.google.com/search-console)
2. Clicca **"Aggiungi proprietà"**
3. Scegli **"Proprietà Dominio"**
4. Inserisci: `www.andrealosavio.com`
5. **Verifica via DNS**:
   - Google ti dà un TXT record
   - Vai sul tuo DNS provider (es. Cloudflare, Vercel)
   - Aggiungi il TXT record
   - Torna su Search Console e clicca "Verifica"

### Step 2: Sottometti la Sitemap

1. Nel menu laterale → **Sitemaps**
2. In "Aggiungi una nuova sitemap":
   ```
   https://www.andrealosavio.com/sitemap.xml
   ```
3. Clicca **"Invia"**
4. Attendi 24-48 ore per la prima scansione
5. Verifica stato: **"Riuscito"** (con numero di URL scoperte)

### Step 3: Richiedi Indicizzazione Pagine Principali

Per velocizzare l'indicizzazione:

1. Nel menu → **Controllo URL**
2. Inserisci URL (uno alla volta):
   - `https://www.andrealosavio.com/it`
   - `https://www.andrealosavio.com/en`
   - `https://www.andrealosavio.com/it/services`
   - `https://www.andrealosavio.com/en/services`
   - `https://www.andrealosavio.com/it/projects`
   - `https://www.andrealosavio.com/en/projects`
3. Clicca **"Richiedi indicizzazione"**
4. Ripeti per ogni URL importante

### Step 4: Configura International Targeting

1. Menu → **Impostazioni** → **Targeting internazionale**
2. Verifica che le hreflang siano rilevate correttamente
3. Non impostare un paese target (sito globale)

### Step 5: Monitora Core Web Vitals

1. Menu → **Esperienza** → **Core Web Vitals**
2. Verifica che tutte le URL siano "Good" (verdi)
3. Se ci sono problemi, usa PageSpeed Insights per dettagli

### Step 6: Verifica Copertura

1. Menu → **Copertura** (o **Indicizzazione**)
2. Monitora:
   - **Pagine indicizzate**: Dovrebbero essere ~12
   - **Errori**: Dovrebbero essere 0
   - **Escluse**: Verifica che non ci siano pagine importanti escluse

### Step 7: Monitora Rich Results

1. Menu → **Miglioramenti** → **Rich results**
2. Verifica che compaiano:
   - **Person** rich result (homepage)
   - **Breadcrumb** (altre pagine)
3. Se ci sono errori, usa Rich Results Test per debug

---

## ⚙️ Configurazione Vercel (Deployment)

### Variabili d'Ambiente CRITICHE

**⚠️ IMPORTANTE**: Il sito NON funzionerà correttamente senza questa
configurazione!

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona progetto **www.andrealosavio.com**
3. **Settings** → **Environment Variables**
4. Aggiungi/Modifica:

```bash
NEXT_PUBLIC_SITE_URL = www.andrealosavio.com
```

**❌ ERRORE COMUNE**:

```bash
# SBAGLIATO - Non includere https://
NEXT_PUBLIC_SITE_URL = https://www.andrealosavio.com

# SBAGLIATO - Non usare localhost in production
NEXT_PUBLIC_SITE_URL = localhost:3000

# ✅ CORRETTO
NEXT_PUBLIC_SITE_URL = www.andrealosavio.com
```

5. Salva e **Redeploy** il sito

### Verifica Deployment

Dopo il deploy, verifica:

```bash
# Sitemap deve avere URL corrette
curl https://www.andrealosavio.com/sitemap.xml | grep "www.andrealosavio.com"

# OG images devono puntare al dominio corretto
curl -I https://www.andrealosavio.com/images/og.jpg
# Deve ritornare 200 OK
```

---

## 📊 Monitoraggio e Maintenance

### KPI da Monitorare

**Google Search Console (Settimanale)**:

- Impressioni (visualizzazioni nei risultati)
- Click (click dai risultati)
- CTR (Click-Through Rate)
- Posizione media

**Google Analytics 4 (Settimanale)**:

- Traffico organico
- Bounce rate
- Pagine per sessione
- Conversioni (form contatto)

**Performance (Mensile)**:

- Core Web Vitals (Search Console)
- PageSpeed Insights score
- Mobile usability

### Maintenance Schedule

**Ogni settimana**:

- [ ] Controlla errori in Search Console
- [ ] Verifica nuove pagine indicizzate
- [ ] Monitora posizioni keywords principali

**Ogni mese**:

- [ ] Audit completo PageSpeed
- [ ] Verifica broken links
- [ ] Update sitemap se aggiunte nuove pagine
- [ ] Controlla competitors

**Ogni trimestre**:

- [ ] SEO audit completo (con tool esterni)
- [ ] Aggiorna meta descriptions se necessario
- [ ] Rivedi keyword strategy
- [ ] Verifica backlinks

---

## Troubleshooting

### Problema: Sitemap vuota o non trovata

**Sintomo**: `/sitemap.xml` ritorna 404 o XML vuoto

**Causa**: `NEXT_PUBLIC_SITE_URL` non configurata o contiene "localhost"

**Soluzione**:

1. Verifica `.env` locale o Vercel env vars
2. Assicurati che `NEXT_PUBLIC_SITE_URL = www.andrealosavio.com`
3. Redeploy

**Debug**:

```bash
# Verifica in locale
npm run build
npm start
curl http://localhost:3000/sitemap.xml
```

---

### Problema: OG image non si vede sui social

**Sintomo**: Condividendo link, non appare preview image

**Causa**:

1. Cache dei social network
2. URL dell'immagine sbagliata
3. Immagine non accessibile

**Soluzione**:

1. Testa su Facebook Debugger (forza refresh cache)
2. Verifica che `https://www.andrealosavio.com/images/og.jpg` carichi
3. Verifica dimensioni: 1200×630px
4. Verifica formato: JPG o PNG (non SVG)

**Debug**:

```bash
# Verifica che l'immagine esista
curl -I https://www.andrealosavio.com/images/og.jpg
# Deve ritornare: 200 OK
```

---

### Problema: Schema markup ha errori

**Sintomo**: Rich Results Test mostra errori

**Cause comuni**:

1. URL mancante in schema
2. `@context` mancante
3. Tipo dati sbagliato

**Soluzione**:

1. Usa Rich Results Test per dettagli
2. Verifica il JSON-LD nel browser (View Source)
3. Copia il JSON e testa su jsonlint.com
4. Confronta con esempi in questa guida

---

### Problema: Google non indicizza le pagine

**Sintomo**: `site:www.andrealosavio.com` non mostra risultati

**Causa**:

1. Sito troppo nuovo (< 2 settimane)
2. robots.txt blocca crawling
3. Noindex tag per errore
4. Sitemap non sottomessa

**Soluzione**:

1. Verifica robots.txt permetta crawling
2. Verifica che non ci siano `<meta name="robots" content="noindex">`
3. Sottometti sitemap su Search Console
4. Usa "Richiedi indicizzazione" per pagine principali
5. **Pazienza**: prima indicizzazione può richiedere 1-4 settimane

**Debug**:

```bash
# Verifica robots.txt
curl https://www.andrealosavio.com/robots.txt

# Verifica meta robots
curl https://www.andrealosavio.com/en | grep "noindex"
# Non dovrebbe ritornare niente
```

---

### Problema: Core Web Vitals non "Good"

**Sintomo**: Search Console mostra URL in giallo/rosso

**Causa**: Performance issues (LCP, INP, CLS)

**Soluzione**:

1. Usa PageSpeed Insights per dettagli
2. Ottimizza immagini (WebP, lazy loading)
3. Riduci JavaScript non necessario
4. Usa font-display: swap
5. Preload critical resources

**Debug**:

```bash
# Test performance
npm run build
npm start
# Apri Chrome DevTools → Lighthouse
# Run Performance audit
```

---

## Risorse Utili

### Tool SEO Gratuiti

- [Google Search Console](https://search.google.com/search-console)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)

### Documentazione

- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Open Graph Protocol](https://ogp.me/)

### Community & Learning

- [r/SEO](https://www.reddit.com/r/SEO/)
- [Search Engine Journal](https://www.searchenginejournal.com/)
- [Moz Blog](https://moz.com/blog)
