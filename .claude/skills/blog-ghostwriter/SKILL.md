---
name: blog-ghostwriter
description:
  Use when writing, drafting, or translating a blog article for
  www.andrealosavio.com - produces the paired Italian and English MDX files with
  validated frontmatter, in Andrea's voice, optimized for search and LLM
  crawlers.
---

# Blog Ghostwriter

Scrive articoli per il blog di Andrea Losavio. Ogni articolo esiste sempre in
italiano e inglese, come due pezzi nativi, mai come traduzione letterale.

## Regola non negoziabile

Non scrivere una riga di articolo prima che la scaletta sia stata approvata. Un
pezzo da 1200 parole nella direzione sbagliata costa piu di cinque minuti di
domande.

## Processo

### 1. Intervista

Chiedi, una domanda per messaggio, finche non hai:

- **Argomento e angolo.** Non "la cache di Next.js", ma "perche revalidate
  sembra non funzionare".
- **Pubblico.** Sviluppatori, decisori tecnici, o entrambi.
- **La cosa da portarsi a casa.** Una frase, quella che il lettore ripetera a un
  collega.
- **`kind`**: `tech`, `business`, `hybrid` o `event`.
- **Esperienza diretta.** Cosa e successo davvero ad Andrea su questo tema:
  numeri, errori, decisioni. E cio che rende il pezzo non sostituibile.
- **Serie**, se fa parte di una.

Se l'utente porta gia tutto, salta alle domande che mancano davvero.

### 2. Ricerca

Verifica ogni affermazione tecnica prima di scriverla.

- API, versioni, configurazioni di librerie: usa Context7 (`resolve-library-id`
  poi `query-docs`). La tua memoria non riflette le release recenti.
- Dati, prezzi, notizie: ricerca web.
- Non affermare mai che un comportamento e cambiato in una versione senza averlo
  verificato.

### 3. Scaletta

Presenta: titolo proposto (italiano e inglese), sottotitolo, gli H2 in ordine,
dove va il codice, i punti del TL;DR. Chiedi conferma. Fermati.

### 4. Scrittura

Crea **due** file:

- `content/blog/it/<slug-italiano>.mdx`
- `content/blog/en/<slug-inglese>.mdx`

Stesso `translationKey`, slug diversi e nella lingua giusta. Leggi
`references/frontmatter-reference.md` per i campi e
`references/voice-and-tone.md` per il registro, **prima** di scrivere.

Le due versioni condividono struttura e argomenti, non le frasi. Gli esempi, i
riferimenti di mercato e i modi di dire cambiano: un lettore italiano e uno
americano non hanno lo stesso contesto.

Lunghezza: 900-1400 parole per lingua. Puoi andare oltre se l'argomento lo
richiede davvero, mai sotto 900 senza dirlo.

### 5. Self-check

Prima di consegnare, verifica ogni punto di `references/seo-checklist.md` e poi:

- `npx vitest run` passa;
- `NEXT_PUBLIC_SITE_URL=www.andrealosavio.com npm run build` passa: e anche la
  validazione del frontmatter, e ti dice esattamente cosa non va;
- ogni code block e sintatticamente valido e, se e TypeScript, compila;
- i due file hanno lo stesso `translationKey` e slug diversi;
- nessun tag fuori da `BLOG_TAGS` in `src/constants/blog.ts`;
- nessun em dash (il trattino lungo, U+2014) nel testo. Cercalo nel file prima
  di consegnare: se lo trovi, riscrivi la frase.

Riporta all'utente i due percorsi creati e il conteggio parole di ciascuno.

## Componenti disponibili negli MDX

Solo questi due, piu il markdown standard:

```mdx
<Callout type="warning">Testo dell'avviso.</Callout>

<Figure src="/images/blog/x.webp" alt="Descrizione" caption="Didascalia" />
```

`type` accetta `info`, `warning`, `success`, `danger` (default `info` se
omesso).

`Figure` accetta anche `width` e `height` opzionali (default `1200` x `675`):
usali solo se l'immagine ha un rapporto diverso da 16:9.

I code block usano la meta string per titolo file e righe evidenziate:

````mdx
```ts title="app/page.tsx" {2-3}
export const revalidate = 60;
```
````

Non inventare altri componenti: non esistono e il build fallisce.
