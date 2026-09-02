# Case study dei progetti — Design

Data: 2026-09-02
Stato: in revisione

## Contesto

`/projects` elenca dodici card in una griglia piatta a due colonne. Ogni card
porta il logo del cliente, tag tecnologici, uno screenshot e un testo — che
descrive **il cliente**, non il contributo:

> "Quido.ai è una piattaforma di intelligenza artificiale dedicata al mondo del
> private equity e delle operazioni M&A in Italia…"

Tre elementi rinforzano la lettura sbagliata: il testo parla dell'azienda, lo
screenshot è la loro landing page, e la CTA primaria dice "Visita il sito". Il
risultato è che un visitatore conclude una di due cose, entrambe false: che
siano state consegnate delle landing page, oppure che ci sia stata una
collaborazione indistinta da dipendente full-time. Il lavoro reale — rework
completo di UI/UX, feature di prodotto, architettura, sostituzione temporanea
di un CTO, mentoring con passaggio di consegne documentato — non è visibile da
nessuna parte.

C'è anche un effetto SEO: `src/app/[locale]/projects/page.tsx` passa quelle
stesse descrizioni allo schema `ItemList` e usa il sito del cliente come `url`.
Il portfolio si presenta a Google come un elenco di siti altrui.

Obiettivo: rendere leggibile il contributo su tutti i progetti, e dare
profondità narrativa a quelli che se la guadagnano, senza che la pagina risulti
incompleta finché i contenuti lunghi non esistono.

## Decisioni

| Ambito | Decisione | Alternative scartate |
| --- | --- | --- |
| Dove vive la profondità | Pagine MDX dedicate sotto `/{locale}/projects/[slug]`, **additive** | Solo card strutturata; case study scritti come articoli del blog |
| Riuso del blog | Nuovo `src/libs/case-studies/` che copia la *forma* di `src/libs/blog/` senza importarne i moduli | Estrarre un modulo di contenuto condiviso fra blog e case study |
| Slug e i18n | Slug unico, identico nelle due lingue | Slug localizzati legati da `translationKey`, come il blog |
| Metadati di progetto | `PROJECTS` + `projects.json`, letti sia dalla card sia dalla pagina | Duplicarli nel frontmatter del case study |
| Legame progetto ↔ case study | Derivato dalla sorgente MDX | Campo `caseStudy: string` dentro `PROJECTS` |
| Tassonomia | `kind` (`client`/`product`/`personal`) fuori dai tag, più vocabolario `roles` | Tenere `customer`/`personal` in mezzo ai tag tecnologici |
| `fde` tra i ruoli | No: resta narrativa dentro il case study di Quido | Chip di filtro `fde` |
| Griglia del lavoro cliente | Una card a riga intera, split orizzontale | Due card per riga, come oggi |
| Ordine dei blocchi | Clienti → esperimenti → prodotti (i prodotti stanno fuori dal filtro, vedi §6) | Prodotti per primi, come oggi |
| Immagine della card | Riconoscimento del cliente, non prova del lavoro | Sostituire ovunque con screenshot di prodotto |
| JSON-LD del case study | `BreadcrumbList` + `CreativeWork` | `Article` / `BlogPosting` |
| `llms.txt` | Elenca i case study | Non elencarli, per coerenza con la scelta fatta sugli articoli |

### Perché non condividere codice col blog

`src/libs/blog/` risolve già problemi identici: validazione del frontmatter che
fa fallire il build, coppie di locale con guardia di consistenza, pipeline MDX,
sitemap, JSON-LD. La tentazione è estrarne un livello condiviso.

Non si fa. Il blog è appena passato per un rework di performance (payload RSC
delle card, route raster per le cover, tetto alle superfici che elencano tutto)
e continuerà a muoversi con l'archivio che cresce. Un case study ha vincoli
opposti: sono meno di dieci, non paginano, non hanno feed, non hanno cover
generative. Accoppiare due sottosistemi con traiettorie diverse costa più della
duplicazione di un pattern piccolo. Se un giorno arriva un terzo tipo di
contenuto, allora si estrae con tre casi d'uso reali sotto gli occhi.

### Perché non articoli del blog

