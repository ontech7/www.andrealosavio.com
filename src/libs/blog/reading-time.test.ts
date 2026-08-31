import { describe, expect, it } from "vitest";
import { countProseWords, readingTimeMinutes } from "./reading-time";

describe("countProseWords", () => {
  it("conta le parole della prosa", () => {
    expect(countProseWords("Una frase con cinque parole.")).toBe(5);
  });

  it("ignora i blocchi di codice recintati", () => {
    const markdown = [
      "Due parole.",
      "",
      "```ts",
      "const molte = parole + che + non + contano;",
      "```",
    ].join("\n");

    expect(countProseWords(markdown)).toBe(2);
  });

  it("ignora il codice inline e la sintassi markdown", () => {
    expect(countProseWords("Usa `revalidate` **subito**")).toBe(2);
  });

  it("conta il testo dei link, non l'URL", () => {
    expect(
      countProseWords("Vedi [la documentazione](https://example.com)")
    ).toBe(3);
  });
});

describe("readingTimeMinutes", () => {
  it("arrotonda per eccesso a 200 parole al minuto", () => {
    expect(readingTimeMinutes(Array(250).fill("parola").join(" "))).toBe(2);
  });

  it("non scende mai sotto un minuto", () => {
    expect(readingTimeMinutes("Breve.")).toBe(1);
  });
});
