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
