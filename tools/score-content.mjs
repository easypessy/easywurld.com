#!/usr/bin/env node
/* Easywurld — content scorecard.
 *
 *   npm run score            (reads marketing/measurement/weekly-tracker.csv)
 *   npm run score:example    (reads the worked example)
 *
 * Answers one question:
 *
 *   Which SHOW — on which channel — is actually producing conversations and money?
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

/* A cell needs this many posts before its average means anything. Set low enough
   that one month of anchors can produce a verdict at SHOW level, high enough that
   a single lucky post cannot. */
const MIN_POSTS_SHOW = 10;
const MIN_POSTS_BROAD = 20;
/* Never cut or double anything unless there are at least this many eligible cells
   to compare. Ranking two cells into thirds is noise, not a decision. */
const MIN_CELLS = 3;

const COLUMNS = [
  "week", "channel", "format", "tier", "posts", "views", "conversations",
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
  console.error("\nThe tracker has no data rows yet. Add one row per channel x show per week.\n");
  process.exit(1);
}

const header = rows[0].map((h) => h.trim().toLowerCase());
const missing = COLUMNS.filter((c) => !header.includes(c));
if (missing.length) {
  console.error(`\nThe tracker is missing these columns: ${missing.join(", ")}`);
  console.error(`Expected: ${COLUMNS.join(", ")}\n`);
  process.exit(1);
}

const idx = Object.fromEntries(COLUMNS.map((c) => [c, header.indexOf(c)]));
const cell = (r, c) => (r[idx[c]] ?? "").trim();

const records = [];
for (const r of rows.slice(1)) {
  const week = cell(r, "week");
  if (!week || week.toUpperCase().startsWith("EXAMPLE")) continue;
  records.push({
    week,
    channel: cell(r, "channel").toLowerCase(),
    format: cell(r, "format").toLowerCase(),
    tier: cell(r, "tier").toLowerCase(),
    posts: num(cell(r, "posts")),
    views: num(cell(r, "views")),
    conversations: num(cell(r, "conversations")),
    reviews: num(cell(r, "reviews")),
    offer_sales: num(cell(r, "offer_sales")),
    service_leads: num(cell(r, "service_leads")),
    revenue: num(cell(r, "revenue_ngn")),
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
    if (!key) continue;
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
  }));
}

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const lpad = (s, n) => String(s).padStart(n).slice(0, n);
const naira = (n) => "₦" + Math.round(n).toLocaleString("en-NG");
const dec = (n) => n.toFixed(1);

/* ---------- verdict ---------- */

function verdicts(cells, floor) {
  const eligible = cells.filter((c) => c.posts >= floor);
  const out = new Map();

  if (eligible.length < MIN_CELLS) {
    for (const c of cells) out.set(c.key, "TOO EARLY");
    return { out, enough: false };
  }

  const ranked = [...eligible].sort((a, b) => b.cp10 - a.cp10 || b.rev10 - a.rev10);
  const third = Math.max(1, Math.ceil(ranked.length / 3));

  ranked.forEach((c, i) => {
    if (i < third) out.set(c.key, "DOUBLE");
    else if (i >= ranked.length - third) out.set(c.key, "CUT");
    else out.set(c.key, "KEEP");
  });
  for (const c of cells) if (!out.has(c.key)) out.set(c.key, "TOO EARLY");
  return { out, enough: true };
}

/* ---------- report ---------- */

const byShow = aggregate(records, (r) => r.format);
const byChannel = aggregate(records, (r) => r.channel);
const byTier = aggregate(records, (r) => r.tier);
const byCell = aggregate(records, (r) => (r.format && r.channel ? `${r.channel} · ${r.format}` : ""));

const { out: verdict, enough } = verdicts(byShow, MIN_POSTS_SHOW);
const channelVerdict = verdicts(byChannel, MIN_POSTS_BROAD).out;

const totalPosts = records.reduce((n, r) => n + r.posts, 0);
const totalConv = records.reduce((n, r) => n + r.conversations, 0);
const totalRev = records.reduce((n, r) => n + r.revenue, 0);
const weeks = new Set(records.map((r) => r.week)).size;

const line = "─".repeat(94);

