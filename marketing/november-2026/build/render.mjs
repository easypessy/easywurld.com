/**
 * Easywurld — November carousel renderer.
 *
 *   node marketing/november-2026/build/render.mjs            # render every post
 *   node marketing/november-2026/build/render.mjs day-01     # render one post
 *
 * Each slide is built as SVG (so the text is always exactly right, unlike an
 * image model) and rasterised with @resvg/resvg-js using the real brand fonts:
 * Fraunces for headlines, Inter for body, JetBrains Mono for labels.
 *
 * Output per post:  marketing/november-2026/<folder>/01-hook.png … CAPTION.md
 * Edit the words in ../posts.mjs, never the PNGs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";
import { Resvg } from "@resvg/resvg-js";
import { posts as flagshipPosts } from "../posts.mjs";

/** Day packs live in days.mjs and are merged in when present. */
let dayPosts = [];
try {
  const mod = await import("../days.mjs");
  dayPosts = mod.dayPosts ?? [];
} catch {
  dayPosts = [];
}
import { generatedPosts } from "../content/compose.mjs";

const posts = [...flagshipPosts, ...dayPosts, ...generatedPosts];

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const fontDir = path.join(root, "assets", "fonts");
const repoRoot = path.resolve(root, "..", "..");
const shotCache = new Map();

/** Real work, embedded as a data URI so the render is self-contained. */
function shot(pathInRepo) {
  if (!shotCache.has(pathInRepo)) {
    const abs = path.resolve(repoRoot, pathInRepo);
    if (!fs.existsSync(abs)) throw new Error(`Screenshot not found: ${pathInRepo}`);
    shotCache.set(pathInRepo, `data:image/jpeg;base64,${fs.readFileSync(abs).toString("base64")}`);
  }
  return shotCache.get(pathInRepo);
}

const C = {
  cream: "#FAE7C7",
  creamSoft: "#F6DEB6",
  deep: "#0A4937",
  leaf: "#27473A",
  terra: "#9E4E2C",
  ink: "#14170F",
  paper: "#FBF9F4",
  line: "rgba(10,73,55,.20)",
  muted: "rgba(10,73,55,.62)",
};

const MARK = (() => {
  const f = path.join(root, "assets", "mark.png");
  return fs.existsSync(f) ? `data:image/png;base64,${fs.readFileSync(f).toString("base64")}` : null;
})();

const FONTS = {
  display: { file: path.join(fontDir, "Fraunces-700.ttf"), name: "Fraunces" },
  displaySoft: { file: path.join(fontDir, "Fraunces-600.ttf"), name: "Fraunces" },
  body: { file: path.join(fontDir, "Inter-400.ttf"), name: "Inter" },
  bodyMed: { file: path.join(fontDir, "Inter-500.ttf"), name: "Inter" },
  bodySemi: { file: path.join(fontDir, "Inter-600.ttf"), name: "Inter" },
  mono: { file: path.join(fontDir, "Mono-500.ttf"), name: "JetBrains Mono" },
};
for (const f of Object.values(FONTS)) f.font = fontkit.openSync(f.file);

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Width of a string in px at a given size, using real glyph metrics. */
function measure(text, face, size) {
  const { font } = FONTS[face];
  return font.glyphsForString(text).reduce((sum, g) => sum + g.advanceWidth, 0) * (size / font.unitsPerEm);
}

function wrap(text, face, size, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate, face, size) <= maxWidth || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Pick the largest headline size whose wrapped text fits the box. */
function fitHeadline(text, boxWidth, boxHeight, { max = 92, min = 48, face = "display", lh = 1.1 } = {}) {
  let fallback = null;
  for (let size = max; size >= min; size -= 2) {
    const lines = wrap(text, face, size, boxWidth);
    const lineH = size * lh;
    const widths = lines.map((l) => measure(l, face, size));
    const widest = Math.max(...widths);
    const narrowest = Math.min(...widths);
    const fits = lines.length * lineH <= boxHeight && widest <= boxWidth;
    if (!fits) continue;
    const candidate = { size, lines, lineH };
    if (!fallback) fallback = candidate;
    // Reject ragged shapes: a one-word orphan line looks like a mistake.
    if (lines.length === 1 || narrowest >= widest * 0.52) return candidate;
  }
  if (fallback) return fallback;
  const size = min;
  return { size, lines: wrap(text, face, size, boxWidth), lineH: size * lh };
}

