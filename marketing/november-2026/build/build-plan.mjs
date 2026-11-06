/**
 * Turns plan.mjs into PLAN-30-DAYS.md — the table you can actually work from.
 *
 *   node marketing/november-2026/build/build-plan.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDays } from "../plan.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const days = buildDays();

const weekdayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmt = (d) =>
  `${weekdayName[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${d.toLocaleString("en-NG", { month: "short", timeZone: "UTC" })}`;

const lines = [];
lines.push("# The 30-day plan");
lines.push("");
lines.push(
  "Generated from `plan.mjs`. Every day runs the same eleven slots; the angle and the sector rotate so nothing repeats inside a month. Copy is written per day into `days.mjs`; this file is the brief.",
);
lines.push("");
lines.push("| Day | Date | Theme | Lead slot |");
lines.push("|---|---|---|---|");
for (const d of days) {
  lines.push(`| ${d.index} | ${fmt(d.date)} | ${d.theme.name} — ${d.theme.note} | ${d.items[0].angle} |`);
}
lines.push("");

for (const d of days) {
  lines.push(`## Day ${d.index} — ${fmt(d.date)} · ${d.theme.name}`);
  lines.push("");
  lines.push(`_${d.theme.note}_`);
  lines.push("");
  lines.push("| # | Slot | Platform | Today's angle | Example sector |");
  lines.push("|---|---|---|---|---|");
  for (const it of d.items) {
    lines.push(`| ${it.slot.n} | ${it.slot.name} | ${it.slot.platform} | ${it.angle} | ${it.sector} |`);
  }
  lines.push("");
}

lines.push("## How to read this");
lines.push("");
lines.push("- **Slot** never changes. That is what makes the day producible.");
lines.push("- **Angle** is the idea; **sector** is whose business the example comes from.");
lines.push("- Days marked *Proof day* run slot 4 first and slot 11 (Easywurld) in the evening.");
lines.push("- Days marked *Story day* move the personal story earlier — it is the strongest asset that day.");
lines.push("- Sundays make no hard ask. The system sells by pattern, not pressure.");
lines.push("");

fs.writeFileSync(path.join(root, "PLAN-30-DAYS.md"), lines.join("\n"));
console.log(`Wrote PLAN-30-DAYS.md — ${days.length} days × 11 slots = ${days.length * 11} posts.`);
