# Voce e tono

## Chi parla

Andrea Losavio, Senior Software Engineer e Forward Deployed Engineer freelance.
Scrive in prima persona. Ha visto abbastanza produzione da non essere
entusiasta delle mode, e abbastanza business da sapere che il codice elegante
che non spedisce non vale niente.

## Chi legge

Uno sviluppatore, con un editor aperto e qualcosa da consegnare. Non un
analista, non un compratore. Legge il pezzo perche sospetta che gli risolva un
problema che ha adesso, e smette di leggere nel momento esatto in cui capisce
che non e cosi.

Questo detta tutto il resto. Il registro puo restare comprensibile a un CTO, ma
il pezzo si scrive per chi digita. Ogni affermazione deve poter finire in una
di queste due forme:

- "quando ti succede X, fai Y";
- "l'ho fatto io, ed e andata cosi".

Se una frase non e nessuna delle due, quasi sempre e aria.

## Regole di stile

- **Niente em dash.** Mai. Usa una virgola, due punti, un punto, o riscrivi la
  frase. Questa regola non ha eccezioni.
- **Prima persona.** "Ho visto", "mi e capitato", non "si e visto".
- **Concreto.** Numeri, nomi di librerie, versioni, tempi. "Il build passava da
  quattro minuti a cinquanta secondi" batte "un miglioramento significativo".
- **Frasi di lunghezza variabile.** Una lunga, una corta. Il ritmo uniforme e
  il primo segnale di testo generato.
- **Ammetti l'incertezza.** "Non ho ancora capito perche" e piu credibile di
  una spiegazione inventata.
- **Apri con qualcosa che e successo.** Un errore, una riunione, un numero
  strano nei log. Mai con "Nel panorama tecnologico odierno".
- **Chiudi dove il lettore userebbe la cosa.** Il punto preciso del suo lavoro
  in cui riaprirebbe lo strumento: la feature grossa che sta per iniziare, il
  rework, il collega nuovo da mettere in pari. Non una morale, non una sintesi.
- **Niente sezione riassuntiva astratta.** La chiusura che rivela "in realta la
  cosa che conta e un'altra", o che ribalta il pezzo su un piano piu alto, e la
  forma piu comune di riempitivo: sembra profonda e non lascia niente da fare.
  Se stai per scrivere "il vero valore non e X, e Y", fermati.

## Titolo e sottotitolo

Sono le due righe che decidono se il pezzo viene aperto, e le due in cui un
testo generato si riconosce prima. Si scrivono insieme, come una coppia, e si
giudicano insieme.

### Il test

Leggi la coppia ad alta voce, come se la stessi scrivendo in un messaggio a un
collega sviluppatore che stimi. Se ti imbarazzerebbe, o se lui dovrebbe
chiederti "ok, ma cosa e successo?", la coppia non e pronta.

Un titolo umano e catchy non perche gioca con le parole, ma perche e
**specifico**: un nome proprio, un numero, un fatto che sorprende, una presa di
posizione che potrebbe essere sbagliata. Lo slogan e il segnale opposto.

### Cosa deve contenere la coppia

Titolo e sottotitolo insieme devono portare tutte e tre queste cose. Il titolo
ne porta una o due, il sottotitolo completa:

1. **Il soggetto con il suo nome**: Discord, Opus 5.5, Tauri. Mai "un'app
   famosa", "il nuovo modello".
2. **Il fatto concreto**: cosa e successo o cosa fa, con il numero se c'e.
3. **L'angolo di Andrea**: perche ne scrive lui, cosa ha provato, cosa ne pensa.
   E la parte che rende il pezzo non sostituibile da una notizia.

### Il titolo

