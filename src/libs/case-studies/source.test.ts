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
const coverAlwaysExists = () => true;
const coverNeverExists = () => false;

describe("assertConsistency", () => {
  it("accetta una coppia completa", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "quido", "quido")],
          en: [build("en", "quido", "quido")],
        },
        projectIds,
        coverAlwaysExists
      )
    ).not.toThrow();
  });

  it("rifiuta un case study senza gemello nell'altra lingua", () => {
    expect(() =>
      assertConsistency(
        { it: [build("it", "quido", "quido")], en: [] },
        projectIds,
        coverAlwaysExists
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
        projectIds,
        coverAlwaysExists
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
        projectIds,
        coverAlwaysExists
      )
    ).toThrow(/piu di un case study/);
  });

  it("ignora le bozze", () => {
    expect(() =>
      assertConsistency(
        { it: [build("it", "quido", "quido", true)], en: [] },
        projectIds,
        coverAlwaysExists
      )
    ).not.toThrow();
  });

  it("lancia quando un case study non-draft ha una cover che non esiste", () => {
    expect(() =>
      assertConsistency(
        {
          it: [build("it", "quido", "quido")],
          en: [build("en", "quido", "quido")],
        },
        projectIds,
        coverNeverExists
      )
    ).toThrow(/cover/);
  });

  it("non lancia quando una bozza ha una cover che non esiste", () => {
    expect(() =>
      assertConsistency(
        { it: [build("it", "quido", "quido", true)], en: [] },
        projectIds,
        coverNeverExists
      )
    ).not.toThrow();
  });
});
