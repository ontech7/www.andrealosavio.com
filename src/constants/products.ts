export type FeaturedProductStatus = "downloads" | "available" | "comingSoon";

export interface FeaturedProduct {
  id: string;
  status: FeaturedProductStatus;
  logo: string;
  logoFullBleed: boolean;
  image: string;
  websiteUrl: string;
}

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "fastmemo",
    status: "downloads",
    logo: "/images/clients/fastmemo_v3.svg",
    logoFullBleed: true,
    image: "/images/products/fastmemo_v2.webp",
    websiteUrl:
      "https://fastmemo.losav.cc?utm_source=andrealosavio.com&utm_medium=referral",
  },
  {
    id: "coolifyManager",
    status: "downloads",
    logo: "/images/clients/coolify-manager.svg",
    logoFullBleed: false,
    image: "/images/products/coolify-manager.webp",
    websiteUrl:
      "https://coolify-manager.losav.cc?utm_source=andrealosavio.com&utm_medium=referral",
  },
  {
    id: "dillobene",
    status: "available",
    logo: "/images/clients/dillobene.svg",
    logoFullBleed: true,
    image: "/images/products/dillobene_v2.webp",
    websiteUrl:
      "https://dillobene.losav.cc?utm_source=andrealosavio.com&utm_medium=referral",
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
    id: "piShare",
    owner: "ontech7",
    name: "pi-share",
    url: "https://github.com/ontech7/pi-share",
  },
  {
    id: "drezimoSoundboard",
    owner: "ontech7",
    name: "drezimo-soundboard",
    url: "https://github.com/ontech7/drezimo-soundboard",
  },
  {
    id: "fastmemoServer",
    owner: "ontech7",
    name: "fastmemo-server",
    url: "https://github.com/ontech7/fastmemo-server",
  },
];
