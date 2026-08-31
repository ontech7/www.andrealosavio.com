import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

function valid(overrides: Record<string, unknown> = {}) {
  return {
    title: "La cache di Next.js, spiegata davvero",
    subtitle: "Quando revalidate non fa quello che pensi",
    description:
      "Una guida pratica ai livelli di cache di Next.js, a come interagiscono tra loro e agli errori che fanno sembrare rotto il revalidate.",
    publishedAt: new Date("2026-09-02T00:00:00Z"),
    translationKey: "nextjs-cache",
    tags: ["nextjs", "performance"],
    takeaways: ["Primo punto chiave.", "Secondo punto chiave."],
    ...overrides,
  };
}

describe("parseFrontmatter", () => {
  it("accetta un frontmatter valido e normalizza le date a stringhe ISO", () => {
    const result = parseFrontmatter(valid(), "it/test.mdx");

    expect(result.publishedAt).toBe("2026-09-02");
    expect(result.draft).toBe(false);
    expect(result.tags).toEqual(["nextjs", "performance"]);
  });

  it("accetta publishedAt anche come stringa", () => {
    const result = parseFrontmatter(
      valid({ publishedAt: "2026-09-02" }),
      "it/test.mdx"
    );

    expect(result.publishedAt).toBe("2026-09-02");
  });

  it("rifiuta un campo obbligatorio mancante citando il file", () => {
    const { title: _omitted, ...withoutTitle } = valid();

    expect(() => parseFrontmatter(withoutTitle, "it/test.mdx")).toThrow(
      /it\/test\.mdx.*title/
    );
  });

  it("rifiuta una data di calendario inesistente", () => {
    expect(() =>
      parseFrontmatter(valid({ publishedAt: "2026-02-31" }), "it/test.mdx")
    ).toThrow(/publishedAt/);
  });

  it("rifiuta updatedAt precedente a publishedAt", () => {
    expect(() =>
      parseFrontmatter(valid({ updatedAt: "2026-08-01" }), "it/test.mdx")
    ).toThrow(/updatedAt/);
  });

  it("rifiuta un tag fuori dal vocabolario", () => {
    expect(() =>
      parseFrontmatter(valid({ tags: ["nextjs", "blockchain"] }), "it/test.mdx")
    ).toThrow(/blockchain/);
  });

  it("rifiuta una description fuori dai limiti", () => {
    expect(() =>
      parseFrontmatter(valid({ description: "Troppo corta." }), "it/test.mdx")
    ).toThrow(/description/);
  });

  it("rifiuta cover senza coverAlt", () => {
    expect(() =>
      parseFrontmatter(valid({ cover: "/images/blog/x.webp" }), "it/test.mdx")
    ).toThrow(/coverAlt/);
  });

  it("rifiuta takeaways fuori dall'intervallo consentito", () => {
    expect(() =>
      parseFrontmatter(valid({ takeaways: ["Solo uno."] }), "it/test.mdx")
    ).toThrow(/takeaways/);
  });

  it("accetta series e faq quando sono ben formati", () => {
    const result = parseFrontmatter(
      valid({
        series: { id: "nextjs-deep-dive", part: 2 },
        faq: [{ q: "Funziona in dev?", a: "No, in sviluppo la cache è off." }],
      }),
      "it/test.mdx"
    );

    expect(result.series).toEqual({ id: "nextjs-deep-dive", part: 2 });
    expect(result.faq).toHaveLength(1);
  });

  it("rifiuta series con part non positivo", () => {
    expect(() =>
      parseFrontmatter(valid({ series: { id: "x", part: 0 } }), "it/test.mdx")
    ).toThrow(/series/);
  });
});
