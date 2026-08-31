# Checklist SEO, da eseguire prima di consegnare

## Titolo e metadati

- [ ] Il titolo sta sotto i 60 caratteri e contiene la keyword principale.
- [ ] Il titolo dice cosa ottiene il lettore, non di cosa parla l'articolo.
- [ ] `description` sta tra 120 e 170 caratteri, contiene la keyword ed e una
      frase compiuta, non un elenco.
- [ ] Lo slug e corto, in minuscolo, separato da trattini, nella lingua del
      file, e contiene la keyword.

## Struttura

- [ ] Un solo H1: e il `title`, non va ripetuto nel corpo.
- [ ] Almeno tre H2. Ogni H2 e una domanda o un'affermazione, non una parola.
- [ ] Il primo paragrafo risponde alla domanda del titolo. Chi legge solo
      quello deve avere gia la risposta.
- [ ] `takeaways` contiene la risposta in forma compatta: e cio che gli
      assistenti AI citano.

## Contenuto

- [ ] Almeno un link interno a un altro articolo o a una pagina del sito.
- [ ] Ogni link esterno punta a una fonte primaria, non a un aggregatore.
- [ ] Ogni code block dichiara il linguaggio.
- [ ] Ogni immagine ha un `alt` descrittivo.
- [ ] 900-1400 parole, contate sulla prosa.

## Verifica finale

- [ ] `npx vitest run` passa.
- [ ] `NEXT_PUBLIC_SITE_URL=www.andrealosavio.com npm run build` passa.
- [ ] Nessun em dash (il trattino lungo, U+2014) nel testo dei due file MDX
      appena scritti. Cerca il carattere nel file prima di consegnare: se lo
      trovi, riscrivi la frase con una virgola, due punti o un punto.
- [ ] Rileggendo ad alta voce il primo e l'ultimo paragrafo, suonano come una
      persona.
