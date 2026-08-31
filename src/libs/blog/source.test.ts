import { describe, expect, it } from "vitest";
import type { BlogTag } from "@/constants/blog";
import type { AppLocale } from "@/libs/i18n/utils";
import type { BlogArticle } from "./source";
import { assertConsistency, selectRelated, sortByVocabulary } from "./source";

function article(
  slug: string,
  overrides: {
    locale?: AppLocale;
    tags?: BlogTag[];
    publishedAt?: string;
    translationKey?: string;
    draft?: boolean;
  } = {}
): BlogArticle {
  return {
    slug,
    locale: overrides.locale ?? "it",
    body: "",
    readingTime: 1,
    wordCount: 1,
    toc: [],
    frontmatter: {
      title: slug,
      subtitle: slug,
      description: "d".repeat(140),
      publishedAt: overrides.publishedAt ?? "2026-01-01",
      translationKey: overrides.translationKey ?? slug,
      kind: "tech",
      tags: overrides.tags ?? ["nextjs"],
      draft: overrides.draft ?? false,
      takeaways: ["uno", "due"],
    },
  };
}

describe("selectRelated", () => {
  it("ordina per numero di tag condivisi, poi per data", () => {
    const current = article("current", { tags: ["nextjs", "performance"] });
    const candidates = [
      article("uno-tag", { tags: ["nextjs"], publishedAt: "2026-05-01" }),
      article("due-tag", {
        tags: ["nextjs", "performance"],
        publishedAt: "2026-02-01",
      }),
    ];

    expect(selectRelated(current, candidates, 3).map((a) => a.slug)).toEqual([
      "due-tag",
      "uno-tag",
    ]);
  });

  it("esclude l'articolo corrente", () => {
    const current = article("current");

    expect(selectRelated(current, [current], 3)).toEqual([]);
  });

  it("rispetta il limite", () => {
    const current = article("current");
    const candidates = ["a", "b", "c", "d"].map((slug) => article(slug));

    expect(selectRelated(current, candidates, 3)).toHaveLength(3);
  });

  it("ripiega sui piu recenti quando nessun tag combacia", () => {
    const current = article("current", { tags: ["ai"] });
    const candidates = [
      article("vecchio", { tags: ["seo"], publishedAt: "2026-01-01" }),
      article("nuovo", { tags: ["seo"], publishedAt: "2026-06-01" }),
    ];

    expect(selectRelated(current, candidates, 1).map((a) => a.slug)).toEqual([
      "nuovo",
    ]);
  });
});

describe("assertConsistency", () => {
  it("accetta coppie complete", () => {
    expect(() =>
      assertConsistency({
        it: [article("cache-it", { translationKey: "cache" })],
        en: [article("cache-en", { locale: "en", translationKey: "cache" })],
      })
    ).not.toThrow();
  });

  it("rifiuta un articolo senza controparte", () => {
    expect(() =>
      assertConsistency({
        it: [article("cache-it", { translationKey: "cache" })],
        en: [],
      })
    ).toThrow(/cache/);
  });

  it("rifiuta due articoli con lo stesso translationKey nello stesso locale", () => {
    expect(() =>
      assertConsistency({
        it: [
          article("uno", { translationKey: "cache" }),
          article("due", { translationKey: "cache" }),
        ],
        en: [article("cache-en", { locale: "en", translationKey: "cache" })],
      })
    ).toThrow(/cache/);
  });

  it("ignora le bozze nel controllo delle coppie", () => {
    expect(() =>
      assertConsistency({
        it: [article("bozza", { translationKey: "wip", draft: true })],
        en: [],
      })
    ).not.toThrow();
  });
});

describe("sortByVocabulary", () => {
  it("ordina i tag secondo l'ordine del vocabolario", () => {
    expect(sortByVocabulary(["performance", "nextjs"])).toEqual([
      "nextjs",
      "performance",
    ]);
  });

  it("ordina piu tag rispettando l'ordine di BLOG_TAGS", () => {
    expect(sortByVocabulary(["seo", "react", "ai"])).toEqual([
      "react",
      "seo",
      "ai",
    ]);
  });

  it("non muta l'array in input", () => {
    const tags: BlogTag[] = ["performance", "nextjs"];

    sortByVocabulary(tags);

    expect(tags).toEqual(["performance", "nextjs"]);
  });
});
