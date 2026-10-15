import type { Project } from "./types";

export const landingPages: Project[] = [
  {
    slug: "sunday-table-preorder",
    shot: "/shots/sunday-table-preorder.jpg",
    liveUrl: "/demo/sunday-table-preorder/index.html",
    title: "The Sunday Table",
    category: "Landing Pages",
    industry: "Food & beverage",
    service: "Landing Page Design",
    projectType: "Pre-order launch page",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary: "One seasonal box, ten days to launch, one page to sell it.",
    challenge:
      "A small kitchen wanted to test a seasonal produce box before buying stock. They had no page, no email list and no time. Anything that did not help a pre-order was a distraction they could not afford.",
    approach:
      "One offer, one action, nothing else. The page opens with the box and the price. It answers the three worries that stop food orders: can you deliver to me, what is inside, and what if I am not home. Then it asks once. There is no menu, because a menu on a launch page is just a way out.",
    built: [
      "The box, the price and the order cut-off date on the first screen",
      "What is inside, and what happens if something runs out",
      "Three worries answered, then one box for an email or phone number",
      "A countdown to a real dispatch date, not a fake timer",
    ],
    direction:
      "Built to make you hungry. Cream paper, brown ink, tomato red accent. One wide photo, a narrow column of text, and one button used twice. Plain type, on purpose, so the food does the work.",
    result:
      "Concept build. No real sales. It shows a launch page that takes a day to make, and tests demand without buying stock first.",
    takeaway: "A landing page with two goals has none.",
    tags: ["Launch", "Single offer", "Food"],
    visual: {
      archetype: "landing", bg: "#FCF6EA", ink: "#3A2A18", accent: "#C0392B", muted: "#8A7A63",
      head: "'Fraunces', Georgia, serif", body: "'Inter', system-ui, sans-serif", variant: 0,
      words: ["The Sunday Table", "Seasonal box", "₦18,500", "Pre-order"],
    },
  },
  {
    slug: "quiet-hours-consult",
    shot: "/shots/quiet-hours-consult.jpg",
    liveUrl: "/demo/quiet-hours-consult/index.html",
    title: "Quiet Hours",
    category: "Landing Pages",
    industry: "Wellness",
    service: "Landing Page Design",
    projectType: "Consultation booking page",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary: "A therapy page that answers the worries first, then asks for a booking.",
    challenge:
      "People reached the booking form still worried. What happens in the first session? Is it private? What if I cannot keep paying? They left at the last step.",
    approach:
      "We listed the worries in the order they show up, then answered each one before the form appears. The ask is small on purpose: a fifteen-minute call, not a course of treatment.",
    built: [
      "Worries listed in the order they really appear",
      "A step-by-step note on what happens in session one",
      "Fees out in the open, including the lower-priced option",
      "A small first step instead of a full booking",
    ],
    direction:
      "Slow and calm. Pale sage, slate ink, and no colour that shouts. Wide line spacing, short paragraphs, lots of room at the top. Nothing that adds pressure. A countdown timer on a therapy page does real harm.",
    result:
      "Concept build. The point is that the first step costs the visitor almost nothing.",
    takeaway: "In wellness, comfort works better than pressure.",
    tags: ["Wellness", "Objection handling", "Low friction"],
    visual: {
      archetype: "landing", bg: "#F1F4EF", ink: "#2E3A34", accent: "#7E9C88", muted: "#7C8A82",
      head: "'Outfit', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 1,
      words: ["Quiet Hours", "Before you book", "15-minute call", "No obligation"],
    },
  },
  {
    slug: "atlas-crm-saas",
    shot: "/shots/atlas-crm-saas.jpg",
    liveUrl: "/demo/atlas-crm-saas/index.html",
    title: "Atlas CRM",
    category: "Landing Pages",
    industry: "SaaS",
    service: "Landing Page Design",
    projectType: "Product page",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary: "A product page for a small team that dislikes heavy software.",
    challenge:
      "Big systems list two hundred features. Listing your forty is an argument you lose. The real strength of this product was simple: a new salesperson could use it within an hour. No page had ever said that.",
    approach:
      "We made the limit the main selling point: it does less, on purpose. The page shows the real screen early, not a drawing of it. Then a setup timeline. Then prices, with no 'call us for a quote' tier.",
    built: [
      "A hero that shows a real screen from the product",
      "A comparison based on setup time, not feature counts",
      "Clear prices in three steps, with no hidden top tier",
      "A clear path for switching from the two most common rivals",
    ],
    direction:
      "Cool and screen-led. Near-white, graphite ink, indigo accent used only on things you can click. Tight type, thin borders, mono for data labels. The product screenshots are the pictures.",
    result:
      "Concept build. It shows how to sell a smaller product without pretending it is big.",
    takeaway: "If you cannot win on how many features you have, change the question.",
    tags: ["SaaS", "Pricing", "Product UI"],
    visual: {
      archetype: "landing", bg: "#FAFAFB", ink: "#16181D", accent: "#4636E0", muted: "#6F7480",
      head: "'Inter Tight', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 2,
      words: ["Atlas CRM", "Set up in an hour", "See the screen", "From ₦12k/mo"],
    },
  },
  {
    slug: "brightline-course",
    shot: "/shots/brightline-course.jpg",
    liveUrl: "/demo/brightline-course/index.html",
    title: "Brightline Course Launch",
    category: "Landing Pages",
    industry: "Education",
    service: "Landing Page Design",
    projectType: "Course enrolment page",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary: "Turning a course list into a real decision.",
    challenge:
      "The old page was a list of modules. A module list tells you what you will sit through. It does not tell you what you will be able to do at the end, or whether the fee is worth it.",
    approach:
      "We rewrote each module as a skill: you will be able to do this. The result comes before the syllabus. The time needed is stated in hours per week, honestly, including the heavier weeks.",
    built: [
      "Every module rewritten as a skill you gain",
      "An honest table of hours per week",
      "Who teaches it, with real teaching history",
      "Refund and deferral terms on the page, not hidden in a PDF",
    ],
    direction:
      "Academic but not stiff. Warm ivory, deep ink, one oxblood accent. A serif for headings and a clean sans for tables. The mix feels like a school, not an advert.",
    result:
      "Concept build. No enrolment numbers. The aim is to let the wrong student leave early, which protects completion rates.",
    takeaway: "Sell what people can do, not what they will study.",
    tags: ["Education", "Copy structure", "Enrolment"],
    visual: {
      archetype: "landing", bg: "#FBF8F2", ink: "#1E1B17", accent: "#7B2D26", muted: "#7A736A",
      head: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif", variant: 3,
      words: ["Brightline", "You will be able to…", "6 hrs / week", "Enrol"],
    },
  },
  {
    slug: "homebase-workshop-event",
    shot: "/shots/homebase-workshop-event.jpg",
    liveUrl: "/demo/homebase-workshop-event/index.html",
    title: "Homebase Workshop",
    category: "Landing Pages",
    industry: "Local business",
    service: "Landing Page Design",
    projectType: "Event registration page",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary: "An event page for a parent signing up one-handed at 11pm.",
    challenge:
      "Sign-up took six fields, on a page that hid the date, the address and whether children could come. The audience was busy parents on phones. There is no harder way to read a page.",
    approach:
      "Everything a parent needs is on the first screen: date, time, place, cost, childcare, parking. Sign-up takes three fields. The map is a picture with a directions link, not a heavy widget.",
    built: [
      "A facts block: date, place, cost, childcare, parking",
      "Three-field sign-up, with no account needed",
      "A map picture that opens directions on your phone",
      "A calendar file you can download after signing up",
    ],
    direction:
      "Plain and bright. Chalk background, charcoal ink, one clear blue for buttons. Big tap targets, 18px text at the smallest, strong labels. Nothing decorative. This page is a tool.",
    result:
      "Concept build. On a phone, the whole sign-up can be done in under thirty seconds.",
    takeaway: "Design for the worst moment your reader will have, not the best.",
    tags: ["Events", "Mobile-first", "Local"],
    visual: {
      archetype: "landing", bg: "#FFFFFF", ink: "#1A1D21", accent: "#1E64C8", muted: "#6B7178",
      head: "'Inter Tight', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 0,
      words: ["Homebase Workshop", "Sat 14 Mar · 10am", "Children welcome", "Register"],
    },
  },
  {
    slug: "aster-property-single",
    shot: "/shots/aster-property-single.jpg",
    liveUrl: "/demo/aster-property-single/index.html",
    title: "Aster Property",
    category: "Landing Pages",
    industry: "Real estate",
    service: "Landing Page Design",
    projectType: "Single-property page",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary: "One building, one story, one viewing request.",
    challenge:
      "A well-designed building was listed on a property site next to ordinary houses. There, good design just looked expensive. It needed its own page, one that could explain the higher price.",
    approach:
      "We treated it like a short magazine piece, not a listing. The architect's reasons. The materials. The light at different times of day. The street. The facts come last, because by then the reader is only checking details.",
    built: [
      "A story-led scroll, with photos chosen for each section",
      "Materials and finishes, with the suppliers named",
      "Floor plans with notes at human scale",
      "One viewing request form, with no gate on the brochure",
    ],
    direction:
      "Restrained, like the building. Warm concrete, near-black ink, one thin bronze line as the only decoration. Very large type used with very few words. A lopsided layout with empty columns, on purpose.",
    result:
      "Concept build. It shows what to do when a list of similar places makes your property look ordinary.",
    takeaway: "Good work needs its own space. A list of houses is a price comparison.",
    tags: ["Property", "Narrative", "Premium"],
    visual: {
      archetype: "landing", bg: "#E9E7E2", ink: "#17181A", accent: "#8C6A3F", muted: "#77787B",
      head: "'Archivo', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 1,
      words: ["Aster", "Ikoyi", "Light at 4pm", "Request a viewing"],
    },
  },
  {
    slug: "first-step-finance-lead",
    shot: "/shots/first-step-finance-lead.jpg",
    liveUrl: "/demo/first-step-finance-lead/index.html",
    title: "First Step Finance",
    category: "Landing Pages",
    industry: "Financial services",
    service: "Landing Page Design",
    projectType: "Lead-generation page",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary: "A calm page for people who find money talk hard.",
    challenge:
      "Money pages usually use jargon or fake cheer. Both make people think something is being hidden. These readers were first-time borrowers. They needed to understand the process before typing anything personal.",
    approach:
      "We wrote the page in short, simple words, without talking down to anyone. The four steps are shown with real timings. And we say exactly what a credit check does and does not do to your score.",
    built: [
      "Four steps, with honest timings",
      "Hard words explained right there in the text",
      "A quick check of what you qualify for, before any personal details",
      "A plain statement of what happens to the details you send",
    ],
    direction:
      "Calm and steady. Soft grey-blue, deep navy ink, and a muted green only for confirmations. One column, so nothing competes. The form never shows more than three fields at once.",
    result:
      "Concept build. No application data. The idea is that people know what they are agreeing to before they hand over any details.",
    takeaway: "In money and health, clear words help people say yes, and keep you out of trouble.",
    tags: ["Finance", "Plain language", "Trust"],
    visual: {
      archetype: "landing", bg: "#F4F6F8", ink: "#152238", accent: "#2F7A5B", muted: "#6C7A8C",
      head: "'Inter Tight', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 2,
      words: ["First Step", "Check eligibility", "No credit impact", "4 steps"],
    },
  },
];
