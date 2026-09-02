# Handoff — case study dei progetti

Data: 2026-09-02
Branch: `feat/case-studies` (30 commit sopra `main`, working tree pulito, mai pushato)

## ⛔ Leggi questo per primo: il branch è rosso

`npm run build` **fallisce**. Non è una regressione da cercare, è una conseguenza nota
e diagnosticata:

```
Module not found: Can't resolve '@content/case-studies/' <dynamic> '/' <dynamic> '.mdx'
  src/app/[locale]/projects/[slug]/page.tsx:94
```

Turbopack costruisce la mappa dei moduli per l'import dinamico **a build-time**, e
senza almeno un `.mdx` che corrisponda al pattern non risolve. Verificato due volte di
persona:

- directory `content/case-studies/` assente → errore
- directory create ma **vuote** → stesso identico errore

`generateStaticParams` che torna un array vuoto e `dynamicParams = false` non c'entrano:
il fallimento è nella risoluzione, prima che qualunque pagina venga generata.

**La correzione decisa** (Ruling AA, sotto): creare le due coppie MDX come *scheletri*
con `draft: true`. Vedi "Il primo passo" in fondo.

## Cos'è questo lavoro

`/projects` descriveva **i clienti**, non il contributo di Andrea. Con lo screenshot
della loro landing e una CTA primaria "Visita il sito", un visitatore concludeva una di
due cose, entrambe false: che avesse consegnato delle landing page, o che fosse stato
"un falso dipendente full-time" (parole sue). Il lavoro reale — rework completo di
UI/UX, feature di prodotto, architettura, sostituzione temporanea di un CTO, mentoring
con passaggio di consegne — non era visibile da nessuna parte.

Documenti che comandano, in ordine di autorità:

1. `docs/superpowers/specs/2026-09-02-case-studies-design.md` — **la spec è vincolante**
2. `docs/superpowers/plans/2026-09-02-case-studies.md` — il piano argomenta dalla spec
3. Questo handoff — lo stato

## Stato dei task

| # | Task | Stato |
| --- | --- | --- |
| 1 | Tassonomia (`kind`, `roles`) | ✅ completo, review pulita |
| 2 | Copy `context`/`contribution` IT+EN | ✅ completo, review pulita |
| 3 | Card a riga intera | ✅ completo, review pulita |
| 4 | Raggruppamento e ordine pagina | ✅ completo, review pulita |
| 5 | Filtro su ruoli e stack | ✅ completo, review pulita |
| 6 | Easter egg nel footer | ⊘ **RITIRATO da Andrea** dopo l'implementazione |
| 7 | Documentare la fase A | ✅ completo, review pulita |
| 8 | Validazione frontmatter | ✅ completo, review pulita, 11 test |
| 9 | Sorgente e guardie di consistenza | ✅ completo, review pulita, 5 test |
| 10 | Schema `CreativeWork` | ⚠️ **implementato, MAI REVISIONATO** |
| 11 | Route `/projects/[slug]` | ⚠️ **implementato, MAI REVISIONATO, build rosso** |
| 12 | Sitemap, link dalla card, `llms.txt` | ⬜ non iniziato |
| 13 | Contenuto Quido | ⬜ scaffolding da fare, corpo di Andrea |
| 14 | Contenuto Studio Bargiggia + docs | ⬜ scaffolding e docs da fare |

**La fase A (1-7) è completa e spedibile da sola.** Se la fase B si complicasse, si può
tagliare il branch lì: `/projects` è già corretta senza un solo case study scritto.

Nota su Task 10+11: sono stati implementati e l'implementer ha riportato `tsc`, `lint`,
vitest 106/106, parità delle traduzioni e la verifica anti-regressione sulla CTA del blog
tutti verdi — **ma il build rosso ha interrotto il ciclo prima della review del task**.
Vanno revisionati.

## Dove sta il lavoro di processo

Il piano è stato eseguito con `superpowers:subagent-driven-development`. Lo stato vive in:

