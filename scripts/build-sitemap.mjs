/**
 * Generates client/public/sitemap.xml from the route list and the project /
 * offer data files, so a new project can never be left out of the sitemap.
 *
 * Run with:  npm run sitemap
 *
 * Slugs are read from the data source files rather than from a hand-maintained
 * list. The regex is deliberately narrow (`slug: "…"`), so it ignores the
 * `slug: string` in a type declaration. client/src/data/projects.test.ts fails
 * if the generated sitemap and the real data ever disagree.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE =
  process.env.VITE_SITE_URL ?? "https://website-builder-portfolio.vercel.app";
const LASTMOD = new Date().toISOString().slice(0, 10);

const DATA_DIR = path.join(ROOT, "client", "src", "data");
const SKIP = new Set([
  "index.ts",
  "types.ts",
  "content.ts",
  "clients.ts",
  "offers.ts",
]);

/* Matches `slug: "…"` in the TypeScript project files and `"slug": "…"` in
   offers.ts. The optional quotes around the key are what differ between them. */
const slugsIn = relPath =>
  [
    ...readFileSync(path.join(ROOT, relPath), "utf8").matchAll(
      /"?slug"?\s*:\s*"([^"]+)"/g
    ),
  ].map(m => m[1]);

const projectFiles = readdirSync(DATA_DIR).filter(
  f => f.endsWith(".ts") && !SKIP.has(f)
);
const projectSlugs = projectFiles.flatMap(f =>
  slugsIn(path.join("client", "src", "data", f))
);
const offerSlugs = slugsIn(path.join("client", "src", "data", "offers.ts"));

/** [path, changefreq, priority] */
const STATIC = [
  ["/", "monthly", "1.0"],
  ["/projects", "weekly", "0.9"],
  ["/services", "monthly", "0.9"],
  ["/offers", "monthly", "0.9"],
  ["/about", "yearly", "0.6"],
  ["/contact", "yearly", "0.7"],
  ["/free-review", "monthly", "0.8"],
];

const escape = s =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const url = (loc, changefreq, priority) =>
  `  <url><loc>${escape(loc)}</loc><lastmod>${LASTMOD}</lastmod>` +
  `<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

const urls = [
  ...STATIC.map(([p, f, pr]) => url(`${SITE}${p}`, f, pr)),
  ...offerSlugs.map(s => url(`${SITE}/offers/${s}`, "monthly", "0.8")),
  ...projectSlugs.map(s => url(`${SITE}/projects/${s}`, "monthly", "0.7")),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.join("\n") +
  `\n</urlset>\n`;

const out = path.join(ROOT, "client", "public", "sitemap.xml");
writeFileSync(out, xml);

console.log(
  `sitemap.xml: ${STATIC.length} static + ${offerSlugs.length} offers + ` +
    `${projectSlugs.length} projects = ${urls.length} urls`
);
