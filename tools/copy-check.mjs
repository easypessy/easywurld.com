#!/usr/bin/env node
/* Easywurld — copy checker.
 *
 *   npm run copy:check
 *   npm run copy:check -- launch-content/november/content/days-01-02.json
 *
 * The validator checks structure. The audit checks hooks and pace. This one
 * checks the COPY — the words themselves — against
 * marketing/craft/06-COPYWRITING.md and 08-RULES.md.
 *
 * It cannot tell you whether a line is good. It tells you whether it is doing
 * the job you asked it to do, which is the part that is checkable at 11pm.
 *
 * No dependencies. Node 18+.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();
const CONTENT = resolve(ROOT, "launch-content/november/content");
const ONE = resolve(ROOT, "marketing/craft/07-THE-ONE-OFFER.md");

/* ---------- the rules ---------- */

/* Words that mean nothing. Each one is a word a reader cannot picture. */
const VAGUE = [
  "improve your marketing", "take your business to the next level", "level up",
  "unlock", "leverage", "elevate", "empower", "seamless", "cutting-edge",
  "game changer", "game-changer", "world-class", "one-stop", "synergy",
  "holistic", "robust", "innovative", "revolutionary", "state of the art",
  "next level", "boost your", "skyrocket", "unleash", "harness",
];

/* Claims this brand does not make. */
const HYPE = [
  "guaranteed", "guarantee results", "#1 ", "best in the world",
  "secret hack", "life changing", "life-changing", "instantly", "get rich",
  "viral", "go viral", "blow up", "best in nigeria", "best in lagos",
];

/* Honest copy has to be allowed to SAY these words in order to refuse them:
   "no guarantee of results", "not a viral month", "rarer than a viral post".
   A match only counts when it is not negated within this window. */
const NEGATORS = /(no|not|never|cannot|can't|won't|doesn't|isn't|without|rarer than|instead of|rather than|refuse|zero|absence of|no such thing as|the opposite of)\s+(\w+\s+){0,3}$/i;

/* Copy can also be QUOTING a bad claim in order to take it apart. That is the
   house style, so it must not be flagged as making the claim. */
const QUOTED = /(six impossible|promise[sd]?|want(s|ed)?|ask(s|ed) for|said|says|wrote|writes|advert\w*|claim(s|ed|ing)?|the words|caption says|\bquote[sd]?)\s*[^.!?]{0,30}$/i;

/* Product words. A post may name ONE. */
const OFFERS = [
  "CLEAR", "SILENCE", "LOCAL", "PROPOSAL", "MESSAGE", "LAUNCH", "PROMPTS",
  "BUNDLE", "PLAYBOOK", "TEMPLATES", "TRACKER",
];

/* The single offer this account sells until 30 November. */
const THE_ONE = "SILENCE";

/* A claim only counts if it is actually being made. */
/* Anything inside quotation marks is being quoted, not claimed. The whole
   honest-ad style depends on being able to show bad copy and take it apart. */
function inQuotes(text, index) {
  const spans = text.match(/"[^"]*"|'[^']*'/g);
  if (!spans) return false;
  let cursor = 0;
  for (const span of spans) {
    const start = text.indexOf(span, cursor);
    if (start === -1) continue;
    if (index >= start && index < start + span.length) return true;
    cursor = start + span.length;
  }
  return false;
}

function isClaimed(text, index) {
  if (inQuotes(text, index)) return false;
  const before = text.slice(Math.max(0, index - 60), index);
  return !NEGATORS.test(before) && !QUOTED.test(before);
}

function claimHits(text, needle) {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped, "gi");
  let claimed = 0;
  let refused = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (isClaimed(text, m.index)) claimed += 1;
    else refused += 1;
    if (m.index === re.lastIndex) re.lastIndex += 1;
  }
  /* If the post also quotes or refuses the same claim, it is taking it apart,
     not making it. That is the whole house style — do not punish it. */
  if (refused > 0) return { claimed: 0, refused };
  return { claimed, refused };
}

const words = (s) => s.split(/\s+/).filter(Boolean);
const sentences = (s) => s.split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter(Boolean);
const count = (hay, needle) => {
  const re = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
  return (hay.match(re) ?? []).length;
};

/* ---------- load ---------- */

const arg = process.argv[2];
let files = [];
if (arg) {
  files = [resolve(ROOT, arg)];
} else {
  files = readdirSync(CONTENT)
    .filter((f) => /^days-\d+(-\d+)?\.json$/.test(f))
    .sort()
    .map((f) => join(CONTENT, f));
}

const posts = [];
for (const file of files) {
  const days = JSON.parse(readFileSync(file, "utf8"));
  for (const day of days) {
    for (const p of day.posts) {
      const tt = p.tiktok ?? {};
      const ig = p.instagram ?? {};
      const fb = p.facebook ?? {};
      const slides = Array.isArray(ig.slides) ? ig.slides : [];
      const text = [
        tt.hook, tt.vo, tt.cap,
        slides.join(" "), ig.cap,
        fb.body,
      ].filter(Boolean).join("\n");
      posts.push({ id: p.id, day: day.day, type: p.type, show: p.show, topic: p.topic, text });
    }
  }
}

