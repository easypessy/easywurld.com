/**
 * EASYWURLD — single source of truth for every word on the site.
 *
 * Before this module existed, page copy was hard-coded inside the page
 * components and the homepage copy existed in three places (index.html
 * `#prerender`, Home.tsx and HomeHero.tsx). Changing one sentence meant
 * editing TSX in several files and keeping the copies in sync by hand.
 *
 * Now: edit the copy here, and the page, the crawler-facing pre-render and
 * the structured data all follow. Nothing in this file may invent a client,
 * a result, a testimonial or a statistic — see README.md.
 */

import type { Category } from "./types";

/* ------------------------------------------------------------------ brand */

export const BRAND = {
  name: "Easywurld",
  slogan: "Simplify. Optimize. Grow.",
  tagline: "Independent digital studio · Lagos, Nigeria",
  email: "hello@easywurld.com",
  phoneDisplay: "0905 069 0837",
  phoneIntl: "+2349050690837",
  whatsapp: "https://wa.me/2349050690837",
  country: "Nigeria",
  city: "Lagos",
  hours: "Mo-Sa 09:00-18:00",
} as const;

/** Public origin. Overridable so attaching a custom domain is a one-line
 *  change (VITE_SITE_URL) rather than an edit across four files.
 *  `import.meta.env` is absent when this module is loaded from vite.config.ts
 *  (vitest, sitemap script), so it is read defensively. */
