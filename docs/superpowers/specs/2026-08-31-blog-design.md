# Sezione Blog — Design

Data: 2026-08-31
Stato: approvato, pronto per il piano di implementazione

## Contesto

Il sito è un portfolio / lead-gen bilingue (IT default, EN) su Next.js 16 App
Router, React 19, TypeScript strict, deploy su Vercel. Oggi i contenuti sono
modellati come `src/constants/*.ts` più cataloghi di traduzione JSON: un
formato adatto a liste di progetti, inadatto a prosa lunga con code block.

Obiettivo: una sezione blog tecnica, bilingue, ottimizzata per la ricerca
organica e per i crawler LLM, alimentata da una skill ghostwriter che produce
gli articoli in entrambe le lingue.

## Decisioni

| Ambito | Decisione | Alternative scartate |
| --- | --- | --- |
| Formato contenuti | MDX con frontmatter YAML in `content/` | Markdown puro con direttive; TSX per articolo; CMS headless |
| Pipeline | `@next/mdx` con dynamic import per slug, tutto al build | `next-mdx-remote/rsc` (compilazione a runtime, dipendenza in più) |
| Slug e i18n | Slug localizzato, coppia IT/EN obbligatoria legata da `translationKey` | Slug unico condiviso; traduzione opzionale |
| Cover | `cover` opzionale nel frontmatter, altrimenti SVG generativo; OG PNG sempre generato | Immagine obbligatoria; solo generativo |
| Lunghezza target | 900–1400 parole, senza tetto rigido | 600–800 parole; minimo 800 senza fascia |
| Skill | End-to-end: intervista, ricerca, scaletta, scrittura IT+EN, self-check | Sola scrittura; skill di audit separata |
| Ordine header | Home · Progetti · Chi sono · Blog | Riordino in Home · Chi sono · Blog · Progetti |

## 1. Modello dei contenuti

I contenuti vivono alla root, fuori da `src/`, così la skill ghostwriter non
tocca mai il codice applicativo:

```
content/blog/
├── it/cache-nextjs-spiegata.mdx
└── en/nextjs-cache-explained.mdx
```

`tsconfig.json` guadagna l'alias `"@content/*": ["./content/*"]`.

### Frontmatter

```yaml
title: "La cache di Next.js, spiegata davvero"
subtitle: "Quando revalidate non fa quello che pensi"
description: "Meta description, target 150-160 caratteri."
publishedAt: 2026-09-02
updatedAt: 2026-09-20
translationKey: nextjs-cache
kind: tech
tags: [nextjs, performance, caching]
cover: /images/blog/nextjs-cache.webp
coverAlt: "Diagramma dei livelli di cache di Next.js"
draft: false
series: { id: nextjs-deep-dive, part: 2 }
takeaways:
  - "Primo punto chiave."
  - "Secondo punto chiave."
faq:
  - q: "revalidate funziona in dev?"
    a: "No, in sviluppo la cache è disattivata."
```

Campi obbligatori: `title`, `subtitle`, `description`, `publishedAt`,
`translationKey`, `kind`, `tags`, `takeaways`.
Campi opzionali: `updatedAt`, `cover` (che rende obbligatorio `coverAlt`),
`draft` (default `false`), `series`, `faq`.

`kind` è uno di `tech | business | hybrid | event`.

Tempo di lettura e conteggio parole **non** stanno nel frontmatter: si
calcolano dal corpo al build, così non possono divergere dal testo.

### Vocabolario dei tag

`src/constants/blog.ts` esporta `BLOG_TAGS` (vocabolario chiuso) e
`BLOG_KINDS`. Un tag fuori vocabolario fa fallire il build. Le etichette
tradotte stanno in `src/translations/<locale>/blog.json` sotto
`blog.tags.<tag>` e `blog.kinds.<kind>`.

Set iniziale: `nextjs`, `react`, `typescript`, `performance`, `seo`,
`architecture`, `ai`, `devops`, `mobile`, `career`, `business`, `freelance`,
`events`.

## 2. Pipeline MDX

