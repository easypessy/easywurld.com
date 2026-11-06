/**
 * The composer: plan.mjs (what each day argues) × angles (how it argues) ×
 * sectors (whose business the example comes from) → finished posts.
 *
 * Day 1 is hand-written in posts.mjs, Day 2 in days.mjs. Days 3–30 are built
 * here so the whole month exists in one place and can be regenerated in seconds.
 */

import { buildDays, slots } from "../plan.mjs";
import { sectors } from "./sectors.mjs";
import { slot1, slot2 } from "./angles-01-02.mjs";
import { slot3, slot4, slot6 } from "./angles-03-04-06.mjs";
import { slot5, slot7, slot8, slot9, slot10, slot11 } from "./angles-05-07-08-09-10-11.mjs";

const ANGLE_SETS = {
  1: slot1, 2: slot2, 3: slot3, 4: slot4, 5: slot5, 6: slot6,
  7: slot7, 8: slot8, 9: slot9, 10: slot10, 11: slot11,
};

const FOOT = {
  1: "Message CLEAR on WhatsApp · free ten-second audit",
  2: "Save this. Then rewrite one line tonight.",
  3: "Message CLEAR if this sounds familiar.",
  4: "Real screenshots, labelled honestly. Concept work is marked.",
  5: "Message CLEAR with your own ten-second answer.",
  6: "Disagree? Comment. I read every one.",
  7: "Message CLEAR if you want the standard, not the pitch.",
  8: "Message CLEAR and I'll send the template.",
  9: "Message CLEAR · 0905 069 0837",
  10: "Message CLEAR and I'll send the template.",
  11: "Message CLEAR · 0905 069 0837 · Lagos, Nigeria",
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TIMES = {
  1: "07:45 LinkedIn, 08:00 Instagram",
  2: "09:00 TikTok, 12:00 Instagram",
  3: "15:00 Facebook, 19:00 Instagram",
  4: "10:00 Facebook, 17:00 TikTok",
  5: "07:30 stories + WhatsApp status",
  6: "13:00 TikTok, 22:00 Instagram",
  7: "22:00 Instagram",
  8: "12:30 stories + WhatsApp status",
  9: "20:00 Facebook, weekly LinkedIn",
  10: "21:00 TikTok, 18:00 stories",
  11: "20:00 Facebook, LinkedIn rotation",
};

const slug = (s) =>
  s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42);

const fill = (text, sector) =>
  String(text)
    .replaceAll("{biz}", sector.biz)
    .replaceAll("{cust}", sector.cust)
    .replaceAll("{amt}", sector.amt)
    .replaceAll("{friction}", sector.friction);

function hashtags(sector, n) {
  const base = ["#Easywurld", "#LagosBusiness", "#SmallBusinessNigeria", "#MarketingClarity", "#NaijaBusiness"];
  const all = [...sector.tags, ...base];
  return [...new Set(all)].slice(0, n).join(" ");
}

function captions({ angle, sector, slot }) {
  const h = angle.h;
  const p0 = angle.p[0];
  const p1 = angle.p[1] ?? angle.p[0];
  const [ch, cb] = angle.c;

  const linkedin = [
    h,
    "",
    `${p0[1]} ${p0[2]}`,
    "",
    `${p1[1]} ${p1[2]}`,
    "",
    `${ch} ${cb}`,
    "",
    `If this is your business — a ${sector.biz} where ${sector.friction} — message CLEAR on WhatsApp and I will send back the first thing I would change. No pitch.`,
    "",
    hashtags(sector, 5),
  ].join("\n");

  const instagram = [
    `${h} 🧡`,
    "",
    p0[1],
    p0[2],
    "",
    p1[1],
    p1[2],
    "",
    ch,
    cb,
    "",
    "Save this if it is you.",
    "",
    hashtags(sector, 7),
  ].join("\n");

  const tiktok = [
    `Hook on screen: “${h}”`,
    "",
    "Beats:",
    `0–3s — ${p0[1]}.`,
    `3–10s — ${p0[2]}`,
    `10–16s — ${p1[1]}. ${p1[2]}`,
    `16–20s — ${ch}`,
    "",
    `Text on screen: “${ch.split(".")[0]}.”`,
  ].join("\n");

  const whatsapp = [
    h,
    "",
    `${p0[1]} ${p1[1]}`,
    "",
    ch,
    cb,
    "",
    "Message CLEAR if you want the checklist.",
  ].join("\n");

  return { linkedin, instagram, tiktok, whatsapp: slot === 11 ? `${h}\n\n${p0[1]}\n\n${ch}\n${cb}\n\nMessage CLEAR · 0905 069 0837` : whatsapp };
}

