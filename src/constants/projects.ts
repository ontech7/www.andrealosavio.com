export interface Project {
  id: string;
  logo: string | null;
  image: string;
  tags: readonly string[];
  website?: string | null;
  designUrl?: string | null;
}

export const PROJECTS: Project[] = [
  {
    id: "quido",
    logo: "/images/clients/quido.svg",
    image: "/images/projects/quido.png",
    tags: ["customer", "design", "nextjs", "react"],
    website: "https://quido.ai",
  },
  {
    id: "forfettarioControl",
    logo: "/images/clients/forfettario-control.svg",
    image: "/images/projects/forfettario-control.png",
    tags: ["mobile", "personal", "design", "mvp"],
    designUrl: "https://www.behance.net/gallery/209115303/Forfettario-Control",
  },
  {
    id: "fastmemo",
    logo: "/images/clients/fastmemo.svg",
    image: "/images/projects/fastmemo.png",
    tags: ["mobile", "personal", "design", "react-native", "expo-sdk"],
    website: "https://fastmemo.vercel.app",
  },
  {
    id: "anonymous",
    logo: null,
    image: "/images/projects/anonymous_tabacconists.png",
    tags: ["customer", "nextjs", "react", "prisma", "postgresql"],
  },
  {
    id: "ravenn",
    logo: "/images/clients/ravenn.svg",
    image: "/images/projects/ravenn.png",
    tags: ["customer", "nextjs", "react", "prisma", "postgresql"],
    website: "https://ravenn.io",
  },
  {
    id: "recrowd",
    logo: "/images/clients/recrowd.svg",
    image: "/images/projects/recrowd.png",
    tags: ["customer", "nextjs", "react", "nodejs", "prisma", "postgresql"],
    website: "https://recrowd.com",
  },
  {
    id: "brainplatform",
    logo: "/images/clients/brainplatform.svg",
    image: "/images/projects/brainplatform.png",
    tags: ["customer", "react", "nextjs"],
    website: "https://brainplatform.it",
  },
  {
    id: "studioBargiggia",
    logo: "/images/clients/studio-bargiggia.svg",
    image: "/images/projects/studiobargiggia.png",
    tags: ["customer", "design", "react", "nextjs", "strapi"],
    website: "https://studiobargiggia.com",
  },
];
