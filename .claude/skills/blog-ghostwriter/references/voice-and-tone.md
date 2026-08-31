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

## Il sottotitolo

Il sottotitolo non spiega: colpisce. La forma che funziona e sempre la stessa.

**Sintagma nominale + due punti + un'immagine compressa.**

Due sottotitoli approvati, da usare come metro:

- "Un agent skill da installare una volta sola: il pilota automatico per la
  struttura del codice"
- "Motion graphics scritte da un prompt: roba da studio di produzione, senza lo
  studio di produzione"
- "An agent skill you install once: the diagram you would have drawn yourself,
  if you had the afternoon"

L'ultimo mostra anche il vincolo che si dimentica piu spesso: il sottotitolo non
puo riusare le parole della `description`, perche le due righe si leggono a
pochi pixel di distanza. Quella di Archify diceva gia "navigable HTML file, not
a screenshot", quindi il sottotitolo ha dovuto trovarsi un'altra immagine.

Il titolo dice l'argomento, il corpo dice il meccanismo. Al sottotitolo resta
**il risultato**: cosa ottieni, mai come funziona.

Cosa lo rovina, in ordine di frequenza:

- **Verbi rivolti al lettore.** "Descrivi il video a parole e ottieni..." e copy
  da onboarding, non un sottotitolo.
- **Quantificatori che si scusano.** "Buono abbastanza", "quasi come",
  "abbastanza veloce". Nessuno vende con "abbastanza", e in italiano suona
  infantile.
- **Il momento di lavoro.** "Quando la feature e pronta e il post no" e roba da
  prima sezione. Nel sottotitolo diventa generico.
- **Liste di astrazioni.** "Il prodotto, il sito e il marketing" senza
  un'immagine che le tenga insieme non e un sottotitolo, e un tag cloud.

Se non hai trovato l'immagine compressa, il sottotitolo non e pronto. Non
ripiegare su una frase che descrive il flusso: e sempre peggio di niente.

Quando lo proponi all'utente, porta **tre o quattro varianti in un colpo solo**,
con angoli diversi fra loro, non varianti della stessa. Una alla volta e un
ping-pong che costa a lui e non converge.

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
