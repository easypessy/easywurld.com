import type { Project } from "./types";

export const reports: Project[] = [
  {
    slug: "field-notes-report",
    shot: "/shots/field-notes-report.jpg",
    liveUrl: "/demo/field-notes-report/field-notes-report.pdf",
    title: "Field Notes Report",
    category: "Reports & Presentations",
    industry: "Research",
    service: "Business Reports & Presentations",
    projectType: "Report system",
    status: "Sample Project",
    year: "2026",
    weight: 2,
    summary: "Sixty-page reports that nobody read past page three.",
    challenge:
      "The research was paid for, delivered, and put on a shelf. The findings were good. The format hid them. Decisions were made in meetings by people who had read two pages.",
    approach:
      "We rebuilt it around decisions instead of method: what to do, why, then the evidence, in that order. The method moved to the back, where the people who want it can still find it.",
    built: [
      "A one-page summary of the decisions, right at the front",
      "Chart rules: one idea per chart, labelled directly",
      "A fixed question at the end of each section: so what?",
      "A one-page brief made from the same content",
    ],
    direction:
      "Borrowed from newspapers, not slide decks: a strong column of text, wide margins, charts sitting inside the words. Black on off-white, one accent for emphasis.",
    result:
      "Sample system. No readership data. The change is simple: the recommendation comes before the evidence, not after.",
    takeaway: "A report nobody finishes is a report nobody commissioned.",
    tags: ["Reports", "Data", "Editorial"],
    visual: {
      archetype: "report", bg: "#FBFAF7", ink: "#17181A", accent: "#9A3B2E", muted: "#72757A",
      head: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif", variant: 0,
      words: ["Field Notes", "Decision summary", "Evidence", "Appendix"],
    },
  },
  {
    slug: "civic-proposal-template",
    shot: "/shots/civic-proposal-template.jpg",
    liveUrl: "/demo/civic-proposal-template/civic-proposal-template.pdf",
    title: "Civic Proposal",
    category: "Reports & Presentations",
    industry: "Professional services",
    service: "Business Reports & Presentations",
    projectType: "Proposal template",
    status: "Sample Project",
    year: "2026",
    weight: 1,
    summary: "A proposal template that keeps a small team saying the same thing.",
    challenge:
      "Every proposal was written from nothing by whoever had time. Quality changed with the writer, and the price section looked different each time. Clients noticed.",
    approach:
      "We built a template with a fixed order: what we understand, how we would work, the team, the timeline, the price, the terms. We wrote the joins, so only the details need changing.",
    built: [
      "A six-part proposal template with the order locked",
      "A price table that lists what is in and what is out, every time",
      "A standing terms page that can be reused",
      "Notes inside the template to guide the writer",
    ],
    direction:
      "Calm and formal. Navy and warm white, thin lines, one accent on the price line. Built to print properly, because proposals still get printed.",
    result:
      "Sample template. The win is that every writer produces the same quality. We cannot claim a higher win rate without data.",
    takeaway: "Consistency is the cheapest form of credibility.",
    tags: ["Proposals", "Templates", "B2B"],
    visual: {
      archetype: "report", bg: "#FFFFFF", ink: "#132033", accent: "#2C4A6E", muted: "#6B7480",
      head: "'Inter Tight', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 1,
      words: ["Proposal", "Understanding", "Timeline", "Price"],
    },
  },
  {
    slug: "open-door-deck",
    shot: "/shots/open-door-deck.jpg",
    liveUrl: "/demo/open-door-deck/open-door-deck.pdf",
    title: "Open Door Enrolment Deck",
    category: "Reports & Presentations",
    industry: "Education",
    service: "Business Reports & Presentations",
    projectType: "Presentation design",
    status: "Sample Project",
    year: "2026",
    weight: 1,
    summary: "A parents' evening deck that works in a bright hall.",
    challenge:
      "The old slides were dense paragraphs at 14pt, shown in a hall with the lights on. Parents at the back could not read them, so the presenter read the slides out loud.",
    approach:
      "One idea per slide, 28pt or bigger, strong contrast. The detail moved to a printed handout. That is where detail belongs when people are standing in a hall, not sitting at a desk.",
    built: [
      "24 slides, one idea on each",
      "A two-page handout that carries the detail",
      "Speaker notes with a time for each part",
      "A high-contrast version for dim rooms",
    ],
    direction:
      "Ivory and navy with ochre accents. Very large type, wide margins, no logo on every slide. Charts cut down to one comparison each, instead of full tables.",
    result:
      "Sample deck. Designed for the real room, not for the writer's screen.",
    takeaway: "Design slides for the back row or don't use slides.",
    tags: ["Presentation", "Education", "Legibility"],
    visual: {
      archetype: "report", bg: "#FCFAF4", ink: "#1C2A46", accent: "#D18A18", muted: "#757E90",
      head: "'Outfit', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 2,
      words: ["One idea", "28pt minimum", "Handout has detail", "Slide 7 / 24"],
    },
  },
  {
    slug: "aster-market-brief",
    shot: "/shots/aster-market-brief.jpg",
    liveUrl: "/demo/aster-market-brief/aster-market-brief.pdf",
    title: "Aster Market Brief",
    category: "Reports & Presentations",
    industry: "Real estate",
    service: "Business Reports & Presentations",
    projectType: "Briefing document",
    status: "Sample Project",
    year: "2026",
    weight: 1,
    summary: "A briefing document for a new property release.",
    challenge:
      "Agents were briefed by email chain. By launch day, three were quoting different availability and two were using the old price list.",
    approach:
      "One briefing document, with a version number and a date on every page. It is laid out so an agent can find any fact in under ten seconds while on a call.",
    built: [
      "A versioned brief, with the changes listed on page two",
      "An availability table built to be read on a phone",
      "A sheet of common worries and answers",
      "A one-page summary card you can print",
    ],
    direction:
      "Stone and bronze, real building photos, a strict two-column grid. All numbers in a mono type, so nothing is misread.",
    result:
      "Sample document. The useful part is versioning: one source, dated, with the changes written down.",
    takeaway: "If three people quote three prices, the problem is the document, not the people.",
    tags: ["Property", "Internal comms", "Versioning"],
    visual: {
      archetype: "report", bg: "#EDEBE6", ink: "#1A1B1D", accent: "#8C6A3F", muted: "#767881",
      head: "'Archivo', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 3,
      words: ["Brief v2.1", "Availability", "Objections", "28 Sep 2026"],
    },
  },
  {
    slug: "good-harvest-plan",
    shot: "/shots/good-harvest-plan.jpg",
    liveUrl: "/demo/good-harvest-plan/good-harvest-plan.pdf",
    title: "Good Harvest Season Plan",
    category: "Reports & Presentations",
    industry: "Food retail",
    service: "Business Reports & Presentations",
    projectType: "Operational planning document",
    status: "Sample Project",
    year: "2026",
    weight: 1,
    summary: "A seasonal plan made to be used in a stockroom, not filed away.",
    challenge:
      "Earlier plans were slide decks that stayed on a laptop. The people who needed them were on the shop floor, with wet hands and no screen.",
    approach:
      "We designed for the wall. A3 size, fine in black and white, one page per month. The order deadlines are the biggest thing on the page, because those are what get missed.",
    built: [
      "Twelve monthly sheets, A3, clear in black and white",
      "Order deadlines as the biggest element",
      "A season chart by type of produce",
      "A blank column for handwritten notes",
    ],
    direction:
      "Practical: heavy lines, big numbers, strong contrast, no photos. Readable from two metres under strip lights.",
    result:
      "Sample document. The constraint was how it gets used in the hand. That changed almost every choice a screen-first plan would have made.",
    takeaway: "Ask where the document will physically be when it is read.",
    tags: ["Operations", "Print", "Planning"],
    visual: {
      archetype: "report", bg: "#F5F7F0", ink: "#1E2D1A", accent: "#6B8F3A", muted: "#77836D",
      head: "'Archivo', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 0,
      words: ["March", "Order by 12th", "In season", "Notes"],
    },
  },
  {
    slug: "northline-lookbook",
    shot: "/shots/northline-lookbook.jpg",
    liveUrl: "/demo/northline-lookbook/northline-lookbook.pdf",
    title: "Northline Lookbook",
    category: "Reports & Presentations",
    industry: "Fashion",
    service: "Business Reports & Presentations",
    projectType: "Wholesale lookbook",
    status: "Sample Project",
    year: "2026",
    weight: 1,
    summary: "A compact lookbook that doubles as an order form.",
    challenge:
      "Buyers got a lovely lookbook and a separate spreadsheet, and had to match them up by hand. Orders kept arriving with the wrong style codes.",
    approach:
      "We put them together. Every photo carries its style code, wholesale price and minimum order on the same spread, so the buyer never looks away from the clothes.",
    built: [
      "A 24-page lookbook with the order details built in",
      "Style codes that match the warehouse exactly",
      "A size grid for each style on the facing page",
      "One layout that works for print and screen",
    ],
    direction:
      "Room around the images, and a small, exact data block in the same place on every spread. Paper white, black ink, no accent colour. The clothes bring the colour.",
    result:
      "Sample document. The change is structural: one document instead of two, which removes the copying step where errors happen.",
    takeaway: "Two documents that must be read together should be one document.",
    tags: ["Fashion", "Wholesale", "Print"],
    visual: {
      archetype: "report", bg: "#F7F5F1", ink: "#141210", accent: "#9A8468", muted: "#847C73",
      head: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif", variant: 1,
      words: ["NL-204", "₦42,000 wholesale", "MOQ 6", "Spread 08"],
    },
  },
  {
    slug: "buildwise-project-report",
    shot: "/shots/buildwise-project-report.jpg",
    liveUrl: "/demo/buildwise-project-report/buildwise-project-report.pdf",
    title: "Buildwise Project Report",
    category: "Reports & Presentations",
    industry: "Construction",
    service: "Business Reports & Presentations",
    projectType: "Client progress report",
    status: "Sample Project",
    year: "2026",
    weight: 1,
    summary: "Progress updates written for clients, not for the site team.",
    challenge:
      "Clients were sent the internal progress report: trade shorthand, schedule codes, variation numbers. It caused worried phone calls every two weeks asking what it all meant.",
    approach:
      "A separate client version, built from the same data: what happened, what is next, what needs a decision from you, and whether the cost or the date has moved. Four questions, answered every time.",
    built: [
      "A two-weekly client report, two pages at most",
      "The 'decisions needed' section first",
      "Site photos with captions in plain words",
      "Cost and date changes stated, even when the change is zero",
    ],
    direction:
      "Clear and plain. Grey, black, one yellow accent on the decisions block. Photo captions are full sentences. That is unusual, and far more useful.",
    result:
      "Sample template. The hope is fewer clarifying calls. We have no call data to claim that.",
    takeaway: "An internal document sent to a client is not a client report.",
    tags: ["Construction", "Client comms", "Templates"],
    visual: {
      archetype: "report", bg: "#EEEEEB", ink: "#151515", accent: "#E0A800", muted: "#6F6F6A",
      head: "'Inter Tight', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 2,
      words: ["Decisions needed", "This fortnight", "Next fortnight", "Cost: no change"],
    },
  },
];