const ENV =
  (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export const SITE_URL =
  ENV.VITE_SITE_URL ?? "https://website-builder-portfolio.vercel.app";

/** One-line description used wherever a short summary is needed. */
export const DESCRIPTION =
  "We build websites, write the words and set up simple systems for small businesses in Lagos. Clear sites that load fast, show up in search and turn visitors into messages.";

/* ------------------------------------------------------------------- home */

export const HOME_HERO = {
  eyebrow: BRAND.tagline,
  title: BRAND.slogan,
  lead:
    "Marketing clarity for small businesses in Lagos — strategy, design, words and simple " +
    "systems that work together. Clear, fast and built to bring in messages.",
  primary: "Start a project",
  secondary: "Explore our work",
  services: "Our services",
  lighthouseUrl: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`,
  lighthouseNote: "Results are measured live — no sample scores.",
};

/** Title tag and meta description for the homepage. Kept here so the static
 *  shell in index.html and the per-route <Seo> component cannot disagree. */
export const HOME_SEO = {
  title: "Easywurld | Web Design & SEO for Lagos Small Businesses",
  description: DESCRIPTION,
};

export const MARQUEE = [
  "Strategy",
  "Web design",
  "Landing pages",
  "Business systems",
  "Social media",
  "Copywriting",
  "Reports & decks",
  "Lagos, Nigeria",
];

export const HOME_PROBLEMS = {
  eyebrow: "01 / What usually brings people here",
  title: "Four problems, over and over.",
  items: [
    {
      title: "People can't tell what you do",
      body: "Your business grew and changed. The website still says what you said three years ago.",
    },
    {
      title: "Your work is good, your website isn't",
      body: "People who know you say yes. Strangers look you up, find nothing to trust, and leave.",
    },
    {
      title: "Messages come in, then go cold",
      body: "That is not a lead problem. It is a follow-up problem, and nobody owns it.",
    },
    {
      title: "Everything gets done twice",
      body: "The same questions, the same quotes, the same posts. All typed out again by hand.",
    },
  ],
};

export const HOME_SERVICES = {
  eyebrow: "02 / What we do",
  title: "Seven services that fit together.",
  items: [
    {
      n: "01",
      title: "Digital marketing strategy",
      body: "Who you are talking to, what you say, and where you say it. The thinking before the making.",
    },
    {
      n: "02",
      title: "Web design",
      body: "Sites for businesses and services. A visitor should know what you do in ten seconds.",
    },
    {
      n: "03",
      title: "Landing pages",
      body: "One offer, one action. We answer the doubts in between.",
    },
    {
      n: "04",
      title: "Business systems",
      body: "Enquiry desks, lead checks and follow-up flows. Simple, and clear about what they can't do.",
    },
    {
      n: "05",
      title: "Social media management",
      body: "A content plan that still works in a busy month.",
    },
    {
      n: "06",
      title: "Copywriting & business content",
      body: "Plain words for your website, offers, emails and service pages.",
    },
    {
      n: "07",
      title: "Reports & presentations",
      body: "Reports and decks people read to the end.",
    },
  ],
};

export const HOME_WORK = {
  eyebrow: "03 / Selected work",
  title: "Real designs, with the thinking behind them.",
  note:
    "Easywurld is a young studio. Every project below is a concept or sample build, and each " +
    "card says so. We don't list client names, testimonials or numbers we can't prove.",
};

export const HOME_PROCESS = {
  eyebrow: "04 / How we work",
  title: "Understand. Simplify. Build. Optimize.",
  intro:
    "Four steps, in order. You get something you can hold at the end of each one. We don't " +
    "start until we agree on the real problem. Most briefs only describe the symptom.",
  items: [
    {
      title: "Understand",
      body: "We learn about your business, your customers and the real problem. It is often not the one you first described.",
    },
    {
      title: "Simplify",
      body: "We find the message that matters and cut everything getting in its way.",
    },
    {
      title: "Build",
      body: "We make the thing. Clear, working, and easy to keep running.",
    },
    {
      title: "Optimize",
      body: "We check what works, fix what doesn't, and hand you something you can run.",
    },
  ],
  figure: {
    src: "/demo/img/consultant-desk.jpg",
    alt: "A desk with an open notebook, a laptop and a printed report, ready for a planning session.",
    caption: "Every stage ends with something written down.",
  },
};

export const HOME_WHY = {
  eyebrow: "05 / Why work with Easywurld",
  title: "Small enough to care about the little things.",
  figure: {
    src: "/demo/img/firm-office.jpg",
    alt: "A meeting table with a written plan set out for review.",
    caption: "One team, from the first call to handover.",
  },
  paragraphs: [
    "You talk to the person doing the work. Nobody passes messages along, and no one new takes over after the first meeting.",
    "We do the plan, the design, the words and the systems. So the parts fit together, instead of being split between three people who never talk.",
    "And we tell you when something is not worth paying for. A cheaper answer that fixes the problem beats a bigger bill.",
  ],
  link: "More about how we work",
};

export const HOME_CTA = {
  title: "Tell us what you're trying to solve.",
  lead: "A question, half an idea, or a project ready to start. WhatsApp is the fastest way to reach us.",
  whatsapp: "Message us on WhatsApp",
  review: "Get a free 3-point review",
  contact: "Use the form instead",
};

/* --------------------------------------------------------------- services */

export const SERVICES_PAGE = {
  seo: {
    title: "Services — Websites, Copy, Social & Systems in Lagos | Easywurld",
    description:
      "Marketing plans, web design, landing pages, simple systems, social media, copywriting " +
      "and business reports for small businesses in Lagos.",
  },
  eyebrow: "Services",
  title: "Seven services that work as one.",
  lead:
    "Most small businesses don't need seven suppliers. They need a plan, a design, words and " +
    "systems that agree with each other. That is why we keep them together.",
  detail: {
    "Digital Marketing": {
      blurb:
        "The thinking that comes before any design: who you are for, what you say, where you say it, and what happens next.",
      items: [
        "Marketing strategy",
        "Audience research",
        "Positioning",
        "Content strategy",
        "Campaign planning",
        "Customer journey mapping",
        "Brand messaging",
        "Marketing systems",
      ],
      deliver:
        "A written plan you can use without us. Not a slide deck we present and take away.",
    },
    "Web Design": {
      blurb:
        "Websites for businesses, services and local shops. We build around the three questions your visitors arrive with.",
      items: [
        "Business websites",
        "Corporate sites",
        "Service websites",
        "Local business sites",
        "E-commerce-style sites",
        "Portfolio websites",
        "Responsive build",
        "Content editing setup",
      ],
      deliver:
        "A working site you own, on phones and computers, with the content set up so you can change it.",
    },
    "Landing Pages": {
      blurb:
        "One offer, one action. Pages for launches, campaigns and enquiries. Every section has to earn its place.",
      items: [
        "Lead-generation pages",
        "Product launches",
        "Service pages",
        "Campaign pages",
        "Event registration",
        "Sales pages",
        "Consultation booking",
        "Offer pages",
      ],
      deliver:
        "One page, built to get a reply, with the doubts answered before we ask for anything.",
    },
    "Business Systems": {
      blurb:
        "Simple assistants and workflows with clear limits. We decide what they should say no to before we decide what they do.",
      items: [
        "Out-of-hours enquiry desks",
        "Customer support assistants",
        "Sales assistants",
        "Lead qualification",
        "Appointment workflows",
        "Order capture",
        "Internal knowledge desks",
        "Follow-up sequences",
      ],
      deliver:
        "A written workflow, the conversation design, and the rules that keep it honest.",
    },
    "Social Media": {
      blurb:
        "A content plan that fits the time you really have, not the time a plan assumes you have.",
      items: [
        "Social strategy",
        "Content pillars",
        "Content calendars",
        "Campaign concepts",
        "Caption frameworks",
        "Grid direction",
        "Templates for non-designers",
        "Handover training",
      ],
      deliver:
        "A calendar, templates and rules your team can run after we leave.",
    },
    Copywriting: {
      blurb:
        "Plain, exact words for websites, offers, emails and products. Written to be read, not to sound clever.",
      items: [
        "Website copy",
        "Landing-page copy",
        "Sales copy",
        "Product descriptions",
        "Service descriptions",
        "Email sequences",
        "Brand messaging",
        "FAQ and objection copy",
      ],
      deliver:
        "Final words in a document you can paste, plus a short guide so you can write more later.",
    },
    "Reports & Presentations": {
      blurb:
        "Business documents people read to the end, designed for where they will really be read.",
      items: [
        "Business reports",
        "Seminar and project reports",
        "Proposals",
        "Pitch decks",
        "Training presentations",
        "Executive summaries",
        "Briefing documents",
        "Document templates",
      ],
      deliver:
        "A designed document and a reusable template, so the next one takes an hour.",
    },
  } as Record<Category, { blurb: string; items: string[]; deliver: string }>,
  pricing: {
    eyebrow: "Pricing",
    title: "What it costs",
    paragraphs: [
      "We don't put fixed prices here, because a one-page site and a seven-page site are not the same job. What we do is give you a number before any work starts. In writing. With what is included, and what is not.",
      "Send us a short description of the problem on WhatsApp. You will get a price range the same day, or an honest answer that this is not a job we should take.",
    ],
    cta: "Ask for a range",
  },
};

/* ------------------------------------------------------------------ about */

export const ABOUT_PAGE = {
  seo: {
    title: "About Easywurld — A small digital studio in Lagos",
    description:
      "One team for the website, the words, the social media and the follow-up.",
  },
  eyebrow: "About",
  title: "A small studio that cares about the details.",
  intro: [
    "Easywurld is a small digital studio in Lagos. We work with small businesses that want careful work, without the drama that usually comes with it.",
    "We started the studio because we kept seeing the same thing. A business hires a designer, a writer, someone for social media, and a developer. Each one does good work. But they don't talk to each other. So the business ends up saying four different things in four different voices.",
    "So we keep the plan, the design, the words and the systems in one place. Not because we are better at all four than a specialist would be. But because the gaps between them are where small businesses lose the most money.",
  ],
  honest: {
    title: "What we are honest about",
    paragraphs: [
      "We are a young studio. All the work on this site is concept or sample work, and every project says so on its card. We have no client logos to show you. We have not made up testimonials, and we don't quote sales numbers we can't prove.",
    ],
    projectsLink: "projects",
    after:
      "Each one has a case study that explains the problem, the choice we made, and what we would change. That tells you more than a wall of logos.",
  },
  turnDown: {
    title: "What we turn down",
    body:
      "Work that needs a claim we can't back up. Systems that pretend to be a person where that " +
      "matters — health, money, anything with a legal result. And if the honest answer is that " +
      "you don't need us yet, we will say so.",
  },
  how: {
    eyebrow: "How we work",
    title: "Four steps, in order. Each one ends with something real.",
    columns: [
      [
        {
          title: "You talk to the person doing the work",
          body: "Nobody passes messages along for us, and no one new takes over after the first meeting. The person you talk to first is the person who does the work.",
        },
        {
          title: "Everything is handed to you",
          body: "Templates, content plans, guides. If you can't run it after we leave, we have given you a problem, not a solution.",
        },
      ],
      [
        {
          title: "We write things down",
          body: "We put the decisions, the scope, the price and what is not included in writing, before any work starts. Most arguments in this business are really missing paperwork.",
        },
        {
          title: "We will tell you to spend less",
          body: "If a smaller job fixes the problem, that is what we will suggest. It is a smaller bill for us and a better result for you. The second one matters more.",
        },
      ],
    ],
  },
  cta: {
    title: "Tell us what you're trying to solve.",
    whatsapp: "Message us on WhatsApp",
    contact: "Send a brief",
  },
};

/* ---------------------------------------------------------------- contact */

export const CONTACT_PAGE = {
  seo: {
    title: "Contact Easywurld — Start a project",
    description:
      "Tell Easywurld what you are trying to solve. WhatsApp 0905 069 0837, or send a short " +
      "brief through the form.",
  },
  eyebrow: "Contact",
  title: "Tell us what you're trying to solve.",
  lead:
    "A question, half an idea, or a project ready to start. WhatsApp is the fastest way to " +
    "reach us. We usually reply the same day.",
  whatsappTitle: "Straight to WhatsApp",
  whatsappBody:
    "If you would rather just talk, skip the form. Tell us the problem in one sentence and we " +
    "will take it from there.",
  nextTitle: "What happens next",
  next: [
    "We reply with questions, or tell you it is not a good fit.",
    "A short call. Fifteen minutes, no slide deck.",
    "A written plan and a price, before anything starts.",
  ],
  /* Reworded from "most of our clients are one WhatsApp message and one time
     zone away", which implied a client base that does not exist yet. */
  location:
    "We are based in Lagos, Nigeria. We work with businesses anywhere, but most " +
    "conversations start with one WhatsApp message.",
  form: {
    kicker: "Send a short brief",
    fields: {
      name: { label: "Name", placeholder: "Your name" },
      business: { label: "Business", placeholder: "Business name" },
      service: { label: "What do you need help with?" },
      problem: {
        label: "What are you trying to solve?",
        placeholder: "One or two sentences is plenty.",
      },
      link: {
        label: "Website or social link",
        placeholder: "@yourbusiness or https://…",
        hint: "Optional, but it saves us asking later.",
      },
      contact: {
        label: "How should we reach you?",
        placeholder: "Phone, email or WhatsApp number",
      },
      company: { label: "Company", placeholder: "Optional" },
    },
    submit: "Continue on WhatsApp",
    footnote:
      "This form opens WhatsApp with your answers filled in. Nothing is saved on this website, " +
      "and nothing is sent anywhere else.",
    sent:
      "WhatsApp should have opened in a new tab. If it did not, use the button above, or " +
      "message 0905 069 0837.",
  },
  fallbackService: "Not sure yet",
  messageIntro: "Hello Easywurld, I'd like to discuss a project.",
};

/* ------------------------------------------------------------- free review */

export const FREE_REVIEW_PAGE = {
  seo: {
    title: "Free website review for Lagos businesses | Easywurld",
    description:
      "Send us your link. Within 24 hours you get a voice note and three points: what is " +
      "costing you enquiries, what to fix first, and what to leave alone. No charge, no sales call.",
  },
  eyebrow: "Free website review",
  title: "Send us your link. We'll tell you what's costing you enquiries.",
  lead:
    "Within 24 hours you get a voice note and three points: what is costing you enquiries, " +
    "what to fix first, and what to leave alone for now.",
  cta: "Send my link on WhatsApp",
  meta: "Free · 24 hours · No sales call",
  whatsappTemplate:
    "Hello Easywurld, I'd like the free 3-point website review.\n\nMy site: \nMy business: \nWhat we sell: ",
  get: {
    eyebrow: "What you get",
    title: "Three things, and nothing you have to sign up for.",
    items: [
      {
        n: "01",
        title: "A voice note",
        body: "Sixty to ninety seconds, recorded while we look at your site on a real phone. Not a document nobody opens.",
      },
      {
        n: "02",
        title: "Three points, written down",
        body: "The one costing you enquiries. The easy one you can fix this week. And the one to leave alone for now.",
      },
      {
        n: "03",
        title: "An honest answer",
        body: "If your site is fine, or the person who built it is doing a good job, we say so. That is a useful result too.",
      },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "Three steps. You only do the first one.",
    steps: [
      {
        title: "Send your link",
        body: "WhatsApp is fastest. Your web address, your business name, and one line about what you sell.",
      },
      {
        title: "We check it properly",
        body: "We open it on a phone on mobile data, time how long it takes, and run it through Google's speed test.",
      },
      {
        title: "You get it within a day",
        body: "The voice note and the three points land in the same WhatsApp thread. No form, no account, no call.",
      },
    ],
    noteLabel: "What you need to send:",
    note:
      "your link, your business name, and one line about what you sell. That is all. If you " +
      "have a website you are unhappy with, or no website yet and a social page instead, " +
      "both are fine.",
  },
  not: {
    eyebrow: "What this is not",
    title: "So you know what you're getting into.",
    items: [
      "Not a sales call. We won't phone you or ask you to book a meeting.",
      "No obligation. Most people read the review and fix the easy things themselves. That is a fine outcome.",
      "We don't fix it for free. The review tells you what to do. Building it is the paid work.",
      "No list, no spam. We don't ask for your email and we won't add you to anything.",
      "If your current person is doing a good job, we say so. We would rather keep our word than win a project.",
    ],
  },
  cta2: {
    title: "Ready when you are.",
    lead:
      "Send your link and we'll get started. One review per business, and it stays free while " +
      "we're building our own record.",
    whatsapp: "Send my link on WhatsApp",
    contact: "I already know what I need",
  },
};

/* ------------------------------------------------------ crawler pre-render */

/**
 * Static HTML injected into index.html#prerender for crawlers, and removed the
 * moment the app mounts. Generated from the same copy the pages render, so the
 * three homepage copies that used to drift apart can no longer disagree.
 */
export function renderPrerender() {
  const serviceLines = HOME_SERVICES.items
    .map(s => `        <h2>${s.title}</h2>\n        <p>${s.body}</p>`)
    .join("\n");

  return `
      <header>
        <p>${BRAND.name} — ${BRAND.slogan}</p>
        <nav aria-label="Primary"><a href="/projects">Projects</a> <a href="/services">Services</a> <a href="/about">About</a> <a href="/contact">Contact</a></nav>
      </header>
      <main>
        <h1>${HOME_HERO.title}</h1>
        <p>${HOME_HERO.lead}</p>
        <p><a href="/projects">Explore our work</a> · <a href="${BRAND.whatsapp}">Start a project on WhatsApp</a></p>

${serviceLines}

        <h2>Contact ${BRAND.name}</h2>
        <address>
          ${BRAND.city}, ${BRAND.country}.
          WhatsApp and phone: <a href="${BRAND.whatsapp}">${BRAND.phoneDisplay}</a>.
        </address>
        <p>Tell us what you are trying to solve. Your name, your business, what you need help with, and a link to your website or social page.</p>
      </main>`;
}
