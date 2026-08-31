import { describe, expect, it } from "vitest";
import { extractToc } from "./toc";

describe("extractToc", () => {
  it("estrae h2 e h3 con gli id in stile GitHub", () => {
    const markdown = [
      "# Titolo ignorato",
      "## Come funziona la cache",
      "### Il caso limite",
      "#### Troppo profondo",
    ].join("\n");

    expect(extractToc(markdown)).toEqual([
      {
        id: "come-funziona-la-cache",
        title: "Come funziona la cache",
        level: 2,
      },
      { id: "il-caso-limite", title: "Il caso limite", level: 3 },
    ]);
  });

  it("ignora gli heading dentro i blocchi di codice", () => {
    const markdown = [
      "## Vero",
      "",
      "```bash",
      "## non un heading",
      "```",
    ].join("\n");

    expect(extractToc(markdown)).toHaveLength(1);
  });

  it("ripulisce la formattazione inline dal titolo", () => {
    expect(extractToc("## Usare `revalidate` **bene**")[0]).toEqual({
      id: "usare-revalidate-bene",
      title: "Usare revalidate bene",
      level: 2,
    });
  });

  it("disambigua i titoli duplicati come fa rehype-slug", () => {
    const entries = extractToc(["## Note", "## Note"].join("\n"));

    expect(entries.map((entry) => entry.id)).toEqual(["note", "note-1"]);
  });
});
