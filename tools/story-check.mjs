#!/usr/bin/env node
/* Easywurld — story checker.
 *
 *   npm run story -- path/to/script.md
 *   npm run story:example
 *
 * Checks a draft script against the system in marketing/storytelling/THE-ITCH.md.
 * It cannot tell you whether the script is good. It tells you whether it is BUILT
 * correctly — which is the part you can check at 11pm when you are tired.
 *
 * Script format (one line per beat):
 *
 *   @tier entertain
 *   @seconds 28
 *   @I 0:00 Screen recording, thumb scrolling a bakery homepage
 *   @T 0:02 This bakery is not bad. This website is.
 *   @C 0:05 It says welcome where it should say what they sell.
 *   @H 0:10 Here's the fix, but don't write quality bread
 *   @SCRATCH 0:24 A stranger now knows what you sell and what to do.
 *   @LOOP 0:27 Tomorrow: the same problem on a food vendor's status.
 *
 * No dependencies. Node 18+.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FILE = resolve(process.argv[2] ?? "marketing/storytelling/examples/fix-this-bakery.md");

/* ---------- thresholds (edit these, not the logic) ---------- */

const T = {
  hookMaxWords: 12,      // the opening line must be short enough to land in 2 seconds
  maxWordsPerSecond: 4.2, // denser than this and nobody can read it, let alone hear it
  minWordsPerSecond: 1.2, // emptier than this and the middle has dead air
  hStartMin: 0.20,       // "HOW" should not arrive before 20% of runtime
  hStartMax: 0.50,       // ...nor after 50%, or there is no space to teach
  scratchMin: 0.75,      // the payoff must sit in the last quarter
  minConnectors: 1,      // at least one "but" and one "therefore"
};

const BANNED_OPENERS = [
  "hey guys", "hi guys", "hello guys", "welcome back", "in this video",
  "today i want to", "so today", "what's up guys", "let me tell you about",
];

const HYPE = [
  "guaranteed", "guarantee results", "number one", "#1 ", "best in the world",
  "secret hack", "life changing", "10x your", "instantly", "get rich",
];

const FAKE_URGENCY = [
  "only 3 left", "only 5 left", "last chance", "hurry", "expires today",
  "ending soon", "before it's gone", "limited spots",
];

const SELL_KEYWORDS = ["bundle", "playbook", "clear", "engine", "page", "local", "message", "prompts", "templates", "launch", "sample"];

/* ---------- parse ---------- */

if (!existsSync(FILE)) {
  console.error(`\nNo script at ${FILE}\n`);
  process.exit(1);
}

const raw = readFileSync(FILE, "utf8").split(/\r?\n/);

const meta = { tier: "", seconds: 0, title: "" };
const beats = [];

const toSeconds = (mm, ss) => Number(mm) * 60 + Number(ss);

for (const line of raw) {
  const trimmed = line.trim();

  if (trimmed.startsWith("# ") && !meta.title) { meta.title = trimmed.slice(2).trim(); continue; }

  const metaMatch = trimmed.match(/^@(tier|seconds)\s+(.+)$/i);
  if (metaMatch) {
    const key = metaMatch[1].toLowerCase();
    const val = metaMatch[2].trim();
    if (key === "tier") meta.tier = val.toLowerCase();
    else meta.seconds = Number(val.replace(/[^0-9.]/g, "")) || 0;
    continue;
  }

  const beatMatch = trimmed.match(/^@(I|T|C|H|SCRATCH|LOOP|P|N|S|L|A)\s+(?:(\d+):(\d{2})\s+)?(.+)$/i);
  if (beatMatch) {
    beats.push({
      beat: beatMatch[1].toUpperCase(),
      at: beatMatch[2] !== undefined ? toSeconds(beatMatch[2], beatMatch[3]) : null,
      text: beatMatch[4].trim(),
    });
  }
}

const words = (s) => s.split(/\s+/).filter(Boolean).length;
const allText = beats.map((b) => b.text).join(" ").toLowerCase();

/* The I beat is a PICTURE, not a line of speech. It must not count against the
   pace or be judged as the hook — the hook is the first spoken/written beat. */
const spoken = beats.filter((b) => b.beat !== "I");
const totalWords = spoken.reduce((n, b) => n + words(b.text), 0);

/* ---------- checks ---------- */

const errors = [];
const warnings = [];
const notes = [];

const has = (name) => beats.some((b) => b.beat === name);
const get = (name) => beats.find((b) => b.beat === name);

const runtime = meta.seconds || (beats.filter((b) => b.at !== null).at(-1)?.at ?? 0);
const missingTimes = beats.some((b) => b.at === null);

if (!beats.length) {
  console.error(`\nNo beats found. Every line of a script starts with a beat, e.g.  @T 0:02 your hook\n`);
  process.exit(1);
}

if (!runtime) errors.push("No runtime. Add `@seconds 28` or time the beats (`@H 0:10 ...`).");
if (missingTimes) warnings.push("Some beats have no timestamp, so timing checks were skipped.");

/* 1 — the spine */
for (const required of ["I", "T", "C", "H"]) {
  if (!has(required)) errors.push(`Missing beat ${required} — the ITCH spine needs I, T, C and H.`);
}
if (!has("SCRATCH")) warnings.push("No SCRATCH beat. The itch opens and never closes.");
if (!has("LOOP")) warnings.push("No LOOP beat. The next video has no invested audience.");

