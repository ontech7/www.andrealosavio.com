export const SERVICE_IDS = [
  "collaboration",
  "fde",
  "customSolutions",
  "aiNativeEngineer",
  "fractionalCto",
  "audit",
  "mentorship",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export type ServicePriceUnit = "project" | "month" | "hour";

export interface ServicePrice {
  amount: number;
  unit: ServicePriceUnit;
  from: boolean;
}

export const SERVICE_PRICES: Partial<Record<ServiceId, ServicePrice>> = {
  customSolutions: { amount: 7000, unit: "project", from: true },
  fractionalCto: { amount: 800, unit: "month", from: true },
  mentorship: { amount: 50, unit: "hour", from: false },
};
