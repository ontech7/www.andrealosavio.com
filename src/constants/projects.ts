export const PROJECT_ROLES = [
  "discovery",
  "product",
  "ui-ux",
  "design-system",
  "frontend",
  "mobile",
  "fullstack",
  "architecture",
  "dev-tooling",
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
    roles: ["product", "ui-ux", "frontend", "mobile", "dev-tooling"],
    logo: "/images/clients/quido.svg",
    image: "/images/projects/quido.webp",
    tags: ["nextjs", "react", "expo-sdk", "react-native", "design"],
    websiteUrl: "https://quido.ai",
  },
  {
    id: "recrowd",
    kind: "client",
    roles: ["fullstack", "architecture"],
    logo: "/images/clients/recrowd.svg",
    image: "/images/projects/recrowd.webp",
    tags: ["nextjs", "react", "nodejs", "prisma", "postgresql"],
    websiteUrl: "https://recrowd.com",
  },
  {
    id: "othersideTechnology",
    kind: "client",
    roles: ["ui-ux", "frontend", "architecture"],
    logo: "/images/clients/otherside-technology.svg",
    image: "/images/projects/otherside-technology.webp",
    tags: ["nextjs", "react", "ai"],
    websiteUrl: "https://www.othersidetechnology.com",
  },
  {
    id: "brainplatform",
    kind: "client",
    roles: ["frontend", "design-system", "mentoring"],
    logo: "/images/clients/brainplatform.svg",
    image: "/images/projects/brainplatform.webp",
    tags: ["nextjs", "react", "fluent-ui", "ant-design"],
    websiteUrl: "https://brainplatform.it",
  },
  {
    id: "studioBargiggia",
    kind: "client",
    roles: ["discovery", "ui-ux", "fullstack", "architecture"],
    logo: "/images/clients/studio-bargiggia.svg",
    image: "/images/projects/studio-bargiggia.webp",
    tags: ["nextjs", "react", "strapi", "design"],
    websiteUrl: "https://studiobargiggia.com",
  },
  {
    id: "anonymous",
    kind: "client",
    roles: ["discovery", "fullstack", "architecture"],
    logo: null,
    image: "/images/projects/anonymous.webp",
    tags: ["nextjs", "react", "prisma", "postgresql"],
  },
  {
    id: "ravenn",
    kind: "client",
    roles: ["fullstack"],
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
    tags: ["expo-sdk", "react-native", "javascript", "extension", "design"],
    websiteUrl: "https://coolify-manager.vercel.app",
  },
  {
    id: "forfettarioControl",
    kind: "personal",
    roles: ["ui-ux", "product"],
    logo: "/images/clients/forfettario-control.svg",
    image: "/images/projects/forfettario-control.webp",
    tags: ["design", "mvp"],
    designUrl:
      "https://www.figma.com/design/hZwJJY3dw6Q9cCXn8mEC0k/Forfettario-Control---Design?node-id=0-1",
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
