#!/usr/bin/env node
/* Easywurld — November content audit.
 *
 *   npm run audit:november
 *
 * Reads launch-content/november/content/days-*.json and reports the craft
 * facts that the validator does not check: hook length, voiceover pace,
 * whether the middle carries an explicit turn ("but") and consequence
 * ("therefore"), and whether any two posts share the same words.
 *
 * It does not judge whether a script is good. It reports what can be
 * counted, so the judgement happens with the numbers in front of you.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const contentDir = join(here, "..", "launch-content", "november", "content");

const HOOK_MAX_WORDS = 12;   // about two seconds of speech
const MAX_WPS = 4.2;
const MIN_WPS = 1.2;

const TURN = /\b(but|except|yet|until|instead)\b/;
const CAUSE = /\b(because|therefore|so|which means|that means|since)\b/;

const files = readdirSync(contentDir)
  .filter((f) => /^days-\d+(-\d+)?\.json$/.test(f))
  .sort();

const posts = [];
for (const f of files) {
  const raw = JSON.parse(readFileSync(join(contentDir, f), "utf8"));
  const list = Array.isArray(raw) ? raw : raw.days || Object.values(raw);
  for (const day of list) for (const p of day.posts || []) posts.push(p);
}

const secondsOf = (fmt) => {
  const m = String(fmt || "").match(/(\d+)\s*s/);
  return m ? Number(m[1]) : null;
};

const longHooks = [];
const paceOut = [];
let turnCount = 0;
let causeCount = 0;
let both = 0;

for (const p of posts) {
  const t = p.tiktok || {};
  const hook = String(t.hook || "").trim();
  const words = hook.split(/\s+/).filter(Boolean).length;
  if (words > HOOK_MAX_WORDS) longHooks.push({ id: p.id, words, hook });

  const vo = " " + String(t.vo || "").toLowerCase() + " ";
  const hasTurn = TURN.test(vo);
  const hasCause = CAUSE.test(vo);
  if (hasTurn) turnCount++;
  if (hasCause) causeCount++;
  if (hasTurn && hasCause) both++;

  const s = secondsOf(t.fmt);
  const voWords = String(t.vo || "").split(/\s+/).filter(Boolean).length;
  if (s) {
    const wps = voWords / s;
    if (wps > MAX_WPS || wps < MIN_WPS) {
      paceOut.push({ id: p.id, wps: Math.round(wps * 100) / 100, voWords, s });
    }
  }
}

/* duplicate check — same opening words on two posts would read as a repeat */
const seen = new Map();
const dupes = [];
for (const p of posts) {
  const key = String((p.tiktok || {}).vo || "").trim().toLowerCase().slice(0, 90);
  if (!key) continue;
  if (seen.has(key)) dupes.push([seen.get(key), p.id]);
  else seen.set(key, p.id);
}

const pct = (n) => Math.round((n / posts.length) * 100);

console.log("");
console.log(`November audit — ${posts.length} core posts across ${files.length} files`);
console.log("─".repeat(70));
console.log(`Hooks over ${HOOK_MAX_WORDS} words      ${longHooks.length}`);
for (const h of longHooks.slice(0, 10)) {
  console.log(`   ${h.id} (${h.words}) ${h.hook}`);
}
console.log(`Pace outside ${MIN_WPS}–${MAX_WPS} w/s   ${paceOut.length}`);
for (const x of paceOut.slice(0, 10)) {
  console.log(`   ${x.id}: ${x.voWords} words in ${x.s}s = ${x.wps}/s`);
}
console.log(`Explicit turn ("but")        ${turnCount} (${pct(turnCount)}%)`);
console.log(`Explicit cause ("therefore") ${causeCount} (${pct(causeCount)}%)`);
console.log(`Both                         ${both} (${pct(both)}%)`);
console.log(`Repeated opening lines       ${dupes.length}`);
for (const [a, b] of dupes.slice(0, 10)) console.log(`   ${a} and ${b}`);
console.log("─".repeat(70));
console.log("");
console.log("The connector counts are a reading aid, not a verdict. A script can");
console.log("carry its turn by contrast (\"not ugly — unclear\") instead of the word");
console.log("\"but\". Read the low ones out loud before you rewrite them.");
console.log("");
