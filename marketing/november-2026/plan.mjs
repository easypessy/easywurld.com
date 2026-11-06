/**
 * The 30-day content plan, as data.
 *
 * Every day has the same eleven slots; what changes is the ANGLE (which idea)
 * and the SECTOR (which kind of Lagos business the example comes from). Ten
 * angles across ten sectors means a reader who follows us for a month never
 * hears the same sentence twice, while the argument stays recognisably ours.
 *
 * build/build-plan.mjs turns this into PLAN-30-DAYS.md.
 */

export const START = new Date(Date.UTC(2026, 10, 6, 12)); // noon UTC keeps the date stable

export const slots = [
  {
    n: 1,
    name: "Diagnose",
    platform: "LinkedIn 07:45 → Instagram 08:00",
    format: "feed",
    job: "They recognise themselves in a mistake",
    angles: [
      "the silent loss: they looked, then left",
      "the price they never saw",
      "the homepage that describes instead of promising",
      "the WhatsApp catalogue that should be a page",
      "the logo wall pretending to be proof",
      "the page that dies on mobile data",
      "five services that cancel each other out",
      "no address, no face, no reason to trust",
      "the form nobody finishes",
      "the site that sells yesterday's offer",
    ],
  },
  {
    n: 2,
    name: "Teach",
    platform: "TikTok 09:00 → Instagram 12:00",
    format: "feed",
    job: "One method they can use today — the copywriting door",
    angles: [
      "the ten-second test",
      "rewrite a headline in three passes",
      "price + what it includes = fair",
      "one button, one destination",
      "the 'so what' ladder",
      "a WhatsApp broadcast people actually read",
      "photograph your product on a phone, in daylight",
      "the three questions every page must answer",
      "writing a service page that pre-answers objections",
      "how to show a price range without scaring people",
    ],
  },
  {
    n: 3,
    name: "Personal story",
    platform: "Facebook 15:00 → Instagram 19:00",
    format: "feed",
    job: "Human trust: a moment, a mistake, what it cost",
    angles: [
      "the first website, unpaid",
      "'this is too simple' — the work nobody bought",
      "the month I almost quit",
      "the project I should have refused",
      "the day I stopped calling myself a web designer",
      "the message that changed how I price",
      "a mistake that cost me a client",
      "the 2am rebuild I should never have needed",
      "the client who taught me to charge first",
      "the day I fired myself from a job",
    ],
  },
  {
    n: 4,
    name: "Proof",
    platform: "Facebook 10:00 → TikTok 17:00",
    format: "feed",
    job: "Real work, screenshotted and annotated",
    angles: [
      "a homepage rewrite",
      "a landing page, two versions",
      "a social grid made coherent",
      "an automation that removed a manual step",
      "a report that replaced a meeting",
      "the same line, rewritten",
      "one brief, three directions",
      "a menu, redesigned for a phone",
      "a pricing page that stopped apologising",
      "a booking flow with one less step",
    ],
  },
  {
    n: 5,
    name: "Status lesson",
    platform: "Stories 07:30 + WhatsApp status",
    format: "story",
    job: "One idea in twenty seconds",
    angles: [
      "ten seconds, three questions",
      "a price with no reason reads expensive",
      "one button beats five menus",
      "if it doesn't load on data, it doesn't exist",
      "your best work is buried in WhatsApp",
    ],
  },
  {
    n: 6,
    name: "Opinion",
    platform: "TikTok 13:00 → Instagram 22:00",
    format: "feed",
    job: "The contrarian take that sets our standard",
    angles: [
      "you don't need a bigger website",
      "'DM for price' is costing you money",
      "most redesigns are headline problems",
      "your logo is not your brand",
      "social media cannot fix an unclear offer",
      "an agency that can't name your problem is guessing",
      "posting daily won't fix a weak offer",
      "'we are professional' is not a promise",
      "design awards don't pay rent",
      "a cheap website is the expensive option",
    ],
  },
  {
    n: 7,
    name: "Personal belief",
    platform: "Instagram 22:00",
    format: "feed",
    job: "What we refuse to do — standards build price",
    angles: [
      "we only take work we can name the fix for",
      "we don't do 'make it pop'",
      "we won't promise rankings",
      "we would rather lose the job than fake a result",
      "simplicity is a standard, not a style",
      "we don't keep clients busy to keep them paying",
      "we don't do free spec work",
      "we put the price on the page",
      "we don't hide the revision limit",
      "we say no to rushed work",
    ],
  },
  {
    n: 8,
    name: "Status proof",
    platform: "Stories 12:30 + WhatsApp status",
    format: "story",
    job: "A screenshot, one line, one ask",
    angles: [
      "homepage, before and after",
      "a WhatsApp broadcast rewrite",
      "a landing page, two versions",
      "a report page that replaced a meeting",
      "the same product, a better photo",
    ],
  },
  {
    n: 9,
    name: "Invitation",
    platform: "Facebook 20:00 → LinkedIn weekly",
    format: "feed",
    job: "Useful reply-bait — the soft sell",
    angles: [
      "drop your link, one sentence back",
      "send your homepage headline, I'll rewrite one line",
      "tell me what you sell in one sentence",
      "what is your biggest 'nobody messages me' problem?",
      "pick one of three, I'll explain which fits",
      "send your price list, I'll tell you what's missing",
      "record a ten-second read of your homepage",
    ],
  },
  {
    n: 10,
    name: "Behind the scenes",
    platform: "TikTok 21:00 → Stories 18:00",
    format: "feed",
    job: "Work in progress, a boring truth",
    angles: [
      "the folder structure that keeps projects sane",
      "how a project actually starts, unromantic version",
      "the revision I disagreed with",
      "the tool I stopped using",
      "a day where nothing went right",
      "the template that saves two hours",
      "the brief I refuse to start without",
      "how I price a project",
      "the checklist before launch",
      "what the client owns at handover",
    ],
  },
  {
    n: 11,
    name: "Easywurld",
    platform: "LinkedIn pin + Facebook 20:00 (Wednesdays)",
    format: "feed",
    job: "Who we are — the post that turns followers into clients",
    angles: [
      "the story + where we are",
      "what 'digital studio' actually means",
      "the process: understand, simplify, build, optimize",
      "the price: ranges and what moves them",
      "the handover: what you own at the end",
      "the refusal: the work we turn down",
      "the first 14 days after payment",
    ],
  },
];