È la strada più economica: zero sottosistema nuovo, e sitemap, RSS e `llms.txt`
già li gestirebbero. Si scarta per il lettore. Il blog parla a uno sviluppatore
con l'editor aperto; un case study parla a un potenziale cliente che sta
decidendo se scrivere. Registro diverso, obiettivo diverso. Mescolarli rende
incoerente l'indice del blog e fa leggere `/blog/come-ho-rifatto-la-ux-di-x`
come content marketing invece che come portfolio.

## 1. Triage dei progetti

| Progetto | `kind` | Case study | Nota |
| --- | --- | --- | --- |
| Quido | client | Sì — **primo** | Rework totale UI/UX, poi arco da consulente a forward deployed engineer |
| Recrowd | client | Sì | Più piattaforme incluso l'intero backoffice, più la landing |
| Otherside Technology | client | Sì | CloTU, sistema multi-agentico; contributo su UI/UX frontend |
| Brainplatform | client | Sì | Rework di sistema legacy, Fluent UI, ricerca con suggeriti e azioni rapide, dashboard whitelabel, mentoring |
| Studio Bargiggia | client | Sì — **secondo** | Arco completo discovery → handover, rischio NDA nullo |
| Anonimo (tabaccherie) | client | Sì | Check-in con geofence 500 m, RBAC, PostgreSQL serverless; cliente non nominabile |
| Ravenn | client | No | Stand-in del CTO e area staff con flussi dedicati: storia forte ma corta, sta nella card |
| Fast Memo | product | No | Già in `FEATURED_PRODUCTS` |
| Coolify Manager | product | No | Già in `FEATURED_PRODUCTS` |
| Forfettario Control | personal | No | Solo design Figma, mai sviluppato |
| Coffee Notes Lab | personal | No | Progetto personale, nessun obiettivo di lead-gen |
| old.andrealosavio.com | — | — | **Esce** dai progetti, diventa easter egg nel footer |

Sei dei sette progetti cliente reggono un racconto per esteso; il settimo
(Ravenn) ne ha uno corto, che sta nella card. Il sistema deve però reggere
anche lo stato in cui nessun case study è ancora scritto: un progetto senza
pagina resta esattamente la card che è.

### Fasi

Le due metà sono indipendenti e si spediscono separate:

- **Fase A — il pavimento**: tassonomia, `context`/`contribution` su tutti e
  dodici, card a riga intera, raggruppamento, correzione dell'`ItemList`,
  easter egg del sito vecchio. Risolve il problema descritto nel contesto anche
  se non viene mai scritto un case study.
- **Fase B — la profondità**: `src/libs/case-studies/`, la route, la sitemap,
  il JSON-LD, `llms.txt`, e i primi due contenuti.

La fase A non dipende dalla B. La B aggiunge il primario "Leggi il case study"
alle card dei progetti che nel frattempo hanno guadagnato una pagina.

## 2. Modello dei contenuti

```
content/case-studies/
├── it/quido.mdx
└── en/quido.mdx
```

Fuori da `src/`, raggiunto dall'alias `@content/*` che esiste già in
`tsconfig.json`. La configurazione MDX in `next.config.ts` è globale
(`extension: /\.mdx?$/`), quindi i case study ereditano gli stessi plugin senza
modifiche.

**Lo slug è identico nelle due lingue.** È la differenza deliberata rispetto al
blog: là l'identità è il titolo dell'articolo, che si traduce, e serve
`translationKey` più `pathByLocale` per tenere insieme la coppia. Qui
l'identità è il cliente, che non si traduce. Il nome del file è la chiave, la
guardia diventa "ogni file in `it/` ha il gemello in `en/`", e la sitemap può
usare l'helper `samePath` esistente senza risoluzioni per locale.

### Frontmatter

```yaml
project: quido                       # deve esistere in PROJECTS
title: Da consulente a forward deployed engineer
summary: >-                          # 120–170 caratteri: card + metadata
  ...
period: "2024 — oggi"
publishedAt: 2026-09-02
updatedAt: 2026-09-10                # opzionale, non può precedere publishedAt
cover: /images/case-studies/quido/cover.webp
coverAlt: ...                        # obbligatorio quando c'è cover
draft: false
```

Il frontmatter porta **solo ciò che è specifico del case study**. Ruoli, stack
e testo di contributo restano in `PROJECTS` e `projects.json`, perché servono
anche ai progetti senza pagina: la card li legge da lì e l'intestazione del
case study rilegge la stessa sorgente. Una fonte sola, nessuna deriva.

