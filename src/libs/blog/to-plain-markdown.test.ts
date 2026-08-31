import { describe, expect, it } from "vitest";
import { toPlainMarkdown } from "./to-plain-markdown";

describe("toPlainMarkdown", () => {
  it("converte i Callout in blockquote", () => {
    const input = '<Callout type="warning">Attenzione a questo.</Callout>';

    expect(toPlainMarkdown(input)).toBe("> **warning:** Attenzione a questo.");
  });

  it("converte i Callout su piu righe", () => {
    const input = [
      '<Callout type="info">',
      "Testo su piu righe.",
      "</Callout>",
    ].join("\n");

    expect(toPlainMarkdown(input)).toBe("> **info:** Testo su piu righe.");
  });

  it("converte i Callout senza type esplicito usando info come default", () => {
    const input = "<Callout>Testo senza type.</Callout>";

    expect(toPlainMarkdown(input)).toBe("> **info:** Testo senza type.");
  });

  it("converte le Figure in immagini markdown", () => {
    const input = '<Figure src="/a.webp" alt="Un grafico" caption="La resa" />';

    expect(toPlainMarkdown(input)).toBe("![Un grafico](/a.webp)\n\n*La resa*");
  });

  it("converte le Figure non self-closing in immagini markdown", () => {
    const input = '<Figure src="/a.webp" alt="Un grafico"></Figure>';

    expect(toPlainMarkdown(input)).toBe("![Un grafico](/a.webp)");
  });

  it("converte le Figure self-closing senza caption", () => {
    const input = '<Figure src="/a.webp" alt="Un grafico" />';

    expect(toPlainMarkdown(input)).toBe("![Un grafico](/a.webp)");
  });

  it("lascia intatti i blocchi di codice", () => {
    const input = ["```ts", "const a = 1;", "```"].join("\n");

    expect(toPlainMarkdown(input)).toBe(input);
  });

  it("lascia intatta la prosa normale", () => {
    expect(toPlainMarkdown("## Titolo\n\nUn **paragrafo**.")).toBe(
      "## Titolo\n\nUn **paragrafo**."
    );
  });
});
