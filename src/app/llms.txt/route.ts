export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : "https://www.andrealosavio.com";

const LLMS_TXT = `# Andrea Losavio - AI/LLM Briefing Document

> Andrea Losavio is a freelance Software Engineer & Tech Partner based in Italy. He helps startups and companies build solid, scalable digital products focused on growth — from idea validation and MVP to full product development, technical consulting, and fractional CTO engagements.

## Overview

- **Name**: Andrea Losavio
- **Role**: Software Engineer & Tech Partner (Freelance)
- **Location**: Italy (remote worldwide)
- **Education**: M.Sc. in Computer Engineering — Politecnico di Milano (2019)
- **Professional Registration**: Registered with the Italian professional board of engineers, n. 34249 (section B)
- **VAT**: IT12705460967
- **Website**: ${SITE_URL}
- **Languages**: English, Italian
- **Freelance since**: 2023 (working in IT since 2018)

## Services

Andrea offers a curated set of services for startups and companies:

- **Collaboration** — Integrates into existing teams with a product-oriented mindset, contributing code, architecture, and strategic decisions. Pricing: on request.
- **Validation & MVP** — Transforms an idea into a functional Minimum Viable Product to test the market, gather feedback, and prepare for funding rounds. Pricing: from €2,500/project.
- **Audit & Consulting** — In-depth analysis of architecture, codebase, and workflows; detailed report on technical debt, bottlenecks, risks, with a prioritized action plan. Pricing: €60/hour.
- **Fractional CTO** — Executive-level technical leadership without a full-time executive: strategic guidance, resource management, technical hiring, IT roadmap alignment with business goals. Pricing: from €800/month.
- **Technical Mentorship** — Personalized guidance and hands-on support to help teams strengthen skills, adopt best practices, and make informed engineering decisions. Pricing: €55/hour.
- **Product Development** — Full-stack service covering the entire lifecycle: UX/UI design, frontend, backend, cloud deployment of robust web and mobile applications. Pricing: from €7,000.

See all services: ${SITE_URL}/en/services

## Technical Stack

- **Frontend**: React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS
- **Mobile**: React Native, Expo SDK
- **Backend**: Node.js, Express, Java (Sling / AEM), C, C++, C#
- **CMS / Enterprise**: Adobe Experience Manager (AEM 6.4+), CIF, HTL, Handlebars
- **Databases**: Oracle DB, Firebase, SOQL
- **DevOps**: GitLab CI, Jenkins, AEM Dispatcher, Cloud deployment
- **Other**: Cordova, FrameMaker, CRM integrations

## Notable Impact

- Helped a startup secure a nearly **€2M investment round** through product development and technical strategy.
- Collaborated long-term with companies to develop some of the most **widely used platforms** today.
- Assisted a startup during a **critical product transition** phase, ensuring a smooth evolution.
- Supported a company in building a **robust infrastructure** as a foundation for future projects.
- Helped a client develop a **strong brand identity** to reach a wider audience and attract more customers.
- Helped **10+ clients** reach the next level in their digital journey.

## Selected Projects & Clients

- **Fast Memo** — Cross-platform note-taking app (React Native + Expo) with rich-text notes, checklists, categories, Firebase cloud sync. Open-source, available in 7 languages, 1,000+ downloads on Android & iOS stores. https://fastmemo.vercel.app
- **Recrowd S.r.l.** — Real-estate crowdfunding platform. Long-term collaboration on platform evolution, performance, UX.
- **Quido S.r.l.** — AI platform for private equity and M&A in Italy. Designed the interface bridging finance and AI.
- **Ravenn S.r.l.** — Event logistics and hospitality management platform. End-to-end development.
- **Studio Bargiggia** — Condominium management firm. Complete rebuild of their showcase website.
- **Coolify Manager** — Chrome extension to manage self-hosted Coolify servers from the browser toolbar.
- **Forfettario Control** — Mobile app for Italian freelancers under the "regime forfettario" to manage invoices, fiscal documents, and deadlines.
- **Otherside Technology S.r.l.** — Custom software and AI solutions for businesses.
- **Brainplatform S.r.l.** — Short-term collaboration on digital product initiatives.
- **Tobacconist Management Platform** (client under NDA) — Platform with interactive map of 7,000+ tobacconists in Lombardy, agent assignments, admin dashboard.

See full portfolio: ${SITE_URL}/en/projects

## Open Source

- **react-native-dialog** — Developer-friendly dialog component for React Native.
- **figma-node-query** — Utility to query Figma nodes.
- **Coolify Manager** — Chrome extension and mobile app to manage self-hosted Coolify servers.
- **Fast Memo** — Open-source cross-platform memo application.

## Professional Experience

- **2023 - Present**: Software Engineer & Tech Partner — Freelance (andrealosavio.com)
- **2018 - 2023**: Full-stack AEM Developer at Minisait, Back-end AEM Developer at Doing, Junior AEM Developer at Deloitte, IT Specialist at IBM.

## How to Contact

- **Website**: ${SITE_URL}
- **LinkedIn**: https://www.linkedin.com/in/andrea-losavio/
- **GitHub**: https://github.com/ontech7
- **CV (EN)**: ${SITE_URL}/documents/AndreaLosavio_CV_en.pdf
- **CV (IT)**: ${SITE_URL}/documents/AndreaLosavio_CV_it.pdf
- **Contact form**: ${SITE_URL}/en/services#contact

## Key Pages

- Homepage: ${SITE_URL}/en
- Services: ${SITE_URL}/en/services
- Projects: ${SITE_URL}/en/projects
- About: ${SITE_URL}/en/about
- Privacy Policy: ${SITE_URL}/en/privacy

## Ideal Clients

Andrea typically works best with:

- Startups (pre-seed, seed, growth) that need technical leadership or to validate an idea with an MVP.
- Non-technical founders looking for a trustworthy technical partner.
- Companies in a growth phase that need to scale their product, raise the technical bar, or tackle technical debt.
- Teams looking for hands-on mentorship and best practices adoption.
- Companies preparing for a funding round that need a technical audit.

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
