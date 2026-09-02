# Stato al merge — case study dei progetti

Data: 2026-09-02
Branch: `feat/case-studies`

> Questo documento sostituisce l'handoff scritto a metà lavoro, che descriveva
> un build rotto e una lista di task aperti. Entrambi non esistono più.

## Dov'è arrivato il lavoro

`/projects` descriveva **i clienti**, non il contributo di Andrea. Adesso la
pagina separa tre assi (`kind`, `roles`, `tags`), racconta ogni progetto con
`context` + `contribution` in prima persona, e i progetti che reggono un
racconto lungo hanno una pagina dedicata sotto `/{locale}/projects/[slug]`.

Tutto il codice è completo e revisionato: fase A (tassonomia, copy, card,
raggruppamento, filtro) e fase B (validazione del frontmatter, sorgente con
guardie a build-time, schema `CreativeWork`, route, sitemap, link dalla card,
`llms.txt`, documentazione).

Il sottosistema è documentato in `.claude/rules/architecture.md` (sezione
"Case studies") e `.claude/rules/seo.md` (sezione 11).

## Cosa resta ad Andrea

**Prima del merge:**

- Rileggere il copy. Non sono stringhe d'interfaccia, sono affermazioni sulla
  sua carriera e su clienti reali: `src/translations/{it,en}/projects.json` e le
  voci dei progetti in `src/app/llms.txt/route.ts`. Quattro righe in
  particolare sono segnalate nella review finale come da guardare per prime.

**Prima di pubblicare il primo case study** (oggi i quattro MDX sono scheletri
con `draft: true` e in produzione non esce niente):

- Scrivere il corpo di `content/case-studies/{it,en}/quido.mdx` e
  `studio-bargiggia.mdx`. La struttura, le quattro battute e la traccia raccolta
  in fase di design sono già nei file.
- Creare le cover: `public/images/case-studies/<slug>/cover.webp`, 1200×630,
  raster (il validatore rifiuta gli SVG, perché qui non c'è nessuna route di
  rasterizzazione che salvi l'anteprima social). Il build fallisce nominando il
  file se una cover manca su un case study non-draft.
- Rendere ruoli e stack come etichette leggibili invece che come slug
  (`ui-ux, product, mobile` sotto un'etichetta "Ruolo" al singolare), in
  `case-study-header.tsx`. Oggi non si vede perché nessun case study è
  pubblicato, ma è la pagina il cui unico compito è convincere un cliente.
- Aggiungere `publishedTime`, `modifiedTime` e `authors` al blocco `openGraph`
  della route: il frontmatter ha già i valori.

## Trappole da conoscere

- **`content/case-studies/` non può mai restare vuota.** Turbopack risolve
  l'import dinamico MDX a build-time e senza almeno un `.mdx` corrispondente il
  build non parte; le directory vuote falliscono allo stesso modo. Serve almeno
  un file, anche solo una bozza.
- `src/libs/case-studies/` non importa nulla da `src/libs/blog/`, ed è
  deliberato. Il motivo sta in `architecture.md`: si estrae solo se comparisse
  un terzo tipo di contenuto.
- `src/libs/blog/frontmatter.ts` ha lo stesso difetto sul `draft` che è stato
  corretto qui (un `draft: Yes` in YAML è una stringa, non `true`, quindi
  l'articolo verrebbe pubblicato invece di restare bozza). È su `main` da prima
  di questo branch e la correzione è una decisione di Andrea.
