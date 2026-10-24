/* Easywurld social kit — validator.
 *
 * Checks the plan before it ships. Run:
 *   node launch-content/social-command/build/validate.mjs
 *
 * It reads content/days-*.json and the built artifacts, and fails loudly on
 * anything that would embarrass the brand or break the app.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dateFor, START_DATE } from "./kit-dates.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..");
const contentDir = join(outDir, "content");

const errors = [];
const warns = [];
const fail = (m) => errors.push(m);
const warn = (m) => warns.push(m);

/* ------------------------------------------------------------------ */
/* rules                                                               */
/* ------------------------------------------------------------------ */

const ALLOW_PARTIAL = process.argv.includes("--partial");
const EXPECT_DAYS = 30;
const POSTS_PER_DAY = 11;
const LINKEDIN_PER_DAY = 0;      // November: LinkedIn dropped
const SLOTS_PER_DAY = 33;        // 11 + 11 + 11

const WHATSAPP = "0905 069 0837";
const WA_LINK = "https://wa.me/2349050690837";
const SITE = "https://website-builder-portfolio.vercel.app";
const PRICE = "₦5,000";

/* words that make writing sound machine-made */
const BANNED = [
  "dive into", "dive deep", "game-changer", "game changer",
  "leverage", "unlock", "seamless", "robust", "testament",
  "revolutionize", "revolutionise", "cutting-edge", "cutting edge",
  "in today's fast-paced", "in today's digital", "elevate",
  "supercharge", "synergy", "paradigm", "holistic", "tapestry",
  "navigate the", "embark", "unleash", "transform your business",
  "in conclusion", "furthermore", "moreover", "it is important to note",
];

/* things we must never invent.
   These are CLAIMS, not bare words. Saying "no testimonials yet" or
   "think trust only comes from testimonials" is honest and must pass.
   Claiming "rated 5 stars by our clients" must not. */