`@next/mdx` con dynamic import per slug e `dynamicParams = false`: ogni pagina
è generata al build, nessuna compilazione a runtime.

### Vincolo Turbopack

Next 16 gira su Turbopack, dove i plugin remark/rehype vanno dichiarati come
**stringhe** con opzioni **serializzabili**. Le callback JavaScript non sono
supportate. Conseguenza pratica: `rehype-pretty-code` va configurato senza
`onVisitLine` / `onVisitHighlightedLine`; evidenziazione righe, titolo file e
diff passano dalla meta string del fence, e lo styling delle righe da CSS in
`globals.css`.

Configurazione in `next.config.ts`:

- `pageExtensions` resta invariato (gli MDX non sono route, sono importati).
- `remarkPlugins`: `remark-gfm`, `remark-frontmatter`,
  `["remark-mdx-frontmatter", { name: "frontmatter" }]`.
- `rehypePlugins`: `rehype-slug`,
  `["rehype-autolink-headings", { behavior: "wrap" }]`,
  `["rehype-pretty-code", { theme: "github-dark-default", keepBackground: false }]`.

`behavior: "wrap"` evita di dover passare un nodo hast come opzione; l'icona
dell'anchor è resa in CSS su `:hover`/`:focus-visible`.

### Dipendenze nuove

`@next/mdx`, `@mdx-js/react`, `@mdx-js/loader`, `@types/mdx`, `remark-gfm`,
`remark-frontmatter`, `remark-mdx-frontmatter`, `rehype-slug`,
`rehype-autolink-headings`, `rehype-pretty-code`, `shiki`, `gray-matter`,
`github-slugger`.

`github-slugger` serve a generare nella TOC gli stessi id che `rehype-slug`
mette sugli heading. Tempo di lettura e feed RSS sono scritti a mano (poche
decine di righe) invece di aggiungere altre dipendenze.

### Moduli

```
src/libs/blog/
  source.ts        fs + gray-matter: getArticles(locale), getArticle(locale, slug),
                   getTranslatedSlug(translationKey, locale), getRelated(article),
                   getSeries(seriesId, locale)
  frontmatter.ts   tipo Frontmatter + parseFrontmatter() che valida e fallisce forte
  reading-time.ts  parole di prosa / 200 wpm, arrotondato per eccesso, minimo 1;
                   i code block sono esclusi dal conteggio
  toc.ts           estrae h2/h3 dal markdown grezzo ignorando i fence di codice
```

Le due strade di lettura convivono per ragioni precise: l'indice, la sitemap,
il feed e il footer leggono **solo i frontmatter** di tutti i file via `fs` +
`gray-matter` senza compilare nulla; la pagina articolo importa il singolo MDX
come componente e ne riceve il frontmatter come named export. Entrambe le cose
avvengono al build.

Gli articoli con `draft: true` sono esclusi da indice, sitemap, feed, footer e
`generateStaticParams` in produzione, e restano visibili in sviluppo.

### Componenti MDX

```
src/components/mdx/
  mdx-components.tsx   mapping di h2/h3/p/a/ul/ol/table/pre/img/blockquote
  callout.tsx          varianti info | warning | success | danger
  copy-button.tsx      unico "use client" della pipeline di rendering
  figure.tsx           immagine con didascalia
```

I componenti esposti agli autori sono **due**: `Callout` e `Figure`. Il TL;DR
arriva dal frontmatter, non è un componente da scrivere a mano. `a` interno
usa il `Link` di `@/libs/i18n/navigation`; `a` esterno prende
`target="_blank" rel="noopener noreferrer"` e quindi eredita l'indicatore già
definito in `globals.css`.

## 3. Route e i18n

```
src/app/[locale]/blog/page.tsx                     indice
src/app/[locale]/blog/[slug]/page.tsx              articolo, dynamicParams = false
src/app/[locale]/blog/[slug]/opengraph-image.tsx   PNG 1200×630 via ImageResponse
src/app/[locale]/blog/rss.xml/route.ts             feed per locale
src/app/api/blog/[locale]/[slug]/route.ts          markdown puro per LLM
```

