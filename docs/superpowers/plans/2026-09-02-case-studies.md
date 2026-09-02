# Case study dei progetti — Piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Far leggere a `/projects` il contributo reale di Andrea invece della descrizione dei clienti, e dare una pagina di approfondimento ai sei progetti che reggono un racconto per esteso.

**Architecture:** Due fasi indipendenti. La fase A ristruttura dati, copy e layout della pagina esistente: `kind` e `roles` entrano in `PROJECTS`, `description` si sdoppia in `context` + `contribution`, la griglia a due colonne diventa una card a riga intera raggruppata per tipo. La fase B aggiunge un sottosistema di contenuti MDX sotto `content/case-studies/`, servito da una route `/{locale}/projects/[slug]`, che copia la forma di `src/libs/blog/` senza importarne i moduli. La A si spedisce da sola.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, next-intl v4, `@next/mdx` + `gray-matter`, Tailwind v4, `schema-dts`, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-02-case-studies-design.md`

## Global Constraints

- **Branch:** `feat/case-studies`, già creato da `main`.
- **Niente commenti in `src/`**, tranne `/** JSDoc */` sugli export di `src/libs/` e `src/utils/`.
- **Traduzioni sempre dalla radice**: `getTranslations({ locale })` / `useTranslations()` senza argomento, chiavi complete (`t("projects.groups.clients.title")`).
- **Le due lingue si toccano insieme**: ogni modifica a `src/translations/it/*.json` ha la gemella in `src/translations/en/*.json`, strutturalmente identica.
- **Navigazione localizzata** via `@/libs/i18n/navigation` (`Link`), mai `next/link`, per le URL interne. `next/link` resta per i link esterni.
- **Server Components di default.** `"use client"` solo dove servono stato, effetti o handler.
- **Named export** per componenti e moduli; default export solo dove Next lo impone (`page.tsx`, `route.ts`).
- **Test**: unit test Vitest solo per le funzioni pure di `src/libs/case-studies/`, come si fa per `src/libs/blog/`. Per costanti, componenti e traduzioni la verifica è `npx tsc --noEmit` + `npm run lint` + `npm run build`, che è la convenzione documentata in `CLAUDE.md`. Non introdurre test di componenti: non esiste setup per farlo.
- **Verifica dopo ogni task**: `npx tsc --noEmit` sempre; `npm run lint` e `npm run build` per i task che toccano routing, metadata o i18n.
- **Riservatezza del copy**: si nominano solo aziende che il sito già espone con logo e link. Mai persone, mai metriche non autorizzate, mai roadmap. Il cliente delle tabaccherie resta anonimo.
- **`src/libs/case-studies/` non importa nulla da `src/libs/blog/`.** È deliberato: vedi la spec, sezione "Perché non condividere codice col blog".

---

## Struttura dei file

**Fase A**

| File | Responsabilità |
| --- | --- |
| `src/constants/projects.ts` | `PROJECT_ROLES`, `ProjectRole`, `Project` con `kind` e `roles`, elenco `PROJECTS` |
| `src/translations/{it,en}/projects.json` | `context` + `contribution` per progetto, titoli dei gruppi, etichette CTA |
| `src/app/[locale]/projects/components/project-card.tsx` | Card a riga intera: split immagine/contenuto, chip, CTA |
| `src/app/[locale]/projects/sections/projects-section.tsx` | Tre blocchi raggruppati per `kind`, collasso durante il filtro |
| `src/app/[locale]/projects/components/projects-filter.tsx` | Chip di ruolo + chip di stack, due gruppi distinti |
| `src/app/[locale]/projects/page.tsx` | Ordine delle sezioni, `ItemList` corretto |
| `src/components/layout/footer.tsx` | Easter egg del sito vecchio |

**Fase B**

| File | Responsabilità |
| --- | --- |
| `src/libs/case-studies/frontmatter.ts` | `CaseStudyFrontmatter`, `parseFrontmatter` — validazione che fa fallire il build |
| `src/libs/case-studies/source.ts` | Lettura dal filesystem, `assertConsistency`, accessor per locale/slug/progetto |
| `src/app/[locale]/projects/[slug]/page.tsx` | Route del case study, metadata, JSON-LD |
| `src/app/[locale]/projects/[slug]/components/case-study-header.tsx` | Intestazione da `PROJECTS` + traduzioni + frontmatter |
| `src/utils/seo-schema.ts` | `generateCaseStudySchema` |
| `src/app/sitemap.ts` | Route dei case study |
| `content/case-studies/{it,en}/*.mdx` | I contenuti |

---

# FASE A — Il pavimento

## Task 1: Tassonomia dei progetti

**Files:**
- Modify: `src/constants/projects.ts`

**Interfaces:**
- Produces: `PROJECT_ROLES` (readonly tuple), `type ProjectRole`, `interface Project` con `kind: "client" | "product" | "personal"` e `roles: readonly ProjectRole[]`, `PROJECTS`.

- [ ] **Step 1: Riscrivere il file**

```ts
export const PROJECT_ROLES = [
  "ui-ux",
  "product",
  "frontend",
  "fullstack",
  "mobile",
  "architecture",
  "design-system",
  "mentoring",
] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export type ProjectKind = "client" | "product" | "personal";

export interface Project {
  id: string;
  kind: ProjectKind;
  roles: readonly ProjectRole[];
  logo: string | null;
  image: string;
  tags: readonly string[];
  websiteUrl?: string | null;
  githubUrl?: string | null;
  designUrl?: string | null;
}

export const PROJECTS: Project[] = [
  {
    id: "quido",
    kind: "client",
    roles: ["ui-ux", "product", "mobile", "frontend"],
    logo: "/images/clients/quido.svg",
    image: "/images/projects/quido_v2.webp",
    tags: ["nextjs", "react", "expo-sdk", "react-native", "design"],
    websiteUrl: "https://quido.ai",
  },
  {
    id: "recrowd",
    kind: "client",
    roles: ["fullstack", "frontend", "architecture"],
    logo: "/images/clients/recrowd.svg",
    image: "/images/projects/recrowd.webp",
    tags: ["nextjs", "react", "nodejs", "prisma", "postgresql"],
    websiteUrl: "https://recrowd.com",
  },
  {
    id: "othersideTechnology",
    kind: "client",
    roles: ["ui-ux", "frontend"],
    logo: "/images/clients/otherside-technology.svg",
    image: "/images/projects/otherside-technology.webp",
    tags: ["nextjs", "react", "ai"],
    websiteUrl: "https://www.othersidetechnology.com",
  },
  {
    id: "brainplatform",
    kind: "client",
    roles: ["fullstack", "design-system", "frontend", "mentoring"],
    logo: "/images/clients/brainplatform.svg",
    image: "/images/projects/brainplatform.webp",
    tags: ["nextjs", "react", "fluent-ui", "ant-design"],
    websiteUrl: "https://brainplatform.it",
  },
  {
    id: "studioBargiggia",
    kind: "client",
    roles: ["ui-ux", "fullstack", "design-system"],
    logo: "/images/clients/studio-bargiggia.svg",
    image: "/images/projects/studiobargiggia.webp",
    tags: ["nextjs", "react", "strapi", "design"],
    websiteUrl: "https://studiobargiggia.com",
  },
  {
    id: "anonymous",
    kind: "client",
    roles: ["fullstack", "architecture", "product"],
    logo: null,
    image: "/images/projects/anonymous_tabacconists.webp",
    tags: ["nextjs", "react", "prisma", "postgresql"],
  },
  {
    id: "ravenn",
    kind: "client",
    roles: ["fullstack", "frontend"],
    logo: "/images/clients/ravenn.svg",
    image: "/images/projects/ravenn.webp",
    tags: ["nextjs", "react", "prisma", "postgresql"],
    websiteUrl: "https://ravenn.io",
  },
  {
    id: "fastmemo",
    kind: "product",
    roles: ["ui-ux", "mobile", "fullstack"],
    logo: "/images/clients/fastmemo_v3.svg",
    image: "/images/projects/fastmemo_v3.webp",
    tags: ["expo-sdk", "react-native", "tauri", "design"],
    websiteUrl: "https://fastmemo.vercel.app",
  },
  {
    id: "coolifyManager",
    kind: "product",
    roles: ["ui-ux", "mobile", "frontend"],
    logo: "/images/clients/coolify-manager.svg",
    image: "/images/projects/coolify-manager.webp",
    tags: [
      "expo-sdk",
      "react-native",
      "javascript",
      "extension",
      "design",
    ],
    websiteUrl: "https://coolify-manager.vercel.app",
  },
  {
    id: "forfettarioControl",
    kind: "personal",
    roles: ["ui-ux", "product"],
    logo: "/images/clients/forfettario-control.svg",
    image: "/images/projects/forfettario-control.webp",
    tags: ["design", "mvp", "mobile"],
    designUrl: "https://www.behance.net/gallery/209115303/Forfettario-Control",
  },
  {
    id: "coffeeNotesLab",
    kind: "personal",
    roles: ["ui-ux", "frontend"],
    logo: "/images/clients/coffee-notes-lab.svg",
    image: "/images/projects/coffee-notes-lab.webp",
    tags: ["nextjs", "react", "design"],
    websiteUrl: "https://coffeenoteslab.online",
  },
];
```

Tre cose cambiano rispetto a oggi, oltre ai due campi nuovi. `customer` e `personal` spariscono dai `tags`, perché ora sono `kind`. Il progetto `andreaLosavio` esce dall'elenco: diventa un easter egg nel footer al Task 6. E l'ordine dell'array è quello di lettura della pagina — i clienti per peso del contributo, poi i prodotti, poi i personali.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: PASS. Le chiavi di traduzione passano per cast `as never` in `page.tsx`, quindi TypeScript non vede che `projects.items.andreaLosavio.*` è rimasto orfano: la rottura sarebbe a runtime.

Per questo **il Task 1 e il Task 2 sono una sola unità spedibile**: non eseguire `npm run build` fra i due e non fermarsi qui. Fra un task e l'altro la pagina è in uno stato incoerente — traduzioni per un progetto che non esiste più, e nessuna traduzione `context`/`contribution` per quelli che restano.

- [ ] **Step 3: Commit**

```bash
git add src/constants/projects.ts
git commit -m "$(cat <<'EOF'
refactor(projects): separa il tipo di progetto dallo stack tecnologico

"customer" e "personal" stavano nella stessa lista di "nextjs" e "prisma",
come se essere un cliente e usare React fossero la stessa informazione.
Diventano kind, che pilota il raggruppamento della pagina, e nasce un
vocabolario di ruoli che dice quanto in profondita' e' andato il lavoro.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 2: Copy in prima persona (IT + EN)

**Files:**
- Modify: `src/translations/it/projects.json`
- Modify: `src/translations/en/projects.json`

**Interfaces:**
- Produces: chiavi `projects.items.<id>.{name,context,contribution}`, `projects.groups.{clients,experiments}.{title,subtitle}`, `projects.items.common.{clientSite,readCaseStudy,checkDesign,checkGitHub,checkWebsite,noResults}`, `projects.filter.{rolesLabel,tagsLabel,sortLabel,sortOrder*}`.
- `description` viene rimossa da tutti gli item.

> **Nota per chi esegue:** il copy qui sotto è redatto a partire da quello che Andrea ha raccontato durante il design. È il punto del piano che va riletto con lui prima del commit: sono affermazioni sulla sua carriera, non stringhe di interfaccia.

- [ ] **Step 1: Sostituire `items` e aggiungere `groups` in `src/translations/it/projects.json`**

```json
{
  "hero": {
    "title": "Lavori <highlight>per clienti</highlight> e <highlight>progetti personali</highlight>",
    "description": "Cosa ho fatto per aziende e startup: prodotto, interfacce, architettura. E i progetti che ho costruito da solo.",
    "ctaCheckOut": "Dai un'occhiata"
  },
  "groups": {
    "clients": {
      "title": "Lavoro per clienti",
      "subtitle": "Cosa ho costruito, e cosa ho lasciato quando me ne sono andato."
    },
    "experiments": {
      "title": "Esperimenti",
      "subtitle": "Progetti personali, senza clienti e senza scadenze."
    }
  },
  "filter": {
    "sortLabel": "Ordinamento",
    "sortOrderNone": "Nessun ordinamento",
    "sortOrderAsc": "Ordina da A a Z",
    "sortOrderDesc": "Ordina da Z a A",
    "rolesLabel": "Tipo di lavoro",
    "tagsLabel": "Tecnologie"
  },
  "items": {
    "common": {
      "noResults": "Nessun progetto trovato con i filtri selezionati",
      "checkDesign": "Guarda il design",
      "checkWebsite": "Visita il sito",
      "checkGitHub": "Vai su GitHub",
      "clientSite": "Sito del cliente",
      "readCaseStudy": "Leggi il case study"
    },
    "quido": {
      "name": "Quido S.r.l.",
      "context": "Piattaforma AI per private equity, M&A e investment banking",
      "contribution": "Ho rifatto da zero la UI/UX della piattaforma su Figma e l'ho portata in produzione con Next.js ed Expo. Col tempo sono diventato il loro forward deployed engineer: tool interni, sviluppo agentico più preciso, e decisioni su cosa costruire prima."
    },
    "recrowd": {
      "name": "Recrowd S.r.l.",
      "context": "Piattaforma di crowdfunding immobiliare",
      "contribution": "Collaborazione lunga su più piattaforme: ho sviluppato l'intero backoffice con Next.js, Node.js e PostgreSQL, e ho lavorato anche sulla landing pubblica. Frontend, backend e decisioni tecniche insieme al loro team."
    },
    "othersideTechnology": {
      "name": "Otherside Technology S.r.l.",
      "context": "Software house specializzata in soluzioni AI su misura",
      "contribution": "Il loro sito non l'ho mai toccato: ho lavorato su CloTU, il sistema multi-agentico che stavano costruendo per le organizzazioni. Mio il frontend e la UI/UX, cioè il problema di rendere governabile un'orchestrazione di agenti."
    },
    "brainplatform": {
      "name": "Brainplatform S.r.l.",
      "context": "Agenzia di sviluppo e design per prodotti digitali",
      "contribution": "Rework completo di un gestionale legacy: Fluent UI per dare al web il comportamento di un tool Microsoft, con ricerca a suggeriti e azioni rapide. Poi due dashboard, la prima diventata base whitelabel della seconda. Ho seguito un junior lasciando tutto documentato."
    },
    "studioBargiggia": {
      "name": "Studio Bargiggia",
      "context": "Studio di amministrazione condominiale",
      "contribution": "Dalla call di discovery al passaggio di consegne: analisi dei bisogni, due proposte di design tra cui far scegliere, Figma, poi Next.js e Strapi on-premise. I contenuti dal vecchio sito li ho migrati io. Oggi lo aggiornano da soli."
    },
    "anonymous": {
      "name": "Anonimo",
      "context": "Piattaforma privata per una rete di agenti sul territorio",
      "contribution": "Strumento usato ogni giorno da tablet: 7.000 tabaccherie lombarde su mappa, check-in valido solo entro 500 metri, preventivo generato in PDF da mandare su WhatsApp. Next.js con server components, PostgreSQL serverless, sessioni e RBAC."
    },
    "ravenn": {
      "name": "Ravenn S.r.l.",
      "context": "Piattaforma per la logistica e l'ospitalità negli eventi",
      "contribution": "Entrato per coprire l'assenza del CTO, e tornato una seconda volta per costruire l'area riservata allo staff degli eventi: accesso a password e flussi dedicati, separati da quelli dei partecipanti."
    },
    "fastmemo": {
      "name": "Fast Memo - Note in un click",
      "context": "App di note multipiattaforma, open source",
      "contribution": "Nata perché le note finiscono su server altrui e le funzioni utili dietro un paywall. Ha webhook, riconoscimento vocale e AI locale, gira su mobile e desktop e si può self-hostare. Oltre 1.000 download e 30+ stelle su GitHub."
    },
    "coolifyManager": {
      "name": "Coolify Manager",
      "context": "App mobile ed estensione Chrome per server Coolify",
      "contribution": "Coolify in tasca: riavviare un server, leggere i log, seguire un deploy mentre non sei alla scrivania. Costruita sulle REST API di Coolify, funziona sia con l'hosted che con il self-hosted. Oltre 1.000 download."
    },
    "forfettarioControl": {
      "name": "Forfettario Control",
      "context": "Concept di app per freelance in regime forfettario",
      "contribution": "Fermo al design: fatture, scadenze e notifiche ordinate per urgenza, disegnate su Figma. Non risolveva niente che altri non facessero già — mi interessava vedere come sarebbe stato se fosse stato fatto bene."
    },
    "coffeeNotesLab": {
      "name": "Coffee Notes Lab",
      "context": "Diario di degustazioni ed esperimenti sull'espresso",
      "contribution": "Progetto personale senza obiettivi: un posto dove curare l'interfaccia con calma, soprattutto la sezione /photos. Next.js 16, niente di più."
    }
  }
}
```

`metadata`, `list` e **`featured`** restano invariati rispetto al file attuale: vanno ricopiati, non cancellati. `featured` in particolare: `featured-products-section.tsx:38,45` legge `projects.featured.title` e `projects.featured.subtitle`, e toglierle romperebbe la sezione dei prodotti a runtime senza che il type check dica niente. Per la stessa ragione **non** esiste un `groups.products`: quella sezione ha già le sue chiavi, e duplicarle creerebbe due fonti per la stessa intestazione.

`context` e `contribution` vanno scritti anche per `fastmemo` e `coolifyManager`, che nella pagina non compaiono come card: li consuma l'`ItemList` in `page.tsx`, che mappa su tutto `PROJECTS`.

- [ ] **Step 2: Rispecchiare la struttura in `src/translations/en/projects.json`**

Stesse regole: `metadata`, `list` e `featured` si ricopiano invariati, e non esiste `groups.products`.

```json
{
  "groups": {
    "clients": {
      "title": "Client work",
      "subtitle": "What I built, and what I left behind when I walked away."
    },
    "experiments": {
      "title": "Experiments",
      "subtitle": "Personal projects, no clients and no deadlines."
    }
  },
  "filter": {
    "sortLabel": "Sorting",
    "sortOrderNone": "No sorting",
    "sortOrderAsc": "Sort A to Z",
    "sortOrderDesc": "Sort Z to A",
    "rolesLabel": "Type of work",
    "tagsLabel": "Technologies"
  },
  "items": {
    "common": {
      "noResults": "No project matches the selected filters",
      "checkDesign": "See the design",
      "checkWebsite": "Visit the website",
      "checkGitHub": "Go to GitHub",
      "clientSite": "Client website",
      "readCaseStudy": "Read the case study"
    },
    "quido": {
      "name": "Quido S.r.l.",
      "context": "AI platform for private equity, M&A and investment banking",
      "contribution": "I rebuilt the platform's UI/UX from scratch in Figma and shipped it with Next.js and Expo. Over time I became their forward deployed engineer: internal tooling, sharper agentic development, and calls on what to build first."
    },
    "recrowd": {
      "name": "Recrowd S.r.l.",
      "context": "Real-estate crowdfunding platform",
      "contribution": "A long collaboration across several platforms: I built the entire backoffice with Next.js, Node.js and PostgreSQL, and also worked on the public landing page. Frontend, backend and technical decisions alongside their team."
    },
    "othersideTechnology": {
      "name": "Otherside Technology S.r.l.",
      "context": "Software house building tailored AI solutions",
      "contribution": "I never touched their website: I worked on CloTU, the multi-agent system they were building for organisations. Frontend and UI/UX were mine — the problem of making an agent orchestration something a person can actually steer."
    },
    "brainplatform": {
      "name": "Brainplatform S.r.l.",
      "context": "Development and design agency for digital products",
      "contribution": "A full rework of a legacy back-office: Fluent UI to give the web the behaviour of a Microsoft tool, with typeahead search and quick actions. Then two dashboards, the first becoming the whitelabel base of the second. I mentored a junior and left everything documented."
    },
    "studioBargiggia": {
      "name": "Studio Bargiggia",
      "context": "Condominium management firm",
      "contribution": "From the discovery call to the handover: needs analysis, two design routes for the client to choose from, Figma, then Next.js and on-premise Strapi. I migrated the content from the old site myself. They keep it updated on their own today."
    },
    "anonymous": {
      "name": "Anonymous",
      "context": "Private platform for a field sales network",
      "contribution": "A tool used daily from tablets: 7,000 Lombardy tobacconists on a map, check-in valid only within 500 metres, and a PDF quote generated to send over WhatsApp. Next.js with server components, serverless PostgreSQL, sessions and RBAC."
    },
    "ravenn": {
      "name": "Ravenn S.r.l.",
      "context": "Logistics and hospitality platform for events",
      "contribution": "I stepped in to cover for an absent CTO, then came back a second time to build the area reserved for event staff: password-gated access and dedicated flows, kept separate from the attendees'."
    },
    "fastmemo": {
      "name": "Fast Memo - Notes in one click",
      "context": "Cross-platform note-taking app, open source",
      "contribution": "Born because notes end up on someone else's servers and the useful features sit behind a paywall. It has webhooks, voice recognition and local AI, runs on mobile and desktop, and can be self-hosted. Over 1,000 downloads and 30+ stars on GitHub."
    },
    "coolifyManager": {
      "name": "Coolify Manager",
      "context": "Mobile app and Chrome extension for Coolify servers",
      "contribution": "Coolify in your pocket: restart a server, read the logs, follow a deploy while you're away from the desk. Built on Coolify's REST APIs, it works with both the hosted and the self-hosted setup. Over 1,000 downloads."
    },
    "forfettarioControl": {
      "name": "Forfettario Control",
      "context": "App concept for Italian flat-tax freelancers",
      "contribution": "It never left the design stage: invoices, deadlines and notifications ordered by urgency, drawn in Figma. It solved nothing others weren't already solving — I wanted to see what it would look like done well."
    },
    "coffeeNotesLab": {
      "name": "Coffee Notes Lab",
      "context": "A log of espresso tastings and home experiments",
      "contribution": "A personal project with no goal: somewhere to work on the interface without a deadline, the /photos section especially. Next.js 16, nothing more."
    }
  }
}
```

- [ ] **Step 3: Verificare che i due file abbiano la stessa forma**

Run:
```bash
node -e '
const it = require("./src/translations/it/projects.json");
const en = require("./src/translations/en/projects.json");
const shape = (o, p = "") => typeof o !== "object" || o === null
  ? [p]
  : Object.keys(o).flatMap((k) => shape(o[k], p ? `${p}.${k}` : k));
const a = shape(it).sort(), b = shape(en).sort();
const only = (x, y) => x.filter((k) => !y.includes(k));
console.log("solo in IT:", only(a, b));
console.log("solo in EN:", only(b, a));
'
```
Expected: due array vuoti.

- [ ] **Step 4: Commit**

```bash
git add src/translations/it/projects.json src/translations/en/projects.json
git commit -m "$(cat <<'EOF'
feat(projects): racconta il contributo, non l'azienda del cliente

Ogni description parlava del cliente: "Quido.ai e' una piattaforma di
intelligenza artificiale...". Di chi ha fatto il lavoro non diceva niente,
e insieme allo screenshot della landing faceva concludere che il
deliverable fosse il loro sito. Si sdoppia in una riga di contesto piu'
il contributo in prima persona.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 3: La card a riga intera

**Files:**
- Modify: `src/app/[locale]/projects/components/project-card.tsx`

**Interfaces:**
- Consumes: `Project`, `ProjectRole` dal Task 1; chiavi di traduzione dal Task 2.
- Produces: `ProjectCard({ project, caseStudySlug, className })`. `caseStudySlug` è `string | null` e resta `null` per tutta la fase A; il Task 13 lo popola.

- [ ] **Step 1: Riscrivere il componente**

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Project } from "@/constants/projects";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowUpRightIcon, CircleQuestionMarkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  caseStudySlug?: string | null;
  className?: string;
}

export async function ProjectCard({
  project,
  caseStudySlug = null,
  className,
}: ProjectCardProps) {
  const t = await getTranslations();

  const name = t(`projects.items.${project.id}.name`);
  const externalUrl =
    project.websiteUrl ?? project.designUrl ?? project.githubUrl ?? null;

  const externalLabel =
    project.designUrl && !project.websiteUrl
      ? t("projects.items.common.checkDesign")
      : project.githubUrl && !project.websiteUrl
        ? t("projects.items.common.checkGitHub")
        : project.kind === "client"
          ? t("projects.items.common.clientSite")
          : t("projects.items.common.checkWebsite");

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
        className
      )}
    >
      <div className="relative aspect-3/2 overflow-hidden md:aspect-auto md:h-full">
        <Image
          src={project.image}
          alt=""
          width={600}
          height={400}
          sizes="(max-width: 768px) 100vw, 380px"
          className="size-full object-cover object-top"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex items-start gap-3">
          {project.logo ? (
            <Image
              src={project.logo}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <CircleQuestionMarkIcon
              className="text-muted-foreground size-10 shrink-0"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-base leading-tight font-semibold">{name}</h3>
            <p className="text-muted-foreground text-xs">
              {t(`projects.items.${project.id}.context`)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {project.roles.map((role) => (
            <span
              key={role}
              className="rounded-md p-px"
              style={{ background: "var(--border-gradient)" }}
            >
              <span className="bg-card text-foreground block rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                {role}
              </span>
            </span>
          ))}
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {t(`projects.items.${project.id}.contribution`)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-1">
          {caseStudySlug && (
            <Button variant="gradient-outline" asChild>
              <Link href={`/projects/${caseStudySlug}`}>
                {t("projects.items.common.readCaseStudy")}
              </Link>
            </Button>
          )}

          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex items-center gap-1 rounded-sm text-sm transition-colors outline-none focus-visible:ring-[3px]"
            >
              {externalLabel}
              <ArrowUpRightIcon className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
```

Tre cose da notare. Il link esterno non è più un `Button` primario: era il terzo elemento che faceva leggere il sito del cliente come il deliverable, e ora è un link secondario che dice cosa sta linkando. I chip di ruolo usano l'anello `--border-gradient` che `Card` e i tag del blog già usano, così si distinguono dai chip di stack che restano `bg-muted` piatti. L'immagine è `aria-hidden` con `alt=""`: è riconoscimento del cliente, non contenuto informativo, e il nome è già nell'`h3` accanto.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: PASS. `projects-section.tsx` continua a passare solo `project`, e `caseStudySlug` e' opzionale. Come per il Task 1, le chiavi di traduzione ormai orfane in `page.tsx` passano per cast `as never` e non danno errore di tipo: restano visibili solo come `MISSING_MESSAGE` in console finche' il Task 4 non riscrive quel file.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/projects/components/project-card.tsx"
git commit -m "$(cat <<'EOF'
feat(projects): dai alla card la larghezza per dire cosa ho fatto

A due colonne non ci stava altro che una descrizione e un bottone. A riga
intera entrano contesto, ruoli e contributo senza affollare, e "Visita il
sito" smette di essere l'azione primaria: e' il sito del cliente, non il
lavoro consegnato.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 4: Raggruppamento e ordine della pagina

**Files:**
- Modify: `src/app/[locale]/projects/sections/projects-section.tsx`
- Modify: `src/app/[locale]/projects/page.tsx`

**Interfaces:**
- Consumes: `ProjectCard` dal Task 3, `PROJECTS` dal Task 1, e `useProjectsFilter()` **nella forma estesa del Task 5** (con `selectedRoles` e `toggleRole`).
- Produces: `ProjectsSection` che rende tre gruppi; `ProjectGroupHeading` (client component) che si nasconde quando un filtro è attivo.

> **Ordine di esecuzione:** questo task dipende dal Task 5. Eseguire il Task 5 per primo, oppure accettare che `npx tsc --noEmit` fallisca su `selectedRoles` finché il Task 5 non è chiuso. I due sono separati perché toccano file diversi e un reviewer può respingerne uno approvando l'altro.

- [ ] **Step 1: Creare il titolo di gruppo che collassa durante il filtro**

Create: `src/app/[locale]/projects/components/project-group-heading.tsx`

```tsx
"use client";

import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectGroupHeadingProps {
  title: string;
  subtitle: string;
}

export function ProjectGroupHeading({
  title,
  subtitle,
}: ProjectGroupHeadingProps) {
  const { selectedTags, selectedRoles } = useProjectsFilter();

  if (selectedTags.length > 0 || selectedRoles.length > 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">{subtitle}</p>
    </div>
  );
}
```

`selectedRoles` arriva dal Task 5. Eseguire il Task 5 prima di questo, oppure accettare che il type check fallisca fino a quel punto.

- [ ] **Step 2: Riscrivere `projects-section.tsx`**

```tsx
import { PROJECTS, type ProjectKind } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { getTranslations } from "next-intl/server";
import { ProjectCard } from "../components/project-card";
import { ProjectGroupHeading } from "../components/project-group-heading";
import { ProjectItem } from "../components/project-item";
import { ProjectsEmptyState } from "../components/projects-empty-state";
import { ProjectsFilter } from "../components/projects-filter";
import { ProjectsFilterProvider } from "../components/projects-filter-provider";

interface ProjectsSectionProps {
  id: string;
  className?: string;
}

const GROUPS: { kind: ProjectKind; key: string }[] = [
  { kind: "client", key: "clients" },
  { kind: "personal", key: "experiments" },
];

const ALL_TAGS = [...new Set(PROJECTS.flatMap((p) => p.tags))].sort();
const ALL_ROLES = [...new Set(PROJECTS.flatMap((p) => p.roles))].sort();

export async function ProjectsSection({ id, className }: ProjectsSectionProps) {
  const t = await getTranslations();

  const sortKeys = PROJECTS.map((project) => ({
    id: project.id,
    name: t(`projects.items.${project.id}.name`).toLowerCase(),
  }));

  const alphabeticalIndexById = new Map(
    sortKeys
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((project, index) => [project.id, index] as const)
  );

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 pb-10 lg:pt-0 lg:pb-14", className)}
    >
      <h2 className="sr-only">{t("projects.list.title")}</h2>

      <ProjectsFilterProvider availableTags={ALL_TAGS} availableRoles={ALL_ROLES}>
        <ProjectsFilter tags={ALL_TAGS} roles={ALL_ROLES} />

        {GROUPS.map(({ kind, key }) => {
          const projects = PROJECTS.filter((project) => project.kind === kind);

          return (
            <div key={kind} className="mb-12 last:mb-0">
              <ProjectGroupHeading
                title={t(`projects.groups.${key}.title`)}
                subtitle={t(`projects.groups.${key}.subtitle`)}
              />

              <div
                className={cn(
                  "grid grid-cols-1 gap-6",
                  kind === "personal" && "md:grid-cols-2"
                )}
              >
                {projects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    tags={project.tags}
                    roles={project.roles}
                    sourceIndex={PROJECTS.indexOf(project)}
                    alphabeticalIndex={
                      alphabeticalIndexById.get(project.id) ?? 0
                    }
                    total={PROJECTS.length}
                  >
                    <ProjectCard project={project} />
                  </ProjectItem>
                ))}
              </div>
            </div>
          );
        })}

        <ProjectsEmptyState
          projects={PROJECTS.map((project) => ({
            tags: project.tags,
            roles: project.roles,
          }))}
          message={t("projects.items.common.noResults")}
        />
      </ProjectsFilterProvider>
    </section>
  );
}
```

Il gruppo `product` non compare qui: i due prodotti hanno già la loro sezione dedicata (`FeaturedProductsSection`), e ripeterli nella lista li mostrerebbe due volte sulla stessa pagina.

- [ ] **Step 3: Aggiornare `project-item.tsx` per filtrare anche sui ruoli**

```tsx
"use client";

import type { ProjectRole } from "@/constants/projects";
import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectItemProps {
  tags: readonly string[];
  roles: readonly ProjectRole[];
  sourceIndex: number;
  alphabeticalIndex: number;
  total: number;
  children: React.ReactNode;
}

export function ProjectItem({
  tags,
  roles,
  sourceIndex,
  alphabeticalIndex,
  total,
  children,
}: ProjectItemProps) {
  const { selectedTags, selectedRoles, sortOrder } = useProjectsFilter();

  const isMatching =
    selectedTags.every((tag) => tags.includes(tag)) &&
    selectedRoles.every((role) => (roles as readonly string[]).includes(role));

  const order =
    sortOrder === "asc"
      ? alphabeticalIndex
      : sortOrder === "desc"
        ? total - 1 - alphabeticalIndex
        : sourceIndex;

  return (
    <div hidden={!isMatching} style={{ order }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Aggiornare `projects-empty-state.tsx`**

```tsx
"use client";

import type { ProjectRole } from "@/constants/projects";
import { useProjectsFilter } from "./projects-filter-provider";

interface ProjectsEmptyStateProps {
  projects: readonly {
    tags: readonly string[];
    roles: readonly ProjectRole[];
  }[];
  message: string;
}

export function ProjectsEmptyState({
  projects,
  message,
}: ProjectsEmptyStateProps) {
  const { selectedTags, selectedRoles } = useProjectsFilter();

  const hasMatch = projects.some(
    (project) =>
      selectedTags.every((tag) => project.tags.includes(tag)) &&
      selectedRoles.every((role) =>
        (project.roles as readonly string[]).includes(role)
      )
  );

  if (hasMatch) {
    return null;
  }

  return <p className="text-muted-foreground py-12 text-center">{message}</p>;
}
```

- [ ] **Step 5: Invertire l'ordine delle sezioni e correggere l'`ItemList` in `page.tsx`**

Sostituire il corpo di `ProjectsPage` (da `const itemListSchema` fino al `return`):

```tsx
  const itemListSchema = generateItemListSchema({
    name: t("projects.metadata.title"),
    description: t("projects.metadata.description"),
    items: PROJECTS.map((project) => ({
      name: tItems(`projects.items.${project.id}.name` as never),
      description: tItems(
        `projects.items.${project.id}.contribution` as never
      ),
      url: project.websiteUrl ?? project.githubUrl ?? project.designUrl ?? pageUrl,
      image: `${siteUrl}${project.image}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, itemListSchema]),
        }}
      />
      <PageMessages namespaces={["projects"]}>
        <HeroSection id="hero" />
        <ProjectsSection id="projects" />
        <FeaturedProductsSection id="featured" />
      </PageMessages>
    </>
  );
```

`description` diventa `contribution`: è la correzione SEO descritta nella spec. Il `url` resta il sito esterno per ora; il Task 12 lo fa puntare al case study dove esiste.

- [ ] **Step 6: Aggiornare la CTA dell'hero che punta a `#projects`**

`hero-section.tsx` fa già `getElementById("projects")`, che ora è il primo blocco invece del secondo. Nessuna modifica al codice, ma verificare a mano che lo scroll atterri sul blocco "Lavoro per clienti".

- [ ] **Step 7: Build e verifica visiva**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS.

Poi `npm run dev` e su `http://localhost:3000/it/projects` verificare: tre blocchi nell'ordine clienti → prodotti → esperimenti, card a riga intera per i clienti, due per riga per gli esperimenti, e i titoli di gruppo che spariscono quando si seleziona un filtro.

- [ ] **Step 8: Commit**

```bash
git add "src/app/[locale]/projects"
git commit -m "$(cat <<'EOF'
feat(projects): raggruppa per tipo e metti il lavoro cliente per primo

In una griglia piatta il sito personale vecchio pesava quanto Recrowd. I
tre gruppi danno alla pagina un asse che il lettore riconosce, e il lavoro
per clienti va per primo perche' e' quello di cui la pagina deve
convincere. L'ItemList smette di dichiarare a Google un elenco di siti
altrui.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 5: Filtro su ruoli e stack

**Files:**
- Modify: `src/app/[locale]/projects/components/projects-filter-provider.tsx`
- Modify: `src/app/[locale]/projects/components/projects-filter.tsx`

**Interfaces:**
- Produces: `useProjectsFilter()` che espone `{ selectedTags, selectedRoles, sortOrder, toggleTag, toggleRole, changeSortOrder }`. `ProjectsFilterProvider` accetta `availableTags` e `availableRoles`. URL state: `?tags=`, `?roles=`, `?sort=`.

- [ ] **Step 1: Estendere il provider**

Nel file, sostituire i tipi e le funzioni di lettura/scrittura della query string:

```tsx
interface ProjectsFilterValue {
  selectedTags: string[];
  selectedRoles: string[];
  sortOrder: SortOrder;
  toggleTag: (tag: string) => void;
  toggleRole: (role: string) => void;
  changeSortOrder: (sortOrder: SortOrder) => void;
}

interface ProjectsFilterState {
  selectedTags: string[];
  selectedRoles: string[];
  sortOrder: SortOrder;
  isHydrated: boolean;
}

function readSearchParams(
  availableTags: readonly string[],
  availableRoles: readonly string[]
): Omit<ProjectsFilterState, "isHydrated"> {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get("sort");

  return {
    selectedTags: (params.get("tags") ?? "")
      .split(",")
      .filter((tag) => availableTags.includes(tag)),
    selectedRoles: (params.get("roles") ?? "")
      .split(",")
      .filter((role) => availableRoles.includes(role)),
    sortOrder: isSortOrder(sort) ? sort : "none",
  };
}

function buildSearch(
  selectedTags: string[],
  selectedRoles: string[],
  sortOrder: SortOrder
): string {
  const params = new URLSearchParams(window.location.search);

  const setOrDelete = (key: string, values: string[]) => {
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
  };

  setOrDelete("tags", selectedTags);
  setOrDelete("roles", selectedRoles);

  if (sortOrder !== "none") {
    params.set("sort", sortOrder);
  } else {
    params.delete("sort");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
```

Nel componente provider: aggiungere `availableRoles` alle props e al ref, inizializzare `selectedRoles: []` nello stato, passare `availableRolesRef.current` a `readSearchParams`, passare `state.selectedRoles` a `buildSearch`, e aggiungere `toggleRole` speculare a `toggleTag`:

```tsx
  const toggleRole = useCallback((role: string) => {
    setState((previous) => ({
      ...previous,
      selectedRoles: previous.selectedRoles.includes(role)
        ? previous.selectedRoles.filter((selected) => selected !== role)
        : [...previous.selectedRoles, role],
    }));
  }, []);
```

`toggleRole` e `selectedRoles` vanno aggiunti al `useMemo` del valore e alle sue dipendenze.

- [ ] **Step 2: Estrarre il gruppo di chip in `projects-filter.tsx`**

Aggiungere sopra il componente, e usarlo per entrambi i gruppi:

```tsx
interface FilterChipGroupProps {
  label: string;
  values: readonly string[];
  selected: readonly string[];
  onToggle: (value: string) => void;
  variant: "role" | "tag";
}

function FilterChipGroup({
  label,
  values,
  selected,
  onToggle,
  variant,
}: FilterChipGroupProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {values.map((value) => {
          const isSelected = selected.includes(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              aria-pressed={isSelected}
              aria-label={t("common.accessibility.filterByTag", { tag: value })}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors lg:text-[10px]",
                isSelected
                  ? "bg-foreground text-background"
                  : variant === "role"
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

Poi sostituire il corpo di `ProjectsFilter`. Il select di ordinamento resta identico a com'è oggi — va ricopiato, non riscritto — e cambia solo il contenitore e ciò che gli sta sotto:

```tsx
interface ProjectsFilterProps {
  tags: readonly string[];
  roles: readonly string[];
}

export function ProjectsFilter({ tags, roles }: ProjectsFilterProps) {
  const t = useTranslations();
  const {
    selectedTags,
    selectedRoles,
    sortOrder,
    toggleTag,
    toggleRole,
    changeSortOrder,
  } = useProjectsFilter();

  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const triggerId = useId();

  const activeSortOption =
    SORT_OPTIONS.find((option) => option.value === sortOrder) ??
    SORT_OPTIONS[0];

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span id="sort-label" className="text-muted-foreground text-sm">
          {t("projects.filter.sortLabel")}
        </span>
        {/* il blocco del select resta esattamente quello attuale:
            div ref=selectRef, span con --border-gradient, button trigger,
            listbox condizionale con le tre SORT_OPTIONS */}
      </div>

      <FilterChipGroup
        label={t("projects.filter.rolesLabel")}
        values={roles}
        selected={selectedRoles}
        onToggle={toggleRole}
        variant="role"
      />

      <FilterChipGroup
        label={t("projects.filter.tagsLabel")}
        values={tags}
        selected={selectedTags}
        onToggle={toggleTag}
        variant="tag"
      />
    </div>
  );
}
```

La griglia passa da `md:grid-cols-2` a una colonna con i tre blocchi impilati: tre gruppi su due colonne si sbilanciano, e i ruoli vanno letti prima dello stack.

- [ ] **Step 3: Type check e prova manuale della URL**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

Poi in dev: selezionare un ruolo, verificare che l'URL diventi `?roles=ui-ux`, ricaricare la pagina e verificare che il chip resti selezionato, premere Indietro e verificare che si deselezioni.

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/projects/components"
git commit -m "$(cat <<'EOF'
feat(projects): fai rispondere il filtro a "che lavoro fa", non solo "con cosa"

I chip elencavano solo lo stack. Separandoli in ruoli e tecnologie il
filtro risponde alla domanda che si fa chi valuta un freelance, e i due
gruppi restano distinguibili a colpo d'occhio.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 6: Easter egg del sito vecchio

**Files:**
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/translations/{it,en}/common.json`