```
.superpowers/sdd/2026-09-02-case-studies/     (git-ignored)
├── progress.md          ← il ledger: ogni ruling, ogni minor differito
├── task-N-brief.md      ← brief 1-14, già generati
├── task-N-report.md     ← report degli implementer
└── orphan-worktree-changes.patch   ← backup del ritiro manuale del Task 6
```

Per riprendere: rileggi `progress.md`, poi `scripts/task-brief` e `scripts/review-package`
da `~/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills/subagent-driven-development/scripts/`.

`.superpowers/` è stato aggiunto a `.gitignore` durante il setup.

## Decisioni prese durante l'esecuzione

Ognuna è nel ledger con il costo se sbagliata. Le rilevanti per chi prosegue:

**Sull'architettura**

- **`src/libs/case-studies/` non importa niente da `src/libs/blog/`.** Deliberato e
  documentato: il blog è un archivio che cresce, con paginazione, feed e cover generate;
  i case study sono un insieme chiuso sotto la decina senza niente di tutto ciò. Copiare
  la forma costa meno che accoppiare due sottosistemi con traiettorie diverse. **Non
  "unificare" i due moduli.**
- **Slug identico nelle due lingue** (`quido.mdx` in `it/` e in `en/`). Diverso dal blog,
  dove gli slug si traducono. Qui l'identità è il cliente, che non si traduce: niente
  `translationKey`, niente `pathByLocale`, la sitemap usa `samePath`.
- **Ordine dei blocchi: clienti → esperimenti → prodotti** (Ruling N). La spec diceva
  clienti → prodotti → esperimenti, ed è stata emendata: i prodotti vivono **fuori** dal
  `ProjectsFilterProvider`, quindi in mezzo ai due gruppi filtrabili resterebbero
  piantati fra i risultati mentre i titoli collassano sotto filtro.
- **`FILTERABLE_PROJECTS`** (Ruling P): l'insieme su cui si filtra deve coincidere con
  quello che si rende. Prima non era così e tre chip (`tauri`, `javascript`, `extension`)
  nascondevano tutte le card sopprimendo anche il messaggio "nessun risultato".
- **`fde` non è nel vocabolario dei ruoli.** Gli altri sono discipline; FDE è un arco di
  carriera. Vive nel titolo e nel corpo del case study di Quido.

**Sui contenuti**

- **Ruling AA** (corregge il precedente Ruling R): la separazione non è "tutti i Task
  13/14 ad Andrea", è **scaffolding all'agente, affermazioni ad Andrea**. Gli scheletri
  MDX con `draft: true` si generano; il corpo lo scrive lui.
- **Il `summary` degli scheletri dev'essere un segnaposto palese.** Se qualcuno
  pubblicasse per sbaglio, meglio un testo evidentemente incompleto che una frase
  plausibile ma inventata.
- **Regola di riservatezza**: si nominano solo aziende che il sito già espone con logo e
  link. Mai persone, mai metriche non autorizzate, mai roadmap. Il cliente delle
  tabaccherie resta anonimo e si racconta per il meccanismo (check-in con geofence a
  500 m), che è dove sta il valore.
- **Il copy dei Task 2, 13 e 14 va riletto da Andrea prima del merge.** Sono affermazioni
  sulla sua carriera, non stringhe di interfaccia. Il Task 2 è già in pagina e non l'ha
  ancora riletto.

**Difetti del piano trovati dalle review** (tutti già corretti nel piano e nel codice)

- `projects.featured.*` sarebbe sparito dal `projects.json`, rompendo a runtime la
  sezione prodotti senza che il type check dicesse niente (Ruling A).
- `externalLabel` diceva "Guarda il design" mentre l'href apriva il sito, quando un
  progetto aveva entrambi gli URL (Ruling K).
- Il confronto sui ruoli non compilava; risolto con un widening cast, non un narrowing
  (Ruling O).
- `draft: raw.draft === true` **falliva aperto**: `draft: Yes` in YAML viene letto come
  stringa dal core schema YAML 1.2, quindi il case study veniva pubblicato invece di
  restare bozza (Ruling U).