console.log(`\nEASYWURLD · CONTENT SCORECARD`);
console.log(`${weeks} week${weeks === 1 ? "" : "s"} · ${totalPosts} posts · ${totalConv} conversations · ${naira(totalRev)} revenue`);
console.log(line);
console.log(`THE NUMBER: ${dec(totalPosts ? (totalConv / totalPosts) * 10 : 0)} conversations per 10 posts`);
console.log(line);

const table = (title, list, verdictMap, floor) => {
  const showVerdict = Boolean(verdictMap);
  console.log(`\n${title}\n`);
  console.log(
    pad("", 26) + lpad("POSTS", 7) + lpad("VIEWS/P", 9) +
    lpad("CONV", 7) + lpad("CONV/10", 9) + lpad("₦/10 POSTS", 12) +
    (showVerdict ? "   VERDICT" : ""),
  );
  const sorted = [...list].sort((a, b) => b.cp10 - a.cp10 || b.rev10 - a.rev10);
  for (const c of sorted) {
    const flag = showVerdict && c.posts < floor ? " (thin)" : "";
    console.log(
      pad(c.key, 26) + lpad(c.posts, 7) + lpad(Math.round(c.viewPerPost), 9) +
      lpad(c.conversations, 7) + lpad(dec(c.cp10), 9) +
      lpad(naira(c.rev10), 12) +
      (showVerdict ? `   ${verdictMap.get(c.key) ?? ""}${flag}` : ""),
    );
  }
};

table("BY SHOW — the question you asked: what do I double down on?", byShow, verdict, MIN_POSTS_SHOW);
table("BY CHANNEL", byChannel, channelVerdict, MIN_POSTS_BROAD);
table("BY TIER — is the 60 / 30 / 10 ratio right?", byTier, null, 0);
table("BY CHANNEL × SHOW (detail)", byCell, null, 0);

/* ---------- the ratio check ---------- */

const tierOrder = ["entertain", "teach", "sell"];
const tierRows = tierOrder
  .map((t) => {
    const found = byTier.find((c) => c.key === t);
    return { tier: t, posts: found?.posts ?? 0, views: found?.views ?? 0, conv: found?.conversations ?? 0, rev: found?.revenue ?? 0, cp10: found?.cp10 ?? 0 };
  })
  .filter((r) => r.posts > 0);

if (tierRows.length) {
  const postTotal = tierRows.reduce((n, r) => n + r.posts, 0);
  const revTotal = tierRows.reduce((n, r) => n + r.rev, 0);
  const viewTotal = tierRows.reduce((n, r) => n + r.views, 0);
  console.log(`\nTHE RATIO\n`);
  console.log(`  ${pad("tier", 12)}${lpad("posts", 14)}${lpad("reach", 14)}${lpad("revenue", 14)}${lpad("conv/10", 10)}`);
  for (const r of tierRows) {
    console.log(
      `  ${pad(r.tier, 12)}${lpad(((r.posts / postTotal) * 100).toFixed(0) + "%", 14)}` +
      lpad(viewTotal ? ((r.views / viewTotal) * 100).toFixed(0) + "%" : "—", 14) +
      lpad(revTotal ? ((r.rev / revTotal) * 100).toFixed(0) + "%" : "—", 14) +
      lpad(dec(r.cp10), 10),
    );
  }

  const entertainRow = tierRows.find((r) => r.tier === "entertain");
  if (entertainRow && viewTotal && revTotal && postTotal >= MIN_POSTS_BROAD) {
    const reachShare = (entertainRow.views / viewTotal) * 100;
    const revShare = (entertainRow.rev / revTotal) * 100;
    if (reachShare >= 50 && revShare <= 20) {
      console.log(`\n  ! THE ENTERTAINMENT TRAP — read this before you cut anything.`);
      console.log(`    Entertain is ${reachShare.toFixed(0)}% of your reach and only ${revShare.toFixed(0)}% of your revenue.`);
      console.log(`    That is the NORMAL shape of a working account, not a failure. Entertainment buys`);
      console.log(`    the audience; teach and sell monetise it. They cannot convert people who never`);
      console.log(`    saw you. Cut entertainment on revenue alone and reach collapses next month,`);
      console.log(`    taking teach and sell down with it.`);
      console.log(`    Judge entertainment on reach and saves. Judge teach and sell on revenue.`);
    }
  }
  const entertain = tierRows.find((r) => r.tier === "entertain");
  if (entertain && entertain.posts / postTotal < 0.5 && postTotal >= MIN_POSTS_BROAD) {
    console.log(`\n  ! Entertain is only ${((entertain.posts / postTotal) * 100).toFixed(0)}% of output. Target is 60%.`);
    console.log(`    Reach comes from the entertain tier. Without it, teach and sell only reach people who already know you.`);
  }
}

