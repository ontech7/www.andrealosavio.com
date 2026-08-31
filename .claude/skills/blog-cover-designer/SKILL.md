---
name: blog-cover-designer
description:
  Use when designing, creating, or revising the cover image of a blog article
  for www.andrealosavio.com - composes a bespoke 1200x630 SVG driven by the
  article's real content (technologies, code, mental model) instead of the
  automatic tag-based fallback.
---

# Blog Cover Designer

Disegna la cover di un articolo del blog. Una cover buona si legge in mezzo
secondo e dice **di cosa parla quel pezzo**, non "questo e un articolo tecnico".

## Quando serve davvero

Il sito ha gia un generatore automatico
(`src/app/[locale]/blog/components/article-cover.tsx`): senza `cover:` nel
frontmatter compone una scena nera e blu scegliendo fra cinque archetipi — chip
isometrico, orbite, orizzonte, lastre di vetro, aurora — con al centro il glifo
della tecnologia principale. Archetipo, temperatura di blu, posizione e
geometria vengono dal `translationKey`, quindi ogni articolo ha la sua scena.
Va bene per la maggior parte dei pezzi.

Disegna una cover dedicata solo quando l'articolo ha **un'immagine mentale
propria**: due tecnologie che si parlano, un flusso, un prima/dopo, una riga di
codice che e il cuore del pezzo. Se non sai dire in una frase cosa mostrera la
cover, non serve: lascia il fallback.

## Regola non negoziabile

Leggi l'articolo intero prima di disegnare. La cover nasce dal contenuto, non
dal titolo. Se stai scegliendo forme prima di aver letto il corpo del pezzo,
stai facendo decorazione.

## Processo

### 1. Estrai il soggetto

Dal file MDX ricava, in quest'ordine:

- **Le tecnologie reali.** Quali compaiono negli import, nei blocchi di codice,
  nei nomi delle API. `revalidateTag` da `next/cache` significa Next.js, non
  "web generico".
- **Il gesto centrale.** Cosa fa il lettore dopo aver letto: invalida un tag,
  sposta un layer, misura una metrica.
- **L'artefatto citabile.** La riga di codice, il nome di funzione o il numero
  che il pezzo rende memorabile.

Scrivi queste tre cose in chiaro prima di aprire l'editor. Sono il brief.

### 2. Proponi il concept

Una frase, all'utente, prima di scrivere SVG. Esempio:

> Logo Next.js a sinistra, `revalidateTag("post-42")` al centro in mono, e a
> destra tre riquadri di cui uno solo si illumina: l'invalidazione chirurgica.

Aspetta conferma. Un SVG rifatto costa piu di una riga di domanda.

### 3. Componi l'SVG

Segui [references/design-system.md](references/design-system.md) per griglia,
palette, tipografia e i glifi gia disponibili. Vincoli duri:

- `viewBox="0 0 1200 630"`, nessun `width`/`height` sull'elemento radice.
- Solo elementi SVG nativi. Niente `<foreignObject>`, niente `<image>` verso
  URL esterni, niente `<script>`, niente `<style>` con `@import`.
- Rispetta le quattro regole della grammatica in
  [references/design-system.md](references/design-system.md): il tuo SVG finisce
  accanto a quelli generati e deve sembrare della stessa famiglia. La
  composizione puo essere nuova, la grammatica no.
- Nessun font esterno: usa `font-family="DM Mono, ui-monospace, monospace"` come
  attributo di presentazione. Il file viene inlinato nella pagina, quindi
  eredita i font gia caricati dal sito.
- Testo come `<text>`/`<tspan>` reali, mai tracciati convertiti: resta
  selezionabile e nitido a ogni scala.
- Ogni `id` interno prefissato con lo slug dell'articolo
  (`id="on-demand-revalidation-glow"`): piu cover coesistono nella stessa
  pagina e gli id duplicati si rubano i gradienti a vicenda.

### 4. Salva e collega

1. Scrivi il file in `public/images/blog/<translationKey>/cover.svg`. Ogni
   articolo ha la sua cartella, nominata sul `translationKey` perche e l'unico
   identificatore condiviso dalle due lingue e non cambia se rinomini uno slug.
   Dentro, i nomi sono generici: la cartella porta gia l'identita. Una cover sola per
   coppia di traduzioni: evita testo lungo in lingua, cosi vale per IT e EN.
   Se il concept richiede testo localizzato, fai due file e collega quello
   giusto in ogni MDX.
2. Nel frontmatter di **entrambi** gli MDX:

   ```yaml
   cover: /images/blog/on-demand-revalidation/cover.svg
   coverAlt:
     "Il logo Next.js accanto a revalidateTag, con un solo riquadro di cache
     illuminato tra tre"
   ```

   `coverAlt` e obbligatorio quando c'e `cover` (lo impone
   `parseFrontmatter`). Descrivi cosa si vede, non "cover dell'articolo".

### 5. Verifica

```bash
npx tsc --noEmit
npx vitest run
npm run build
```

Poi apri l'articolo e l'indice e controlla, in quest'ordine:

- La cover si legge a **208px di larghezza** (la riga dell'indice usa la
  variante thumb del generatore, ma una cover dedicata viene mostrata intera
  anche li). Se a quella scala e illeggibile, semplificala.
- Il contrasto del testo sul fondo resta almeno 4.5:1.
- `/{locale}/blog/{slug}/opengraph-image` restituisce il PNG con la tua cover:
  la route la rasterizza automaticamente per i social.

## Errori da non ripetere

- **Grafica piatta.** Forme appoggiate su un fondo, senza luce ne profondita: e
  la versione precedente di queste cover ed e stata scartata.
- **Due soggetti pari.** Lo sguardo non sa dove posarsi e la cover smette di
  funzionare a 208px.
- **Fondo nero con gradiente bianco.** Fa sembrare il sito Vercel. Il fondo e
  sempre nero → blu, radiale attorno al soggetto.
- **Glifo deformato sul piano.** Illeggibile, gia provato: resta frontale.
- **Titolo dentro la cover.** Nell'indice e nella pagina articolo la cover sta a
  pochi pixel dal titolo in HTML. Ripeterlo dentro l'immagine e rumore: se serve
  una parola scritta, sia l'artefatto (la riga di codice, il nome dell'API).
- **Troppa roba.** Tre elementi al massimo. Una cover e un cartello, non uno
  schema.
- **Testo sotto i 24px** nel sistema di coordinate 1200x630: sparisce nel
  thumbnail.
- **Logo di terzi ridisegnato male.** Meglio il glifo geometrico gia presente in
  `cover-glyph.tsx` che una riproduzione approssimativa.