- [ ] **Step 1: Aggiungere la stringa in `src/translations/it/common.json`**

Dentro `footer.cta`, accanto a `descriptionPart2`:

```json
      "easterEgg": "E se ti va, qui c'è il mio primo sito."
```

E in `src/translations/en/common.json`:

```json
      "easterEgg": "And if you fancy it, here's my very first website."
```

- [ ] **Step 2: Renderlo sotto `FooterCatCta`**

In `footer.tsx`, dentro il `<div className="lg:col-span-3">`, dopo `<FooterCatCta />`:

```tsx
                <p className="text-muted-foreground mt-3 text-sm">
                  <a
                    href="https://old.andrealosavio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground focus-visible:ring-ring/50 rounded-sm underline underline-offset-2 transition-colors outline-none focus-visible:ring-[3px]"
                  >
                    {t("common.footer.cta.easterEgg")}
                  </a>
                </p>
```

- [ ] **Step 3: Verifica**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS. In dev, controllare che il link compaia in fondo alla terza colonna del footer e apra il sito vecchio in una scheda nuova.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/footer.tsx src/translations/it/common.json src/translations/en/common.json
git commit -m "$(cat <<'EOF'
feat(footer): retrocedi il sito vecchio a easter egg

Accanto a "ho ricostruito la UX di una piattaforma AI", una card per la
versione precedente di questo stesso sito appiattiva entrambe. In fondo al
footer resta raggiungibile per chi lo cerca, senza pesare sul portfolio.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 7: Documentare la fase A

