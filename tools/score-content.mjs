#!/usr/bin/env node
/* Easywurld — content scorecard.
 *
 *   node tools/score-content.mjs [path/to/weekly-tracker.csv]
 *
 * Reads the weekly tracker and answers one question:
 *
 *   Which channel × kind-of-post is actually producing conversations and money?
 *
 * The headline number is CONVERSATIONS PER 10 POSTS (CP10). It normalises for
 * volume, so a channel posting 77 times a week is not flattered against one
 * posting 20 times a week.
 *
 * No dependencies. Node 18+.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FILE = resolve(process.argv[2] ?? "marketing/measurement/weekly-tracker.csv");

/* A cell needs this many posts before its average means anything. Below this the
   verdict is "too early" — never cut a channel because of 12 posts. */
const MIN_POSTS = 30;

const COLUMNS = [
  "week", "channel", "pillar", "posts", "views", "conversations",
  "reviews", "offer_sales", "service_leads", "revenue_ngn", "notes",
];

/* ---------- csv ---------- */

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    if (c === "\r") continue;
    field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

const num = (v) => {
  const n = Number(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/* ---------- load ---------- */

if (!existsSync(FILE)) {
  console.error(`\nNo tracker at ${FILE}\n`);
  process.exit(1);
}

const rows = parseCsv(readFileSync(FILE, "utf8"));
if (rows.length < 2) {
  console.error("\nThe tracker has no data rows yet. Add a row per channel × post type per week.\n");
  process.exit(1);
}

const header = rows[0].map((h) => h.trim().toLowerCase());
const missing = COLUMNS.filter((c) => !header.includes(c));
if (missing.length) {
  console.error(`\nThe tracker is missing these columns: ${missing.join(", ")}\n`);
  process.exit(1);
}

const idx = Object.fromEntries(COLUMNS.map((c) => [c, header.indexOf(c)]));

const records = [];
for (const r of rows.slice(1)) {
  const week = (r[idx.week] ?? "").trim();
  if (!week || week.toUpperCase().startsWith("EXAMPLE")) continue;
  records.push({
    week,
    channel: (r[idx.channel] ?? "").trim().toLowerCase(),
    pillar: (r[idx.pillar] ?? "").trim().toLowerCase(),
    posts: num(r[idx.posts]),
    views: num(r[idx.views]),
    conversations: num(r[idx.conversations]),
    reviews: num(r[idx.reviews]),
    offer_sales: num(r[idx.offer_sales]),
    service_leads: num(r[idx.service_leads]),
    revenue: num(r[idx.revenue_ngn]),
  });
}

if (!records.length) {
  console.error("\nOnly header and example rows so far — nothing to score yet.\n");
  process.exit(0);
}

/* ---------- aggregate ---------- */

function aggregate(list, keyFn) {
  const map = new Map();
  for (const rec of list) {
    const key = keyFn(rec);
    const cur = map.get(key) ?? {
      key, posts: 0, views: 0, conversations: 0, reviews: 0,
      offer_sales: 0, service_leads: 0, revenue: 0, weeks: new Set(),
    };
    cur.posts += rec.posts;
    cur.views += rec.views;
    cur.conversations += rec.conversations;
    cur.reviews += rec.reviews;
    cur.offer_sales += rec.offer_sales;
    cur.service_leads += rec.service_leads;
    cur.revenue += rec.revenue;
    cur.weeks.add(rec.week);
    map.set(key, cur);
  }
  return [...map.values()].map((c) => ({
    ...c,
    weeks: c.weeks.size,
    cp10: c.posts ? (c.conversations / c.posts) * 10 : 0,
    rev10: c.posts ? (c.revenue / c.posts) * 10 : 0,
    viewPerPost: c.posts ? c.views / c.posts : 0,
    convRate: c.conversations ? (c.offer_sales / c.conversations) * 100 : 0,
  }));
}

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const lpad = (s, n) => String(s).padStart(n).slice(0, n);
const naira = (n) => "₦" + Math.round(n).toLocaleString("en-NG");
const decimals = (n) => n.toFixed(1);

/* ---------- verdict ---------- */

function verdicts(cells) {
  const eligible = cells.filter((c) => c.posts >= MIN_POSTS);
  const out = new Map();

  /* Ranking into thirds only means something with a spread of cells. With one or
     two eligible cells every verdict would be noise, so nothing is cut yet. */
  if (eligible.length < 3) {
    for (const c of cells) out.set(c.key, "TOO EARLY");
    return out;
  }

  const ranked = [...eligible].sort((a, b) => b.cp10 - a.cp10 || b.rev10 - a.rev10);
  const third = Math.max(1, Math.ceil(ranked.length / 3));

  ranked.forEach((c, i) => {
    if (i < third) out.set(c.key, "DOUBLE");
    else if (i >= ranked.length - third) out.set(c.key, "CUT");
    else out.set(c.key, "KEEP");
  });
  for (const c of cells) if (!out.has(c.key)) out.set(c.key, "TOO EARLY");
  return out;
}

/* ---------- report ---------- */

const cells = aggregate(records, (r) => `${r.channel} · ${r.pillar}`);
const byChannel = aggregate(records, (r) => r.channel);
const byPillar = aggregate(records, (r) => r.pillar);
const verdict = verdicts(cells);

const totalPosts = records.reduce((n, r) => n + r.posts, 0);
const totalConv = records.reduce((n, r) => n + r.conversations, 0);
const totalRev = records.reduce((n, r) => n + r.revenue, 0);
const weeks = new Set(records.map((r) => r.week)).size;

const line = "─".repeat(96);

console.log(`\nEASYWURLD · CONTENT SCORECARD`);
console.log(`${weeks} week${weeks === 1 ? "" : "s"} · ${totalPosts} posts · ${totalConv} conversations · ${naira(totalRev)} revenue`);
console.log(line);
console.log(`THE NUMBER: ${decimals(totalPosts ? (totalConv / totalPosts) * 10 : 0)} conversations per 10 posts`);
console.log(line);

const table = (title, list, showVerdict) => {
  console.log(`\n${title}\n`);
  console.log(
    pad("CELL", 30) + lpad("POSTS", 7) + lpad("VIEWS/P", 9) +
    lpad("CONV", 7) + lpad("CONV/10", 9) + lpad("₦/10 POSTS", 12) +
    (showVerdict ? "   VERDICT" : ""),
  );
  const sorted = [...list].sort((a, b) => b.cp10 - a.cp10 || b.rev10 - a.rev10);
  for (const c of sorted) {
    console.log(
      pad(c.key, 30) + lpad(c.posts, 7) + lpad(Math.round(c.viewPerPost), 9) +
      lpad(c.conversations, 7) + lpad(decimals(c.cp10), 9) +
      lpad(naira(c.rev10), 12) +
      (showVerdict ? `   ${verdict.get(c.key) ?? ""}` : ""),
    );
  }
};

table("BY CHANNEL × POST TYPE", cells, true);
table("BY CHANNEL", byChannel, false);
table("BY POST TYPE", byPillar, false);

/* ---------- what to do ---------- */

const double = cells.filter((c) => verdict.get(c.key) === "DOUBLE");
const cut = cells.filter((c) => verdict.get(c.key) === "CUT");
const early = cells.filter((c) => verdict.get(c.key) === "TOO EARLY");

console.log(`\n${line}\nWHAT TO DO NEXT WEEK\n`);

if (double.length) {
  console.log("DOUBLE these — they produce conversations you can count:");
  for (const c of double) {
    console.log(`  · ${c.key}  →  ${decimals(c.cp10)} conv/10 posts, ${naira(c.rev10)} per 10 posts`);
    console.log(`    Add up to 50% more posts here. Remake the post that did best, do not invent a new topic.`);
  }
  console.log("");
}

if (cut.length) {
  console.log("CUT these — they are buying views, not buyers:");
  for (const c of cut) {
    console.log(`  · ${c.key}  →  ${decimals(c.cp10)} conv/10 posts`);
  }
  console.log(`    Halve them. Move the freed slots to the list above. Do not delete the channel yet — one bad month is not a trend.\n`);
}

if (early.length) {
  console.log(`TOO EARLY — under ${MIN_POSTS} posts. No decision yet, keep posting, keep measuring:`);
  for (const c of early) {
    const left = Math.max(0, MIN_POSTS - c.posts);
    console.log(`  · ${c.key} — ${c.posts} posts, ${decimals(c.cp10)} conv/10 (${left} more to judge)`);
  }
  console.log("");
}

if (!double.length && !cut.length && !early.length) {
  console.log(`Nothing eligible yet. Keep going for two more weeks.\n`);
}

console.log(line);
console.log(`Rule: judge a cell only after ${MIN_POSTS} posts. Views are a diagnostic, conversations are a result.`);
console.log(`Tracker: ${FILE}`);
console.log(`${line}\n`);
