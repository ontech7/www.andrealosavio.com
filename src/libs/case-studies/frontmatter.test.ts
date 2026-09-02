import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

const valid = {
  project: "quido",
  title: "Da consulente a forward deployed engineer",
  summary:
    "Rifatta la UI/UX della piattaforma e poi diventato il loro forward deployed engineer, fra tool interni e decisioni di prodotto.",
  period: "2024 — oggi",
  publishedAt: "2026-09-02",
  cover: "/images/case-studies/quido/cover.webp",
  coverAlt: "La dashboard di Quido dopo il redesign",
};

describe("parseFrontmatter", () => {
  it("normalizza un frontmatter valido", () => {
    const result = parseFrontmatter(valid, "it/quido.mdx");

    expect(result.project).toBe("quido");
    expect(result.draft).toBe(false);
    expect(result.updatedAt).toBeUndefined();
  });

  it("prefissa gli errori con il file di origine", () => {
    expect(() =>
      parseFrontmatter({ ...valid, project: "" }, "it/quido.mdx")
    ).toThrow(/\[case-studies\] it\/quido\.mdx/);
  });

  it("rifiuta un project mancante", () => {
    const { project: _project, ...withoutProject } = valid;

    expect(() => parseFrontmatter(withoutProject, "it/quido.mdx")).toThrow(
      /project/
    );
  });

  it("rifiuta un summary fuori dalla fascia di lunghezza", () => {
    expect(() =>
      parseFrontmatter({ ...valid, summary: "Troppo corto." }, "it/quido.mdx")
    ).toThrow(/summary/);
  });

  it("rifiuta una data malformata", () => {
    expect(() =>
      parseFrontmatter({ ...valid, publishedAt: "02-09-2026" }, "it/quido.mdx")
    ).toThrow(/publishedAt/);
  });

  it("rifiuta updatedAt precedente a publishedAt", () => {
    expect(() =>
      parseFrontmatter({ ...valid, updatedAt: "2026-08-01" }, "it/quido.mdx")
    ).toThrow(/updatedAt/);
  });

  it("pretende coverAlt quando c'è cover", () => {
    const { coverAlt: _coverAlt, ...withoutAlt } = valid;

    expect(() => parseFrontmatter(withoutAlt, "it/quido.mdx")).toThrow(
      /coverAlt/
    );
  });

  it("tratta draft come booleano opzionale", () => {
    expect(
      parseFrontmatter({ ...valid, draft: true }, "it/quido.mdx").draft
    ).toBe(true);
  });
});