**Files:**
- Modify: `.claude/rules/architecture.md`

- [ ] **Step 1: Aggiungere una sezione `## Projects` dopo `## Blog`**

In inglese, come il resto del file:

```markdown
## Projects

`/projects` carries three axes that used to be collapsed into one list of
tags. `kind` (`client` / `product` / `personal`) groups the page into three
blocks; `roles`, drawn from the `PROJECT_ROLES` vocabulary, says how deep the
work went; `tags` is left to the stack alone. `customer` and `personal` used
to sit among `nextjs` and `prisma`, which made "is a client" and "uses React"
look like the same kind of fact.

Each project's copy is two fields, not one. `context` is a single line naming
what the client or product is; `contribution` is first-person prose, ~40
words, saying what Andrea did. The old single `description` described the
client's business, which — next to a screenshot of their landing page and a
"Visit the website" primary button — made the page read as a list of
marketing sites he had built. The external link is now a secondary link
labelled "Client website", and the screenshot is client recognition, not
proof of work: the proof lives in the case study, where images can be
captioned.

Client cards are full-width with a horizontal split, because at two per row
there was no room for anything but a description and a button. Personal
experiments stay two per row. `FeaturedProductsSection` renders the two own
products and the `product` kind is therefore skipped by `ProjectsSection`, so
nothing appears twice.

Group headings collapse while a filter is active, the same way the blog index
suspends its featured block — a filtered page is just the result list.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/rules/architecture.md
git commit -m "$(cat <<'EOF'
docs(projects): registra i tre assi della pagina progetti

Il perche' di kind separato dai tag e di context separato da contribution
non si ricostruisce dal codice: sembrano due campi arbitrari invece che la
risposta a un difetto preciso.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

**La fase A finisce qui ed è spedibile.** Se i case study non venissero mai scritti, la pagina sarebbe comunque corretta.

---

# FASE B — La profondità

## Task 8: Validazione del frontmatter

**Files:**
- Create: `src/libs/case-studies/frontmatter.ts`
- Test: `src/libs/case-studies/frontmatter.test.ts`

**Interfaces:**
- Produces: `interface CaseStudyFrontmatter { project, title, summary, period, publishedAt, updatedAt?, cover, coverAlt, draft }`, `parseFrontmatter(data: unknown, source: string): CaseStudyFrontmatter`.

- [ ] **Step 1: Scrivere i test che falliscono**

```ts
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

