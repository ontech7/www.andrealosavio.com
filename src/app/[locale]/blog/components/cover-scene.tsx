import type { BlogTag } from "@/constants/blog";
import {
  buildCoverScene,
  COVER_HEIGHT,
  COVER_WIDTH,
  primaryTag,
} from "@/libs/blog/cover-layout";
import { CoverGlyph } from "./cover-glyph";

export type CoverVariant = "hero" | "thumb";

interface CoverSceneProps {
  translationKey: string;
  tags: readonly BlogTag[];
  variant?: CoverVariant;
}

/**
 * La scena generata dallo `translationKey`: archetipo, temperatura di blu,
 * fuoco e geometria sono deterministici, quindi lo stesso articolo produce
 * sempre lo stesso disegno. Renderizzata inline nella pagina articolo e
 * serializzata su file dalla route delle cover.
 */
export function CoverScene({
  translationKey,
  tags,
  variant = "hero",
}: CoverSceneProps) {
  const tag = primaryTag(tags);
  const {
    kind,
    accent,
    focus,
    subject,
    glyph,
    traces,
    orbits,
    shafts,
    slabs,
    blobs,
    motes,
    wires,
    nodes,
    keys,
    spline,
    beam,
    gridLines,
    horizonY,
  } = buildCoverScene(translationKey, variant);

  const uid = `${translationKey}-${variant}`;
  const id = (name: string) => `${name}-${uid}`;
  const tone = { base: accent.base, light: accent.light, rim: accent.rim };

  return (
    <svg
      viewBox={`0 0 ${COVER_WIDTH} ${COVER_HEIGHT}`}
      className="h-full w-full"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id={id("sky")}
          cx={focus.x / COVER_WIDTH}
          cy={focus.y / COVER_HEIGHT}
          r="0.85"
        >
          <stop offset="0%" stopColor={accent.deep} />
          <stop offset="55%" stopColor="#050912" />
          <stop offset="100%" stopColor="#03060c" />
        </radialGradient>

        <radialGradient
          id={id("bloom")}
          cx={focus.x / COVER_WIDTH}
          cy={focus.y / COVER_HEIGHT}
          r="0.42"
        >
          <stop offset="0%" stopColor={accent.base} stopOpacity="0.75" />
          <stop offset="100%" stopColor={accent.base} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={id("face")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={accent.light} />
          <stop offset="55%" stopColor={accent.base} />
          <stop offset="100%" stopColor={accent.rim} />
        </linearGradient>

        <linearGradient id={id("plate")} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#0b1526" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#060a14" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id={id("glass")} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={accent.light} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent.rim} stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id={id("shaft")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={accent.light} stopOpacity="0.85" />
          <stop offset="100%" stopColor={accent.light} stopOpacity="0" />
        </linearGradient>

        <radialGradient
          id={id("beam")}
          gradientUnits="userSpaceOnUse"
          cx={focus.x}
          cy={focus.y}
          r="620"
        >
          <stop offset="0%" stopColor={accent.light} stopOpacity="0.6" />
          <stop offset="100%" stopColor={accent.base} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={id("horizon-line")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent.base} stopOpacity="0" />
          <stop offset="50%" stopColor={accent.light} stopOpacity="1" />
          <stop offset="100%" stopColor={accent.base} stopOpacity="0" />
        </linearGradient>

        {/* Profondita di campo: la scena si spegne allontanandosi dal fuoco. */}
        <radialGradient
          id={id("depth")}
          cx={focus.x / COVER_WIDTH}
          cy={focus.y / COVER_HEIGHT}
          r="0.72"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <mask id={id("depth-mask")}>
          <rect
            width={COVER_WIDTH}
            height={COVER_HEIGHT}
            fill={`url(#${id("depth")})`}
          />
        </mask>

        <filter
          id={id("bloom-filter")}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
        >
          <feGaussianBlur stdDeviation="14" />
        </filter>

        <filter
          id={id("subject-glow")}
          x="-45%"
          y="-45%"
          width="190%"
          height="190%"
        >
          <feGaussianBlur stdDeviation="22" result="blurred" />
          <feMerge>
            <feMergeNode in="blurred" />
            <feMergeNode in="blurred" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={id("far-blur")}>
          <feGaussianBlur stdDeviation="3.5" />
        </filter>

        <filter id={id("aurora-blur")}>
          <feGaussianBlur stdDeviation="70" />
        </filter>

        <filter
          id={id("mark-shadow")}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="7"
            floodColor="#03102a"
            floodOpacity="0.55"
          />
        </filter>
      </defs>

      <rect
        width={COVER_WIDTH}
        height={COVER_HEIGHT}
        fill={`url(#${id("sky")})`}
      />

      {kind === "aurora" && (
        <g
          filter={`url(#${id("aurora-blur")})`}
          mask={`url(#${id("depth-mask")})`}
        >
          {blobs.map((blob) => (
            <ellipse
              key={`${blob.cx}-${blob.cy}-${blob.rx}`}
              cx={blob.cx}
              cy={blob.cy}
              rx={blob.rx}
              ry={blob.ry}
              fill={tone[blob.tone]}
              opacity={blob.opacity}
              transform={`rotate(${blob.rotate} ${blob.cx} ${blob.cy})`}
            />
          ))}
        </g>
      )}

      <g mask={`url(#${id("depth-mask")})`}>
        {gridLines.length > 0 && (
          <g
            fill="none"
            stroke={accent.light}
            strokeWidth="1"
            opacity={kind === "horizon" ? 0.16 : 0.045}
            filter={kind === "horizon" ? undefined : `url(#${id("far-blur")})`}
          >
            {gridLines.map((line) => (
              <path key={line} d={line} />
            ))}
          </g>
        )}

        {kind === "horizon" && (
          <>
            <g fill={`url(#${id("shaft")})`}>
              {shafts.map((shaft) => (
                <rect
                  key={`${shaft.x}-${shaft.height}`}
                  x={shaft.x}
                  y={horizonY - shaft.height}
                  width={shaft.width}
                  height={shaft.height}
                  opacity={shaft.opacity}
                />
              ))}
            </g>
            <rect
              x="0"
              y={horizonY - 2}
              width={COVER_WIDTH}
              height="4"
              fill={`url(#${id("horizon-line")})`}
              filter={`url(#${id("bloom-filter")})`}
            />
            <rect
              x="0"
              y={horizonY - 1}
              width={COVER_WIDTH}
              height="2"
              fill={`url(#${id("horizon-line")})`}
            />
          </>
        )}

        {kind === "isoChip" && (
          <>
            <g
              fill="none"
              stroke={accent.base}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
              filter={`url(#${id("bloom-filter")})`}
            >
              {traces.map((trace) => (
                <path
                  key={trace.d}
                  d={trace.d}
                  strokeWidth={trace.width * 4}
                  opacity={trace.opacity}
                />
              ))}
            </g>
            <g
              fill="none"
              stroke={accent.light}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {traces.map((trace) => (
                <path
                  key={trace.d}
                  d={trace.d}
                  strokeWidth={trace.width}
                  opacity={trace.opacity}
                />
              ))}
            </g>
          </>
        )}

        {kind === "orbit" && (
          <g fill="none" stroke={accent.light}>
            {orbits.map((orbit) => (
              <ellipse
                key={`${orbit.rx}-${orbit.rotate}`}
                cx={focus.x}
                cy={focus.y}
                rx={orbit.rx}
                ry={orbit.ry}
                strokeWidth={orbit.width}
                strokeDasharray={orbit.dash}
                opacity={orbit.opacity}
                transform={`rotate(${orbit.rotate} ${focus.x} ${focus.y})`}
              />
            ))}
          </g>
        )}

        {kind === "flow" && (
          <>
            <g
              fill="none"
              stroke={accent.base}
              strokeLinecap="round"
              opacity="0.6"
              filter={`url(#${id("bloom-filter")})`}
            >
              {wires.map((wire) => (
                <path
                  key={wire.d}
                  d={wire.d}
                  strokeWidth={wire.width * 4}
                  opacity={wire.opacity}
                />
              ))}
            </g>
            <g fill="none" stroke={accent.light} strokeLinecap="round">
              {wires.map((wire) => (
                <path
                  key={wire.d}
                  d={wire.d}
                  strokeWidth={wire.width}
                  opacity={wire.opacity}
                />
              ))}
            </g>
            {nodes.map((node) => (
              <g key={`${node.x}-${node.y}`} opacity={node.opacity}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx={node.radius}
                  fill="#070d1a"
                  stroke={accent.base}
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                />
                <circle
                  cx={node.x + node.height * 0.5}
                  cy={node.y + node.height / 2}
                  r={node.height * 0.16}
                  fill={accent.light}
                  opacity="0.8"
                />
              </g>
            ))}
          </>
        )}

        {kind === "keys" && (
          <g fill="#060b16" stroke={accent.light} strokeWidth="2.5">
            {keys
              .filter((key) => !key.lit)
              .map((key) => (
                <rect
                  key={`${key.x}-${key.size}`}
                  x={key.x}
                  y={key.y}
                  width={key.size}
                  height={key.size}
                  rx={key.radius}
                  strokeOpacity="0.9"
                  opacity={key.opacity}
                />
              ))}
          </g>
        )}

        {kind === "spline" && spline && (
          <>
            <g stroke={accent.light} strokeWidth="1" opacity="0.22">
              {spline.drops.map((drop) => (
                <path key={drop} d={drop} />
              ))}
            </g>
            <path
              d={spline.d}
              fill="none"
              stroke={accent.base}
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.5"
              filter={`url(#${id("bloom-filter")})`}
            />
            <path
              d={spline.d}
              fill="none"
              stroke={accent.light}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <g fill={accent.light}>
              {spline.nodes.map((node) => (
                <circle
                  key={`${node.x}-${node.y}`}
                  cx={node.x}
                  cy={node.y}
                  r="7"
                />
              ))}
            </g>
          </>
        )}

        {kind === "beam" && beam && (
          <>
            <path
              d={beam.cone}
              fill={`url(#${id("beam")})`}
              filter={`url(#${id("bloom-filter")})`}
            />
            <path d={beam.cone} fill={`url(#${id("beam")})`} opacity="0.55" />
            <rect
              x={beam.sourceX - 2}
              y={beam.sourceY - beam.sourceHeight / 2}
              width="4"
              height={beam.sourceHeight}
              rx="2"
              fill="#ffffff"
              filter={`url(#${id("bloom-filter")})`}
            />
            <rect
              x={beam.sourceX - 1.5}
              y={beam.sourceY - beam.sourceHeight / 2}
              width="3"
              height={beam.sourceHeight}
              rx="1.5"
              fill="#ffffff"
            />
          </>
        )}

        {kind === "stack" && (
          <g filter={`url(#${id("far-blur")})`}>
            {slabs.map((slab) => (
              <rect
                key={`${slab.x}-${slab.y}-${slab.width}`}
                x={slab.x}
                y={slab.y}
                width={slab.width}
                height={slab.height}
                rx={slab.radius}
                fill={`url(#${id("glass")})`}
                stroke={accent.light}
                strokeWidth="1.5"
                strokeOpacity="0.5"
                opacity={slab.opacity}
              />
            ))}
          </g>
        )}

        <g fill={accent.light}>
          {motes.map((mote) => (
            <circle
              key={`${mote.cx}-${mote.cy}`}
              cx={mote.cx}
              cy={mote.cy}
              r={mote.r}
              opacity={mote.opacity}
            />
          ))}
        </g>
      </g>

      <ellipse
        cx={focus.x}
        cy={focus.y}
        rx={COVER_WIDTH * 0.34}
        ry={COVER_HEIGHT * 0.42}
        fill={`url(#${id("bloom")})`}
        opacity="0.5"
      />

      {subject.kind === "chip" && (
        <>
          <path
            d={subject.plate}
            fill={`url(#${id("plate")})`}
            stroke={accent.rim}
            strokeWidth="2"
            strokeOpacity="0.7"
            strokeLinejoin="round"
          />
          <g filter={`url(#${id("subject-glow")})`}>
            <path d={subject.left} fill={accent.rim} opacity="0.9" />
            <path d={subject.right} fill={accent.deep} opacity="0.95" />
            <path
              d={subject.top}
              fill={`url(#${id("face")})`}
              stroke={`url(#${id("face")})`}
              strokeWidth="22"
              strokeLinejoin="round"
            />
          </g>
        </>
      )}

      {subject.kind === "disc" && (
        <g filter={`url(#${id("subject-glow")})`}>
          <circle
            cx={subject.cx}
            cy={subject.cy}
            r={subject.r * 1.18}
            fill={accent.deep}
            opacity="0.85"
          />
          <circle
            cx={subject.cx}
            cy={subject.cy}
            r={subject.r}
            fill={`url(#${id("face")})`}
            stroke={accent.light}
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        </g>
      )}

      {subject.kind === "tile" && (
        <g filter={`url(#${id("subject-glow")})`}>
          <rect
            x={subject.x - subject.size * 0.16}
            y={subject.y - subject.size * 0.16}
            width={subject.size * 1.32}
            height={subject.size * 1.32}
            rx={subject.radius * 1.32}
            fill={accent.deep}
            opacity="0.85"
          />
          <rect
            x={subject.x}
            y={subject.y}
            width={subject.size}
            height={subject.size}
            rx={subject.radius}
            fill={`url(#${id("face")})`}
            stroke={accent.light}
            strokeWidth="2"
            strokeOpacity="0.75"
          />
        </g>
      )}

      <g filter={`url(#${id("mark-shadow")})`}>
        <CoverGlyph
          tag={tag}
          paint="#ffffff"
          fillPaint="#ffffff"
          x={glyph.x}
          y={glyph.y}
          size={glyph.size}
          strokeWidth={4.5}
        />
      </g>
    </svg>
  );
}
