export interface Project {
  id: string;
  logo: string | null;
  image: string;
  tags: readonly string[];
  websiteUrl?: string | null;
  githubUrl?: string | null;
  designUrl?: string | null;
}

export const PROJECTS: Project[] = [
  {
    id: "othersideTechnology",
    logo: "/images/clients/otherside-technology.svg",
    image: "/images/projects/otherside-technology.webp",
    tags: ["customer", "nextjs", "react"],
    websiteUrl: "https://www.othersidetechnology.com",
  },
  {
    id: "coolifyManager",
    logo: "/images/clients/coolify-manager.svg",
    image: "/images/projects/coolify-manager.webp",
    tags: ["personal", "design", "javascript", "extension"],
    githubUrl: "https://github.com/ontech7/coolify-manager-extension",
  },
  {
    id: "quido",
    logo: "/images/clients/quido.svg",
    image: "/images/projects/quido.webp",
    tags: ["customer", "design", "nextjs", "react"],
    websiteUrl: "https://quido.ai",
  },
  {
    id: "forfettarioControl",
    logo: "/images/clients/forfettario-control.svg",
    image: "/images/projects/forfettario-control.webp",
    tags: ["mobile", "personal", "design", "mvp"],
    designUrl: "https://www.behance.net/gallery/209115303/Forfettario-Control",
  },
  {
    id: "fastmemo",
    logo: "/images/clients/fastmemo.svg",
    image: "/images/projects/fastmemo_v2.webp",
    tags: ["mobile", "personal", "design", "react-native", "expo-sdk", "tauri"],
    websiteUrl: "https://fastmemo.vercel.app",
  },
  {
    id: "anonymous",
    logo: null,
    image: "/images/projects/anonymous_tabacconists.webp",
    tags: ["customer", "nextjs", "react", "prisma", "postgresql"],
  },
  {
    id: "ravenn",
    logo: "/images/clients/ravenn.svg",
    image: "/images/projects/ravenn.webp",
    tags: ["customer", "nextjs", "react", "prisma", "postgresql"],
    websiteUrl: "https://ravenn.io",
  },
  {
    id: "recrowd",
    logo: "/images/clients/recrowd.svg",
    image: "/images/projects/recrowd.webp",
    tags: ["customer", "nextjs", "react", "nodejs", "prisma", "postgresql"],
    websiteUrl: "https://recrowd.com",
  },
  {
    id: "andreaLosavio",
    logo: "/images/clients/old-andrea-losavio.svg",
    image: "/images/projects/old-andrea-losavio.webp",
    tags: ["personal", "nextjs", "react"],
    websiteUrl: "https://old.andrealosavio.com",
  },
  {
    id: "brainplatform",
    logo: "/images/clients/brainplatform.svg",
    image: "/images/projects/brainplatform.webp",
    tags: ["customer", "react", "nextjs"],
    websiteUrl: "https://brainplatform.it",
  },
  {
    id: "studioBargiggia",
    logo: "/images/clients/studio-bargiggia.svg",
    image: "/images/projects/studiobargiggia.webp",
    tags: ["customer", "design", "react", "nextjs", "strapi"],
    websiteUrl: "https://studiobargiggia.com",
  },
];