`period` è una stringa libera mostrata così com'è: è un intervallo leggibile
("2024 — oggi", "primavera 2023"), non una data da confrontare, e validarlo
costringerebbe a una precisione che il contenuto non ha. `draft: true` esclude
il case study da `generateStaticParams`, dalla sitemap, da `llms.txt` e dal
link sulla card — esattamente come per gli articoli — così una bozza in attesa
dell'ok del cliente può stare nel repo senza essere raggiungibile.

`src/libs/case-studies/frontmatter.ts` valida e normalizza sul modello di
`parseFrontmatter` del blog: errore descrittivo prefissato dal file, lanciato
al primo campo malformato, così il build fallisce invece di spedire metadati
sbagliati.

### Guardie a build-time

`assertConsistency` in `src/libs/case-studies/source.ts` lancia se:

1. un case study non ha il gemello nell'altra lingua;
2. `project:` non risolve a un id presente in `PROJECTS`;
3. due case study dichiarano lo stesso `project`.

### Asset

`public/images/case-studies/<slug>/`, una cartella per case study con nomi
generici all'interno (`cover.webp`, `search.webp`). Lo slug è condiviso, quindi
una cartella serve entrambe le lingue — stessa logica di
`public/images/blog/<translationKey>/`.

## 3. Modello dati dei progetti

`src/constants/projects.ts`:

```ts
export const PROJECT_ROLES = [
  "ui-ux", "product", "frontend", "fullstack",
  "mobile", "architecture", "design-system", "mentoring",
] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export interface Project {
  id: string;
  kind: "client" | "product" | "personal";
  roles: readonly ProjectRole[];
  tags: readonly string[];      // solo tecnologie
  // logo, image, websiteUrl, githubUrl, designUrl invariati
}
```

`customer` e `personal` escono dai `tags`: oggi stanno nella stessa lista di
`nextjs` e `prisma`, come se "è un cliente" e "usa React" fossero la stessa
specie di informazione. Diventano `kind`, che pilota il raggruppamento della
pagina.

`fde` non entra nel vocabolario: gli altri valori sono discipline, mentre FDE è
un arco di carriera, e come chip di filtro sarebbe gergo che nessuno userebbe.
Vive nel titolo e nel corpo del case study di Quido, dove ha lo spazio per
essere dimostrato invece che asserito.

Nessun campo `caseStudy`. Il legame si deriva da
`getCaseStudyForProject(locale, projectId)`, così non esiste uno stato in cui
un flag dice una cosa e i file ne dicono un'altra.

### Traduzioni

`projects.items.<id>` perde `description` e guadagna due campi:

```json
{
  "name": "Quido S.r.l.",
  "context": "Piattaforma AI per private equity e M&A",
  "contribution": "Ho rifatto l'intera UI/UX della piattaforma…"
}
```

`context` è una riga: il residuo compresso di quello che oggi occupa la card
intera. `contribution` è prosa in prima persona, ~40 parole. Niente elenchi
puntati: appesantiscono una card già densa, e i bullet sono il mestiere del
case study.

`projects.items.common` guadagna `readCaseStudy` e `clientSite`; nascono
`projects.groups.{clients,products,experiments}.{title,subtitle}`.

Vale per entrambi i locale: `src/translations/it/projects.json` e
`src/translations/en/projects.json` restano strutturalmente allineati.

## 4. Route, i18n, SEO

Route `src/app/[locale]/projects/[slug]/page.tsx`, con `dynamicParams = false`
e `generateStaticParams` dalla sorgente: esiste solo ciò che il build ha visto,
tutto il resto è 404. Nessun conflitto con `[locale]/[...rest]`, che è meno
specifico.

- **Canonical** `${siteUrl}/${locale}/projects/${slug}`; hreflang `it`, `en`,
  `x-default` — banali, essendo lo slug condiviso.
- **Open Graph**: la cover è raster, quindi finisce direttamente in
  `openGraph.images`. Non serve la route `opengraph-image` che il blog è
  costretto ad avere per rasterizzare le cover SVG con satori.
- **JSON-LD**: `BreadcrumbList` (Home › Progetti › cliente) più `CreativeWork`
  con `author` la `Person` del sito e il cliente come `about`. Non `Article`:
  quello è del blog, e un case study non è un pezzo giornalistico. Nuovo helper
  in `src/utils/seo-schema.ts`, con `author` e `publisher` inline — la stessa
  lezione già imparata sul `BlogPosting`, dove referenziare per `@id` un nodo
  dichiarato su un'altra pagina non funziona.
