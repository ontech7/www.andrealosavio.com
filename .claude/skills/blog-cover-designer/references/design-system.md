# Design system delle cover

Sistema di riferimento per `public/images/blog/<translationKey>/cover.svg`.
Tutto e espresso nel
sistema di coordinate `viewBox="0 0 1200 630"`.

## La grammatica, non un formato

Le cover del blog non hanno **una** forma: hanno una **grammatica**. Qualsiasi
composizione va bene se rispetta queste quattro regole, e nessuna va bene se ne
salta una.

1. **Fondo radiale nero-blu** centrato sul soggetto: `deep` al centro,
   `#050912` a meta, `#03060c` ai bordi.
2. **Un solo soggetto luminoso** al fuoco ottico. Uno: non due centri
   d'attenzione che si contendono lo sguardo.
3. **Bagliore.** Il soggetto emette luce, non e appoggiato sopra il fondo.
4. **Profondita di campo.** Tutto cio che non e il soggetto sta dentro una
   maschera radiale che lo spegne verso i bordi.

E questa grammatica a far sembrare le cover una collezione anche quando le
composizioni sono diverse. Il generatore automatico ne implementa cinque:

| Archetipo | Composizione                                                        |
| --------- | ------------------------------------------------------------------- |
| `isoChip` | chip isometrico rialzato, piste di circuito sul piano               |
| `orbit`   | disco luminoso cinto da orbite ellittiche inclinate                 |
| `horizon` | linea d'orizzonte accesa, griglia in prospettiva, fasci verticali   |
| `stack`   | lastre di vetro che rientrano in profondita dietro la prima         |
| `aurora`  | campo blu molto sfocato dietro una tessera di vetro tonda           |
| `flow`    | cavi luminosi che si diramano dal soggetto verso nodi spenti        |
| `keys`    | una fila di tasti, acceso solo quello al fuoco                      |
| `spline`  | curva morbida che passa per il fuoco, con nodi e linee di caduta    |
| `beam`    | cono di luce proiettato dal soggetto su una griglia ortogonale      |

Guardali in `buildCoverScene` (`src/libs/blog/cover-layout.ts`) prima di
disegnare. Il tuo SVG puo essere una sesta composizione — anzi, e il motivo per
cui stai disegnando a mano — ma deve rispettare le quattro regole sopra.

## Palette: nero e blu, nient'altro

Nessun accento per tag, nessun bianco dominante: un fondo scuro con gradiente
bianco fa sembrare il sito Vercel, ed e esattamente cio che non vogliamo.

```
Cielo lontano  #03060c   angoli della scena
Cielo medio    #050912   corpo del fondo
Piastra chip   #0b1526 → #060a14
```

Il resto viene da una delle tre temperature di blu ammesse — le stesse di
`COVER_ACCENTS`. Scegline una e restaci:

| Temperatura | Base      | Luce      | Profondo  | Bordo     |
| ----------- | --------- | --------- | --------- | --------- |
| Brand       | `#0d7ef2` | `#7cc0ff` | `#08203f` | `#1b4d8f` |
| Azure       | `#0ea5e9` | `#8ad8fb` | `#062a45` | `#12587f` |
| Indaco      | `#3b6fe0` | `#a3c0ff` | `#101c3d` | `#2a4a9c` |

Il fondo e un gradiente **radiale** centrato sul chip: `deep` al centro,
`#050912` a meta, `#03060c` ai bordi. E cio che da la profondita.

## Il vocabolario visivo

Da cui vengono gli archetipi, e da cui puoi pescare per una composizione nuova:
editor di automazioni con nodi collegati da cavi al neon, dashboard inclinate in
prospettiva con nastri di flusso, sfere in una nebbia volumetrica con coppie
etichetta/valore, file di keycap rim-lit con una sola accesa, tessere di vetro
che emettono luce, pill con un fascio proiettato, grafici con spline luminose e
nodi in evidenza.

Tutti hanno in comune la stessa cosa: **il buio fa la maggior parte del lavoro e
la luce dice dove guardare**. Se nella tua composizione la luce e sparsa
ovunque, non e di questa famiglia.

## La proiezione isometrica (serve a `isoChip`)

Griglia 2:1. Un punto `(u, v)` della griglia finisce a:

```
x = origine.x + (u - v) * 92
y = origine.y + (u + v) * 46
```

Il chip sta a `origine`, tipicamente `(600, 330)`; spostarlo a `(505, 348)` o
`(690, 312)` cambia l'inquadratura senza rompere niente.