const valid = {
  project: "quido",
  title: "Da consulente a forward deployed engineer",
  summary:
    "Rifatta la UI/UX della piattaforma e poi diventato il loro forward deployed engineer, fra tool interni e decisioni di prodotto.",
  period: "2024 — oggi",
  publishedAt: "2026-09-02",
  cover: "/images/case-studies/quido/cover.webp",
  coverAlt: "La dashboard di Quido dopo il redesign",
};

describe("parseFrontmatter", () => {
  it("normalizza un frontmatter valido", () => {
    const result = parseFrontmatter(valid, "it/quido.mdx");

    expect(result.project).toBe("quido");
    expect(result.draft).toBe(false);
    expect(result.updatedAt).toBeUndefined();
  });

  it("prefissa gli errori con il file di origine", () => {
    expect(() => parseFrontmatter({ ...valid, project: "" }, "it/quido.mdx"))
      .toThrow(/\[case-studies\] it\/quido\.mdx/);
  });

  it("rifiuta un project mancante", () => {
    const { project: _project, ...withoutProject } = valid;

    expect(() => parseFrontmatter(withoutProject, "it/quido.mdx")).toThrow(
      /project/
    );
  });

  it("rifiuta un summary fuori dalla fascia di lunghezza", () => {
    expect(() =>
      parseFrontmatter({ ...valid, summary: "Troppo corto." }, "it/quido.mdx")
    ).toThrow(/summary/);
  });

  it("rifiuta una data malformata", () => {
    expect(() =>
      parseFrontmatter({ ...valid, publishedAt: "02-09-2026" }, "it/quido.mdx")
    ).toThrow(/publishedAt/);
  });

  it("rifiuta updatedAt precedente a publishedAt", () => {
    expect(() =>
      parseFrontmatter(
        { ...valid, updatedAt: "2026-08-01" },
        "it/quido.mdx"
      )
    ).toThrow(/updatedAt/);
  });

  it("pretende coverAlt quando c'è cover", () => {
    const { coverAlt: _coverAlt, ...withoutAlt } = valid;

    expect(() => parseFrontmatter(withoutAlt, "it/quido.mdx")).toThrow(
      /coverAlt/
    );
  });

  it("tratta draft come booleano opzionale", () => {
    expect(parseFrontmatter({ ...valid, draft: true }, "it/quido.mdx").draft)
      .toBe(true);
  });
});
```

- [ ] **Step 2: Eseguire i test e verificare che falliscano**

Run: `npx vitest run src/libs/case-studies/frontmatter.test.ts`
Expected: FAIL — "Failed to resolve import ./frontmatter".

- [ ] **Step 3: Implementare**

```ts
export interface CaseStudyFrontmatter {
  project: string;
  title: string;
  summary: string;
  period: string;
  publishedAt: string;
  updatedAt?: string;
  cover: string;
  coverAlt: string;
  draft: boolean;
}

