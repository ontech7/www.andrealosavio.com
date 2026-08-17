export const PRACTICE_GROUPS = [
  {
    id: "verifiable",
    areas: ["accessibility", "performance", "discoverability"],
  },
  {
    id: "underTheHood",
    areas: ["architecture", "data", "aiEngineering", "mobile", "delivery"],
  },
] as const;

export const PRACTICE_ITEM_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

export type PracticeGroupId = (typeof PRACTICE_GROUPS)[number]["id"];
export type PracticeArea = (typeof PRACTICE_GROUPS)[number]["areas"][number];
