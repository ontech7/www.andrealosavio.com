import { SERVICES, type ServiceId } from "@/constants/services";
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
  const price = SERVICES.find((service) => service.id === id)?.price;

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

- **Collaboration** — Integrates into existing teams with a product-oriented mindset, contributing code, architecture, and strategic decisions. Pricing: ${priceOf("collaboration")}.
- **Validation & MVP** — Transforms an idea into a functional Minimum Viable Product to test the market, gather feedback, and prepare for funding rounds. Pricing: ${priceOf("validationMvp")}.
- **FDE Discovery & Audit** — Forward-deployed engineering: bridges complex software and AI technologies with real-world business needs, working directly alongside the team to design, build, and deploy custom full-stack solutions and AI integrations for rapid value delivery and seamless adoption. Pricing: ${priceOf("fdeDiscoveryAudit")}.
- **Fractional CTO** — Executive-level technical leadership without a full-time executive: strategic guidance, resource management, technical hiring, IT roadmap alignment with business goals. Pricing: ${priceOf("fractionalCto")}.
- **Technical Mentorship** — Personalized guidance and hands-on support to help teams strengthen skills, adopt best practices, and make informed engineering decisions. Pricing: ${priceOf("technicalMentorship")}.
- **Product Development** — Full-stack service covering the entire lifecycle: UX/UI design, frontend, backend, cloud deployment of robust web and mobile applications. Pricing: ${priceOf("productDevelopment")}.

- [All services](${SITE_URL}/en/services)

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

- Helped a startup secure a nearly **€2M investment round** through product development and technical strategy.
- Collaborated long-term with companies to develop some of the most **widely used platforms** today.
- Assisted a startup during a **critical product transition** phase, ensuring a smooth evolution.
- Supported a company in building a **robust infrastructure** as a foundation for future projects.
- Helped a client develop a **strong brand identity** to reach a wider audience and attract more customers.

## Selected Projects & Clients

- **Fast Memo** — Cross-platform note-taking app (React Native + Expo) with rich-text notes, checklists, categories, Firebase cloud sync. Open-source, available in 7 languages, 1,000+ downloads on Android & iOS stores. https://fastmemo.vercel.app
- **Recrowd S.r.l.** — Real-estate crowdfunding platform. Long-term collaboration on platform evolution, performance, UX.
- **Quido S.r.l.** — AI platform for private equity and M&A in Italy. Designed the interface bridging finance and AI.
- **Ravenn S.r.l.** — Event logistics and hospitality management platform. End-to-end development.
- **Studio Bargiggia** — Condominium management firm. Complete rebuild of their showcase website.
- **Coolify Manager** — Chrome extension and Android app to manage self-hosted Coolify servers. Available on Google Play Store (https://play.google.com/store/apps/details?id=com.ontech7.coolifyManager&hl=it) and Chrome Web Store (https://chromewebstore.google.com/detail/coolify-manager/dmcclgoafojpjaflnggcnmhbenplnmpi).
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
- [Contact form](${SITE_URL}/en/services#contactForm)

## Key Pages

- [Homepage](${SITE_URL}/en): overview, impact highlights and client feedback
- [Services](${SITE_URL}/en/services): the six service offerings, with pricing and contact form
- [Projects](${SITE_URL}/en/projects): client work and personal products
- [About](${SITE_URL}/en/about): background, experience and skills
- [How I build](${SITE_URL}/en/best-practices): engineering standards, with measurements for this site
- [Privacy Policy](${SITE_URL}/en/privacy): data handling for the contact form

## Ideal Clients

Andrea typically works best with:

- Startups (pre-seed, seed, growth) that need technical leadership or to validate an idea with an MVP.
- Non-technical founders looking for a trustworthy technical partner.
- Companies in a growth phase that need to scale their product, raise the technical bar, or tackle technical debt.
- Teams looking for hands-on mentorship and best practices adoption.
- Companies preparing for a funding round that need an FDE discovery & audit.

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