const SUMMARY_MIN_LENGTH = 120;
const SUMMARY_MAX_LENGTH = 170;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function fail(source: string, message: string): never {
  throw new Error(`[case-studies] ${source}: ${message}`);
}

function requireString(value: unknown, field: string, source: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    return fail(source, `${field} è obbligatorio e deve essere una stringa`);
  }

  return value.trim();
}

function toIsoDate(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10) === value ? value : null;
}

/**
 * Valida il frontmatter grezzo di un case study e lo normalizza. Lancia un
 * errore prefissato dal percorso del file al primo campo malformato: è ciò
 * che fa fallire il build invece di spedire metadati sbagliati.
 *
 * `period` è una stringa libera ("2024 — oggi", "primavera 2023"): è un
 * intervallo leggibile, non una data da confrontare.
 */
export function parseFrontmatter(
  data: unknown,
  source: string
): CaseStudyFrontmatter {
  if (typeof data !== "object" || data === null) {
    return fail(source, "frontmatter mancante o non valido");
  }

  const raw = data as Record<string, unknown>;

  const project = requireString(raw.project, "project", source);
  const title = requireString(raw.title, "title", source);
  const summary = requireString(raw.summary, "summary", source);

  if (
    summary.length < SUMMARY_MIN_LENGTH ||
    summary.length > SUMMARY_MAX_LENGTH
  ) {
    fail(
      source,
      `summary deve essere tra ${SUMMARY_MIN_LENGTH} e ${SUMMARY_MAX_LENGTH} caratteri, trovati ${summary.length}`
    );
  }

  const period = requireString(raw.period, "period", source);
  const publishedAt = toIsoDate(raw.publishedAt);

  if (!publishedAt) {
    fail(source, "publishedAt deve essere una data valida in formato YYYY-MM-DD");
  }

  let updatedAt: string | undefined;

  if (raw.updatedAt !== undefined) {
    const parsed = toIsoDate(raw.updatedAt);

    if (!parsed) {
      fail(source, "updatedAt deve essere una data valida in formato YYYY-MM-DD");
    }

    if (parsed < publishedAt) {
      fail(source, "updatedAt non può precedere publishedAt");
    }

    updatedAt = parsed;
  }

  const cover = requireString(raw.cover, "cover", source);
  const coverAlt = requireString(
    raw.coverAlt,
    "coverAlt (obbligatorio quando è presente cover)",
    source
  );

  return {
    project,
    title,
    summary,
    period,
    publishedAt,
    ...(updatedAt && { updatedAt }),
    cover,
    coverAlt,
    draft: raw.draft === true,
  };
}
```

- [ ] **Step 4: Eseguire i test**

Run: `npx vitest run src/libs/case-studies/frontmatter.test.ts`
Expected: PASS, 8 test.

- [ ] **Step 5: Commit**

```bash
git add src/libs/case-studies/frontmatter.ts src/libs/case-studies/frontmatter.test.ts
git commit -m "$(cat <<'EOF'
feat(case-studies): fai fallire il build sul frontmatter malformato

Un case study con una data storta o senza testo alternativo sulla cover
passerebbe silenziosamente fino in produzione. L'errore nomina il file, per
non doverlo cercare fra dodici.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 9: Sorgente e guardie di consistenza

**Files:**
- Create: `src/libs/case-studies/source.ts`
- Test: `src/libs/case-studies/source.test.ts`

**Interfaces:**
- Consumes: `parseFrontmatter`, `CaseStudyFrontmatter` dal Task 8.
- Produces: `interface CaseStudy { slug, locale, frontmatter, body }`, `assertConsistency(byLocale, projectIds)`, `getCaseStudies(locale)`, `getCaseStudy(locale, slug)`, `getCaseStudyForProject(locale, projectId)`, `getAllCaseStudyParams()`.

- [ ] **Step 1: Scrivere i test che falliscono**

`assertConsistency` prende i dati già caricati, quindi si testa senza toccare il filesystem — stessa scelta fatta per il blog.