**Il chip.** Rombo della faccia superiore ai quattro angoli `(±r, ±r)` con
`r ≈ 1.5`, riempito col gradiente `light → base → rim`. Gli angoli arrotondati
si ottengono ridisegnando il rombo anche come `stroke` dello stesso gradiente,
`stroke-width="22" stroke-linejoin="round"`. Sotto, due facce laterali estruse
di 30px (`rim` a sinistra, `deep` a destra) e una piastra scura piu larga
(`r * 1.42`). Tutto dentro un filtro di bagliore.

**Le piste.** Partono dal bordo del chip e si allontanano a scalini sui due
assi della griglia. Ogni pista resta in **un solo quadrante** e avanza sempre
nella stessa direzione: e cio che le fa uscire dalla scena invece di
ripiegarsi. Vanno disegnate due volte — una copia larga e sfocata in `base` per
il bagliore, una sottile e nitida in `light` sopra.

## Il glifo resta frontale

`src/app/[locale]/blog/components/cover-glyph.tsx` ha un glifo per ogni tag del
vocabolario, su una scatola `100x100`. Va disegnato **frontale**, in bianco,
inscritto nella faccia superiore del chip, con una `feDropShadow` che lo
appoggia sulla superficie.

Non deformarlo sul piano isometrico: i marchi hanno dettaglio interno — la N
dentro il cerchio, TS dentro il quadrato — e la matrice di proiezione li rende
illeggibili. E gia stato provato.

Il quadrato piu grande inscritto in un rombo di semiassi `W` e `H` ha lato
`2WH / (W + H)`. Con `r = 1.5` viene circa 92px: e la misura giusta, un filo
abbondante (`× 1.12`) perche i glifi hanno margine interno.

## Profondita di campo

Tutto cio che sta dietro al chip — griglia, pannelli, piste, pulviscolo — va
dentro un gruppo con una maschera radiale centrata sul chip: bianco pieno al
centro, trasparente ai bordi. E quello che spegne la scena verso l'esterno e
impedisce che il contorno competa col soggetto.

Griglia e pannelli vanno anche sfocati (`feGaussianBlur stdDeviation="3.5"`) e
tenuti sotto il 20% di opacita. Se si leggono come contorni netti, sono troppo
forti: devono sembrare fuori fuoco.

## Niente titolo nella cover

La cover non ripete il titolo dell'articolo. Nell'indice e nella pagina articolo
il titolo sta gia in HTML a pochi pixel di distanza: ripeterlo dentro l'immagine
e rumore. Vale anche per sottotitolo e heading.

Se un articolo ha davvero bisogno di una parola scritta, sia un artefatto — un
nome di API, una riga di codice, una metrica — e mai sotto corpo 24.

## Quando disegnare a mano

Il generatore mette **un** soggetto astratto al centro: dice la tecnologia, non
l'argomento. Disegna a mano quando l'articolo ha un'immagine mentale che il
generatore non puo conoscere.

**Due soggetti in relazione.** Uno acceso e uno spento, collegati. Per un
prima/dopo o due tecnologie che si parlano. Occhio alla regola 2: uno dei due
deve dominare chiaramente, altrimenti lo sguardo non sa dove posarsi.

**Catena di tre.** Tre elementi in fila sulla diagonale, con la luce che arriva
solo fino al secondo. Per spiegare dove interviene una tecnica.

**Soggetto aperto.** Il soggetto sollevato e staccato dalla base, con luce che
esce dalla fessura. Per articoli su cosa succede "dentro" qualcosa.

**Artefatto al posto del glifo.** Una riga di codice o una metrica dentro il
soggetto luminoso. Solo se quella riga e davvero il punto del pezzo.

## Checklist prima di consegnare

- [ ] `viewBox="0 0 1200 630"`, nessun `width`/`height` sul root
- [ ] Le quattro regole: fondo radiale, un solo soggetto, bagliore, profondita
- [ ] Una sola temperatura di blu, presa dalla tabella
- [ ] Fondo radiale centrato sul soggetto, nessun bianco dominante
- [ ] Glifo frontale e bianco, centrato sul fuoco, mai deformato su un piano
- [ ] Contorno mascherato e sfocato, sotto il 20% di opacita
- [ ] Il titolo dell'articolo **non** compare nella cover
- [ ] Ogni `id` prefissato con lo slug
- [ ] Niente `<foreignObject>`, `<image>` esterni, `<script>`
- [ ] `cover` e `coverAlt` aggiunti a **entrambi** gli MDX
- [ ] Il soggetto si riconosce a 208px di larghezza
