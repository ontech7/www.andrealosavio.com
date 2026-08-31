# Frontmatter

Schema per singolo file applicato da `src/libs/blog/frontmatter.ts`: ogni
violazione fa fallire il build con un messaggio che cita il file e il campo.
La coerenza tra i due file della coppia (`translationKey` univoca e presente
in entrambi i locale) e verificata a parte, quando l'indice degli articoli
viene costruito, da `src/libs/blog/source.ts`.

## Campi obbligatori

| Campo            | Tipo    | Vincolo applicato dal validator                                |
| ---------------- | ------- | ---------------------------------------------------------------- |
| `title`          | stringa | non vuota (nessun limite di lunghezza applicato dal validator)   |
| `subtitle`       | stringa | non vuota (nessun altro vincolo applicato dal validator)         |
| `description`    | stringa | tra 120 e 170 caratteri                                          |
| `publishedAt`    | data    | `YYYY-MM-DD`, data di calendario esistente                       |
| `translationKey` | stringa | non vuota; univocita e presenza in entrambi i locale controllate da `source.ts` |
| `kind`           | enum    | `tech`, `business`, `hybrid`, `event`                             |
| `tags`           | array   | almeno uno, tutti da `BLOG_TAGS` in `src/constants/blog.ts`       |
| `takeaways`      | array   | da 2 a 5 stringhe                                                 |

Il validator non impone un limite di caratteri su `title` e `subtitle`, ma
restano comunque le regole da rispettare in scrittura:

- `title`: punta a restare sotto i 60 caratteri per non essere troncato in
  SERP. E una raccomandazione SEO, non un controllo del build: vedi
  `seo-checklist.md`.
- `subtitle`: una frase, non un secondo titolo.

## Campi opzionali

| Campo       | Tipo     | Vincolo applicato dal validator                               |
| ----------- | -------- | --------------------------------------------------------------- |
| `updatedAt` | data     | `YYYY-MM-DD`, non precedente a `publishedAt`                    |
| `cover`     | stringa  | non vuota; rende `coverAlt` obbligatorio                        |
| `coverAlt`  | stringa  | descrizione dell'immagine, obbligatoria se c'e `cover`          |
| `draft`     | booleano | default `false`; le bozze si vedono solo in sviluppo            |
| `series`    | oggetto  | `{ id: stringa, part: intero >= 1 }`                             |
| `faq`       | array    | oggetti `{ q, a }`, almeno uno; genera lo schema FAQPage         |

`cover` deve essere per convenzione un percorso sotto `/images/blog/` (e
quello che gli articoli esistenti usano), ma il validator non controlla il
prefisso: si limita a richiedere che sia una stringa non vuota, e che
`coverAlt` sia presente quando `cover` c'e.

Senza `cover` la copertina viene generata come SVG dallo slug: e il caso
normale, non un ripiego.

## Esempio completo valido

```yaml
---
title: "La cache di Next.js, spiegata davvero"
subtitle: "Quando revalidate non fa quello che pensi"
description:
  "I quattro livelli di cache di Next.js, come interagiscono tra loro e perche
  revalidate a volte sembra non funzionare affatto."
publishedAt: 2026-09-02
updatedAt: 2026-09-20
translationKey: nextjs-cache
kind: tech
tags: [nextjs, performance]
draft: false
series: { id: nextjs-deep-dive, part: 2 }
takeaways:
  - "In sviluppo la cache e disattivata: testare revalidate in dev non dimostra
    niente."
  - "Il Full Route Cache si invalida solo con un nuovo deploy o una revalidation
    esplicita."
faq:
  - q: "revalidate funziona in sviluppo?"
    a: "No, in sviluppo la cache e disattivata e ogni richiesta e fresca."
---
```

Questo esempio passa la validazione: `description` e lunga 125 caratteri
(dentro il range 120-170) e `takeaways` ha 2 voci (dentro il range 2-5).

## Errori frequenti

- `description` di 90 caratteri: sembra ragionevole, fallisce il build.
- `translationKey` diverso tra i due file: il build fallisce dicendo che la
  chiave esiste in un locale e manca nell'altro.
- Tag inventato al volo: usa solo quelli del vocabolario, oppure chiedi
  all'utente se aggiungerne uno a `src/constants/blog.ts`.
- `cover` senza `coverAlt`: e un requisito di accessibilita, non una svista.