function buildSlides(angle, slotN, sector) {
  const hook = {
    kind: "hook",
    eyebrow: fill(angle.e, sector),
    headline: fill(angle.h, sector),
    art: { type: angle.art ?? "none" },
  };
  const point = (p, art = "none") => ({
    kind: "point",
    eyebrow: fill(p[0], sector),
    headline: fill(p[1], sector),
    body: fill(p[2], sector),
    art: { type: art },
  });
  const close = {
    kind: "cta",
    eyebrow: slotN === 11 ? "Say hello" : "Tonight",
    headline: fill(angle.c[0], sector),
    body: fill(angle.c[1], sector),
    foot: FOOT[slotN],
    art: { type: "seal" },
  };

  if (slotN === 5) return [hook, point(angle.p[0]), close];
  if (slotN === 8) {
    const shot = {
      kind: "point",
      eyebrow: "Before / after",
      headline: fill(angle.p[0][1], sector),
      body: "",
      art: { type: "shot", img: angle.shot.img, tag: "Concept build", label: angle.shot.label, zoom: angle.shot.zoom ?? 1.15, cropTop: 0.02 },
    };
    return [hook, shot, close];
  }
  if (slotN === 4) {
    const shot = {
      kind: "point",
      eyebrow: "The build",
      headline: fill(angle.p[1][1], sector),
      body: "",
      art: { type: "shot", img: angle.shot.img, tag: "Concept build", label: angle.shot.label, zoom: angle.shot.zoom ?? 1.15, cropTop: 0.02 },
    };
    return [hook, point(angle.p[0]), shot, point(angle.p[1]), close];
  }
  return [hook, point(angle.p[0]), point(angle.p[1]), close];
}

export const generatedPosts = buildDays()
  .filter((d) => d.index >= 3) // days 1–2 are hand-written
  .flatMap((day) =>
    day.items.map(({ slot, sector: sectorKey }, i) => {
      const sector = sectors.find((s) => s.key === sectorKey) ?? sectors[i % sectors.length];
      const bank = ANGLE_SETS[slot.n];
      const angle = bank[(day.index - 1 + slot.n - 1) % bank.length];
      const dateLabel = `${WEEKDAYS[day.date.getUTCDay()]} ${day.date.getUTCDate()} ${MONTHS[day.date.getUTCMonth()]}`;
      const isStory = slot.format === "story";
      return {
        folder: `days/day-${String(day.index).padStart(2, "0")}/${String(slot.n).padStart(2, "0")}-${slug(angle.k)}`,
        date: `${dateLabel} · ${TIMES[slot.n]}`,
        platform: slot.platform,
        format: slot.format,
        personal: slot.n === 3,
        title: fill(angle.h, sector),
        notes: `${slot.job}. Example sector: ${sector.biz}. Illustrative figures — replace with your own market numbers before posting.`,
        slides: buildSlides(angle, slot.n, sector),
        captions: captions({ angle: { ...angle, h: fill(angle.h, sector), p: angle.p.map((p) => p.map((x) => fill(x, sector))), c: angle.c.map((x) => fill(x, sector)) }, sector, slot: slot.n }),
        hashtags: hashtags(sector, 7).split(" "),
        _meta: { day: day.index, slot: slot.n, story: isStory, angle: angle.k },
      };
    }),
  );