export const sectors = [
  "bakery", "fashion designer", "auto dealer", "clinic", "school",
  "real estate", "restaurant", "salon & spa", "consultant", "logistics",
];

export const weekThemes = [
  { day: 1, name: "Clarity reset", note: "Diagnose leads; teach the ten-second test" },
  { day: 2, name: "Price & perception", note: "'DM for price' week opener" },
  { day: 3, name: "Proof day", note: "Screenshots lead; Easywurld slot runs" },
  { day: 4, name: "Story day", note: "Personal story moves to 12:00" },
  { day: 5, name: "Argument day", note: "Opinion leads; invitation at 20:00" },
  { day: 6, name: "Lagos day", note: "Local places, real screens, lighter teaching" },
  { day: 7, name: "Reflection", note: "Belief and Q&A; no hard ask" },
];

/** 30 days, starting Friday 6 November 2026. */
export function buildDays() {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(START.getTime() + i * 864e5);
    const weekday = date.getUTCDay(); // 0 Sun … 6 Sat
    const theme = weekThemes[(weekday + 6) % 7];
    const items = slots.map((slot) => {
      const angle = slot.angles[(i + slot.n - 1) % slot.angles.length];
      const sector = sectors[(i * 3 + slot.n) % sectors.length];
      return { slot, angle, sector };
    });
    return { index: i + 1, date, weekday, theme, items };
  });
}