/* ---------- checks ---------- */

const errors = [];
const warnings = [];
const notes = [];

const sellPosts = posts.filter((p) => p.type === "Sell");
const offerTally = new Map();

for (const p of posts) {
  const lower = p.text.toLowerCase();

  /* 1 — vague words */
  for (const bad of VAGUE) {
    if (lower.includes(bad)) {
      errors.push(`${p.id} uses "${bad}" — a word nobody can picture. Say the thing instead.`);
    }
  }

  /* 2 — hype, unless it is being refused */
  for (const bad of HYPE) {
    const hit = claimHits(p.text, bad);
    if (hit.claimed > 0) {
      errors.push(`${p.id} claims "${bad.trim()}". This brand does not make that claim.`);
    } else if (hit.refused > 0) {
      notes.push(`${p.id} names "${bad.trim()}" only to refuse it — allowed.`);
    }
  }

  /* 3 — one offer per post */
  const named = OFFERS.filter((o) => new RegExp(`\\b${o}\\b`).test(p.text));
  if (named.length > 1) {
    errors.push(`${p.id} names ${named.length} offers (${named.join(", ")}). One ask per post.`);
  }
  if (p.type === "Sell" && named.length === 1) {
    offerTally.set(named[0], (offerTally.get(named[0]) ?? 0) + 1);
  }
  if (p.type === "Sell" && named.length === 0) {
    warnings.push(`${p.id} is a Sell post that names no offer. Give people one word to send.`);
  }

  /* 4 — talk about the reader, not yourself.
     Only enforced where it matters: the posts that ask for money. A true story
     is allowed to be about us; a sales line is not. */
  const you = count(p.text, "you") + count(p.text, "your") + count(p.text, "you're");
  const us = count(p.text, "i") + count(p.text, "we") + count(p.text, "our") + count(p.text, "us");
  if (p.type === "Sell" && us > you) {
    errors.push(`${p.id} is a Sell post that says I/we/our ${us}× and you/your ${you}×. Sell to the reader, not about us.`);
  }

  /* 5 — sentences a person can say out loud */
  const tooLong = sentences(p.text).filter((s) => words(s).length > 35);
  if (tooLong.length) {
    warnings.push(`${p.id} has ${tooLong.length} sentence(s) over 35 words. Cut or split: "${tooLong[0].slice(0, 64)}…"`);
  }
  const longish = sentences(p.text).filter((s) => words(s).length > 25).length;
  if (longish && !tooLong.length) notes.push(`${p.id} has ${longish} sentence(s) between 25 and 35 words — fine, but read them aloud.`);
}

/* 6 — the month sells one thing */
if (offerTally.size > 1) {
  const list = [...offerTally.entries()].sort((a, b) => b[1] - a[1]);
  errors.push(
    `The month sells ${offerTally.size} different offers (${list.map(([k, v]) => `${k}×${v}`).join(", ")}). ` +
    `Read 07-THE-ONE-OFFER.md: one offer until 30 November.`,
  );
}
if (offerTally.size === 1 && !offerTally.has(THE_ONE)) {
  warnings.push(`Every sell post points at ${[...offerTally.keys()][0]}, not at ${THE_ONE}.`);
}

/* ---------- report ---------- */

const line = "─".repeat(74);
const verdict = errors.length ? "FAIL" : warnings.length ? "PASS, with notes" : "PASS";

console.log(`\nEASYWURLD · COPY CHECK`);
console.log(line);
console.log(`${posts.length} posts · ${sellPosts.length} sell · ${offerTally.size} offer(s) named in the sell tier`);
console.log(`RESULT: ${verdict}`);
console.log(line);

if (offerTally.size) {
  console.log(`\nWHAT THE MONTH IS SELLING`);
  for (const [k, v] of [...offerTally.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(12)} ${v} post(s)`);
  }
}

if (errors.length) {
  console.log(`\nFIX (${errors.length})\n`);
  for (const e of errors.slice(0, 40)) console.log(`  ✗ ${e}`);
  if (errors.length > 40) console.log(`  … and ${errors.length - 40} more`);
}

if (warnings.length) {
  console.log(`\nWORTH A LOOK (${warnings.length})\n`);
  for (const w of warnings.slice(0, 20)) console.log(`  · ${w}`);
  if (warnings.length > 20) console.log(`  … and ${warnings.length - 20} more`);
}

if (notes.length) {
  console.log(`\nNOTES\n`);
  for (const n of notes) console.log(`  ✓ ${n}`);
}

console.log(`\n${line}`);
console.log(`Words are not checked for beauty. Read the flagged ones out loud.`);
console.log(`${line}\n`);

process.exit(errors.length ? 1 : 0);