- **Sitemap**: una `SitemapRoute` per case study, `pathByLocale` costruito con
  `samePath(`/projects/${slug}`)`, `lastModified` da `updatedAt ?? publishedAt`
  e mai `new Date()`, priorità `0.7`, `changeFrequency: "monthly"`.
  `PROJECTS_LAST_MODIFIED` va aggiornata a mano, come per le altre statiche.
- **`llms.txt`**: guadagna una sezione con i case study. Il briefing non elenca
  gli articoli di proposito, perché crescono senza limite; i case study sono un
  insieme chiuso sotto la decina e sono letteralmente *cosa fa* Andrea, che è
  lo scopo dichiarato del briefing.

### Correzione dell'`ItemList` su `/projects`

Oggi `page.tsx` passa allo schema la descrizione del cliente e, come `url`, il
sito del cliente. Diventano `contribution` e — quando il case study esiste — la
sua URL. Il portfolio smette di dichiararsi a Google come una lista di siti
altrui.

## 5. La card

Layout a riga intera, split orizzontale: immagine a sinistra ~40%, contenuto a
destra, impilati su mobile. La larghezza è ciò che risolve il problema di
densità: contesto, chip, contributo e due CTA ci stanno senza affollare.

```
┌──────────────────┬──────────────────────────────────────┐
│                  │ [logo] Quido S.r.l.                  │
│                  │ Piattaforma AI per private equity    │
│   screenshot     │ [ui-ux][product][mobile] · next · expo│
│                  │                                       │
│                  │ Ho rifatto l'intera UI/UX della…     │
│                  │                                       │
│                  │ [Leggi il case study]  Sito ↗        │
└──────────────────┴──────────────────────────────────────┘
```

### CTA

| Caso | Primario | Secondario |
| --- | --- | --- |
| Cliente con case study | Leggi il case study | Sito del cliente ↗ |
| Cliente senza case study | — | Sito del cliente ↗ |
| Prodotto personale | Visita il sito | GitHub ↗ |
| Solo design | Guarda il design ↗ | — |

"Sito del cliente" al posto di "Visita il sito" dice cosa viene linkato e
smette di rivendicarlo come proprio.

### Immagini

Regola: **lo screenshot sulla card è riconoscimento del cliente, non prova del
lavoro.** La prova sta nel case study, dove le immagini hanno una didascalia
che dice cosa si sta guardando. Così non serve procurarsi screenshot di
prodotto sotto NDA per rendere onesta la card; dove esistono e sono
pubblicabili (Studio Bargiggia è interamente suo, la landing di Recrowd è sua)
si usano.

## 6. La pagina `/projects`

Hero invariato. Poi tre blocchi, in quest'ordine:

1. **Lavoro per clienti** — sette card a riga intera
2. **Esperimenti** — Coffee Notes Lab e Forfettario Control, card compatte a
   due o tre per riga
3. **I miei prodotti** — la sezione `FEATURED_PRODUCTS` esistente

L'ordine attuale mette i prodotti personali sopra l'elenco. Si inverte: il
problema da risolvere è la credibilità sul lavoro cliente, e quella va per
prima.

I prodotti chiudono invece di stare in mezzo, ed è un vincolo di struttura più
che una preferenza. Clienti ed esperimenti vivono dentro lo stesso
`ProjectsFilterProvider`; i prodotti no, perché `FeaturedProductsSection` è una
sezione a sé che il filtro non tocca. Infilarla fra i due gruppi filtrabili
significherebbe che, filtrando, i titoli collassano ma il blocco prodotti resta
piantato in mezzo ai risultati. Fuori dalla regione filtrata può stare solo
prima di tutto o dopo tutto, e "prima di tutto" è esattamente l'ordine che
stiamo correggendo.

Il filtro sopravvive su ruoli e stack (non più su `customer`/`personal`, che
ora sono il raggruppamento). Quando un filtro è attivo i blocchi collassano in
una lista piatta — la stessa cosa che l'indice del blog fa già sospendendo il
blocco "In evidenza" durante un filtro.

## 7. La pagina del case study

- Intestazione costruita da `PROJECTS` + `projects.json` + frontmatter: logo,
  nome, contesto, periodo, chip dei ruoli, stack.
