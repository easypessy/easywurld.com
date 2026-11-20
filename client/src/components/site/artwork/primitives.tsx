import type { Visual } from "@/data";

export const W = 800;
export const H = 500;

export type Ctx = {
  bg: string;
  ink: string;
  ac: string;
  mu: string;
  hf: string;
  bf: string;
  v: Visual;
};

export const ctx = (v: Visual): Ctx => ({
  bg: v.bg,
  ink: v.ink,
  ac: v.accent,
  mu: v.muted,
  hf: v.head,
  bf: v.body,
  v,
});

/** soft translucent ink */
export const tint = (hex: string, o: number) => ({ fill: hex, fillOpacity: o });

export function Box(p: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  o?: number;
  r?: number;
  stroke?: string;
  so?: number;
  sw?: number;
}) {
  return (
    <rect
      x={p.x}
      y={p.y}
      width={p.w}
      height={p.h}
      rx={p.r ?? 0}
      fill={p.fill}
      fillOpacity={p.o ?? 1}
      stroke={p.stroke}
      strokeOpacity={p.so ?? 1}
      strokeWidth={p.sw ?? 1}
    />
  );
}

export function TextLines(p: {
  x: number;
  y: number;
  w: number;
  n: number;
  gap?: number;
  fill: string;
  o?: number;
  h?: number;
  last?: number;
}) {
  const gap = p.gap ?? 9,
    h = p.h ?? 3.4;
  return (
    <>
      {Array.from({ length: p.n }).map((_, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y + i * gap}
          width={i === p.n - 1 ? p.w * (p.last ?? 0.62) : p.w}
          height={h}
          rx={h / 2}
          fill={p.fill}
          fillOpacity={p.o ?? 0.26}
        />
      ))}
    </>
  );
}

export function T(p: {
  x: number;
  y: number;
  children: string;
  font: string;
  size: number;
  fill: string;
  weight?: number | string;
  anchor?: "start" | "middle" | "end";
  ls?: number;
  o?: number;
}) {
  return (
    <text
      x={p.x}
      y={p.y}
      fontFamily={p.font}
      fontSize={p.size}
      fill={p.fill}
      fontWeight={p.weight ?? 400}
      textAnchor={p.anchor ?? "start"}
      letterSpacing={p.ls ?? 0}
      opacity={p.o ?? 1}
    >
      {p.children}
    </text>
  );
}

/** wrapped text via foreignObject — for real headline blocks */
export function Head(p: {
  x: number;
  y: number;
  w: number;
  h: number;
  children: string;
  font: string;
  size: number;
  fill: string;
  weight?: number;
  lh?: number;
  ls?: string;
  align?: string;
}) {
  return (
    <foreignObject x={p.x} y={p.y} width={p.w} height={p.h}>
      <div
        style={{
          fontFamily: p.font,
          fontSize: `${p.size}px`,
          fontWeight: p.weight ?? 700,
          lineHeight: p.lh ?? 1.08,
          color: p.fill,
          letterSpacing: p.ls ?? "-0.02em",
          textAlign: (p.align as any) ?? "left",
        }}
      >
        {p.children}
      </div>
    </foreignObject>
  );
}

export function Btn(p: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  bg: string;
  fg: string;
  font: string;
  size?: number;
  r?: number;
}) {
  return (
    <>
      <rect
        x={p.x}
        y={p.y}
        width={p.w}
        height={p.h}
        rx={p.r ?? 2}
        fill={p.bg}
      />
      <text
        x={p.x + p.w / 2}
        y={p.y + p.h / 2 + 3.4}
        textAnchor="middle"
        fontFamily={p.font}
        fontSize={p.size ?? 9}
        fontWeight={600}
        fill={p.fg}
      >
        {p.label}
      </text>
    </>
  );
}

/** a photograph stand-in — diagonal hatch so it never reads as a real photo */
export function Photo(p: {
  x: number;
  y: number;
  w: number;
  h: number;
  c: Ctx;
  o?: number;
  id: string;
  r?: number;
}) {
  const pid = `h-${p.id}`;
  return (
    <>
      <defs>
        <pattern
          id={pid}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <rect
            width="8"
            height="8"
            fill={p.c.ac}
            fillOpacity={(p.o ?? 0.18) * 0.8}
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke={p.c.ink}
            strokeOpacity="0.07"
            strokeWidth="3"
          />
        </pattern>
      </defs>
      <rect
        x={p.x}
        y={p.y}
        width={p.w}
        height={p.h}
        rx={p.r ?? 0}
        fill={`url(#${pid})`}
      />
    </>
  );
}

export function Svg({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {children}
    </svg>
  );
}
