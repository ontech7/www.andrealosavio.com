import { describe, expect, it } from "vitest";
import { buildPageWindow, clampPage, pageCount, pageSlice } from "./pagination";

describe("pageCount", () => {
  it("resta a una pagina anche senza elementi", () => {
    expect(pageCount(0, 6)).toBe(1);
  });

  it("non apre una pagina in piu quando il totale e un multiplo esatto", () => {
    expect(pageCount(6, 6)).toBe(1);
    expect(pageCount(12, 6)).toBe(2);
  });

  it("arrotonda per eccesso il resto", () => {
    expect(pageCount(7, 6)).toBe(2);
    expect(pageCount(13, 6)).toBe(3);
  });
});

describe("clampPage", () => {
  it("riporta dentro i limiti i numeri fuori scala", () => {
    expect(clampPage(0, 3)).toBe(1);
    expect(clampPage(-4, 3)).toBe(1);
    expect(clampPage(9, 3)).toBe(3);
  });

  it("ripiega su 1 quando il numero non e finito", () => {
    expect(clampPage(Number.NaN, 3)).toBe(1);
    expect(clampPage(Number.POSITIVE_INFINITY, 3)).toBe(1);
  });
});

describe("buildPageWindow", () => {
  it("elenca tutte le pagine finche stanno in sette", () => {
    expect(buildPageWindow(1, 1)).toEqual([1]);
    expect(buildPageWindow(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("apre un solo salto quando la pagina corrente e all'inizio", () => {
    expect(buildPageWindow(2, 12)).toEqual([1, 2, 3, 4, "gap", 12]);
  });

  it("apre un solo salto quando la pagina corrente e alla fine", () => {
    expect(buildPageWindow(11, 12)).toEqual([1, "gap", 9, 10, 11, 12]);
  });

  it("apre due salti quando la pagina corrente e in mezzo", () => {
    expect(buildPageWindow(6, 12)).toEqual([1, "gap", 5, 6, 7, "gap", 12]);
  });

  it("non produce mai due salti consecutivi", () => {
    for (let page = 1; page <= 40; page += 1) {
      const slots = buildPageWindow(page, 40);

      slots.forEach((slot, index) => {
        expect(slot === "gap" && slots[index - 1] === "gap").toBe(false);
      });
    }
  });

  it("normalizza una pagina corrente fuori scala", () => {
    expect(buildPageWindow(99, 12)).toEqual(buildPageWindow(12, 12));
  });
});

describe("pageSlice", () => {
  const items = [1, 2, 3, 4, 5, 6, 7];

  it("taglia la prima pagina", () => {
    expect(pageSlice(items, 1, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("taglia l'ultima pagina incompleta", () => {
    expect(pageSlice(items, 2, 6)).toEqual([7]);
  });
});