function textBlock(lines, { face, size, x, y, lineH, fill, anchor = "start", spacing = 0 }) {
  const family = FONTS[face].name;
  const weight = face.includes("Semi") ? 600 : face.includes("Med") ? 500 : 400;
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lineH}" font-family="${family}" font-size="${size}" font-weight="${
          face === "display" ? 700 : face === "displaySoft" ? 600 : weight
        }" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}">${esc(line)}</text>`,
    )
    .join("\n");
}

/* ------------------------------------------------------------------ art */

const ART = {
  browser({ accent = C.terra } = {}) {
    const rows = [0.42, 0.7, 0.55, 0.85, 0.32];
    return `
    <g>
      <rect x="0" y="0" width="560" height="360" rx="18" fill="${C.paper}" stroke="${C.line}"/>
      <rect x="0" y="0" width="560" height="44" rx="18" fill="${C.creamSoft}"/>
      <rect x="0" y="30" width="560" height="14" fill="${C.creamSoft}"/>
      <circle cx="26" cy="22" r="5" fill="${accent}"/><circle cx="44" cy="22" r="5" fill="${C.line}"/><circle cx="62" cy="22" r="5" fill="${C.line}"/>
      <rect x="90" y="14" width="240" height="16" rx="8" fill="${C.paper}"/>
      <rect x="34" y="76" width="300" height="26" rx="6" fill="${C.deep}" opacity="0.92"/>
      <rect x="34" y="112" width="230" height="14" rx="6" fill="${C.ink}" opacity="0.35"/>
      <rect x="34" y="134" width="270" height="14" rx="6" fill="${C.ink}" opacity="0.20"/>
      <rect x="34" y="176" width="150" height="42" rx="8" fill="${accent}"/>
      ${rows
        .map((w, i) => `<rect x="34" y="${244 + i * 20}" width="${Math.round(300 * w)}" height="10" rx="5" fill="${C.ink}" opacity="0.14"/>`)
        .join("")}
      <rect x="380" y="76" width="146" height="150" rx="10" fill="${C.creamSoft}"/>
      <circle cx="453" cy="132" r="26" fill="${C.paper}"/>
      <rect x="380" y="244" width="146" height="60" rx="10" fill="${C.creamSoft}"/>
    </g>`;
  },

  phone({ accent = C.terra } = {}) {
    return `
    <g>
      <rect x="0" y="0" width="270" height="430" rx="34" fill="${C.paper}" stroke="${C.line}" stroke-width="2"/>
      <rect x="14" y="18" width="242" height="34" rx="10" fill="${C.creamSoft}"/>
      <rect x="26" y="30" width="120" height="10" rx="5" fill="${C.ink}" opacity="0.28"/>
      <rect x="24" y="76" width="180" height="58" rx="14" fill="${C.creamSoft}"/>
      <rect x="24" y="150" width="150" height="46" rx="14" fill="${accent}" opacity="0.9"/>
      <rect x="24" y="214" width="196" height="58" rx="14" fill="${C.creamSoft}"/>
      <rect x="24" y="292" width="132" height="46" rx="14" fill="${C.creamSoft}"/>
      <rect x="24" y="356" width="210" height="40" rx="20" fill="${C.deep}"/>
      <text x="129" y="382" font-family="Inter" font-size="17" font-weight="600" fill="${C.paper}" text-anchor="middle">Message</text>
    </g>`;
  },

  quote() {
    return `<text x="-8" y="150" font-family="Fraunces" font-size="300" font-weight="700" fill="${C.terra}" opacity="0.28">&#8220;</text>`;
  },

  list({ items = 3, accent = C.terra } = {}) {
    return Array.from({ length: items })
      .map(
        (_, i) => `
      <g transform="translate(0 ${i * 78})">
        <circle cx="26" cy="26" r="24" fill="none" stroke="${C.deep}" stroke-width="2"/>
        <text x="26" y="36" font-family="JetBrains Mono" font-size="22" fill="${C.deep}" text-anchor="middle">${i + 1}</text>
        <rect x="76" y="14" width="${300 - i * 24}" height="16" rx="8" fill="${C.ink}" opacity="0.18"/>
        <rect x="76" y="42" width="${210 + i * 18}" height="12" rx="6" fill="${C.ink}" opacity="0.10"/>
      </g>`,
      )
      .join("");
  },

  split() {
    return `
    <g>
      <rect x="0" y="0" width="250" height="300" rx="14" fill="${C.creamSoft}"/>
      <text x="20" y="34" font-family="JetBrains Mono" font-size="18" fill="${C.muted}">BEFORE</text>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="20" y="${62 + i * 34}" width="${200 - i * 22}" height="12" rx="6" fill="${C.ink}" opacity="0.16"/>`).join("")}
      <rect x="300" y="0" width="250" height="300" rx="14" fill="${C.paper}" stroke="${C.deep}" stroke-width="2"/>
      <text x="320" y="34" font-family="JetBrains Mono" font-size="18" fill="${C.deep}">AFTER</text>
      <rect x="320" y="60" width="150" height="26" rx="5" fill="${C.deep}" opacity="0.9"/>
      <rect x="320" y="100" width="120" height="12" rx="6" fill="${C.ink}" opacity="0.25"/>
      <rect x="320" y="124" width="170" height="12" rx="6" fill="${C.ink}" opacity="0.18"/>
      <rect x="320" y="160" width="120" height="36" rx="8" fill="${C.terra}"/>
      <rect x="320" y="216" width="190" height="10" rx="5" fill="${C.ink}" opacity="0.12"/>
      <rect x="320" y="236" width="150" height="10" rx="5" fill="${C.ink}" opacity="0.12"/>
    </g>`;
  },

  clock({ label = "10 SECONDS" } = {}) {
    return `
    <g>
      <circle cx="140" cy="140" r="128" fill="${C.paper}" stroke="${C.deep}" stroke-width="3"/>
      <circle cx="140" cy="140" r="8" fill="${C.terra}"/>
      <line x1="140" y1="140" x2="140" y2="58" stroke="${C.deep}" stroke-width="7" stroke-linecap="round"/>
      <line x1="140" y1="140" x2="196" y2="168" stroke="${C.terra}" stroke-width="7" stroke-linecap="round"/>
      <text x="140" y="330" font-family="JetBrains Mono" font-size="24" letter-spacing="2" fill="${C.muted}" text-anchor="middle">${esc(label)}</text>
    </g>`;
  },

  steps() {
    return Array.from({ length: 4 })
      .map(
        (_, i) => `
      <g transform="translate(${i * 150} 0)">
        <circle cx="34" cy="34" r="30" fill="${i === 3 ? C.terra : "none"}" stroke="${i === 3 ? C.terra : C.deep}" stroke-width="2"/>
        <text x="34" y="43" font-family="JetBrains Mono" font-size="22" fill="${i === 3 ? C.paper : C.deep}" text-anchor="middle">${i + 1}</text>
        ${i < 3 ? `<line x1="70" y1="34" x2="144" y2="34" stroke="${C.deep}" stroke-width="2" stroke-dasharray="4 6"/>` : ""}
      </g>`,
      )
      .join("");
  },

  seal({ label = "CLEAR" } = {}) {
    return `
    <g>
      <circle cx="130" cy="130" r="118" fill="none" stroke="${C.deep}" stroke-width="2"/>
      <circle cx="130" cy="130" r="100" fill="none" stroke="${C.terra}" stroke-width="1.5" stroke-dasharray="3 7"/>
      <text x="130" y="122" font-family="Fraunces" font-size="30" font-weight="700" fill="${C.deep}" text-anchor="middle">MESSAGE</text>
      <text x="130" y="166" font-family="Fraunces" font-size="44" font-weight="700" fill="${C.terra}" text-anchor="middle">${esc(label)}</text>
    </g>`;
  },

  shot({ img, tag = "CONCEPT BUILD", label = "", cropTop = 0.085, zoom = 1, focusX = 0.5 } = {}) {
    if (!img) return "";
    const crop = Math.round(336 * cropTop);
    const zoomW = Math.round(580 * zoom);
    const zoomH = Math.round((336 + crop) * zoom);
    const imgX = 10 - Math.round((zoomW - 580) * focusX);
    const imgY = 60 - crop - Math.round(((zoomH - (336 + crop)) * 0.45));
    return `
    <g>
      <rect x="0" y="10" width="600" height="400" rx="16" fill="${C.paper}" stroke="${C.line}"/>
      <rect x="0" y="10" width="600" height="42" rx="16" fill="${C.creamSoft}"/>
      <rect x="0" y="36" width="600" height="16" fill="${C.creamSoft}"/>
      <circle cx="26" cy="31" r="5" fill="${C.terra}"/><circle cx="44" cy="31" r="5" fill="${C.line}"/><circle cx="62" cy="31" r="5" fill="${C.line}"/>
      <rect x="86" y="22" width="220" height="18" rx="9" fill="${C.paper}"/>
      <defs><clipPath id="shotclip"><rect x="10" y="60" width="580" height="336" rx="8"/></clipPath></defs>
      <image href="${shot(img)}" x="${imgX}" y="${imgY}" width="${zoomW}" height="${zoomH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#shotclip)"/>
      <rect x="${600 - Math.round(tag.length * 9.6) - 34}" y="16" width="${Math.round(tag.length * 9.6) + 34}" height="30" rx="15" fill="${C.terra}"/>
      <text x="${600 - (Math.round(tag.length * 9.6) + 34) / 2}" y="37" font-family="JetBrains Mono" font-size="15" letter-spacing="2" fill="${C.paper}" text-anchor="middle">${esc(tag.toUpperCase())}</text>
      ${label ? `<text x="0" y="446" font-family="JetBrains Mono" font-size="19" letter-spacing="2.2" fill="${C.muted}">${esc(label.toUpperCase())}</text>` : ""}
    </g>`;
  },

  /** Location: a pin on a hand-drawn map, no stock photography. */
  pin({ label = "LAGOS, NIGERIA" } = {}) {
    return `
    <g>
      <rect x="0" y="0" width="420" height="300" rx="18" fill="${C.paper}" stroke="${C.line}"/>
      <path d="M40 60 H380 M40 140 H380 M40 220 H380" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="6 8"/>
      <path d="M110 20 V280 M230 20 V280 M330 20 V280" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="6 8"/>
      <circle cx="210" cy="132" r="52" fill="${C.terra}" opacity="0.14"/>
      <path d="M210 92 c-20 0 -34 15 -34 34 0 24 34 54 34 54 s34 -30 34 -54 c0 -19 -14 -34 -34 -34 z" fill="${C.deep}"/>
      <circle cx="210" cy="126" r="12" fill="${C.cream}"/>
      <text x="0" y="336" font-family="JetBrains Mono" font-size="20" letter-spacing="2.4" fill="${C.muted}">${esc(label.toUpperCase())}</text>
    </g>`;
  },

  none() {
    return "";
  },
};

/* --------------------------------------------------------------- slide */

function footerMarkup({ H, W, M, tall, index, total }) {
  const footY = H - (tall ? 120 : 96);
  return [
    `<line x1="${M}" y1="${footY - 42}" x2="${W - M}" y2="${footY - 42}" stroke="${C.line}" stroke-width="1.5"/>`,
    `<text x="${M}" y="${footY}" font-family="JetBrains Mono" font-size="${tall ? 20 : 18}" letter-spacing="2.4" fill="${C.muted}">EASYWURLD</text>`,
    `<text x="${W / 2}" y="${footY}" font-family="JetBrains Mono" font-size="${tall ? 20 : 18}" letter-spacing="2.4" fill="${C.muted}" text-anchor="middle">SIMPLIFY. OPTIMIZE. GROW.</text>`,
    `<text x="${W - M}" y="${footY}" font-family="JetBrains Mono" font-size="${tall ? 20 : 18}" letter-spacing="2.4" fill="${C.muted}" text-anchor="end">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>`,
  ].join("\n");
}

/** A hook slide is one sentence, so it sits in the optical centre of the page. */
function hookSvg({ slide, index, total, tall, W, H, M, boxWidth }) {
  const head = fitHeadline(slide.headline, boxWidth, tall ? 700 : 620, { max: tall ? 116 : 108, min: 46 });
  const used = head.lines.length * head.lineH;
  const blockH = used + (tall ? 190 : 160);
  const top = Math.max(M + 90, (H - blockH) / 2 - (tall ? 60 : 40));
  const parts = [
    `<rect width="${W}" height="${H}" fill="${C.cream}"/>`,
    `<rect x="${M / 2}" y="${M / 2}" width="${W - M}" height="${H - M}" fill="none" stroke="${C.line}" stroke-width="1.5" rx="6"/>`,
    `<text x="${M}" y="${top}" font-family="JetBrains Mono" font-size="${tall ? 24 : 22}" letter-spacing="3.6" fill="${C.terra}">${esc((slide.eyebrow ?? "EASYWURLD").toUpperCase())}</text>`,
    `<rect x="${M}" y="${top + 34}" width="72" height="3" fill="${C.deep}" opacity="0.5"/>`,
    textBlock(head.lines, { face: "display", size: head.size, x: M, y: top + (tall ? 150 : 128), lineH: head.lineH, fill: C.deep }),
  ];
  if (slide.foot) {
    const size = tall ? 34 : 30;
    const lines = wrap(slide.foot, "displaySoft", size, boxWidth);
    const fy = top + (tall ? 150 : 128) + used + 56;
    parts.push(`<rect x="${M}" y="${fy + 4}" width="4" height="${lines.length * size * 1.4}" fill="${C.terra}"/>`);
    parts.push(textBlock(lines, { face: "displaySoft", size, x: M + 22, y: fy + size, lineH: size * 1.4, fill: C.deep }));
  }
  if (MARK) {
    const size = tall ? 96 : 82;
    parts.push(`<image x="${W - M - size}" y="${M + 6}" width="${size}" height="${size}" href="${MARK}" opacity="0.95"/>`);
  }
  parts.push(footerMarkup({ H, W, M, tall, index, total }));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("\n")}</svg>`;
}