```ts
import { describe, expect, it } from "vitest";
import { assertConsistency, type CaseStudy } from "./source";

function build(
  locale: "it" | "en",
  slug: string,
  project: string,
  draft = false
): CaseStudy {
  return {
    slug,
    locale,
    body: "",
    frontmatter: {
      project,
      title: "Titolo",
      summary: "x".repeat(130),
      period: "2024",
      publishedAt: "2026-09-02",
      cover: "/images/case-studies/x/cover.webp",
      coverAlt: "alt",
      draft,
    },
  };
}

const projectIds = ["quido", "recrowd"];

describe("assertConsistency", () => {
  it("accetta una coppia completa", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "quido", "quido")],
          en: [build("en", "quido", "quido")],
        },
        projectIds
      )
    ).not.toThrow();
  });

  it("rifiuta un case study senza gemello nell'altra lingua", () => {
    expect(() =>
      assertConsistency(
        { it: [build("it", "quido", "quido")], en: [] },
        projectIds
      )
    ).toThrow(/manca in "en"/);
  });

  it("rifiuta un project che non esiste in PROJECTS", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "fantasma", "fantasma")],
          en: [build("en", "fantasma", "fantasma")],
        },
        projectIds
      )
    ).toThrow(/fantasma/);
  });

  it("rifiuta due case study sullo stesso progetto", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "quido", "quido"), build("it", "quido-2", "quido")],
          en: [build("en", "quido", "quido"), build("en", "quido-2", "quido")],
        },
        projectIds
      )
    ).toThrow(/piu di un case study/);
  });

  it("ignora le bozze", () => {
    expect(() =>
      assertConsistency(
        { it: [build("it", "quido", "quido", true)], en: [] },
        projectIds
      )
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Eseguire e verificare il fallimento**

Run: `npx vitest run src/libs/case-studies/source.test.ts`
Expected: FAIL — "Failed to resolve import ./source".

- [ ] **Step 3: Implementare**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PROJECTS } from "@/constants/projects";
import { locales, type AppLocale } from "@/libs/i18n/utils";
import { parseFrontmatter, type CaseStudyFrontmatter } from "./frontmatter";

export interface CaseStudy {
  slug: string;
  locale: AppLocale;
  frontmatter: CaseStudyFrontmatter;
  body: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "case-studies");

function readForLocale(locale: AppLocale): CaseStudy[] {
  const directory = path.join(CONTENT_ROOT, locale);

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const parsed = matter(
        fs.readFileSync(path.join(directory, file), "utf8")
      );

      return {
        slug: file.replace(/\.mdx$/, ""),
        locale,
        frontmatter: parseFrontmatter(parsed.data, `${locale}/${file}`),
        body: parsed.content,
      };
    });
}

/**
 * Invarianti che coinvolgono piu file: ogni case study pubblicato ha il
 * gemello nell'altra lingua sotto lo stesso slug, punta a un progetto che
 * esiste, ed e l'unico a puntare a quel progetto. Le bozze sono escluse.
 */
export function assertConsistency(
  byLocale: Record<AppLocale, CaseStudy[]>,
  projectIds: readonly string[]
): void {
  const slugsByLocale = {} as Record<AppLocale, Set<string>>;

  for (const locale of locales) {
    const slugs = new Set<string>();
    const projects = new Set<string>();

    for (const caseStudy of byLocale[locale] ?? []) {
      if (caseStudy.frontmatter.draft) {
        continue;
      }

      const { project } = caseStudy.frontmatter;

      if (!projectIds.includes(project)) {
        throw new Error(
          `[case-studies] ${locale}/${caseStudy.slug}.mdx: project "${project}" non esiste in PROJECTS`
        );
      }

      if (projects.has(project)) {
        throw new Error(
          `[case-studies] il progetto "${project}" ha piu di un case study nel locale "${locale}"`
        );
      }

      projects.add(project);
      slugs.add(caseStudy.slug);
    }

    slugsByLocale[locale] = slugs;
  }

  for (const locale of locales) {
    for (const slug of slugsByLocale[locale]) {
      for (const other of locales) {
        if (other !== locale && !slugsByLocale[other].has(slug)) {
          throw new Error(
            `[case-studies] "${slug}" esiste in "${locale}" ma manca in "${other}"`
          );
        }
      }
    }
  }
}

let cache: Record<AppLocale, CaseStudy[]> | null = null;

function loadAll(): Record<AppLocale, CaseStudy[]> {
  if (cache) {
    return cache;
  }

  const loaded = {} as Record<AppLocale, CaseStudy[]>;

  for (const locale of locales) {
    loaded[locale] = readForLocale(locale);
  }

  assertConsistency(
    loaded,
    PROJECTS.map((project) => project.id)
  );
  cache = loaded;

  return cache;
}

function isVisible(caseStudy: CaseStudy): boolean {
  return (
    !caseStudy.frontmatter.draft || process.env.NODE_ENV === "development"
  );
}

/** Case study visibili di un locale. Le bozze compaiono solo in sviluppo. */
export function getCaseStudies(locale: AppLocale): CaseStudy[] {
  return loadAll()[locale].filter(isVisible);
}

export function getCaseStudy(
  locale: AppLocale,
  slug: string
): CaseStudy | null {
  return getCaseStudies(locale).find((entry) => entry.slug === slug) ?? null;
}

/** Il case study di un progetto, se esiste. Alimenta il link sulla card. */
export function getCaseStudyForProject(
  locale: AppLocale,
  projectId: string
): CaseStudy | null {
  return (
    getCaseStudies(locale).find(
      (entry) => entry.frontmatter.project === projectId
    ) ?? null
  );
}

/** Coppie locale/slug per generateStaticParams. */
export function getAllCaseStudyParams(): {
  locale: AppLocale;
  slug: string;
}[] {
  return locales.flatMap((locale) =>
    getCaseStudies(locale).map((entry) => ({ locale, slug: entry.slug }))
  );
}
```

- [ ] **Step 4: Eseguire i test**

Run: `npx vitest run src/libs/case-studies/`
Expected: PASS, 13 test in totale.

- [ ] **Step 5: Commit**

```bash
git add src/libs/case-studies/source.ts src/libs/case-studies/source.test.ts
git commit -m "$(cat <<'EOF'
feat(case-studies): lega i contenuti ai progetti con guardie a build-time

Un case study puo' restare orfano in tre modi: senza gemello nell'altra
lingua, puntando a un progetto cancellato, o duplicando un progetto gia'
raccontato. Tutti e tre fanno fallire il build invece di dare una 404 o
due link allo stesso lavoro.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 10: Schema JSON-LD del case study

**Files:**
- Modify: `src/utils/seo-schema.ts`

**Interfaces:**
- Produces: `generateCaseStudySchema(props): CreativeWork`.

- [ ] **Step 1: Aggiungere `CreativeWork` all'import di `schema-dts` e l'helper in fondo al file, prima di `schemaToJsonLd`**

```ts
interface GenerateCaseStudySchemaProps {
  url: string;
  name: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  author: SchemaEntityReference;
  about: { name: string; url?: string };
  inLanguage: string;
  keywords: readonly string[];
}

/**
 * Schema di un case study: il lavoro consegnato, non un articolo. `author` è
 * inlineato con nome e url per la stessa ragione di `generateBlogPostingSchema`
 * — ogni pagina viene valutata da sola, e un `@id` verso un nodo dichiarato
 * altrove risulta privo di `name` e `url`.
 */
export function generateCaseStudySchema({
  url,
  name,
  description,
  datePublished,
  dateModified,
  image,
  author,
  about,
  inLanguage,
  keywords,
}: GenerateCaseStudySchemaProps): CreativeWork {
  return {
    "@type": "CreativeWork",
    "@id": `${url}#casestudy`,
    mainEntityOfPage: url,
    url,
    name,
    description,
    datePublished: toIsoDateTime(datePublished),
    dateModified: toIsoDateTime(dateModified ?? datePublished),
    image,
    inLanguage,
    author: {
      "@type": "Person",
      "@id": author.id,
      name: author.name,
      url: author.url,
    },
    about: {
      "@type": "Organization",
      name: about.name,
      ...(about.url && { url: about.url }),
    },
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
  };
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/utils/seo-schema.ts
git commit -m "$(cat <<'EOF'
feat(seo): descrivi un case study come lavoro consegnato, non come articolo

BlogPosting appartiene al blog e mischiarli confonderebbe due superfici con
lettori diversi. CreativeWork con l'azienda in "about" dice esattamente
cosa e' la pagina: un lavoro fatto per qualcuno.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 11: La route del case study

**Files:**
- Create: `src/app/[locale]/projects/[slug]/page.tsx`
- Create: `src/app/[locale]/projects/[slug]/components/case-study-header.tsx`

**Interfaces:**
- Consumes: `getCaseStudy`, `getAllCaseStudyParams` dal Task 9; `generateCaseStudySchema` dal Task 10; `PROJECTS` dal Task 1.

- [ ] **Step 1: L'intestazione**

```tsx
import { Button } from "@/components/ui/button";
import type { Project } from "@/constants/projects";
import type { CaseStudyFrontmatter } from "@/libs/case-studies/frontmatter";
import { Link } from "@/libs/i18n/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface CaseStudyHeaderProps {
  project: Project;
  frontmatter: CaseStudyFrontmatter;
}

export async function CaseStudyHeader({
  project,
  frontmatter,
}: CaseStudyHeaderProps) {
  const t = await getTranslations();
  const name = t(`projects.items.${project.id}.name`);

  return (
    <header className="mx-auto max-w-3xl px-6 pt-32 pb-10">
      <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
        <Link href="/projects">
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          {t("projects.metadata.title")}
        </Link>
      </Button>

      <div className="mb-6 flex items-center gap-3">
        {project.logo && (
          <Image
            src={project.logo}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0"
            aria-hidden="true"
          />
        )}
        <div>
          <p className="text-foreground text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">
            {t(`projects.items.${project.id}.context`)}
          </p>
        </div>
      </div>

      <h1 className="mb-5 bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
        {frontmatter.title}
      </h1>

      <p className="text-muted-foreground mb-6">{frontmatter.summary}</p>

      <dl className="text-muted-foreground mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-foreground font-medium">
            {t("projects.caseStudy.period")}
          </dt>
          <dd>{frontmatter.period}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-foreground font-medium">
            {t("projects.caseStudy.roles")}
          </dt>
          <dd>{project.roles.join(", ")}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-foreground font-medium">
            {t("projects.caseStudy.stack")}
          </dt>
          <dd>{project.tags.join(", ")}</dd>
        </div>
      </dl>

      {project.websiteUrl && (
        <a
          href={project.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm transition-colors"
        >
          {t("projects.items.common.clientSite")}
          <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </a>
      )}
    </header>
  );
}
```

Aggiungere a `src/translations/{it,en}/projects.json` la chiave `caseStudy`:

```json
    "caseStudy": {
      "period": "Periodo",
      "roles": "Ruolo",
      "stack": "Stack",
      "backToProjects": "Torna ai progetti"
    }
```

In inglese: `"Period"`, `"Role"`, `"Stack"`, `"Back to projects"`.

- [ ] **Step 2: La pagina**

```tsx
import { ContentCta } from "@/components/content-cta";
import { PROJECTS } from "@/constants/projects";
import { getCaseStudy, getAllCaseStudyParams } from "@/libs/case-studies/source";
import { PageMessages } from "@/libs/i18n/messages";
import type { AppLocale } from "@/libs/i18n/utils";
import {
  generateBreadcrumbSchema,
  generateCaseStudySchema,
  schemaToJsonLd,
} from "@/utils/seo-schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CaseStudyHeader } from "./components/case-study-header";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllCaseStudyParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = getCaseStudy(locale as AppLocale, slug);

  if (!caseStudy) {
    return {};
  }

  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/projects/${slug}`;
  const { title, summary, cover, coverAlt } = caseStudy.frontmatter;

  return {
    title: `${title} | Andrea Losavio`,
    description: summary,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${siteUrl}/en/projects/${slug}`,
        it: `${siteUrl}/it/projects/${slug}`,
        "x-default": `${siteUrl}/it/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description: summary,
      url: pageUrl,
      type: "article",
      locale: locale === "it" ? "it_IT" : "en_US",
      alternateLocale: locale === "it" ? "en_US" : "it_IT",
      siteName: "Andrea Losavio",
      images: [
        { url: `${siteUrl}${cover}`, width: 1200, height: 630, alt: coverAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [`${siteUrl}${cover}`],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const caseStudy = getCaseStudy(locale as AppLocale, slug);

  if (!caseStudy) {
    notFound();
  }

  const project = PROJECTS.find(
    (entry) => entry.id === caseStudy.frontmatter.project
  );

  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const siteUrl = `https://${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
  const pageUrl = `${siteUrl}/${locale}/projects/${slug}`;
  const name = t(`projects.items.${project.id}.name`);

  const { default: Content } = await import(
    `@content/case-studies/${locale}/${slug}.mdx`
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: t("common.navigation.home"), url: `${siteUrl}/${locale}` },
    { name: t("projects.metadata.title"), url: `${siteUrl}/${locale}/projects` },
    { name, url: pageUrl },
  ]);

  const caseStudySchema = generateCaseStudySchema({
    url: pageUrl,
    name: caseStudy.frontmatter.title,
    description: caseStudy.frontmatter.summary,
    datePublished: caseStudy.frontmatter.publishedAt,
    dateModified: caseStudy.frontmatter.updatedAt,
    image: `${siteUrl}${caseStudy.frontmatter.cover}`,
    author: {
      id: `${siteUrl}#person`,
      name: "Andrea Losavio",
      url: siteUrl,
    },
    about: { name, ...(project.websiteUrl && { url: project.websiteUrl }) },
    inLanguage: locale === "it" ? "it-IT" : "en-US",
    keywords: [...project.roles, ...project.tags],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, caseStudySchema]),
        }}
      />
      <PageMessages namespaces={["projects"]}>
        <CaseStudyHeader project={project} frontmatter={caseStudy.frontmatter} />
        <article className="mx-auto max-w-3xl px-6 pb-20">
          <div className="prose-article">
            <Content />
          </div>
          <ContentCta
            title={t("projects.caseStudy.cta.title")}
            description={t("projects.caseStudy.cta.description")}
            action={t("projects.caseStudy.cta.action")}
          />
        </article>
      </PageMessages>
    </>
  );
}
```

`prose-article` è la classe che l'articolo del blog usa sul contenitore MDX (`blog/[slug]/page.tsx:183`): riusarla tale e quale tiene la tipografia dei due tipi di contenuto allineata.

- [ ] **Step 3: Promuovere la CTA di fine contenuto a componente condiviso**

`ArticleCta` in `src/app/[locale]/blog/components/article-cta.tsx` è un guscio generico: l'unica parte legata al blog sono le tre chiavi `blog.article.cta.*`. La convenzione del repo dice di promuovere a `src/components/` quando due route lo consumano, ed è esattamente questo il caso.

Create: `src/components/content-cta.tsx`

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_HREF } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { SendIcon } from "lucide-react";

interface ContentCtaProps {
  title: string;
  description: string;
  action: string;
  className?: string;
}

export function ContentCta({
  title,
  description,
  action,
  className,
}: ContentCtaProps) {
  return (
    <div className={cn("my-12", className)}>
      <Card className="bg-background items-center gap-4 p-6 text-center">
        <h2 className="m-0 bg-(image:--text-gradient) bg-clip-text text-xl font-bold text-transparent md:text-2xl">
          {title}
        </h2>

        <p className="text-muted-foreground m-0 max-w-md text-sm">
          {description}
        </p>

        <Button variant="gradient-outline" asChild>
          <Link href={CONTACT_HREF}>
            {action}
            <SendIcon className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </Card>
    </div>
  );
}
```

