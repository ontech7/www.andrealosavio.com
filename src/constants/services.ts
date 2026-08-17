export type ServicePriceUnit = "project" | "month" | "hour";

export interface ServicePrice {
  amount: number;
  unit: ServicePriceUnit;
  from: boolean;
}

export interface Service {
  id: string;
  imageSrc: string;
  price: ServicePrice | null;
}

export const SERVICES = [
  {
    id: "collaboration",
    imageSrc: "/images/services/collaboration.webp",
    price: null,
  },
  {
    id: "validationMvp",
    imageSrc: "/images/services/validation-mvp.webp",
    price: { amount: 2500, unit: "project", from: true },
  },
  {
    id: "fdeDiscoveryAudit",
    imageSrc: "/images/services/audit-consulting.webp",
    price: null,
  },
  {
    id: "fractionalCto",
    imageSrc: "/images/services/fractional-cto.webp",
    price: { amount: 800, unit: "month", from: true },
  },
  {
    id: "technicalMentorship",
    imageSrc: "/images/services/technical-mentorship.webp",
    price: { amount: 50, unit: "hour", from: false },
  },
  {
    id: "productDevelopment",
    imageSrc: "/images/services/product-development.webp",
    price: { amount: 7000, unit: "project", from: true },
  },
] as const satisfies readonly Service[];

export type ServiceId = (typeof SERVICES)[number]["id"];