`rss.xml` è un segmento statico e ha precedenza su `[slug]`, quindi non c'è
conflitto.

Il namespace `blog` va aggiunto all'array `namespaces` in
`src/libs/i18n/request.ts`, e le pagine avvolgono i propri Client Component in
`<PageMessages namespaces={["blog"]}>` come già fanno `/projects` e `/about`.

### hreflang e language switcher

`translationKey` risolve lo slug gemello nell'altra lingua. La stessa mappa
alimenta tre cose: gli `alternates.languages` in `generateMetadata`, le
`alternates` della sitemap, e il language switcher — che oggi cambia solo il
prefisso di locale e su un articolo finirebbe in 404.

## 4. SEO

### Metadata

`generateMetadata` per articolo: title, description, canonical, hreflang
IT/EN/x-default, OpenGraph `type: "article"` con `publishedTime`,
`modifiedTime`, `authors` e `tags`, Twitter `summary_large_image`. Segue lo
schema già usato in `src/app/[locale]/projects/page.tsx`.

### JSON-LD

Nuovi helper in `src/utils/seo-schema.ts`:

- `generateBlogPostingSchema` — `author` e `publisher` referenziano gli `@id`
  di `Person` e `Organization` già dichiarati in homepage, così il grafo resta
  connesso invece di duplicare entità.
- `generateFaqSchema` — emesso solo se il frontmatter ha `faq`.
- `generateBlogSchema` — per l'indice, insieme a `BreadcrumbList`.

### Open Graph image

`opengraph-image.tsx` genera al build un PNG 1200×630 con titolo, tag, data e
firma, usando `ImageResponse`. I font DM Sans (Regular e Bold) vanno aggiunti
come `.ttf` in `public/fonts/` e letti con `fs`, perché `ImageResponse` vuole
i font come buffer e non deve dipendere dalla rete durante il build.

### Cover generativa

`src/app/[locale]/blog/components/article-cover.tsx` è un Server Component puro
che rende un SVG deterministico: un hash dello slug seleziona variante
geometrica, rotazione e offset, sulla palette dei token esistenti (`--secondary`
`#0d7ef2` su `--background` `#111`), nello stile di `GridLayers`. Nessun
JavaScript spedito al client. Usato solo quando manca `cover`.

### Markdown puro per i crawler LLM

Rewrite in `next.config.ts` da `/:locale(it|en)/blog/:slug.md` verso
`/api/blog/:locale/:slug`. La route restituisce `text/markdown; charset=utf-8`
con header `X-Robots-Tag: noindex, follow`: i crawler LLM leggono il testo
pulito, Google non indicizza un duplicato del contenuto HTML.

Il corpo servito è l'MDX originale con una trasformazione leggera: i
`<Callout type="...">…</Callout>` diventano blockquote markdown, i `<Figure>`
diventano immagini markdown. Il resto passa invariato.

`src/app/llms.txt/route.ts` guadagna una sezione che elenca gli articoli
pubblicati con quegli URL.

### Feed RSS

`/it/blog/rss.xml` e `/en/blog/rss.xml`, `dynamic = "force-static"`, RSS 2.0
con `atom:link rel="self"`, `pubDate` in RFC 822, una `category` per tag.
Dichiarati nel `<head>` con `<link rel="alternate" type="application/rss+xml">`.

### Sitemap

`src/app/sitemap.ts` va rifattorizzato: oggi assume che il path sia identico in
tutte le lingue, cosa che non vale per gli slug localizzati. La struttura
diventa una lista di voci con path per locale, e `lastModified` usa la data
reale (`updatedAt ?? publishedAt`) invece dell'attuale `new Date()`, che
azzerava il segnale di freschezza a ogni deploy.

Nuove voci: `/blog` (priority 0.8, changeFrequency weekly) e un'entry per
articolo (priority 0.6, changeFrequency monthly).

## 5. Indice `/blog`

Struttura coerente con `/projects`: `HeroSection` con la propria
`hero-decoration`, filtro per tag con `nuqs` riusando l'impianto di
`projects-filter`, poi la lista.

