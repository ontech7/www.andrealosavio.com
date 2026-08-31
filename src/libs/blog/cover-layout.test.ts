import { describe, expect, it } from "vitest";
import {
  buildCoverScene,
  COVER_ACCENTS,
  COVER_HEIGHT,
  COVER_SCENES,
  COVER_WIDTH,
  createRandom,
  hashSeed,
  isoProject,
  ISO_H,
  ISO_W,
  primaryTag,
  type CoverScene,
} from "./cover-layout";

const SEEDS = Array.from({ length: 40 }, (_, index) => `articolo-${index}`);

describe("hashSeed", () => {
  it("e deterministico e distingue chiavi diverse", () => {
    expect(hashSeed("nextjs-cache")).toBe(hashSeed("nextjs-cache"));
    expect(hashSeed("nextjs-cache")).not.toBe(hashSeed("on-demand"));
  });

  it("resta un intero a 32 bit senza segno", () => {
    for (const key of ["", "a", "nextjs-cache", "x".repeat(200)]) {
      const seed = hashSeed(key);

      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(2 ** 32);
    }
  });
});

describe("createRandom", () => {
  it("ripete la stessa sequenza a parita di seme", () => {
    const a = createRandom(42);
    const b = createRandom(42);

    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("resta dentro [0, 1)", () => {
    const random = createRandom(hashSeed("nextjs-cache"));

    for (let index = 0; index < 500; index += 1) {
      const value = random();

      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("isoProject", () => {
  const origin = { x: 600, y: 315 };

  it("manda l'origine della griglia sull'origine della scena", () => {
    expect(isoProject(0, 0, origin)).toEqual(origin);
  });

  it("tiene il rapporto 2:1 fra i due assi", () => {
    expect(isoProject(1, 0, origin).x - origin.x).toBe(ISO_W);
    expect(isoProject(1, 0, origin).y - origin.y).toBe(ISO_H);
    expect(isoProject(0, 1, origin).x - origin.x).toBe(-ISO_W);
    expect(ISO_W / ISO_H).toBe(2);
  });
});

/** Quanta geometria porta ciascun archetipo, per verificare che sia l'unico attivo. */
function weights(scene: CoverScene) {
  return {
    isoChip: scene.traces.length,
    orbit: scene.orbits.length,
    horizon: scene.shafts.length,
    stack: scene.slabs.length,
    aurora: scene.blobs.length,
    flow: scene.wires.length + scene.nodes.length,
    keys: scene.keys.length,
    spline: scene.spline ? 1 : 0,
    beam: scene.beam ? 1 : 0,
  };
}

describe("buildCoverScene", () => {
  it("produce la stessa scena a ogni build", () => {
    expect(buildCoverScene("nextjs-cache", "hero")).toEqual(
      buildCoverScene("nextjs-cache", "hero")
    );
  });

  it("usa nel tempo tutti gli archetipi e tutte le temperature di blu", () => {
    const kinds = new Set(
      SEEDS.map((seed) => buildCoverScene(seed, "hero").kind)
    );
    const accents = new Set(
      SEEDS.map((seed) => buildCoverScene(seed, "hero").accent.base)
    );

    expect(kinds.size).toBe(COVER_SCENES.length);
    expect(accents.size).toBe(COVER_ACCENTS.length);
  });

  it("popola solo l'archetipo scelto", () => {
    for (const seed of SEEDS) {
      const scene = buildCoverScene(seed, "hero");
      const active = Object.entries(weights(scene))
        .filter(([, count]) => count > 0)
        .map(([name]) => name);

      expect(active).toEqual([scene.kind]);
    }
  });

  it("tiene il fuoco lontano dai bordi", () => {
    for (const seed of SEEDS) {
      const { focus } = buildCoverScene(seed, "hero");

      expect(focus.x).toBeGreaterThan(200);
      expect(focus.x).toBeLessThan(COVER_WIDTH - 200);
      expect(focus.y).toBeGreaterThan(150);
      expect(focus.y).toBeLessThan(COVER_HEIGHT - 150);
    }
  });

  it("centra il glifo sul fuoco e lo tiene dentro la cover", () => {
    for (const seed of SEEDS) {
      const { glyph, focus } = buildCoverScene(seed, "hero");

      expect(glyph.x + glyph.size / 2).toBeCloseTo(focus.x, 0);
      expect(glyph.y + glyph.size / 2).toBeCloseTo(focus.y, 0);
      expect(glyph.x).toBeGreaterThan(0);
      expect(glyph.y).toBeGreaterThan(0);
      expect(glyph.x + glyph.size).toBeLessThan(COVER_WIDTH);
      expect(glyph.y + glyph.size).toBeLessThan(COVER_HEIGHT);
    }
  });

  it("fa uscire ogni pista dalla scena invece di ripiegarla", () => {
    for (const seed of SEEDS) {
      for (const trace of buildCoverScene(seed, "hero").traces) {
        const points = trace.d
          .split(/[ML]\s*/)
          .filter(Boolean)
          .map((pair) => pair.trim().split(/\s+/).map(Number));
        const last = points[points.length - 1];

        expect(
          last[0] < 0 ||
            last[0] > COVER_WIDTH ||
            last[1] < 0 ||
            last[1] > COVER_HEIGHT
        ).toBe(true);
      }
    }
  });

  it("tiene le orbite crescenti e visibili", () => {
    for (const seed of SEEDS) {
      const { orbits } = buildCoverScene(seed, "hero");

      for (let index = 1; index < orbits.length; index += 1) {
        expect(orbits[index].rx).toBeGreaterThan(orbits[index - 1].rx);
      }

      for (const orbit of orbits) {
        expect(orbit.opacity).toBeGreaterThan(0);
        expect(orbit.ry).toBeLessThan(orbit.rx);
      }
    }
  });

  it("appoggia i fasci sull'orizzonte, mai sotto", () => {
    for (const seed of SEEDS) {
      const { shafts, horizonY, kind } = buildCoverScene(seed, "hero");

      if (kind === "horizon") {
        expect(horizonY).toBeGreaterThan(0);
        expect(horizonY).toBeLessThan(COVER_HEIGHT);
      }

      for (const shaft of shafts) {
        expect(horizonY - shaft.height).toBeGreaterThan(-COVER_HEIGHT);
        expect(shaft.width).toBeGreaterThan(0);
        expect(shaft.opacity).toBeGreaterThan(0);
      }
    }
  });

  it("ordina le lastre dalla piu lontana alla piu vicina", () => {
    for (const seed of SEEDS) {
      const { slabs } = buildCoverScene(seed, "hero");

      for (let index = 1; index < slabs.length; index += 1) {
        expect(slabs[index].width).toBeLessThan(slabs[index - 1].width);
        expect(slabs[index].opacity).toBeGreaterThan(slabs[index - 1].opacity);
      }
    }
  });

  it("collega ogni cavo del flusso a un nodo, e nessun nodo resta orfano", () => {
    for (const seed of SEEDS) {
      const { wires, nodes } = buildCoverScene(seed, "hero");

      expect(wires.length).toBe(nodes.length);

      for (const node of nodes) {
        expect(node.width).toBeGreaterThan(0);
        expect(node.x).toBeGreaterThan(0);
      }
    }
  });

  it("accende esattamente un tasto, quello sul fuoco", () => {
    for (const seed of SEEDS) {
      const { keys, focus, kind } = buildCoverScene(seed, "hero");

      if (kind !== "keys") {
        expect(keys).toEqual([]);
        continue;
      }

      const lit = keys.filter((key) => key.lit);

      expect(lit).toHaveLength(1);
      expect(lit[0].x + lit[0].size / 2).toBeCloseTo(focus.x, 0);
      expect(lit[0].opacity).toBe(1);

      for (const key of keys.filter((candidate) => !candidate.lit)) {
        expect(key.opacity).toBeLessThan(1);
        expect(key.size).toBeLessThanOrEqual(lit[0].size);
      }
    }
  });

  it("fa passare la spline per il fuoco con due cubiche raccordate", () => {
    for (const seed of SEEDS) {
      const { spline, focus } = buildCoverScene(seed, "hero");

      if (!spline) {
        continue;
      }

      expect(spline.d.match(/C/g)).toHaveLength(2);
      expect(spline.d).toContain(`${focus.x} ${focus.y} C`);
      expect(spline.drops).toHaveLength(spline.nodes.length);

      for (const node of spline.nodes) {
        expect(node.x).toBeGreaterThan(0);
        expect(node.x).toBeLessThan(COVER_WIDTH);
      }
    }
  });

  it("fa partire il fascio dal bordo del soggetto", () => {
    for (const seed of SEEDS) {
      const { beam, subject, focus } = buildCoverScene(seed, "hero");

      if (!beam || subject.kind !== "tile") {
        continue;
      }

      const left = subject.x;
      const right = subject.x + subject.size;

      expect([left, right].map(Math.round)).toContain(Math.round(beam.sourceX));
      expect(beam.sourceY).toBe(focus.y);
      expect(beam.cone.endsWith("Z")).toBe(true);
    }
  });

  it("tiene i blob dell'aurora abbastanza tenui da non coprire il soggetto", () => {
    for (const seed of SEEDS) {
      for (const blob of buildCoverScene(seed, "hero").blobs) {
        expect(blob.opacity).toBeLessThan(0.35);
        expect(blob.rx).toBeGreaterThan(0);
      }
    }
  });

  it("centra e alleggerisce la thumb, tenendo archetipo e colore della hero", () => {
    for (const seed of SEEDS) {
      const hero = buildCoverScene(seed, "hero");
      const thumb = buildCoverScene(seed, "thumb");
      const total = (scene: CoverScene) =>
        Object.values(weights(scene)).reduce((sum, count) => sum + count, 0);

      expect(thumb.kind).toBe(hero.kind);
      expect(thumb.accent).toEqual(hero.accent);
      expect(thumb.focus.x).toBe(COVER_WIDTH / 2);
      expect(thumb.motes).toEqual([]);
      expect(total(thumb)).toBeLessThanOrEqual(total(hero));
      expect(thumb.glyph.size).toBeGreaterThan(hero.glyph.size);
    }
  });
});

describe("primaryTag", () => {
  it("sceglie il tag piu alto nel vocabolario, non il primo scritto", () => {
    expect(primaryTag(["performance", "nextjs"])).toBe("nextjs");
    expect(primaryTag(["nextjs", "performance"])).toBe("nextjs");
  });

  it("non muta l'array in ingresso", () => {
    const tags = ["performance", "react"] as const;
    primaryTag(tags);

    expect(tags).toEqual(["performance", "react"]);
  });
});