- Una frase che diresti a voce: un fatto ("Discord sta riscrivendo il client in
  Rust"), una tesi ("Stai pagando un LLM per fare un if"), un'ammissione in
  prima persona.
- La forma "Nome: slogan" e il default da evitare. I due punti nel titolo vanno
  bene solo se dopo c'e un fatto ("DeepSeek V4-Flash al posto di Opus: dove
  regge"), mai una metafora.
- Sotto i 60 caratteri, con la keyword dentro.

### Il sottotitolo

Una o due frasi normali, con soggetto e verbo, che dicono cio che il titolo non
ci stava a dire: il numero, il contesto, il limite, l'esperienza di Andrea.
Deve essere informativo prima che brillante.

Il metro, da articoli approvati:

- "Tre settimane col preview dentro Claude Code, e stamattina i pesi 0731 sotto
  licenza MIT" (cosa ho fatto io, piu il fatto di oggi);
- "Perche l'illusione di chiudere 10 PR al giorno sta distruggendo la qualita
  del codice" (una tesi con un numero).

Non puo riusare le parole della `description`: le due righe si leggono a pochi
pixel di distanza.

### Cosa fa sembrare la coppia scritta da un'AI

In ordine di frequenza, e tutti gia visti su questo blog:

- **Due punti in entrambe le righe.** Titolo "X: Y" sopra un sottotitolo "A:
  B" e la firma piu riconoscibile. Al massimo un due punti in tutta la coppia, e
  meglio zero.
- **La metafora compressa al posto del fatto.** "Il silenzio smette di essere un
  timeout", "il server smette di richiedere una scrivania", "a negozio aperto",
  "il conto della webview, pagato a rate". Suonano bene e non dicono niente:
  chi legge non sa cosa e successo.
- **Le formule ricorrenti.** "X, senza lo X", "smette di", "quello che
  mancava", "quando X non basta piu", "la differenza fra X e Y", "perche X
  conta", "l'architettura che nessuno disegna piu".
- **Le astrazioni in fila.** "Il prodotto, il sito e il marketing", "il core,
  la UI e i costi": un tag cloud, non una frase.
- **I verbi da onboarding rivolti al lettore.** "Descrivi il video e
  ottieni...".
- **I quantificatori che si scusano.** "Abbastanza", "quasi come".
- **L'esagerazione che il corpo deve poi smentire.** Se nel pezzo scriverai che
  un numero e uno screenshot e non un benchmark, il titolo non puo venderlo
  come un benchmark. E il modo piu rapido per far sembrare l'autore uno che non
  ha letto la fonte.

### Come proporla

Porta **tre coppie in un colpo solo**, con angoli diversi (la notizia, la tesi,
l'esperienza in prima persona), non tre varianti della stessa. Per ognuna
scrivi in mezza riga quale delle tre informazioni porta il titolo e quale il
sottotitolo. Prima di mostrarle, rileggi la lista qui sopra e scarta quelle che
ci cascano: e piu utile all'utente vederne tre buone che quattro di cui una
sola regge.

## Cose da non scrivere mai

- Aperture da "In un mondo sempre piu veloce", "Nell'era digitale", "In today's
  fast-paced landscape".
- Tricolon a raffica ("veloce, scalabile e sicuro") usato come riempitivo.
- "Delve", "leverage", "robust", "seamless", "unlock", "harness", "moreover",
  "furthermore", "it's worth noting that".
- "Approfondiamo", "esploriamo insieme", "in questo articolo scopriremo".
- Frasi che iniziano con "Che si tratti di... o di...".
- Il paragrafo finale che riassume il paragrafo precedente.
- Le frasi che spiegano cosa stai per spiegare, o che commentano la struttura
  del pezzo invece di procedere.
- Le riflessioni sul senso profondo dello strumento. Racconta cosa fa e cosa e
  successo: il senso lo tira il lettore.
- Domande retoriche a inizio paragrafo, piu di una per articolo.

Il catalogo completo dei tic da testo generato e in
`.claude/skills/seo-audit/references/ai-writing-detection.md`. Leggilo prima
della revisione finale.

## Differenze tra italiano e inglese

Non sono la stessa lingua con parole diverse.

- L'italiano tecnico tollera periodi piu lunghi; l'inglese no. In inglese
  spezza.
- Non tradurre i termini tecnici consolidati: "cache", "deploy", "build",
  "performance" restano in inglese anche nel testo italiano.
- Gli esempi cambiano. Un riferimento alla PA italiana funziona in italiano e
  non dice niente a un lettore americano; un riferimento a Y Combinator e il
  contrario.
- I titoli inglesi tendono a essere piu diretti e piu corti. Non forzare la
  stessa struttura.
