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

## Le due regole non negoziabili

**Non scrivere una riga prima che la scaletta sia approvata.** Un pezzo da 1200
parole nella direzione sbagliata costa piu di cinque minuti di domande.

**Ogni sezione deve stare dentro un momento di lavoro reale.** Chi legge e uno
sviluppatore che ha una giornata da finire. Vuole sapere quando gli serve la
cosa di cui parli, cosa digita, e cosa gli torna indietro. Se una sezione non
risponde a una di queste tre domande, non e una sezione: e un riempitivo, e va
cancellata prima di scriverla.

## Processo

### 1. Intervista

Chiedi, una domanda per messaggio, finche non hai:

- **Argomento e angolo.** Non "la cache di Next.js", ma "perche revalidate
  sembra non funzionare".
- **Il momento.** Quando, di preciso, il lettore si trova nella situazione di
  cui parli: sta per aprire un rework, ha un bug in produzione, deve spiegare un
  sistema a un nuovo arrivato. Senza questo l'articolo diventa una descrizione
  generica, ed e il modo piu veloce per renderlo noioso.
- **Pubblico.** Sviluppatori, decisori tecnici, o entrambi.
- **La cosa da portarsi a casa.** Una frase, quella che il lettore ripetera a un
  collega.
- **`tags`**: da uno a tre, dal vocabolario `BLOG_TAGS`. Il primo
  nell'ordine del vocabolario detta il glifo della cover generata.
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

Se il pezzo parla di uno strumento, di una libreria o di una skill, **non
riscrivere il suo README**. Quello esiste gia, e linkarlo costa una riga. Scrivi
solo cio che si impara usandolo: cosa hai installato, cosa hai digitato, cosa ha
risposto, dove ti sei bloccato, e in che punto del tuo lavoro lo riapriresti.
L'elenco dei comandi e delle opzioni non e un articolo, e documentazione
duplicata che invecchia peggio dell'originale.

Crea **due** file:

- `content/blog/it/<slug-italiano>.mdx`
- `content/blog/en/<slug-inglese>.mdx`

Stesso `translationKey`, slug diversi e nella lingua giusta. Leggi
`references/frontmatter-reference.md` per i campi e
`references/voice-and-tone.md` per il registro, **prima** di scrivere.

Le due versioni condividono struttura e argomenti, non le frasi. Gli esempi, i
riferimenti di mercato e i modi di dire cambiano: un lettore italiano e uno
americano non hanno lo stesso contesto.

Lunghezza: 900-1400 parole per lingua. Punta alla parte bassa. Novecento parole
che dicono tutto battono milletrecento allungate, e allungare e la tentazione
piu facile da cedere quando l'argomento non basta.

Usa il markdown per far respirare la pagina: **grassetto** sui termini che
portano il ragionamento (non piu di due o tre per sezione), liste puntate quando
elenchi limiti o alternative, un `<Callout>` quando una frase merita di stare da
sola. Un articolo tutto paragrafi e un muro, e nessuno lo legge fino in fondo.

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

Solo questi tre, piu il markdown standard:

```mdx
<Callout type="warning">Testo dell'avviso.</Callout>

<Figure
  src="/images/blog/<translationKey>/schema.webp"
  alt="Descrizione"
  caption="Didascalia"
/>

<VideoFigure
  mp4="/images/blog/<translationKey>/demo.mp4"
  webm="/images/blog/<translationKey>/demo.webm"
  poster="/images/blog/<translationKey>/demo-poster.webp"
  alt="Descrizione"
  caption="Didascalia"
  width={960}
  height={540}
/>
```

`type` accetta `info`, `warning`, `success`, `danger` (default `info` se
omesso).

`Figure` accetta anche `width` e `height` opzionali (default `1200` x `675`):
usali solo se l'immagine ha un rapporto diverso da 16:9. E `animated`, da mettere
a `true` solo per una WebP o GIF animata, che altrimenti Next.js appiattisce sul
primo fotogramma.

`VideoFigure` e la scelta giusta per ogni animazione: una GIF che dura piu di
cinque secondi e va in loop viola il criterio WCAG 2.2.2, perche non si puo
fermare. Il video ha i controlli nativi e parte da solo solo quando
`prefers-reduced-motion` non e attivo. Serve almeno `mp4`; `webm` e `poster`
sono opzionali ma pesano molto meno. Converti con
`ffmpeg -i x.gif -pix_fmt yuv420p -c:v libx264 -crf 26 -an x.mp4`.

Sia `Figure` sia `VideoFigure` linkano il file a piena risoluzione in una scheda
nuova: e gia gestito dal componente, non aggiungere link a mano.

I code block usano la meta string per titolo file e righe evidenziate:

````mdx
```ts title="app/page.tsx" {2-3}
export const revalidate = 60;
```
````

Non inventare altri componenti: non esistono e il build fallisce.