Le stringhe arrivano risolte dal chiamante invece che come chiavi, così il componente non sa niente del namespace che lo sta usando.

Poi riscrivere `article-cta.tsx` come sottile adattatore, per non toccare `blog/[slug]/page.tsx`:

```tsx
import { ContentCta } from "@/components/content-cta";
import type { AppLocale } from "@/libs/i18n/utils";
import { getTranslations } from "next-intl/server";

interface ArticleCtaProps {
  locale: AppLocale;
  className?: string;
}

export async function ArticleCta({ locale, className }: ArticleCtaProps) {
  const t = await getTranslations({ locale });

  return (
    <ContentCta
      title={t("blog.article.cta.title")}
      description={t("blog.article.cta.description")}
      action={t("blog.article.cta.action")}
      className={className}
    />
  );
}
```

Aggiungere a `src/translations/it/projects.json`, dentro `caseStudy`:

```json
      "cta": {
        "title": "Hai un problema che somiglia a questo?",
        "description": "Raccontamelo. Se posso aiutarti te lo dico, e se non posso ti dico chi può.",
        "action": "Scrivimi"
      }
```

E in inglese:

```json
      "cta": {
        "title": "Got a problem that looks like this one?",
        "description": "Tell me about it. If I can help I'll say so, and if I can't I'll tell you who can.",
        "action": "Get in touch"
      }
```

- [ ] **Step 4: Build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS. Senza contenuti in `content/case-studies/`, `generateStaticParams` torna un array vuoto e non viene generata nessuna pagina: è corretto. Verificare anche che un articolo del blog renda ancora la sua CTA di chiusura, dato che `ArticleCta` è stata riscritta.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/projects/[slug]" src/components/content-cta.tsx "src/app/[locale]/blog/components/article-cta.tsx" src/translations/it/projects.json src/translations/en/projects.json
git commit -m "$(cat <<'EOF'
feat(case-studies): dai al racconto lungo una pagina invece di una card

Nella card non ci sta perche' mi hanno chiamato, cosa ho posseduto e cosa
ho lasciato. dynamicParams=false tiene la superficie chiusa a cio' che il
build ha visto, e lo slug condiviso fra le lingue rende gli hreflang due
righe invece di una risoluzione.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 12: Sitemap, link dalla card, llms.txt

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/[locale]/projects/sections/projects-section.tsx`
- Modify: `src/app/[locale]/projects/page.tsx`
- Modify: `src/app/llms.txt/route.ts`

- [ ] **Step 1: Sitemap**

In `src/app/sitemap.ts`, dopo il blocco che costruisce `articleRoutes`:

```ts
  const caseStudyRoutes: SitemapRoute[] = getCaseStudies(
    routing.defaultLocale as AppLocale
  ).map((caseStudy) => {
    const { updatedAt, publishedAt } = caseStudy.frontmatter;

    return {
      pathByLocale: samePath(`/projects/${caseStudy.slug}`),
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: new Date(`${updatedAt ?? publishedAt}T00:00:00Z`),
    };
  });
