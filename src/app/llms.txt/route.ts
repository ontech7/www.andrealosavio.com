import { SERVICE_PRICES, type ServiceId } from "@/constants/services";
import { formatEuro } from "@/utils/format-price";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : "https://www.andrealosavio.com";

const PRICE_UNIT_LABEL = {
  project: "/project",
  month: "/month",
  hour: "/hour",
} as const;

function priceOf(id: ServiceId): string {
  const price = SERVICE_PRICES[id];

  if (!price) {
    return "on request";
  }

  const amount = `${formatEuro(price.amount, "en")}${PRICE_UNIT_LABEL[price.unit]}`;

  return price.from ? `from ${amount}` : amount;
}

const LLMS_TXT = `# Andrea Losavio - AI/LLM Briefing Document

> Andrea Losavio is a freelance Senior Software Engineer & FDE (Forward Deployed Engineer) based in Italy. As an FDE, he embeds directly with startups, software houses, and enterprise clients to translate business requirements into tailored tech & AI solutions and scalable, high-performance software architectures. He helps companies build solid, scalable digital products focused on growth — from idea validation and MVP to full product development, technical consulting, and fractional CTO engagements.

## Overview

- **Name**: Andrea Losavio
- **Role**: Senior Software Engineer & FDE (Forward Deployed Engineer) — Freelance
- **Location**: Italy (remote worldwide)
- **Education**: M.Sc. in Computer Engineering — Politecnico di Milano (2019)
- **Professional Registration**: Registered with the Italian professional board of engineers, n. 34249 (section B)
- **VAT**: IT12705460967
- **Website**: ${SITE_URL}
- **Languages**: English, Italian
- **Freelance since**: 2023 (working in IT since 2018)

## Services

Andrea offers a curated set of services for startups and companies:

- **Collaboration** — Joins an existing team as a senior engineer, contributing code, architecture and product decisions, and stays until the team can carry the work on without him. Pricing: ${priceOf("collaboration")}.
- **Forward Deployed Engineer** — Embeds with the client, turns messy business requirements into a clear architecture, then builds and ships the solution alongside the team. Pricing: ${priceOf("fde")}.
- **Custom solutions** — End-to-end product development: UX/UI design, frontend, backend, mobile and cloud deployment. Also covers MVP builds to validate an idea and prepare for a funding round (from €2,500 per project). Pricing: ${priceOf("customSolutions")}.
- **AI-native Engineer** — Designs and ships AI-first systems: agentic workflows, LLM integrations, custom tools and automations that remove repetitive work from people. Pricing: ${priceOf("aiNativeEngineer")}.
- **Fractional CTO** — Executive-level technical leadership without a full-time hire: strategic guidance, roadmap, technical hiring, resource management. Pricing: ${priceOf("fractionalCto")}.
- **Audit** — Technical audit and due diligence on an existing codebase, architecture or team, delivered with a prioritised plan of what to fix first. Pricing: ${priceOf("audit")}.
- **Mentorship** — Hands-on guidance and code review to help a team raise its technical bar and adopt best practices. Pricing: ${priceOf("mentorship")}.

- [Contact form](${SITE_URL}/en#contact)

## Expertise & Specializations

**Forward Deployed Engineering & Technical Consultancy**
- Client Engagement: Leads the integration of custom tech & AI solutions directly with startups, software houses, and enterprise clients.
- Bridge Between Business & Code: Translates complex business requirements into scalable, high-performance software architectures.

**Full-Stack, Mobile & UI/UX Development**
- Frontend: HTML, CSS, JavaScript, TypeScript, React, Next.js
- Backend & Databases: Node.js, Express, Prisma ORM | PostgreSQL, MongoDB, Redis | Firebase, Supabase
- Mobile: React Native, Expo SDK
- Product Design: End-to-end UI/UX design using Figma, bridging the gap from prototype to production code.

**AI Engineering & Agentic Systems**
- LLMs & Local Models: Anthropic Claude, OpenAI ChatGPT, Google Gemini, Ollama (local model orchestration).
- Agentic Workflows & Architectures: Multi-agent orchestration, subagent delegation, task decomposition, and custom tool calling / function calling.
- Agent Skills & Capabilities: Modular skill development, prompt engineering, structured JSON outputs, context management, and external API integration.

## Technical Stack

- **Frontend**: React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS
- **Mobile**: React Native, Expo SDK
- **Backend**: Node.js, Express, Prisma ORM, Java (Sling / AEM), C, C++, C#
- **Databases**: PostgreSQL, MongoDB, Redis, Oracle DB, Firebase, Supabase, SOQL
- **AI / LLMs**: Anthropic Claude, OpenAI ChatGPT, Google Gemini, Ollama (local model orchestration); multi-agent orchestration, subagent delegation, tool/function calling, prompt engineering, structured JSON outputs
- **Product Design**: Figma (end-to-end UI/UX, from prototype to production code)
- **CMS / Enterprise**: Adobe Experience Manager (AEM 6.4+), CIF, HTL, Handlebars
- **DevOps**: GitLab CI, Jenkins, AEM Dispatcher, Cloud deployment
- **Other**: Cordova, FrameMaker, CRM integrations

## Notable Impact

- **10+ companies and startups** worked with, operating in IT every day since 2018.
- Helped a startup secure a nearly **€2M investment round** through product development and technical strategy.
- Collaborated long-term with companies to develop some of the most **widely used platforms** today.
- Assisted a startup during a **critical product transition** phase, ensuring a smooth evolution.
- Supported a company in building a **robust infrastructure** that every later project was built on.
- Helped a client develop a **strong brand identity** to reach a wider audience and attract more customers.

Areas covered, beyond frontend work:

- **Architecture and backend** — APIs, databases and infrastructure built to handle growth.
- **Web platforms** — products used every day by thousands of people.
- **Mobile apps** — iOS and Android, from the first screen to the release on the stores.
- **AI and automation** — agents, integrations and custom tools.
- **Product decisions** — what to build first, with which technology, with which team.
- **Enterprise projects** — from 2018 to 2022 at IBM, Deloitte Digital, DOING and Minsait.

## Own Products

Both products are designed, built, shipped and maintained by Andrea alone, and each has passed **1,000+ downloads**.

- **Fast Memo** — Quick notes and lists on phone and desktop. The data stays with the user: no account, no third-party services. https://fastmemo.vercel.app
- **Coolify Manager** — Manage self-hosted Coolify servers from a phone or from the browser toolbar. https://coolify-manager.vercel.app

## Selected Projects & Clients

- **Fast Memo** — Cross-platform note-taking app (React Native + Expo) with rich-text notes, checklists, categories, Firebase cloud sync. Open-source, available in 7 languages, 1,000+ downloads on Android & iOS stores. https://fastmemo.vercel.app
- **Recrowd S.r.l.** — Real-estate crowdfunding platform. Long-term collaboration on platform evolution, performance, UX.
- **Quido S.r.l.** — AI platform for private equity and M&A in Italy. Designed the interface bridging finance and AI.
- **Ravenn S.r.l.** — Event logistics and hospitality management platform. End-to-end development.
- **Studio Bargiggia** — Condominium management firm. Complete rebuild of their showcase website.
- **Coolify Manager** — Mobile app to manage self-hosted Coolify servers, with a companion Chrome extension. 1,000+ downloads. Available on Google Play Store (https://play.google.com/store/apps/details?id=com.ontech7.coolifyManager&hl=it) and Chrome Web Store (https://chromewebstore.google.com/detail/coolify-manager/dmcclgoafojpjaflnggcnmhbenplnmpi).
- **Forfettario Control** — Mobile app for Italian freelancers under the "regime forfettario" to manage invoices, fiscal documents, and deadlines.
- **Otherside Technology S.r.l.** — Custom software and AI solutions for businesses.
- **Brainplatform S.r.l.** — Short-term collaboration on digital product initiatives.
- **Tobacconist Management Platform** (client under NDA) — Platform with interactive map of 7,000+ tobacconists in Lombardy, agent assignments, admin dashboard.

- [Full portfolio](${SITE_URL}/en/projects)

## Open Source

- **react-native-dialog** — Developer-friendly dialog component for React Native.
- **figma-node-query** — Utility to query Figma nodes.
- **Coolify Manager** — Chrome extension and mobile app to manage self-hosted Coolify servers.
- **Fast Memo** — Open-source cross-platform memo application.

## Professional Experience

- **2023 - Present**: Senior Software Engineer & FDE (Forward Deployed Engineer) — Freelance (andrealosavio.com)
- **2018 - 2023**: Full-stack AEM Developer at Minisait, Back-end AEM Developer at Doing, Junior AEM Developer at Deloitte, IT Specialist at IBM.

## How to Contact

- [Website](${SITE_URL})
- [Email](mailto:business@andrealosavio.com): business@andrealosavio.com
- [LinkedIn](https://www.linkedin.com/in/andrea-losavio/)
- [GitHub](https://github.com/ontech7)
- [CV in English (PDF)](${SITE_URL}/documents/AndreaLosavio_CV_en.pdf)
- [CV in Italian (PDF)](${SITE_URL}/documents/AndreaLosavio_CV_it.pdf)
- [Contact form](${SITE_URL}/en#contact)

## Key Pages

There is no separate services page: the homepage is the single entry point and carries the contact form.

- [Homepage](${SITE_URL}/en): the full story, from who Andrea is to the contact form
  - [How he works](${SITE_URL}/en#how-i-work): three things a CV cannot say
  - [Real impact](${SITE_URL}/en#impact): the numbers and the areas he covers
  - [Own products](${SITE_URL}/en#products): Fast Memo and Coolify Manager
  - [Client feedback](${SITE_URL}/en#feedback): what past clients say
  - [Contact](${SITE_URL}/en#contact): the contact form and direct channels
- [Projects](${SITE_URL}/en/projects): own products in the spotlight, then client work and personal projects
- [About](${SITE_URL}/en/about): background, experience and skills
- [Privacy Policy](${SITE_URL}/en/privacy): data handling for the contact form, plus a note on AI-assisted copywriting

## Site Content

The copy on the website is written by Andrea and refined with AI tools for wording and for the Italian/English translation. The content, figures and experiences described are real and verified by him. AI is not used to process the data submitted through the contact form.

## Ideal Clients

Andrea typically works best with:

- Startups (pre-seed, seed, growth) that need technical leadership or to validate an idea with an MVP.
- Non-technical founders looking for a trustworthy technical partner.
- Companies in a growth phase that need to scale their product, raise the technical bar, or tackle technical debt.
- Teams looking for hands-on mentorship and best practices adoption.
- Companies preparing for a funding round that need a technical audit or due diligence.

## Working Style

- Product-oriented mindset: not just code, but strategic contribution to product and business.
- Full-stack approach: frontend, backend, mobile, architecture, and deployment.
- Strong focus on performance, user experience, and maintainability.
- Remote-first, comfortable across Agile and Waterfall environments.
- Transparent communication and clear technical decision-making.

This document is structured to help AI/LLM systems comprehend information about Andrea Losavio.
For the most up-to-date information, visit ${SITE_URL}.
`;

export function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