- Corpo MDX, con gli override di `src/mdx-components.tsx` già esistenti.
- CTA di chiusura verso `#contact`, sul modello della CTA di fine articolo.
- Link di ritorno a `/projects` e link al sito del cliente.

Riusa `Card` e `Button variant="gradient-outline"`: il vocabolario visivo resta
quello del sito.

## 8. Template e regole dei contenuti

Quattro battute, che rispondono direttamente alle due letture sbagliate
descritte nel contesto:

1. **Perché mi hanno chiamato** — la situazione prima
2. **Cosa ho posseduto** — perimetro e ruolo, espliciti. Chiude la lettura
   "dipendente full-time indistinto"
3. **Cosa ho fatto e perché così** — le decisioni col ragionamento dietro. È
   qui che sta il valore, non nell'elenco delle feature
4. **Cosa è cambiato e cosa ho lasciato** — esito e passaggio di consegne

700–1200 parole. Voce distinta da quella del blog: meno codice, più decisioni,
zero aggettivi da brochure.

### Regola di riservatezza

Si nominano solo aziende che il sito già espone con logo e link. Mai persone,
mai metriche non autorizzate, mai roadmap non annunciata, mai screenshot con
dati reali. Il cliente delle tabaccherie resta anonimo e si racconta per il
meccanismo, che è dove sta il valore. Per i case study su cui resta un dubbio,
la bozza si manda al cliente prima di pubblicare.

Ordine di scrittura: **Quido** (l'arco verso FDE, la prova del titolo che il
sito già dichiara), poi **Studio Bargiggia** (arco completo, rischio nullo,
raggio diverso). Gli altri quando c'è occasione.

## 9. Modifiche collaterali

`old.andrealosavio.com` esce da `PROJECTS`. L'idea di retrocederlo a link easter
egg nel footer è stata implementata e poi ritirata da Andrea il 2026-09-02: il sito
vecchio semplicemente non compare più da nessuna parte, coerentemente con
l'intenzione di spegnerlo prima o poi.

## 10. Validazione

- `npx tsc --noEmit`, `npm run lint`, `npm run build`
- `npx vitest run` — test unitari per le funzioni pure di
  `src/libs/case-studies/` (parsing del frontmatter, guardie di consistenza),
  come già si fa per `src/libs/blog/`
- Build negativo verificato a mano: `project:` inesistente, gemello mancante,
  due case study sullo stesso progetto → il build deve fallire con un messaggio
  che nomina il file
- `/it/projects/quido` e `/en/projects/quido` rispondono; uno slug inventato dà
  404
- Sitemap contiene le due URL per case study con il `lastModified` giusto
- Rich Results Test su una pagina di case study: `BreadcrumbList` +
  `CreativeWork` senza errori
- `/projects` non regredisce: filtro, ordinamento, empty state

## 11. Fuori scope (v1)

Mirror `.md` per crawler LLM, feed RSS, paginazione, indice dei contenuti,
tempo di lettura, generatore di cover, case study correlati, filtro dedicato ai
case study, route `opengraph-image`.

## Appendice: file toccati

**Nuovi**

```
content/case-studies/{it,en}/*.mdx
public/images/case-studies/<slug>/*
src/libs/case-studies/frontmatter.ts          (+ .test.ts)
src/libs/case-studies/source.ts               (+ .test.ts)
src/app/[locale]/projects/[slug]/page.tsx
src/app/[locale]/projects/[slug]/components/*
docs/superpowers/plans/2026-09-02-case-studies.md
```

**Modificati**

```
src/constants/projects.ts                     kind, roles, PROJECT_ROLES, rimozione old site
src/translations/{it,en}/projects.json        context/contribution, groups, CTA
src/app/[locale]/projects/page.tsx            ItemList, ordine delle sezioni
src/app/[locale]/projects/components/project-card.tsx        layout a riga intera, CTA
src/app/[locale]/projects/components/projects-filter*.tsx    ruoli al posto di kind
src/app/[locale]/projects/sections/projects-section.tsx      raggruppamento a tre blocchi
src/app/sitemap.ts                            route dei case study
src/app/llms.txt/route.ts                     sezione case study
src/utils/seo-schema.ts                       helper CreativeWork
src/components/layout/footer.tsx              easter egg del sito vecchio
.claude/rules/architecture.md                 sottosistema case study (in inglese)
.claude/rules/seo.md                          JSON-LD e sitemap dei case study (in inglese)
```