```

Import: `import { getCaseStudies } from "@/libs/case-studies/source";`
E nel `return`: `[...staticRoutes, ...caseStudyRoutes, ...articleRoutes]`.

Lo slug è condiviso, quindi `samePath` basta: nessun `getTranslatedSlug` come per gli articoli.

- [ ] **Step 2: Passare lo slug alla card**

In `projects-section.tsx`, importare `getCaseStudyForProject`, ricavare il locale con `getLocale()` di `next-intl/server`, e passarlo:

```tsx
import { getCaseStudyForProject } from "@/libs/case-studies/source";
import { getLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/libs/i18n/utils";
```

Dentro il componente, prima del `return`:

```tsx
  const locale = (await getLocale()) as AppLocale;
```

E nella `map`:

```tsx
                    <ProjectCard
                      project={project}
                      caseStudySlug={
                        getCaseStudyForProject(locale, project.id)?.slug ?? null
                      }
                    />
```

- [ ] **Step 3: Far puntare l'`ItemList` al case study quando esiste**

In `page.tsx`, nella `map` di `items`:

```tsx
      url:
        getCaseStudyForProject(locale as AppLocale, project.id)
          ? `${pageUrl}/${getCaseStudyForProject(locale as AppLocale, project.id)!.slug}`
          : (project.websiteUrl ?? project.githubUrl ?? project.designUrl ?? pageUrl),
```

Estrarre la chiamata in una const dentro la `map` per non ripeterla tre volte:

```tsx
    items: PROJECTS.map((project) => {
      const caseStudy = getCaseStudyForProject(locale as AppLocale, project.id);

      return {
        name: tItems(`projects.items.${project.id}.name` as never),
        description: tItems(`projects.items.${project.id}.contribution` as never),
        url: caseStudy
          ? `${pageUrl}/${caseStudy.slug}`
          : (project.websiteUrl ?? project.githubUrl ?? project.designUrl ?? pageUrl),
        image: `${siteUrl}${project.image}`,
      };
    }),
```

- [ ] **Step 4: `llms.txt`**

La sezione `## Selected Projects & Clients` oggi contiene due voci che il nuovo copy smentisce: Ravenn è descritta come *"End-to-end development"* e Brainplatform come *"Short-term collaboration on digital product initiatives"*, che sottovende un rework legacy con mentoring. Riallineare le voci al `contribution` inglese scritto al Task 2, e aggiungere in fondo alla sezione i link ai case study pubblicati.

Rendere il file dinamico rispetto ai case study: `LLMS_TXT` è oggi una costante template. Trasformarla in una funzione chiamata dentro `GET()`, e interpolare:

```ts
function caseStudyLinks(): string {
  const entries = getCaseStudies("en");

  if (entries.length === 0) {
    return "";
  }

  return `\n\nIn-depth case studies:\n\n${entries
    .map(
      (entry) =>
        `- [${entry.frontmatter.title}](${SITE_URL}/en/projects/${entry.slug}) — ${entry.frontmatter.summary}`
    )
    .join("\n")}`;
}
```

Il briefing non elenca gli articoli di proposito, perché crescono senza limite. I case study sono un insieme chiuso sotto la decina e sono letteralmente *cosa fa* Andrea, che è lo scopo dichiarato del documento.

- [ ] **Step 5: Build e verifica**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts "src/app/[locale]/projects" src/app/llms.txt/route.ts
git commit -m "$(cat <<'EOF'
feat(case-studies): rendi i case study raggiungibili da card, sitemap e briefing

Una pagina che esiste solo se ne conosci l'URL non serve a niente. E
llms.txt descriveva Brainplatform come "short-term collaboration", che
sottovende un rework legacy con mentoring: le voci si riallineano al copy
delle card.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 13: Il primo case study — Quido

**Files:**
- Create: `content/case-studies/it/quido.mdx`
- Create: `content/case-studies/en/quido.mdx`
- Create: `public/images/case-studies/quido/cover.webp`

**Interfaces:**
- Consumes: tutto il sottosistema dei Task 8-12.

> **Nota per chi esegue:** questo è un contenuto, non codice. Va scritto con Andrea, non al posto suo: le quattro battute sono la struttura, i fatti li porta lui. Quanto segue è lo scheletro da riempire, con dentro il materiale che ha già raccontato durante il design.

- [ ] **Step 1: Preparare la cover**

Una schermata reale del lavoro, 1200×630, in `public/images/case-studies/quido/cover.webp`. Se nessuna schermata è pubblicabile, usare una composizione neutra col logo: la regola della spec è che la prova sta nel testo, e una cover non pubblicabile non blocca il case study.

- [ ] **Step 2: Scrivere `content/case-studies/it/quido.mdx`**

```mdx
---
project: quido
title: Da consulente a forward deployed engineer
summary: >-
  Rifatta da zero la UI/UX di una piattaforma AI per il private equity, e poi
  rimasto dentro come forward deployed engineer.
period: "2024 — oggi"
publishedAt: 2026-09-02
cover: /images/case-studies/quido/cover.webp
coverAlt: <descrizione della schermata>
draft: false
---

## Perché mi hanno chiamato

<La situazione prima: che prodotto avevano, cosa non funzionava
nell'interfaccia, perché serviva qualcuno da fuori.>

## Cosa ho posseduto

<Il perimetro, esplicito. UI/UX della piattaforma su Figma, frontend
Next.js, app Expo. Cosa era mio e cosa no — questa sezione è quella che
impedisce di leggere il lavoro come "un dipendente in più".>

## Cosa ho fatto e perché così

<Le decisioni, col ragionamento. Come hai deciso cosa era primario e cosa
secondario, e come l'hai distribuito nel prodotto. Le feature ad alto
impatto e perché quelle. Non un elenco: il criterio.>

## Come è diventato un ruolo diverso

<L'arco verso l'FDE: ottimizzare il lavoro del team, rendere lo sviluppo
agentico più preciso, costruire tool ad hoc, ragionare insieme sulle
soluzioni. È il pezzo che il sito dichiara nel titolo e non ha mai
dimostrato.>

## Cosa è cambiato

<Esito, senza numeri che non puoi pubblicare. Cosa fa il team oggi che
prima non poteva fare.>
```

Rispettare la fascia 120–170 caratteri per `summary`, altrimenti il build fallisce con un messaggio che nomina il file.

- [ ] **Step 3: Scrivere la versione inglese**

Stesso slug (`en/quido.mdx`), stessa struttura, stesso `project`. Non una traduzione letterale: stesso contenuto, inglese naturale.

- [ ] **Step 4: Verificare le guardie**

Run: `npm run build`
Expected: PASS, con `/it/projects/quido` e `/en/projects/quido` fra le pagine generate.

Poi provare i tre fallimenti previsti, uno alla volta, ripristinando ogni volta:
1. cambiare `project:` in `progetto-inesistente` → build fallisce nominando il file
2. rinominare temporaneamente `en/quido.mdx` → build fallisce con `manca in "en"`
3. duplicare il file come `quido-bis.mdx` in entrambe le lingue con lo stesso `project` → build fallisce con `piu di un case study`

- [ ] **Step 5: Verifica manuale**

In dev, su `/it/projects`: la card di Quido mostra il primario "Leggi il case study". Cliccarlo porta a `/it/projects/quido`. Il language switcher porta a `/en/projects/quido`. Uno slug inventato dà 404.

Copiare il JSON-LD dal sorgente della pagina e passarlo al [Rich Results Test](https://search.google.com/test/rich-results): `BreadcrumbList` e `CreativeWork` senza errori.

- [ ] **Step 6: Commit**

```bash
git add content/case-studies public/images/case-studies
git commit -m "$(cat <<'EOF'
feat(case-studies): racconta Quido, dal redesign al ruolo di FDE

Il sito si intitola "Senior Software Engineer & FDE" da sempre e non ha mai
mostrato cosa voglia dire. Questo e' il progetto in cui il ruolo e' nato
davvero, quindi e' il primo a meritare la pagina.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Task 14: Il secondo case study e la documentazione

**Files:**
- Create: `content/case-studies/{it,en}/studio-bargiggia.mdx`
- Create: `public/images/case-studies/studio-bargiggia/cover.webp`
- Modify: `.claude/rules/architecture.md`
- Modify: `.claude/rules/seo.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Scrivere il case study di Studio Bargiggia**

```mdx
---
project: studioBargiggia
title: Un sito che il cliente aggiorna da solo
summary: >-
  Dalla call di discovery al passaggio di consegne: analisi, due proposte di
  design, Next.js e Strapi. Oggi il sito lo aggiornano loro.
period: "2023"
publishedAt: 2026-09-02
cover: /images/case-studies/studio-bargiggia/cover.webp
coverAlt: <descrizione della schermata>
draft: false
---

## Perché mi hanno chiamato

<Il vecchio sito non dava nessun valore aggiunto. Cosa è emerso dalla call
di discovery, quali bisogni hai annotato.>

## Cosa ho posseduto

<Tutto: analisi, design, sviluppo, contenuti, consegna. Dirlo esplicitamente
qui è ciò che distingue questo progetto dagli altri della pagina.>

## Cosa ho fatto e perché così

<L'analisi di stack e palette, col giallo Milano imposto come constraint dal
cliente — cioè un design token deciso prima di aprire Figma. Le due proposte
di design fra cui far scegliere, e perché due e non una. Next.js con Strapi
on-premise, Leaflet per le mappe, reCAPTCHA sulla contact form: ogni scelta
col motivo.>

## Cosa è cambiato e cosa ho lasciato

<Lo staging per il collaudo. Il data entry migrato a mano dal vecchio sito,
con foto senza copyright che il cliente può sostituire. E il punto di
arrivo: oggi lo aggiornano da soli col CMS, senza richiamarti.>
```

Il materiale c'è già ed è l'arco più completo della lista. È anche l'unico case study a rischio NDA nullo, e chiude sull'autonomia del cliente — l'argomento più forte contro la paura di restare legati a un freelance. Per questo è il secondo e non il quinto: dimostra un raggio diverso da Quido.

Versione inglese in `content/case-studies/en/studio-bargiggia.mdx`, stesso slug e stesso `project`.

- [ ] **Step 2: Documentare il sottosistema in `.claude/rules/architecture.md`**

Aggiungere sotto la sezione `## Projects` creata al Task 7:

```markdown
### Case studies

Six of the seven client projects carry a long-form case study under
`content/case-studies/{it,en}/<slug>.mdx`, served at
`/{locale}/projects/[slug]`. They are additive: a project without one stays
the card it already was, so the page is never waiting to be filled.

The slug is the same in both locales — unlike blog articles, whose identity
is a title that translates. A case study's identity is the client, which does
not, so the filename is the key, the twin check replaces `translationKey`,
and the sitemap uses `samePath` with no per-locale resolution.

Frontmatter carries only what belongs to the case study (`title`, `summary`,
`period`, dates, cover). Roles, stack and the short contribution line stay in
`PROJECTS` and `projects.json`, because projects without a case study need
them too: the card reads them there and the case-study header reads the same
source, so the two cannot drift.

`src/libs/case-studies/` deliberately imports nothing from `src/libs/blog/`.
The two have opposite constraints — a handful of case studies that never
paginate against an archive that does — and the blog moves as it grows.
Duplicating a small pattern costs less than coupling two subsystems on
different trajectories. Extract only if a third content type shows up.

Three build-time guards in `assertConsistency`: a published case study needs
its twin in the other locale, `project:` must resolve to an id in `PROJECTS`,
and no project may carry two case studies.

Covers are real screenshots, so they go straight into `openGraph.images` —
none of the satori rasterisation the blog needs for its SVG covers.
```

- [ ] **Step 3: Documentare la parte SEO in `.claude/rules/seo.md`**

Aggiungere una sezione numerata dopo quella del Markdown puro:

```markdown
### 11. Case Study Structured Data

**What it does**: Each case study page emits `BreadcrumbList` + `CreativeWork`.

**Implementation**:

- Helper: `generateCaseStudySchema` in `src/utils/seo-schema.ts`.
- `CreativeWork`, not `Article`: a case study is delivered work, not a
  journalistic piece, and `BlogPosting` belongs to the blog.
- `author` is inlined with name and url — the same lesson as `BlogPosting`:
  crawlers evaluate each page on its own, so an `@id` pointing at a node
  declared on another page resolves to nothing.
- The client sits in `about` as an `Organization`.
- Sitemap: one URL pair per case study, `lastModified` from frontmatter.
- `/projects`' `ItemList` points at the case study when one exists, and now
  carries the contribution text rather than the client's own description.

**How to test**: open a case study, copy the JSON-LD block, and check it on
the Rich Results Test. Confirm `@type` includes `BreadcrumbList` and
`CreativeWork`.
```

- [ ] **Step 4: Aggiungere la riga alla mappa di orientamento in `CLAUDE.md`**

Nella tabella "Quick orientation map":

```markdown
| Scrivere un case study      | `content/case-studies/{it,en}/` — coppia MDX con lo stesso slug, `project:` deve esistere in `PROJECTS` |
```

- [ ] **Step 5: Verifica finale completa**

Run: `npx tsc --noEmit && npm run lint && npx vitest run && npm run build`
Expected: tutto PASS.

Controllare la sitemap generata:

```bash
npm start &
sleep 5
curl -s http://localhost:3000/sitemap.xml | grep "projects/"
curl -s http://localhost:3000/llms.txt | grep -A5 "In-depth case studies"
```
Expected: quattro URL di case study (due slug × due lingue) più `/it/projects` e `/en/projects`; il briefing elenca i due case study.

- [ ] **Step 6: Commit**

```bash
git add content/case-studies public/images/case-studies .claude/rules/architecture.md .claude/rules/seo.md CLAUDE.md
git commit -m "$(cat <<'EOF'
feat(case-studies): racconta Studio Bargiggia e documenta il sottosistema

Il secondo pezzo scelto per contrasto: rischio NDA nullo, arco completo
dalla discovery all'handover, e chiude con il cliente che se lo gestisce da
solo — l'argomento piu' forte contro la paura di restare legati a un
freelance.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018fX71PgUTWg9sKjvnnKk2c
EOF
)"
```

---

## Verifica di fine piano

- [ ] `npx tsc --noEmit` pulito
- [ ] `npm run lint` pulito
- [ ] `npx vitest run` verde, 13 test nuovi in `src/libs/case-studies/`
- [ ] `npm run build` completo, con quattro pagine di case study generate
- [ ] `/it/projects` e `/en/projects`: tre blocchi, card a riga intera, filtro su ruoli e stack funzionante, URL che sopravvive al ricaricamento
- [ ] Nessuna traccia di `projects.items.andreaLosavio` nel codice; il link al sito vecchio vive solo nel footer
- [ ] I due file `projects.json` hanno la stessa forma (script dello Step 3 del Task 2)
- [ ] Rich Results Test pulito su una pagina di case study e su `/it/projects`
- [ ] Il copy dei Task 2, 13 e 14 è stato riletto e approvato da Andrea