const PROOF = [
  /\b(?:rated|rating) us\b/i,
  /\bwe(?:'re| are) rated\b/i,
  /\brating of (?:5|five|4|four)\b/i,
  /\b\d+[- ]star\b/i,
  /\btestimonial from\b/i,
  /\b(?:our|their) (?:client|customer|user)s? (?:reported|said|achieved|got|saw|increased)\b/i,
  /\bwe guarantee\b/i,
  /\bguaranteed results\b/i,
  /\b100% success\b/i,
  /\bproven results\b/i,
  /\bbest in nigeria\b/i,
  /\baward[- ]winning\b/i,
  /\b#1 in\b/i,
  /\bnumber one (?:ranking|agency|provider|shop|brand|position|choice)\b/i,
  /\bcase study of\b/i,
  /\bclient results\b/i,
];

/* a negated promise is fine — "no guaranteed results" is honest.
   So is pointing out that people think wrongly ("most businesses think
   trust comes from testimonials"), or quoting what an agency promises. */
const NEGATION = [
  /\b(?:no|not|never|without|nor|cannot|can't|won't|will not|isn't|is not|aren't|are not|don't|do not|doesn't|does not)\b[^.]{0,60}$/i,
  /\b(?:think|thought|believe|feel|people|businesses|owners|everyone|some|many|most|a lot of)\b[^.]{0,60}$/i,
  /\b(?:promises?|promised|claiming|claims|advertis\w*|says?|said)\b[^.]{0,60}$/i,
  /\b(?:instead|rather than|until|because of)\b[^.]{0,60}$/i,
];

/* quoted examples of bad copy are fine — strip them before checking */
function stripQuoted(text) {
  return String(text)
    .replace(/'[^']*'/g, " ")
    .replace(/"[^"]*"/g, " ")
    .replace(/\u201c[^\u201d]*\u201d/g, " ")
    .replace(/\u2018[^\u2019]*\u2019/g, " ");
}

/* every string inside a post, so each is checked on its own */
function stringsOf(value, acc = []) {
  if (typeof value === "string") acc.push(value);
  else if (Array.isArray(value)) value.forEach((v) => stringsOf(v, acc));
  else if (value && typeof value === "object") {
    for (const k of Object.keys(value)) {
      if (k === "allow_banned") continue;
      stringsOf(value[k], acc);
    }
  }
  return acc;
}

function hasCleanHit(text, needle) {
  const stripped = stripQuoted(text);
  const re = needle instanceof RegExp
    ? new RegExp(needle.source, "i")
    : new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const m = re.exec(stripped);
  if (!m) return false;
  const before = stripped.slice(Math.max(0, m.index - 70), m.index);
  return !NEGATION.some((n) => n.test(before));
}

/* ------------------------------------------------------------------ */
/* read the source days                                               */
/* ------------------------------------------------------------------ */

const files = readdirSync(contentDir)
  .filter((f) => /^days-\d+(-\d+)?\.json$/.test(f))
  .sort();

const days = [];
for (const f of files) {
  const raw = JSON.parse(readFileSync(join(contentDir, f), "utf8"));
  const list = Array.isArray(raw) ? raw : raw.days || Object.values(raw);
  for (const d of list) days.push(d);
}
days.sort((a, b) => a.day - b.day);

/* ------------------------------------------------------------------ */
/* 1. shape                                                            */
/* ------------------------------------------------------------------ */

if (days.length !== EXPECT_DAYS) {
  if (ALLOW_PARTIAL) warn(`partial run: ${days.length} of ${EXPECT_DAYS} days written`);
  else fail(`expected ${EXPECT_DAYS} days, found ${days.length}`);
}

const seenIds = new Set();

days.forEach((day, i) => {
  const dt = dateFor(i);
  const tag = `day ${day.day}`;

  if (!day.posts || day.posts.length !== POSTS_PER_DAY) {
    fail(`${tag}: expected ${POSTS_PER_DAY} posts, found ${day.posts ? day.posts.length : 0}`);
  }

  const liCount = (day.posts || []).filter((p) => p.linkedin).length;
  if (liCount !== LINKEDIN_PER_DAY) {
    fail(`${tag}: expected ${LINKEDIN_PER_DAY} LinkedIn posts, found ${liCount}`);
  }

  (day.posts || []).forEach((p) => {
    if (seenIds.has(p.id)) fail(`${tag}: duplicate post id ${p.id}`);
    seenIds.add(p.id);

    if (!p.id.startsWith(`D${day.day}-`)) {
      fail(`${tag}: post id ${p.id} does not match its day`);
    }

    /* TikTok, Instagram and Facebook run on every post.
       LinkedIn runs on 5 posts a day, not on every post. */
    for (const plat of ["tiktok", "instagram", "facebook"]) {
      if (!p[plat]) { fail(`${p.id}: missing ${plat} version`); continue; }
      const body = p[plat].body || p[plat].vo || p[plat].cap
        || (p[plat].slides || []).join(" ") || "";
      if (!body || body.trim().length < 40) {
        fail(`${p.id}: ${plat} version has no real copy`);
      }
    }
    if (p.linkedin) {
      if (!p.linkedin.body || p.linkedin.body.trim().length < 40) {
        fail(`${p.id}: linkedin version has no real copy`);
      }
    }

    /* brand rules — checked on each string on its own, so a quoted
       example of bad copy does not trip the check */
    const allow = p.allow_banned || [];
    const allStrings = stringsOf(p);
    for (const word of BANNED) {
      if (allow.includes(word)) continue;
      for (const str of allStrings) {
        if (hasCleanHit(str, word)) {
          fail(`${p.id}: banned wording "${word}"`);
          break;
        }
      }
    }
    for (const re of PROOF) {
      for (const str of allStrings) {
        if (hasCleanHit(str, re)) {
          fail(`${p.id}: invented-proof wording "${re.source}"`);
          break;
        }
      }
    }

    /* the WhatsApp link and price, where used, must be exact */
    const all = JSON.stringify(p);
    if (all.includes("wa.me") && !all.includes(WA_LINK)) {
      fail(`${p.id}: wrong WhatsApp link`);
    }
    if (/\bN\s?5,000\b/.test(all) && !all.includes(PRICE)) {
      fail(`${p.id}: price written without the naira sign`);
    }

    /* A sell post must carry a way to buy. Entertain and teach posts are
       deliberately pitch-free — one job per post — so they are not flagged. */
    if (String(p.type || "").toLowerCase() === "sell" && !all.includes(WHATSAPP) && !all.includes(SITE)) {
      warn(`${p.id}: sell post has no contact detail (WhatsApp or site)`);
    }
  });

  /* the day must have a theme and an offer in focus */
  if (!day.theme) fail(`${tag}: no theme`);
  if (!day.offer) fail(`${tag}: no offer in focus`);
});

/* ------------------------------------------------------------------ */
/* 2. the built artifacts must agree with the source                   */
/* ------------------------------------------------------------------ */

const appPath = join(outDir, "EASYWURLD_POST_COMMANDER.html");
let appHtml = "";
try {
  appHtml = readFileSync(appPath, "utf8");
} catch {
  fail("EASYWURLD_POST_COMMANDER.html is missing — run build-kit.mjs first");
}

if (appHtml) {
  const m = appHtml.match(/<script>[\s\S]*?var DATA = (\{.*?\});/);
  if (!m) {
    fail("could not find the DATA block in the built app");
  } else {
    let DATA;
    try {
      DATA = JSON.parse(m[1]);
    } catch (e) {
      fail(`DATA block is not valid JSON: ${e.message}`);
    }
    if (DATA) {
      if (DATA.days.length !== EXPECT_DAYS) {
        if (ALLOW_PARTIAL) warn(`partial run: app has ${DATA.days.length} of ${EXPECT_DAYS} days`);
        else fail(`built app has ${DATA.days.length} days, expected ${EXPECT_DAYS}`);
      }
      if (DATA.meta.startDate !== START_DATE) {
        fail(`built app start date ${DATA.meta.startDate} != ${START_DATE}`);
      }
      DATA.days.forEach((d, i) => {
        const dt = dateFor(i);
        if (d.date.iso !== dt.iso) {
          fail(`day ${d.day}: built date ${d.date.iso} != ${dt.iso}`);
        }
        if (d.posts.length !== POSTS_PER_DAY) {
          fail(`day ${d.day}: built app has ${d.posts.length} posts`);
        }
        const li = d.posts.filter((p) => p.linkedin).length;
        if (li !== LINKEDIN_PER_DAY) {
          fail(`day ${d.day}: built app has ${li} LinkedIn posts`);
        }
        d.posts.forEach((p) => {
          if (!p.ttTime) fail(`${p.id}: no TikTok time in the built app`);
          if (!p.igTime) fail(`${p.id}: no Instagram time in the built app`);
          if (!p.fbTime) fail(`${p.id}: no Facebook time in the built app`);
          if (p.linkedin && !p.liTime && !p.liBonus) {
            fail(`${p.id}: no LinkedIn time in the built app`);
          }
        });
      });

      /* the app script must parse */
      const script = appHtml.match(/<script>([\s\S]*?)<\/script>/);
      if (script) {
        try {
          new Function(script[1]);
        } catch (e) {
          fail(`the built app script does not parse: ${e.message}`);
        }
      }
    }
  }
}

/* the CSV must have one row per scheduled post */
const csvPath = join(outDir, "content_calendar.csv");
try {
  const csv = readFileSync(csvPath, "utf8");
  /* rows can contain newlines inside quoted fields, so count records properly */
  let newlines = 0, inQuotes = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === "\n" && !inQuotes) newlines++;
  }
  /* the file ends without a trailing newline, so records = newlines + 1 */
  const records = newlines + 1;
  const expectedRows = days.length * SLOTS_PER_DAY;
  if (records !== expectedRows + 1) {
    fail(`content_calendar.csv has ${records - 1} rows, expected ${expectedRows}`);
  }
} catch {
  fail("content_calendar.csv is missing — run build-kit.mjs first");
}

/* ------------------------------------------------------------------ */
/* 3. report                                                           */
/* ------------------------------------------------------------------ */

const types = {};
for (const d of days) {
  for (const p of d.posts || []) types[p.type] = (types[p.type] || 0) + 1;
}

const last = dateFor(days.length - 1);
console.log(
  `days: ${days.length} | core posts: ${days.reduce((n, d) => n + (d.posts ? d.posts.length : 0), 0)}`
  + ` | types: ${JSON.stringify(types)}`
);
console.log(`plan: ${dateFor(0).iso} to ${last.iso}`);

if (warns.length) {
  console.log("");
  for (const w of warns) console.log("WARN  " + w);
}

if (errors.length) {
  console.log("");
  for (const e of errors) console.log("FAIL  " + e);
  console.log("");
  console.log(`${errors.length} problem(s) found.`);
  process.exit(1);
}

console.log("");
console.log("ALL CHECKS PASS");
