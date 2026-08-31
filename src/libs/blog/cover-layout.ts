import { BLOG_TAGS, type BlogTag } from "@/constants/blog";

export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 630;

/** Mezza larghezza e mezza altezza di una cella nella proiezione isometrica 2:1. */
export const ISO_W = 92;
export const ISO_H = 46;

/**
 * Tag che detta il glifo della cover: il primo secondo l'ordine del
 * vocabolario, cosi non dipende da come l'autore ha scritto l'array nel
 * frontmatter.
 */
export function primaryTag(tags: readonly BlogTag[]): BlogTag {
  return [...tags].sort(
    (a, b) => BLOG_TAGS.indexOf(a) - BLOG_TAGS.indexOf(b)
  )[0];
}

/**
 * Hash stabile di una stringa in un intero a 32 bit senza segno. Alimenta il
 * generatore: la stessa chiave produce sempre la stessa scena, quindi la cover
 * non cambia tra un build e l'altro.
 */
export function hashSeed(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/**
 * PRNG deterministico (mulberry32). Restituisce valori in [0, 1).
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Le tre temperature di blu ammesse. Restano tutte inequivocabilmente blu: la
 * varieta serve a distinguere due articoli, non a uscire dalla palette.
 */
export const COVER_ACCENTS = [
  { base: "#0d7ef2", light: "#7cc0ff", deep: "#08203f", rim: "#1b4d8f" },
  { base: "#0ea5e9", light: "#8ad8fb", deep: "#062a45", rim: "#12587f" },
  { base: "#3b6fe0", light: "#a3c0ff", deep: "#101c3d", rim: "#2a4a9c" },
] as const;

export type CoverAccent = (typeof COVER_ACCENTS)[number];

/**
 * Gli archetipi di scena. Condividono la stessa grammatica — fondo radiale
 * nero-blu, un solo soggetto luminoso al fuoco, bagliore, profondita di campo
 * che spegne il contorno — ma sono composizioni diverse, cosi l'indice del blog
 * non diventa una sfilza di immagini uguali.
 */
export const COVER_SCENES = [
  "isoChip",
  "orbit",
  "horizon",
  "stack",
  "aurora",
  "flow",
  "keys",
  "spline",
  "beam",
] as const;

export type CoverSceneKind = (typeof COVER_SCENES)[number];

export interface ScenePoint {
  x: number;
  y: number;
}

/**
 * Proietta un punto della griglia isometrica in coordinate schermo.
 */
export function isoProject(
  u: number,
  v: number,
  origin: ScenePoint
): ScenePoint {
  return {
    x: origin.x + (u - v) * ISO_W,
    y: origin.y + (u + v) * ISO_H,
  };
}

export interface Trace {
  d: string;
  opacity: number;
  width: number;
}

export interface Orbit {
  rx: number;
  ry: number;
  rotate: number;
  opacity: number;
  width: number;
  dash?: string;
}

export interface Shaft {
  x: number;
  width: number;
  height: number;
  opacity: number;
}

export interface Slab {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
}

export interface Blob {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
  opacity: number;
  tone: "base" | "light" | "rim";
}

export interface Mote {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

/** Cavo luminoso che collega due nodi, come nei diagrammi di flusso. */
export interface Wire {
  d: string;
  opacity: number;
  width: number;
}

export interface FlowNode {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
}

/** Tasto di una fila: solo quello centrale e acceso, gli altri sono profilati. */
export interface Key {
  x: number;
  y: number;
  size: number;
  radius: number;
  opacity: number;
  lit: boolean;
}

export interface Beam {
  cone: string;
  sourceX: number;
  sourceY: number;
  sourceHeight: number;
}

export interface SplineCurve {
  d: string;
  drops: string[];
  nodes: ScenePoint[];
}

export type Subject =
  | { kind: "chip"; plate: string; top: string; left: string; right: string }
  | { kind: "disc"; cx: number; cy: number; r: number }
  | { kind: "tile"; x: number; y: number; size: number; radius: number };

export interface CoverScene {
  kind: CoverSceneKind;
  accent: CoverAccent;
  focus: ScenePoint;
  subject: Subject;
  glyph: { x: number; y: number; size: number };
  traces: Trace[];
  orbits: Orbit[];
  shafts: Shaft[];
  slabs: Slab[];
  blobs: Blob[];
  motes: Mote[];
  wires: Wire[];
  nodes: FlowNode[];
  keys: Key[];
  spline: SplineCurve | null;
  beam: Beam | null;
  gridLines: string[];
  horizonY: number;
}

const CHIP_DEPTH = 30;
const BLEED = 140;

function toPath(points: readonly ScenePoint[], close: boolean): string {
  const [head, ...tail] = points;
  const body = tail
    .map((point) => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  return `M ${head.x.toFixed(1)} ${head.y.toFixed(1)} ${body}${close ? " Z" : ""}`;
}

function round(value: number): number {
  return Number(value.toFixed(1));
}

function isOffCanvas(point: ScenePoint): boolean {
  return (
    point.x < -BLEED ||
    point.x > COVER_WIDTH + BLEED ||
    point.y < -BLEED ||
    point.y > COVER_HEIGHT + BLEED
  );
}

/**
 * Il quadrato centrato piu grande dentro un rombo di semiassi W e H ha lato
 * 2WH/(W+H). I glifi hanno margine interno, quindi si concede un filo.
 */
function inscribedInRhombus(halfWidth: number, halfHeight: number): number {
  return ((2 * halfWidth * halfHeight) / (halfWidth + halfHeight)) * 1.12;
}

function glyphBox(focus: ScenePoint, size: number) {
  return {
    x: round(focus.x - size / 2),
    y: round(focus.y - size / 2),
    size: round(size),
  };
}

function buildChipSubject(origin: ScenePoint, radius: number): Subject {
  const corner = (u: number, v: number) => isoProject(u, v, origin);
  const drop = (point: ScenePoint) => ({ x: point.x, y: point.y + CHIP_DEPTH });

  const north = corner(-radius, -radius);
  const east = corner(radius, -radius);
  const south = corner(radius, radius);
  const west = corner(-radius, radius);
  const plateRadius = radius * 1.42;

  return {
    kind: "chip",
    plate: toPath(
      [
        corner(-plateRadius, -plateRadius),
        corner(plateRadius, -plateRadius),
        corner(plateRadius, plateRadius),
        corner(-plateRadius, plateRadius),
      ],
      true
    ),
    top: toPath([north, east, south, west], true),
    left: toPath([west, south, drop(south), drop(west)], true),
    right: toPath([south, east, drop(east), drop(south)], true),
  };
}

const QUADRANTS = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

/**
 * Pista che parte dal bordo del chip e si allontana a scalini sui due assi
 * della griglia. Ogni pista resta dentro un solo quadrante e avanza sempre
 * nella stessa direzione, quindi esce dalla scena invece di ripiegarsi.
 */
function buildTrace(
  random: () => number,
  origin: ScenePoint,
  chipRadius: number,
  quadrant: readonly [number, number]
): Trace {
  const [signU, signV] = quadrant;
  const startOnU = random() > 0.5;

  let u = startOnU ? signU * chipRadius : signU * chipRadius * random() * 0.6;
  let v = startOnU ? signV * chipRadius * random() * 0.6 : signV * chipRadius;

  const points: ScenePoint[] = [isoProject(u, v, origin)];
  let alongU = startOnU;

  for (let step = 0; step < 8; step += 1) {
    const length = 0.9 + random() * 2.6;

    if (alongU) {
      u += signU * length;
    } else {
      v += signV * length;
    }

    const point = isoProject(u, v, origin);
    points.push(point);

    if (isOffCanvas(point)) {
      break;
    }

    alongU = random() > 0.42 ? !alongU : alongU;
  }

  return {
    d: toPath(points, false),
    opacity: Number((0.45 + random() * 0.55).toFixed(3)),
    width: Number((2 + random() * 2.6).toFixed(2)),
  };
}

function buildIsoGrid(origin: ScenePoint, span: number): string[] {
  const lines: string[] = [];

  for (let index = -span; index <= span; index += 1) {
    lines.push(
      toPath(
        [isoProject(index, -span, origin), isoProject(index, span, origin)],
        false
      )
    );
    lines.push(
      toPath(
        [isoProject(-span, index, origin), isoProject(span, index, origin)],
        false
      )
    );
  }

  return lines;
}

/**
 * Griglia in prospettiva a un punto di fuga: le fughe convergono sull'orizzonte
 * e le trasversali si infittiscono avvicinandosi ad esso.
 */
function buildPerspectiveGrid(
  vanishing: ScenePoint,
  horizonY: number,
  columns: number,
  rows: number
): string[] {
  const lines: string[] = [];

  for (let index = -columns; index <= columns; index += 1) {
    lines.push(
      toPath(
        [vanishing, { x: vanishing.x + index * 240, y: COVER_HEIGHT + 60 }],
        false
      )
    );
  }

  for (let index = 1; index <= rows; index += 1) {
    const y = horizonY + (COVER_HEIGHT + 60 - horizonY) * (index / rows) ** 2.4;

    lines.push(
      toPath(
        [
          { x: -BLEED, y: round(y) },
          { x: COVER_WIDTH + BLEED, y: round(y) },
        ],
        false
      )
    );
  }

  return lines;
}

const ISO_ANCHORS = [
  { x: 600, y: 330 },
  { x: 505, y: 348 },
  { x: 690, y: 312 },
] as const;

interface SceneParts {
  focus: ScenePoint;
  subject: Subject;
  glyph: { x: number; y: number; size: number };
  traces: Trace[];
  orbits: Orbit[];
  shafts: Shaft[];
  slabs: Slab[];
  blobs: Blob[];
  wires: Wire[];
  nodes: FlowNode[];
  keys: Key[];
  spline: SplineCurve | null;
  beam: Beam | null;
  gridLines: string[];
  horizonY: number;
}

function emptyParts(focus: ScenePoint) {
  return {
    focus,
    traces: [] as Trace[],
    orbits: [] as Orbit[],
    shafts: [] as Shaft[],
    slabs: [] as Slab[],
    blobs: [] as Blob[],
    wires: [] as Wire[],
    nodes: [] as FlowNode[],
    keys: [] as Key[],
    spline: null as SplineCurve | null,
    beam: null as Beam | null,
    gridLines: [] as string[],
    horizonY: 0,
  };
}

function buildIsoChip(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const focus = isThumb
    ? { x: 600, y: 322 }
    : ISO_ANCHORS[Math.floor(choose() * ISO_ANCHORS.length)];
  const radius = isThumb ? 2.15 : 1.5;
  const traces: Trace[] = [];

  for (let index = 0; index < (isThumb ? 4 : 11); index += 1) {
    traces.push(
      buildTrace(random, focus, radius, QUADRANTS[index % QUADRANTS.length])
    );
  }

  return {
    ...emptyParts(focus),
    subject: buildChipSubject(focus, radius),
    glyph: glyphBox(focus, inscribedInRhombus(radius * ISO_W, radius * ISO_H)),
    traces,
    gridLines: buildIsoGrid(focus, isThumb ? 4 : 6),
  };
}

function buildOrbit(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const focus = {
    x: isThumb ? 600 : round(520 + choose() * 160),
    y: isThumb ? 315 : round(290 + choose() * 60),
  };
  const discRadius = isThumb ? 150 : 108;
  const orbits: Orbit[] = [];
  let rx = discRadius * 1.5;

  for (let index = 0; index < (isThumb ? 3 : 6); index += 1) {
    orbits.push({
      rx: round(rx),
      ry: round(rx * (0.24 + random() * 0.3)),
      rotate: round(-40 + random() * 80),
      opacity: Number((0.55 - index * 0.07).toFixed(3)),
      width: Number((1 + random() * 2).toFixed(2)),
      ...(random() > 0.6 && {
        dash: `${(10 + random() * 40).toFixed(0)} ${(14 + random() * 30).toFixed(0)}`,
      }),
    });

    rx *= 1.28 + random() * 0.2;
  }

  return {
    ...emptyParts(focus),
    subject: { kind: "disc", cx: focus.x, cy: focus.y, r: discRadius },
    glyph: glyphBox(focus, discRadius * 1.16),
    orbits,
  };
}

function buildHorizon(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const horizonY = isThumb ? 430 : 415;
  const focus = {
    x: isThumb ? 600 : round(540 + choose() * 120),
    y: isThumb ? 300 : 268,
  };
  const discRadius = isThumb ? 140 : 104;
  const shafts: Shaft[] = [];

  for (let index = 0; index < (isThumb ? 4 : 11); index += 1) {
    shafts.push({
      x: round(random() * COVER_WIDTH),
      width: round(24 + random() * 96),
      height: round(90 + random() * 240),
      opacity: Number((0.14 + random() * 0.3).toFixed(3)),
    });
  }

  return {
    ...emptyParts(focus),
    subject: { kind: "disc", cx: focus.x, cy: focus.y, r: discRadius },
    glyph: glyphBox(focus, discRadius * 1.16),
    shafts,
    gridLines: buildPerspectiveGrid(
      { x: focus.x, y: horizonY },
      horizonY,
      isThumb ? 3 : 6,
      isThumb ? 6 : 11
    ),
    horizonY,
  };
}

function buildStack(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const focus = {
    x: isThumb ? 600 : round(540 + choose() * 130),
    y: isThumb ? 315 : round(300 + choose() * 40),
  };
  const size = isThumb ? 250 : 196;
  const slabs: Slab[] = [];
  const count = isThumb ? 2 : 4;

  /* Un solo passo per scena: randomizzarlo per lastra rompeva la monotonia
   * della pila, che a quel punto non rientrava piu in profondita. */
  const step = 0.16 + random() * 0.08;

  for (let index = count; index >= 1; index -= 1) {
    const spread = 1 + index * step;

    slabs.push({
      x: round(focus.x - (size * spread) / 2 - index * 26),
      y: round(focus.y - (size * spread) / 2 - index * 14),
      width: round(size * spread),
      height: round(size * spread),
      radius: round(28 * spread),
      opacity: Number((0.52 - index * 0.082).toFixed(3)),
    });
  }

  return {
    ...emptyParts(focus),
    subject: {
      kind: "tile",
      x: round(focus.x - size / 2),
      y: round(focus.y - size / 2),
      size,
      radius: 30,
    },
    glyph: glyphBox(focus, size * 0.58),
    slabs,
  };
}

const BLOB_TONES = ["base", "light", "rim"] as const;

function buildAurora(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const focus = {
    x: isThumb ? 600 : round(520 + choose() * 160),
    y: isThumb ? 315 : round(295 + choose() * 50),
  };
  const size = isThumb ? 240 : 190;
  const blobs: Blob[] = [];

  for (let index = 0; index < (isThumb ? 3 : 6); index += 1) {
    blobs.push({
      cx: round(random() * COVER_WIDTH),
      cy: round(random() * COVER_HEIGHT),
      rx: round(200 + random() * 320),
      ry: round(90 + random() * 190),
      rotate: round(-60 + random() * 120),
      opacity: Number((0.12 + random() * 0.22).toFixed(3)),
      tone: BLOB_TONES[Math.floor(random() * BLOB_TONES.length)],
    });
  }

  return {
    ...emptyParts(focus),
    subject: {
      kind: "tile",
      x: round(focus.x - size / 2),
      y: round(focus.y - size / 2),
      size,
      radius: size / 2,
    },
    glyph: glyphBox(focus, size * 0.56),
    blobs,
  };
}

/** Punto di una cubica di Bezier al parametro t. */
function cubicAt(
  a: number,
  b: number,
  c: number,
  d: number,
  t: number
): number {
  const u = 1 - t;

  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

function tileSubject(focus: ScenePoint, size: number, radius: number): Subject {
  return {
    kind: "tile",
    x: round(focus.x - size / 2),
    y: round(focus.y - size / 2),
    size,
    radius,
  };
}

/**
 * Grafo di flusso: dal nodo centrale partono cavi che si incurvano verso nodi
 * secondari spenti, come in un editor di automazioni. I nodi stanno su bande
 * verticali fisse, cosi il fascio si apre invece di ammassarsi.
 */
function buildFlow(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const focus = {
    x: isThumb ? 600 : round(420 + choose() * 90),
    y: isThumb ? 315 : round(300 + choose() * 40),
  };
  const size = isThumb ? 250 : 170;
  const wires: Wire[] = [];
  const nodes: FlowNode[] = [];
  const bands = isThumb ? [-1, 1] : [-1.35, -0.45, 0.45, 1.35];

  for (const band of bands) {
    const width = round(190 + random() * 90);
    const height = round(70 + random() * 16);
    const x = round(focus.x + size / 2 + 150 + random() * 130);
    const y = round(focus.y + band * (110 + random() * 45) - height / 2);

    nodes.push({
      x,
      y,
      width,
      height,
      radius: round(height / 2.6),
      opacity: Number((0.32 + random() * 0.3).toFixed(3)),
    });

    const startX = focus.x + size / 2;
    const endY = y + height / 2;
    const reach = (x - startX) * 0.55;

    wires.push({
      d: `M ${startX.toFixed(1)} ${focus.y.toFixed(1)} C ${(startX + reach).toFixed(1)} ${focus.y.toFixed(1)}, ${(x - reach).toFixed(1)} ${endY.toFixed(1)}, ${x.toFixed(1)} ${endY.toFixed(1)}`,
      opacity: Number((0.5 + random() * 0.45).toFixed(3)),
      width: Number((2 + random() * 1.4).toFixed(2)),
    });
  }

  return {
    ...emptyParts(focus),
    subject: tileSubject(focus, size, round(size / 4.5)),
    glyph: glyphBox(focus, size * 0.56),
    wires,
    nodes,
  };
}

/**
 * Fila di tasti: solo quello al fuoco e acceso, gli altri restano profilati e
 * si spengono allontanandosi. I tasti ai bordi escono di proposito.
 */
function buildKeys(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const focus = {
    x: isThumb ? 600 : round(540 + choose() * 120),
    y: isThumb ? 315 : round(300 + choose() * 30),
  };
  const size = isThumb ? 230 : 186;
  const step = size * 1.34;
  const reach = isThumb ? 1 : 3;
  const keys: Key[] = [];

  for (let index = -reach; index <= reach; index += 1) {
    const distance = Math.abs(index);
    const scale = 1 - distance * 0.07;

    keys.push({
      x: round(focus.x + index * step - (size * scale) / 2),
      y: round(focus.y - (size * scale) / 2),
      size: round(size * scale),
      radius: round(size * scale * 0.26),
      opacity:
        index === 0
          ? 1
          : Number((0.62 - distance * 0.13 + random() * 0.08).toFixed(3)),
      lit: index === 0,
    });
  }

  return {
    ...emptyParts(focus),
    subject: tileSubject(focus, size, round(size * 0.26)),
    glyph: glyphBox(focus, size * 0.54),
    keys,
  };
}

/**
 * Curva morbida che attraversa la cover passando per il fuoco, con linee di
 * caduta verso il basso. Le due cubiche condividono la tangente nel punto di
 * giunzione, cosi la curva non ha spigoli.
 */
function buildSpline(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const focus = {
    x: isThumb ? 600 : round(500 + choose() * 180),
    y: isThumb ? 330 : round(330 + choose() * 60),
  };
  const discRadius = isThumb ? 130 : 84;

  const start = { x: -80, y: round(focus.y + 120 + random() * 130) };
  const end = { x: COVER_WIDTH + 80, y: round(focus.y - 150 - random() * 120) };
  const c1 = { x: round(focus.x * 0.3), y: start.y };
  const c2 = {
    x: round(focus.x - 150 - random() * 90),
    y: round(focus.y + 70),
  };
  /* Riflessione di c2 sul fuoco: garantisce la tangente continua. */
  const c3 = { x: round(2 * focus.x - c2.x), y: round(2 * focus.y - c2.y) };
  const c4 = { x: round(focus.x + (end.x - focus.x) * 0.55), y: end.y };

  const drops: string[] = [];
  const nodes: ScenePoint[] = [];
  const steps = isThumb ? 2 : 5;

  for (let index = 1; index <= steps; index += 1) {
    const t = index / (steps + 1);
    const onFirst = index % 2 === 1;
    const [p0, p1, p2, p3] = onFirst
      ? [start, c1, c2, focus]
      : [focus, c3, c4, end];

    const x = round(cubicAt(p0.x, p1.x, p2.x, p3.x, t));
    const y = round(cubicAt(p0.y, p1.y, p2.y, p3.y, t));

    if (x > 40 && x < COVER_WIDTH - 40) {
      nodes.push({ x, y });
      drops.push(`M ${x} ${y} L ${x} ${COVER_HEIGHT}`);
    }
  }

  return {
    ...emptyParts(focus),
    subject: { kind: "disc", cx: focus.x, cy: focus.y, r: discRadius },
    glyph: glyphBox(focus, discRadius * 1.16),
    spline: {
      d: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${focus.x} ${focus.y} C ${c3.x} ${c3.y}, ${c4.x} ${c4.y}, ${end.x} ${end.y}`,
      drops,
      nodes,
    },
  };
}

/**
 * Fascio di luce che esce dal soggetto e si allarga fino al bordo, su una
 * griglia ortogonale appena percettibile.
 */
function buildBeam(
  choose: () => number,
  random: () => number,
  isThumb: boolean
): SceneParts {
  const toRight = choose() > 0.5;
  const focus = {
    x: isThumb
      ? 600
      : round(toRight ? 330 + choose() * 90 : 780 - choose() * 90),
    y: isThumb ? 315 : round(300 + choose() * 40),
  };
  const size = isThumb ? 240 : 178;
  const edge = focus.x + (toRight ? size / 2 : -size / 2);
  const far = toRight ? COVER_WIDTH + 80 : -80;
  const near = size * 0.42;
  const spread = 150 + random() * 110;

  const gridLines: string[] = [];

  for (let x = 0; x <= COVER_WIDTH; x += 150) {
    gridLines.push(`M ${x} 0 L ${x} ${COVER_HEIGHT}`);
  }

  for (let y = 0; y <= COVER_HEIGHT; y += 150) {
    gridLines.push(`M 0 ${y} L ${COVER_WIDTH} ${y}`);
  }

  return {
    ...emptyParts(focus),
    subject: tileSubject(focus, size, round(size / 2.4)),
    glyph: glyphBox(focus, size * 0.54),
    beam: {
      cone: `M ${edge.toFixed(1)} ${(focus.y - near / 2).toFixed(1)} L ${far} ${(focus.y - spread).toFixed(1)} L ${far} ${(focus.y + spread).toFixed(1)} L ${edge.toFixed(1)} ${(focus.y + near / 2).toFixed(1)} Z`,
      sourceX: round(edge),
      sourceY: focus.y,
      sourceHeight: round(near),
    },
    gridLines,
  };
}

const BUILDERS: Record<
  CoverSceneKind,
  (choose: () => number, random: () => number, isThumb: boolean) => SceneParts
> = {
  isoChip: buildIsoChip,
  orbit: buildOrbit,
  horizon: buildHorizon,
  stack: buildStack,
  aurora: buildAurora,
  flow: buildFlow,
  keys: buildKeys,
  spline: buildSpline,
  beam: buildBeam,
};

/**
 * Compone la scena di un articolo. Il seme sceglie prima l'archetipo, poi la
 * temperatura di blu, poi la geometria: due articoli che condividono il tag
 * principale, e quindi lo stesso glifo, restano due immagini diverse
 * nell'impianto, non solo nei dettagli.
 *
 * La variante `thumb` ingrandisce il soggetto, lo centra e alleggerisce il
 * contorno, perche a 208px di larghezza il dettaglio sparisce.
 */
export function buildCoverScene(
  seed: string,
  variant: "hero" | "thumb"
): CoverScene {
  const choose = createRandom(hashSeed(seed));
  const kind = COVER_SCENES[Math.floor(choose() * COVER_SCENES.length)];
  const accent = COVER_ACCENTS[Math.floor(choose() * COVER_ACCENTS.length)];
  const isThumb = variant === "thumb";

  const random = createRandom(hashSeed(`${seed}-scene`));
  const parts = BUILDERS[kind](choose, random, isThumb);

  const motes: Mote[] = [];

  for (let index = 0; index < (isThumb ? 0 : 14); index += 1) {
    motes.push({
      cx: round(random() * COVER_WIDTH),
      cy: round(random() * COVER_HEIGHT),
      r: round(1 + random() * 2.6),
      opacity: Number((0.15 + random() * 0.45).toFixed(3)),
    });
  }

  return { kind, accent, motes, ...parts };
}