Il primo articolo è in evidenza con cover grande; i successivi sono card
compatte con data, tempo di lettura, tag e badge `kind`. Stato vuoto sul
modello di `projects-empty-state`.

## 6. Pagina articolo

Colonna di lettura `max-w-[42.5rem]` (circa 680px, ~70 caratteri per riga),
centrata dentro il `max-w-5xl` del sito. Code block, immagini e callout possono
sforare fino a ~800px.

Sopra il breakpoint `xl` la TOC sticky vive nella gutter sinistra senza
stringere la colonna di testo; sotto diventa un blocco collassabile in cima
all'articolo.

Ordine in pagina:

1. Breadcrumb
2. Badge `kind` e tag
3. Titolo (h1) e sottotitolo
4. Riga meta: data di pubblicazione, tempo di lettura, "aggiornato il" se presente
5. Cover (fornita o generativa)
6. TL;DR dai `takeaways`
7. Corpo MDX
8. Navigazione serie, se l'articolo appartiene a una serie
9. Articoli correlati
10. CTA contatto

**Correlati**: stessi tag, escluso l'articolo corrente, ordinati per numero di
tag in comune e poi per data, massimo 3. Se nessun match, gli ultimi 3
pubblicati.

**Serie**: articoli con lo stesso `series.id` nello stesso locale, ordinati per
`part`. Mostra "Parte 2 di 4" con link precedente e successivo.

**Barra di progresso**: Client Component leggero, listener di scroll passivo su
`requestAnimationFrame`, ancorata sotto l'header fisso. È decorativa, quindi
`aria-hidden="true"` invece di un `role="progressbar"` che aggiungerebbe solo
rumore per gli screen reader.

**Scroll-spy della TOC**: `IntersectionObserver` sugli heading, la voce attiva
riceve `aria-current="true"`. La TOC è dentro `<nav aria-label>`.

**Copy sui code block**: `navigator.clipboard` con stato "Copiato" temporaneo e
`aria-live="polite"`.

Tutte le animazioni rispettano `prefers-reduced-motion`, già gestito
globalmente in `globals.css`.

## 7. Header e footer

`src/constants/navigation.ts`:

- `NAV_LINKS` perde la voce `llms.txt` (che resta nel footer, dove il pubblico
  giusto la trova) e guadagna `/blog`. Ordine finale: Home · Progetti ·
  Chi sono · Blog.
- `FOOTER_LINKS` guadagna una sezione `blog` collocata tra `general` e
  `projects`.

La colonna Blog del footer non è una lista statica: elenca gli ultimi 3
articoli in ordine cronologico più un link "Tutti gli articoli". `Footer` è già
un Server Component `async`, quindi legge i frontmatter al build senza costi
lato client.

La griglia interna del footer passa da `grid-cols-2` a
`grid-cols-2 lg:grid-cols-3`.

Nuove chiavi in `src/translations/{it,en}/common.json`: `navigation.blog`,
`footer.sections.blog`, `footer.links.allArticles`.

## 8. Skill ghostwriter

```
.claude/skills/blog-ghostwriter/
  SKILL.md
  references/
    voice-and-tone.md
    seo-checklist.md
    frontmatter-reference.md
    mdx-components.md
```

Flusso in cinque passi:

1. **Intervista** — argomento, angolo, pubblico, cosa deve portarsi a casa il
   lettore, `kind`, eventuale serie.
2. **Ricerca** — Context7 per API e versioni di librerie, ricerca web per dati
   e fatti recenti. Nessuna affermazione tecnica senza verifica.
3. **Scaletta** — presentata e approvata prima di scrivere.
4. **Scrittura** — `content/blog/it/<slug-it>.mdx` e
   `content/blog/en/<slug-en>.mdx` come **due pezzi nativi**, non traduzione
   letterale: idiomi, esempi e riferimenti di mercato cambiano tra i due.
5. **Self-check** — lunghezza nella fascia, tag nel vocabolario, meta
   description entro 150–160 caratteri, `translationKey` coerente sui due file,
   assenza di tic da LLM, code block che compilano davvero.

