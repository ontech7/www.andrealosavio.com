export interface FeaturedProduct {
  id: string;
  logo: string;
  logoFullBleed: boolean;
  image: string;
  websiteUrl: string;
}

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "fastmemo",
    logo: "/images/clients/fastmemo_v3.svg",
    logoFullBleed: true,
    image: "/images/products/fastmemo.webp",
    websiteUrl:
      "https://fastmemo.vercel.app?utm_source=andrealosavio.com&utm_medium=referral",
  },
  {
    id: "coolifyManager",
    logo: "/images/clients/coolify-manager.svg",
    logoFullBleed: false,
    image: "/images/products/coolify-manager.webp",
    websiteUrl:
      "https://coolify-manager.vercel.app?utm_source=andrealosavio.com&utm_medium=referral",
  },
];

export interface OpenSourceRepo {
  id: string;
  owner: string;
  name: string;
  url: string;
}

export const OPEN_SOURCE_REPOS: OpenSourceRepo[] = [
  {
    id: "reactNativeDialog",
    owner: "ontech7",
    name: "react-native-dialog",
    url: "https://github.com/ontech7/react-native-dialog",
  },
  {
    id: "claudeOmniRc",
    owner: "ontech7",
    name: "claude-omni-rc",
    url: "https://github.com/ontech7/claude-omni-rc",
  },
  {
    id: "ollamaUsage",
    owner: "ontech7",
    name: "ollama-usage",
    url: "https://github.com/ontech7/ollama-usage",
  },
  {
    id: "figmaNodeQuery",
    owner: "ontech7",
    name: "figma-node-query",
    url: "https://github.com/ontech7/figma-node-query",
  },
];
