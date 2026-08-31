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

  it("estrae il testo da link markdown nel titolo", () => {
    expect(extractToc("## See [the docs](https://example.com) now")[0]).toEqual(
      {
        id: "see-the-docs-now",
        title: "See the docs now",
        level: 2,
      }
    );
  });

  it("gestisce link con codice inline nel testo", () => {
    expect(
      extractToc("## Usare [`revalidate`](https://example.com)")[0]
    ).toEqual({
      id: "usare-revalidate",
      title: "Usare revalidate",
      level: 2,
    });
  });

  it("ripulisce il barrato dal titolo", () => {
    expect(extractToc("## Il vecchio ~~modo~~")[0]).toEqual({
      id: "il-vecchio-modo",
      title: "Il vecchio modo",
      level: 2,
    });
  });

  it("ripulisce gli autolink dal titolo", () => {
    expect(extractToc("## Vedi <https://example.com>")[0]).toEqual({
      id: "vedi-httpsexamplecom",
      title: "Vedi https://example.com",
      level: 2,
    });
  });

  it("preserva i generici TypeScript come List<T>", () => {
    expect(
      extractToc("## Comparing `List<T>` and `Map<K,V>`")[0]
    ).toMatchObject({
      title: "Comparing List<T> and Map<K,V>",
    });
  });

  it("preserva gli operatori di confronto a < b", () => {
    expect(extractToc("## Why a < b and c > d")[0]).toMatchObject({
      title: "Why a < b and c > d",
    });
  });

  it("estrae il testo alternativo dalle immagini", () => {
    expect(extractToc("## See ![Diagram](img.png) here")[0]).toMatchObject({
      title: "See Diagram here",
    });
  });

  it("preserva gli underscore nei nomi costanti", () => {
    expect(extractToc("## NEXT_PUBLIC_SITE_URL spiegata")[0]).toMatchObject({
      title: "NEXT_PUBLIC_SITE_URL spiegata",
    });
  });

  it("elimina gli underscore attorno al testo italico", () => {
    expect(extractToc("## Il modo _giusto_")[0]).toMatchObject({
      title: "Il modo giusto",
    });
  });
});