- `vitest.config.ts` elenca le directory dei test una per una: senza la riga nuova il
  runner rispondeva "No test files found" e il RED si leggeva come un GREEN (Ruling T).

## Minor differiti, da triare nella review finale

- `FilterChipGroup` usa `common.accessibility.filterByTag` come `aria-label` anche per i
  chip di ruolo. Nessun difetto oggi — la stringa è "Filtra per {tag}", dove `tag` è il
  nome del parametro — ma una futura modifica a quella stringa renderebbe sbagliati i
  ruoli. Una chiave dedicata sarebbe più solida.
- I titoli di gruppo sono `h2` fratelli dell'`h2` `sr-only` della sezione, invece di `h3`
  annidati.
- Un gruppo interamente filtrato via lascia il suo `mb-12`: 48px di vuoto sopra i
  risultati visibili.
- La riga delle CTA rende un `div` vuoto per un progetto senza case study e senza URL
  esterna (oggi solo `anonymous`).
- Il link esterno della card non annuncia l'apertura in nuova scheda (preesistente).
- Due warning di lint su `_project`/`_coverAlt` nei test. Il fix giusto sarebbe
  `varsIgnorePattern: "^_"` nella config eslint, che sistemerebbe anche quello identico
  già presente in `src/libs/blog/frontmatter.test.ts` — ma è una decisione sul repo.
- Il messaggio d'errore del duplicato nomina progetto e locale ma non i due slug che
  collidono.
- Il messaggio di `coverAlt` dice "obbligatorio quando è presente cover", ma in questo
  modulo `cover` e `coverAlt` sono entrambi sempre obbligatori.
- Il cablaggio `loadAll` → `assertConsistency` non ha copertura di test.

## ⚠️ Fuori scope, ma Andrea deve saperlo

`src/libs/blog/frontmatter.ts:222` ha **lo stesso bug del `draft`** già corretto nei case
study, ed è già su `main`. Un articolo con `draft: Yes` nel frontmatter verrebbe
pubblicato invece di restare bozza. Non toccato di proposito: è un sottosistema appena
mergiato e la correzione è una chiamata di Andrea.

## Il primo passo per chi riprende

**Sbloccare il build.** Creare le due coppie di scheletri, tutte con `draft: true`:

```
content/case-studies/it/quido.mdx
content/case-studies/en/quido.mdx
content/case-studies/it/studio-bargiggia.mdx
content/case-studies/en/studio-bargiggia.mdx
```

Il frontmatter completo e la struttura delle sezioni stanno nei brief
`task-13-brief.md` e `task-14-brief.md`. Le quattro battute del template sono: *perché mi
hanno chiamato* → *cosa ho posseduto* → *cosa ho fatto e perché così* → *cosa è cambiato
e cosa ho lasciato*. Rispondono alle due letture sbagliate descritte in cima.

`draft: true` li tiene fuori da `generateStaticParams`, dalla sitemap, da `llms.txt` e dal
bottone sulla card: in produzione non esce niente. In dev sono visibili, ed è il file su
cui Andrea scriverà.

Poi, in ordine: verificare che `npm run build` torni verde con zero pagine generate →
review dei Task 10+11 → Task 12 → documentazione del Task 14 → review finale del branch.

## Sulle "pagine di dettaglio" che Andrea vuole ancora fare

La route esiste (`src/app/[locale]/projects/[slug]/page.tsx`, con
`components/case-study-header.tsx`), ma **non è mai stata renderizzata**: il build non è
mai arrivato in fondo e non esiste contenuto. Quindi è codice non verificato visivamente.

E il piano le disegna in modo deliberatamente minimale — intestazione, corpo MDX,
CTA di chiusura — perché la spec metteva fuori scope per la v1 il mirror `.md`, l'RSS, la
paginazione, l'indice dei contenuti, il tempo di lettura, il generatore di cover, i case
study correlati e la route `opengraph-image`.

Se Andrea vuole pagine di dettaglio più ricche, **è lavoro di design nuovo che la spec non
copre**: va brainstormato e aggiunto alla spec prima di implementarlo, non improvvisato
dentro l'esecuzione di questo piano.
