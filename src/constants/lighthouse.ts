export interface LighthouseCategoryScore {
  id: "accessibility" | "bestPractices" | "seo";
  score: number;
}

export interface WebVitalMetric {
  id: "lcp" | "cls" | "ttfb";
  value: string;
  good: boolean;
}

export const LIGHTHOUSE_SCORES: readonly LighthouseCategoryScore[] = [
  { id: "accessibility", score: 100 },
  { id: "bestPractices", score: 100 },
  { id: "seo", score: 100 },
] as const;

export const WEB_VITALS: readonly WebVitalMetric[] = [
  { id: "lcp", value: "1,07 s", good: true },
  { id: "cls", value: "0,00", good: true },
  { id: "ttfb", value: "36 ms", good: true },
] as const;

export const MEASUREMENT = {
  date: "2026-08-17",
  url: "www.andrealosavio.com/it",
  device: "mobile",
  tool: "Lighthouse",
} as const;

export const BUILD_STATS = {
  prerenderedPages: 19,
  buildTimeMs: 244,
} as const;