/* 2 — the hook (the first beat with words, skipping the image) */
const opener = spoken[0];
if (opener) {
  const w = words(opener.text);
  if (opener.beat !== "T") notes.push(`Hook is on the ${opener.beat} beat — the itch is normally the T line.`);
  if (w > T.hookMaxWords) {
    warnings.push(`Opening line is ${w} words. Keep the first line under ${T.hookMaxWords} — it has about two seconds.`);
  }
  const lower = opener.text.toLowerCase();
  for (const bad of BANNED_OPENERS) {
    if (lower.includes(bad)) errors.push(`Opening line starts with "${bad}". That is a reason to scroll.`);
  }
}

/* 3 — hype and fake urgency (this brand does not do either) */
for (const word of HYPE) {
  if (allText.includes(word)) errors.push(`Contains "${word.trim()}". The brand rule is no guarantees and no hype.`);
}
for (const word of FAKE_URGENCY) {
  if (allText.includes(word)) errors.push(`Contains "${word}". No fake scarcity — it spends the trust the teach tier built.`);
}

/* 4 — cause and effect */
const andThen = (allText.match(/\band then\b/g) ?? []).length;
const buts = (allText.match(/\bbut\b/g) ?? []).length;
const therefores = (allText.match(/\b(therefore|so\b|which meant|that's why)\b/g) ?? []).length;

if (andThen > 0) {
  errors.push(`"and then" appears ${andThen}× — a list of events, not a story. Replace each with "but" or "therefore".`);
}
if (buts < T.minConnectors || therefores < T.minConnectors) {
  warnings.push(`Only ${buts} "but" and ${therefores} "therefore". The middle needs both to have a turn and a consequence.`);
}

/* 5 — pacing */
if (runtime) {
  const wps = totalWords / runtime;
  if (wps > T.maxWordsPerSecond) {
    errors.push(`${totalWords} words in ${runtime}s is ${wps.toFixed(1)} words/second. Cut to about ${Math.round(runtime * 3)} words.`);
  } else if (wps < T.minWordsPerSecond) {
    warnings.push(`${totalWords} words in ${runtime}s is only ${wps.toFixed(1)}/second — there is dead air in the middle.`);
  } else {
    notes.push(`Pace: ${totalWords} words in ${runtime}s (${wps.toFixed(1)}/s) — readable.`);
  }

  const h = get("H");
  if (h && h.at !== null && runtime) {
    const frac = h.at / runtime;
    if (frac < T.hStartMin) warnings.push(`The HOW beat starts at ${Math.round(frac * 100)}% of the runtime — too early. Hook and cost need room first.`);
    if (frac > T.hStartMax) errors.push(`The HOW beat starts at ${Math.round(frac * 100)}% of the runtime. That leaves too little middle; the payoff arrives before the teaching does.`);
    else notes.push(`Middle runs from ${Math.round(frac * 100)}% of the runtime — target is 20–50%.`);
  }

  const scratch = get("SCRATCH");
  if (scratch && scratch.at !== null && runtime) {
    const frac = scratch.at / runtime;
    if (frac < T.scratchMin) warnings.push(`The SCRATCH starts at ${Math.round(frac * 100)}% — the itch gets closed too early to hold retention to the end.`);
    else notes.push(`Payoff sits in the last ${Math.round((1 - frac) * 100)}% — correct.`);
  }
}

/* 6 — selling in the right tier */
const looksLikeSelling = /link in bio|dm me|message me|buy now|wa\.me|checkout|order now/.test(allText);
const tier = meta.tier || "unknown";

if (!meta.tier) warnings.push("No `@tier` line. Say whether this post is entertain, teach or sell before you write it.");
if (tier === "entertain" && looksLikeSelling) {
  errors.push("This is an ENTERTAIN post but it asks for the sale. One job per post — move the ask to a sell post.");
}
if (tier === "teach" && /buy now|checkout|order now/.test(allText)) {
  warnings.push("This is a TEACH post with a hard sell. Keep it to one soft line (\"it's on the site\") or move it to a sell post.");
}

if (tier === "sell") {
  const hasPrice = /₦|naira|\bN\d/.test(allText);
  if (!hasPrice) errors.push("A SELL post must name the price. No price = no decision.");
  const hasKeyword = SELL_KEYWORDS.some((k) => allText.includes(k));
  if (!hasKeyword) warnings.push("No product keyword (BUNDLE, PLAYBOOK, etc.). Give people the one word to send.");
  const hasLimit = /won't|will not|doesn't|does not|not a|no guarantee|limit|honest/.test(allText);
  if (!hasLimit) warnings.push("The honest ad needs one stated limit. That sentence is the differentiator — see THE-ITCH.md §4, beat 4.");
}

/* ---------- report ---------- */

const line = "─".repeat(74);
const label = meta.title || FILE.split("/").pop();
const verdict = errors.length ? "FAIL" : warnings.length ? "PASS, with notes" : "PASS";

console.log(`\nEASYWURLD · STORY CHECK`);
console.log(line);
console.log(`${label}`);
console.log(`tier: ${tier} · ${runtime || "?"}s · ${beats.length} beats · ${totalWords} words`);
console.log(`RESULT: ${verdict}`);
console.log(line);

if (errors.length) {
  console.log(`\nFIX (${errors.length})\n`);
  for (const e of errors) console.log(`  ✗ ${e}`);
}
if (warnings.length) {
  console.log(`\nLOOK AT (${warnings.length})\n`);
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (notes.length) {
  console.log(`\nOK\n`);
  for (const n of notes) console.log(`  ✓ ${n}`);
}

console.log(`\n${line}`);
console.log(`Structure is not the same as good. Read it out loud before you post it.`);
console.log(`${line}\n`);

process.exit(errors.length ? 1 : 0);
