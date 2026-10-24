/* Easywurld social kit — meme bank generator.
 *
 * Collects every Meme post in the plan and writes MEME_BANK.md, so the
 * meme file can never drift from the calendar.
 *
 * Run:  node launch-content/social-command/build/build-meme-bank.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dateFor } from "./kit-dates.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..");
const contentDir = join(outDir, "content");

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
/* helpers                                                             */
/* ------------------------------------------------------------------ */

/* strip one wrapping pair of quotes, keeping any quotes inside */
function unquote(s) {
  const t = String(s).trim();
  const m = t.match(/^(['"])([\s\S]*)\1$/);
  return m ? m[2].trim() : t;
}

/* the meme panel text, in order, for one post.
   Instagram carries the full panel script, so it is the source. */
function panels(post) {
  const ig = post.instagram;
  if (ig && ig.slides && ig.slides.length) return ig.slides.slice();

  const t = post.tiktok;
  if (t && t.beats && t.beats.length) return t.beats.slice();
  if (t && t.hook) return [t.hook];

  return [];
}

/* a chat panel opens on a speaker — "Customer: ..." or "Me: ...".
   A meme that opens on a scene ("My services page: 47 things") is a
   multi panel, even when later lines look like dialogue. */
function isChatPanel(lines) {
  if (!lines.length) return false;
  const first = String(lines[0]).split("\n")[0];
  return /^(Customer|Me)\s*:/.test(first);
}

/* work out which format a meme is, from its panels */
function formatOf(post) {
  const lines = panels(post);
  if (isChatPanel(lines)) return "chat panel";
  if (lines.length >= 3) return "multi panel";
  if (lines.length === 2) return "two panel";
  return "one panel";
}

/* ------------------------------------------------------------------ */
/* build the bank                                                     */
/* ------------------------------------------------------------------ */

/* If the month contains no Meme posts, write an honest empty file instead of
   a template that promises memes which are not in the calendar. The November
   build cut the meme show deliberately (it scored 3.0 and produced no
   conversations), so this is the expected state, not an error. */
if (countMemes() === 0) {
  const empty = [
    "# Easywurld — Meme Bank",
    "",
    `**There are no memes in this build, and that is deliberate: ${days.length} days, 0 meme posts.**`,
    "",
    "The meme show was cut after the October scoring round. It scored 3.0, cost a",
    "graphic per post, and produced no conversations, while the four shows that",
    "replaced it (fix this, one thing, steal, honest ad) carried the month.",
    "",
    "## If you want memes back",
    "",
    "1. Add a post with `\"type\": \"Meme\"` and `\"show\": \"meme\"` to any day file.",
    "2. Rebuild with `node launch-content/november/build/build-meme-bank.mjs`.",
    "3. This file fills itself from the calendar, so it can never drift again.",
    "",
    "Guidance if you do: a meme is a picture and a reaction, not a caption with a",
    "font. Keep it to cream `#FAE7C7` and deep green `#0A4937`, no logo, no pitch,",
    "and skip any joke that punches down at a customer, a competitor or a country.",
    "",
    "## Why this file exists at all",
    "",
    "An empty generated file that explains itself is more useful than a full one",
    "that lies about what is scheduled. If this page ever lists memes, they are",
    "real posts with real days attached.",
    "",
  ].join("\n");
  writeFileSync(join(outDir, "MEME_BANK.md"), empty);
  console.log(
    `MEME_BANK.md: ${empty.length.toLocaleString()} chars | 0 memes across ${days.length} days (cut by design)`
  );
  process.exit(0);
}

const md = [];
const push = (...lines) => md.push(...lines);

push("# Easywurld — Meme Bank");
push("");
push(`**30 days, ${countMemes()} memes, every one of them already scheduled.**`);
push("");
push("This is not a list of ideas. Every meme below is a post that is in the calendar, with");
push("the words to type on it. If you build the meme on this page, the day is done.");
push("");
push("**A meme is not a caption with a font. It is a picture and a reaction.**");
push("");
push("**How to build one in 10 minutes**");
push("");
push("1. Open the day in the Post Commander app and tap the meme post.");
push("2. Use any free meme generator, or Canva. Type the text exactly as written here.");
push("3. Keep the Easywurld colours: cream `#FAE7C7` background, deep green `#0A4937` text,");
push("   one terracotta `#9E4E2C` accent if you want it. No gradients, no stock photos, no");
push("   drop shadows.");
push("4. Post it as a plain image. Do not put a logo on it. Let the joke carry it.");
push("5. Do not add a sales pitch to a meme. The morning meme is context, the evening meme");
push("   is the share.");
push("");
push("**Before you post it, check three things**");
push("");
push("- Would a customer find this funny? If it is only funny to other marketers, skip it.");
push("- Is it a punch down at a customer, a competitor or a country? Skip it.");
push("- Is the joke obvious in two seconds? If you had to think, it is a caption, not a meme.");
push("");
push("**Formats used below**");
push("");
push("- *one panel*: a single line of big text on cream. Use this for the industry-insider ones.");
push("- *two panel*: classic, top text and bottom text.");
push("- *multi panel*: three or more beats, each one a short line.");
push("- *chat panel*: a fake chat window. Use this for customer conversations.");
push("");
push("---");
push("");
push("## The bank");
push("");

let n = 0;
const memes = [];

for (let i = 0; i < days.length; i++) {
  const day = days[i];
  const dt = dateFor(i);
  const dayMemes = (day.posts || []).filter((p) => p.type === "Meme");
  if (!dayMemes.length) continue;

  push(`### Day ${day.day} · ${dt.weekday} ${dt.day} ${dt.month}`);
  push("");

  for (const p of dayMemes) {
    n++;
    memes.push({ id: p.id, day: day.day, topic: p.topic, fmt: formatOf(p) });

    push(`**${n}. ${unquote(p.topic)}** · ${formatOf(p)}`);
    panels(p).forEach((line, k) => {
      push(`${k + 1}. \`${unquote(line)}\``);
    });
    push("");
  }
}

push("---");
push("");
push("## Notes on the daily slots");
push("");
push("**Morning meme.** Keep it light. It is context, and it earns you the reach.");
push("");
push("**Evening meme.** This is the one that gets shared, because people share at night when");
push("they are relaxed. Put the sharpest joke here.");
push("");
push("**Never put the same meme on two platforms on the same day.** Rewrite the bottom line for");
push("each platform, and never crop a meme differently on two platforms, because the same");
push("person follows you on both.");
push("");
push("**On the days with two memes,** the first one is the morning slot and the second is the");
push("evening slot. The order in this file is the order in the day.");
push("");

writeFileSync(join(outDir, "MEME_BANK.md"), md.join("\n"));

function countMemes() {
  let c = 0;
  for (const d of days) {
    for (const p of d.posts || []) if (p.type === "Meme") c++;
  }
  return c;
}

console.log(
  `MEME_BANK.md: ${statSync(join(outDir, "MEME_BANK.md")).size.toLocaleString()} chars`
  + ` | ${n} memes across ${days.length} days`
);