/* ---------- what to do ---------- */

const double = byShow.filter((c) => verdict.get(c.key) === "DOUBLE");
const cut = byShow.filter((c) => verdict.get(c.key) === "CUT");
const thin = byShow.filter((c) => c.posts < MIN_POSTS_SHOW);

console.log(`\n${line}\nWHAT TO DO NEXT WEEK\n`);

if (double.length) {
  console.log("DOUBLE these shows:");
  for (const c of double) {
    console.log(`  · ${c.key}  →  ${dec(c.cp10)} conv/10 posts, ${naira(c.rev10)} per 10 posts`);
  }
  console.log(`    Add up to 50% more episodes. Remake the episode that did best — do not invent a new format.\n`);
}

if (cut.length) {
  /* A show with high reach and no revenue is not failing — it is the audience
     engine. Cutting those is how an account kills its own top of funnel. Only
     shows with low reach AND low revenue are genuinely dead weight. */
  const median = (ns) => {
    if (!ns.length) return 0;
    const sorted = [...ns].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };
  const medianReach = median(byShow.map((c) => c.viewPerPost));
  const medianCp10 = median(byShow.map((c) => c.cp10));

  /* Engine = reaches people AND gets some of them talking (at or above median on
     both). Dead weight = below median on reach and conversations, which is what a
     meme doing 3 conversations per 10 posts actually is, however many views it
     collects. Reach alone is not enough to earn a show its slots. */
  const engines = cut.filter((c) => c.viewPerPost >= medianReach && c.cp10 >= medianCp10);
  const dead = cut.filter((c) => !(c.viewPerPost >= medianReach && c.cp10 >= medianCp10));

  if (engines.length) {
    console.log("AUDIENCE ENGINE — high reach, no revenue. Keep these, stop counting them as sales:");
    for (const c of engines) {
      console.log(`  · ${c.key}  →  ${Math.round(c.viewPerPost)} views/post (above median ${Math.round(medianReach)}), ${dec(c.cp10)} conv/10`);
    }
    console.log(`    These reach people who have never heard of you. Give them one soft door at the`);
    console.log(`    end and no pitch. If reach falls here, teach and sell fall two weeks later.\n`);
  }

  if (dead.length) {
    console.log("CUT these shows to half — they reach people but produce too few conversations:");
    for (const c of dead) {
      console.log(`  · ${c.key}  →  ${Math.round(c.viewPerPost)} views/post, ${dec(c.cp10)} conv/10 posts (median ${dec(medianCp10)})`);
    }
    console.log(`    Move the freed slots to the DOUBLE list. Keep the channel — you are cutting a FORMAT, not a platform.\n`);
  }
}

if (thin.length) {
  console.log(`TOO EARLY — under ${MIN_POSTS_SHOW} posts, no verdict yet:`);
  for (const c of thin) {
    console.log(`  · ${c.key} — ${c.posts} posts, ${dec(c.cp10)} conv/10 (${Math.max(0, MIN_POSTS_SHOW - c.posts)} more to judge)`);
  }
  console.log("");
}

if (!enough) {
  console.log(`Fewer than ${MIN_CELLS} shows have ${MIN_POSTS_SHOW}+ posts yet, so nothing is being cut.`);
  console.log(`That is deliberate: ranking two cells is not a decision, it is a coin toss.\n`);
}

console.log(line);
console.log(`Expected keys — channel: ${[...new Set(records.map((r) => r.channel))].join(", ")}`);
console.log(`                  show: ${[...new Set(records.map((r) => r.format))].join(", ")}`);
console.log(`Judged on conversations, never views. Views explain; conversations decide.`);
console.log(`${line}\n`);