function slideSvg({ slide, index, total, format }) {
  const tall = format === "story";
  const W = 1080;
  const H = tall ? 1920 : 1350;
  const M = 92;
  const boxWidth = W - M * 2;

  const eyebrow = (slide.eyebrow ?? "EASYWURLD").toUpperCase();
  const isHook = slide.kind === "hook";
  const artKind = slide.art?.type ?? "none";
  if (isHook && artKind === "none") return hookSvg({ slide, index, total, tall, W, H, M, boxWidth });
  let y = tall ? 250 : 190;

  const parts = [];
  parts.push(`<rect width="${W}" height="${H}" fill="${C.cream}"/>`);

  // A quiet frame line, the only decoration on text-only slides.
  parts.push(`<rect x="${M / 2}" y="${M / 2}" width="${W - M}" height="${H - M}" fill="none" stroke="${C.line}" stroke-width="1.5" rx="6"/>`);

  parts.push(
    `<text x="${M}" y="${y}" font-family="JetBrains Mono" font-size="${tall ? 24 : 22}" letter-spacing="3.6" fill="${C.terra}">${esc(eyebrow)}</text>`,
  );
  y += tall ? 34 : 30;
  parts.push(`<rect x="${M}" y="${y}" width="72" height="3" fill="${C.deep}" opacity="0.5"/>`);
  y += tall ? 110 : 96;

  // Headline
  const artType = slide.art?.type ?? "none";
  const hasArt = artType !== "none";
  const headlineHeight = tall ? 520 : isHook ? 620 : 420;
  const head = fitHeadline(slide.headline, boxWidth, headlineHeight, {
    max: isHook ? (tall ? 108 : 100) : 78,
    min: 40,
  });
  parts.push(
    textBlock(head.lines, { face: "display", size: head.size, x: M, y, lineH: head.lineH, fill: C.deep }),
  );
  y += head.lines.length * head.lineH + (tall ? 46 : 34);

  // Body
  if (slide.body) {
    const size = tall ? 36 : 32;
    const bodyLines = wrap(slide.body, "body", size, boxWidth - 40);
    parts.push(
      textBlock(bodyLines, { face: "body", size, x: M, y, lineH: size * 1.5, fill: C.ink }),
    );
    y += bodyLines.length * size * 1.5 + 24;
  }

  // Optional emphasis line
  if (slide.foot) {
    const size = tall ? 34 : 30;
    const lines = wrap(slide.foot, "displaySoft", size, boxWidth);
    parts.push(`<rect x="${M}" y="${y + 6}" width="4" height="${lines.length * size * 1.4}" fill="${C.terra}"/>`);
    parts.push(
      textBlock(lines, { face: "displaySoft", size, x: M + 22, y: y + size, lineH: size * 1.4, fill: C.deep }),
    );
    y += lines.length * size * 1.4 + 24;
  }

  // Art in whatever space is left — big enough to carry the idea.
  if (hasArt) {
    const availH = H - y - (tall ? 300 : 250);
    const art = ART[artType](slide.art ?? {});
    const natural =
      { browser: [560, 360], phone: [270, 430], quote: [400, 200], list: [420, 230], split: [550, 300], clock: [280, 360], steps: [560, 70], seal: [260, 260], pin: [420, 352], shot: [600, 460], none: [1, 1] }[artType] ?? [400, 300];
    const quote = artType === "quote";
    const seal = artType === "seal";
    const maxW = quote ? boxWidth * 0.5 : seal ? 340 : boxWidth;
    const cap = artType === "shot" ? 1.45 : 2.4;
    const scale = Math.min(cap, availH / natural[1], maxW / natural[0]);
    const artW = natural[0] * scale;
    const artH = natural[1] * scale;
    const left = quote ? W - M - artW : seal ? W - M - artW : M + (boxWidth - artW) / 2;
    const top = quote ? y - natural[1] * scale * 0.35 : seal ? y + 10 : y + Math.max(8, (availH - artH) / 2);
    parts.push(`<g transform="translate(${left} ${top}) scale(${scale.toFixed(3)})">${art}</g>`);
  }

  if (MARK && (isHook || slide.kind === "cta")) {
    const size = tall ? 96 : 82;
    parts.push(`<image x="${W - M - size}" y="${M + 6}" width="${size}" height="${size}" href="${MARK}" opacity="0.95"/>`);
  }

  // Footer
  const footY = H - (tall ? 120 : 96);
  parts.push(`<line x1="${M}" y1="${footY - 42}" x2="${W - M}" y2="${footY - 42}" stroke="${C.line}" stroke-width="1.5"/>`);
  parts.push(
    `<text x="${M}" y="${footY}" font-family="JetBrains Mono" font-size="${tall ? 20 : 18}" letter-spacing="2.4" fill="${C.muted}">EASYWURLD</text>`,
  );
  parts.push(
    `<text x="${W / 2}" y="${footY}" font-family="JetBrains Mono" font-size="${tall ? 20 : 18}" letter-spacing="2.4" fill="${C.muted}" text-anchor="middle">SIMPLIFY. OPTIMIZE. GROW.</text>`,
  );
  parts.push(
    `<text x="${W - M}" y="${footY}" font-family="JetBrains Mono" font-size="${tall ? 20 : 18}" letter-spacing="2.4" fill="${C.muted}" text-anchor="end">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("\n")}</svg>`;
}

function renderPng(svg, outFile) {
  const resvg = new Resvg(svg, {
    font: {
      fontFiles: Object.values(FONTS).map((f) => f.file),
      loadSystemFonts: false,
      defaultFontFamily: "Inter",
    },
    fitTo: { mode: "width", value: 1080 },
  });
  fs.writeFileSync(outFile, resvg.render().asPng());
}

const captionDoc = (post) => `# ${post.title}

**${post.date} · ${post.platform} · ${post.format === "story" ? "1080×1920" : "1080×1350"} carousel · ${post.slides.length} slides**

${post.notes ? `> ${post.notes}\n` : ""}
---

## LinkedIn

${post.captions.linkedin}

---

## Instagram

${post.captions.instagram}

---

## TikTok / Reels

${post.captions.tiktok}

---

## WhatsApp status / broadcast

${post.captions.whatsapp ?? "—"}

---

## Hashtags (Instagram — use 8, drop the rest)

${(post.hashtags ?? []).join(" ")}

---

## Slide copy (for reference / edits)

${post.slides.map((s, i) => `${i + 1}. **${s.headline}**${s.body ? ` — ${s.body}` : ""}${s.foot ? ` *${s.foot}*` : ""}`).join("\n")}
`;

function main() {
  const only = process.argv[2];
  let made = 0;
  for (const post of posts) {
    if (only && !post.folder.startsWith(only)) continue;
    const dir = path.join(root, post.folder);
    fs.mkdirSync(dir, { recursive: true });
    post.slides.forEach((slide, i) => {
      const name = `${String(i + 1).padStart(2, "0")}-${slide.kind}.png`;
      const svg = slideSvg({ slide, index: i, total: post.slides.length, format: post.format });
      renderPng(svg, path.join(dir, name));
      made += 1;
    });
    fs.writeFileSync(path.join(dir, "CAPTION.md"), captionDoc(post));
    if (shotCache.size > 10) shotCache.clear(); // keep memory flat across a long run
  }
  console.log(`Rendered ${made} slide${made === 1 ? "" : "s"} across ${only ? "1 post" : `${posts.length} posts`}.`);
}

main();