`voice-and-tone.md` fissa il registro (metà tecnico, metà business, prima
persona, concreto, con numeri) e le regole di stile: niente em dash, niente
tricolon a raffica, niente aperture da "in un mondo sempre più veloce", frasi
di lunghezza variabile. Il catalogo dei tic da LLM non viene duplicato: la
reference rimanda a `.claude/skills/seo-audit/references/ai-writing-detection.md`,
che nel repo esiste già.

## 9. Validazione e verifica

Il repo non ha framework di test, quindi la rete di sicurezza è la validazione
al build più i controlli esistenti.

`parseFrontmatter()` fa fallire il build quando:

- manca un campo obbligatorio;
- `publishedAt` o `updatedAt` non sono date valide, o `updatedAt` precede
  `publishedAt`;
- `kind` è fuori da `BLOG_KINDS` o un tag è fuori da `BLOG_TAGS`;
- `cover` è presente senza `coverAlt`;
- `description` esce dai 120–170 caratteri;
- `takeaways` non ha da 2 a 5 voci;
- un `translationKey` non ha esattamente un file per locale, o due file nello
  stesso locale condividono lo stesso `translationKey`;
- due articoli nello stesso locale condividono lo stesso slug.

Comandi di verifica: `npx tsc --noEmit`, `npm run lint`, `npm run build`
(che richiede `NEXT_PUBLIC_SITE_URL`).

Controlli manuali dopo il build: `/it/blog` e `/en/blog` rendono la lista; un
articolo rende TOC, code block, copy e correlati; il language switcher su un
articolo porta alla controparte corretta; `/it/blog/<slug>.md` restituisce
markdown; `/it/blog/rss.xml` è XML valido; `sitemap.xml` contiene gli articoli
con gli alternates giusti; la Rich Results Test valida `BlogPosting`.

## 10. Fuori scope

Esclusi deliberatamente, da riconsiderare quando il volume lo giustifica:

- commenti e newsletter (infrastruttura e moderazione sproporzionate);
- contatore visite (richiede storage con stato);
- ricerca full-text (con poche decine di articoli il filtro per tag basta);
- paginazione dell'indice (inutile sotto i ~20 articoli);
- pagine tag dedicate `/blog/tag/<tag>` — con pochi articoli sarebbero thin
  content penalizzante; da introdurre quando un tag ha massa critica.

## Appendice: file toccati

**Nuovi**

```
content/blog/{it,en}/                              contenuti
src/constants/blog.ts                              vocabolario tag e kind
src/libs/blog/{source,frontmatter,reading-time,toc}.ts
src/components/mdx/{mdx-components,callout,copy-button,figure}.tsx
src/app/[locale]/blog/page.tsx
src/app/[locale]/blog/[slug]/page.tsx
src/app/[locale]/blog/[slug]/opengraph-image.tsx
src/app/[locale]/blog/rss.xml/route.ts
src/app/[locale]/blog/components/                  cover, card, toc, progress, correlati, serie
src/app/[locale]/blog/sections/                    hero, lista, filtro
src/app/api/blog/[locale]/[slug]/route.ts
src/translations/{it,en}/blog.json
public/fonts/DMSans-{Regular,Bold}.ttf
.claude/skills/blog-ghostwriter/
```

**Modificati**

```
next.config.ts                    MDX, rewrite .md
tsconfig.json                     alias @content/*
package.json                      dipendenze
src/libs/i18n/request.ts          namespace blog
src/constants/navigation.ts       header e footer
src/components/layout/footer.tsx  colonna Blog
src/components/layout/header.tsx  solo se serve per il nuovo ordine
src/components/layout/language-switcher.tsx   slug gemello sugli articoli
src/app/sitemap.ts                refactor per path localizzati
src/app/llms.txt/route.ts         sezione articoli
src/app/globals.css               stili prosa, code block, anchor heading
src/translations/{it,en}/common.json
CLAUDE.md                         orientamento sul blog
.claude/rules/architecture.md     folder layout e content pipeline
```
