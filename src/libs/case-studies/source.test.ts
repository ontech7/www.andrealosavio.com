import { describe, expect, it } from "vitest";
import { assertConsistency, type CaseStudy } from "./source";

function build(
  locale: "it" | "en",
  slug: string,
  project: string,
  draft = false
): CaseStudy {
  return {
    slug,
    locale,
    body: "",
    frontmatter: {
      project,
      title: "Titolo",
      summary: "x".repeat(130),
      period: "2024",
      publishedAt: "2026-09-02",
      cover: "/images/case-studies/x/cover.webp",
      coverAlt: "alt",
      draft,
    },
  };
}

const projectIds = ["quido", "recrowd"];

describe("assertConsistency", () => {
  it("accetta una coppia completa", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "quido", "quido")],
          en: [build("en", "quido", "quido")],
        },
        projectIds
      )
    ).not.toThrow();
  });

  it("rifiuta un case study senza gemello nell'altra lingua", () => {
    expect(() =>
      assertConsistency(
        { it: [build("it", "quido", "quido")], en: [] },
        projectIds
      )
    ).toThrow(/manca in "en"/);
  });

  it("rifiuta un project che non esiste in PROJECTS", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "fantasma", "fantasma")],
          en: [build("en", "fantasma", "fantasma")],
        },
        projectIds
      )
    ).toThrow(/fantasma/);
  });

  it("rifiuta due case study sullo stesso progetto", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "quido", "quido"), build("it", "quido-2", "quido")],
          en: [build("en", "quido", "quido"), build("en", "quido-2", "quido")],
        },
        projectIds
      )
    ).toThrow(/piu di un case study/);
  });

  it("ignora le bozze", () => {
    expect(() =>
      assertConsistency(
        { it: [build("it", "quido", "quido", true)], en: [] },
        projectIds
      )
    ).not.toThrow();
  });
});
