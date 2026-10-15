import type { Project } from "./types";

export const webDesign: Project[] = [
  {
    slug: "northline-atelier",
    shot: "/shots/northline-atelier.jpg",
    liveUrl: "/demo/northline-atelier/index.html",
    title: "Northline Atelier",
    category: "Web Design",
    industry: "Fashion",
    service: "Web Design",
    projectType: "Editorial storefront",
    status: "Concept Project",
    year: "2026",
    weight: 3,
    summary:
      "A quiet shop site for a small clothing label that sells three collections a year. The photos lead.",
    challenge:
      "Most small labels start from a template built for big shops. Dense grids. Badges. Countdown timers. Northline's clothes are slow, costly and well photographed. The template made them look cheap and fast. The job was to build a shop that can hold one huge photo without making excuses for it.",
    approach:
      "We planned the photo flow before we drew any page. A collection page moves between full-width photos and narrow columns of text, so the eye rests between garments. The menu is one line of text and never fights for attention. The price shows once, in the same size as body text. Making a price shout is how an expensive shop starts to look cheap.",
    built: [
      "Collection and lookbook pages on a 12-column grid",
      "Product page with a fixed size and fit panel, and no add-on offers",
      "A text-only menu with a slow fade panel",
      "Photo plan: AVIF files, three screen sizes, a crop made for each spot",
    ],
    direction:
      "Off-white paper, black ink, and one soft clay colour used only on hover. Big headings in a high-contrast serif. Body text in a plain sans at 17px. Almost no lines. Space does the separating, and space is the cheapest way to look costly.",
    result:
      "No results data. This is a concept build, not a live shop. It shows a pattern that works for photo-heavy shops: the product page has one action, and no photo is ever cropped to fit a box.",
    takeaway:
      "When the photos are the product, the design should step out of the way.",
    tags: ["Editorial", "E-commerce", "Photography"],
    visual: {
      archetype: "website",
      bg: "#F6F4EF",
      ink: "#14110E",
      accent: "#B4693F",
      muted: "#8A8175",
      head: "'Playfair Display', Georgia, serif",
      body: "'Inter', system-ui, sans-serif",
      variant: 0,
      words: ["NORTHLINE", "Collection 04", "Shop", "Lookbook"],
    },
  },
  {
    slug: "morrow-house",
    shot: "/shots/morrow-house.jpg",
    liveUrl: "/demo/morrow-house/index.html",
    title: "Morrow House",
    category: "Web Design",
    industry: "Restaurant",
    service: "Web Design",
    projectType: "Neighbourhood restaurant site",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary:
      "A menu-first site for a small restaurant with thirty seats that changes its dishes every week.",
    challenge:
      "The kitchen answered the same three questions on the phone all night. Are you open? What is on today? Can we book? The old site hid all three under a video and a long story about the owners. Worse, the menu was a PDF, so the chef had to email a developer to change a dish.",
    approach:
      "We put the useful things first. Opening hours, today's menu and the booking link sit at the top of a phone screen, before any photos. The menu is now content the chef edits directly. A 'changed today' mark shows regulars what is new, without making them read the whole list.",
    built: [
      "Menu system with dish availability and a weekly change log",
      "An hours block at the top that shows if they are open now",
      "Booking handed to the service they already use",
      "A space for holiday closures and private events",
    ],
    direction:
      "Warm paper, deep olive ink, terracotta accent. Dish names use a friendly serif, big enough to read across a table, with roomy spacing. It reads closer to a printed menu than a website. Only four photos, because a menu that needs a photo of every dish is a menu that is not written well.",
    result:
      "Concept build. The aim is fewer phone calls about hours and menus. In practice, the three most common questions can be answered in under five seconds on a phone.",
    takeaway:
      "A restaurant site works when the phone stops ringing about small things.",
    tags: ["Hospitality", "Content editing", "Local"],
    visual: {
      archetype: "website",
      bg: "#FBF6EC",
      ink: "#22301F",
      accent: "#C2542B",
      muted: "#7E8672",
      head: "'Fraunces', Georgia, serif",
      body: "'Inter', system-ui, sans-serif",
      variant: 1,
      words: ["MORROW HOUSE", "Tonight", "Book a table", "Open until 23:00"],
    },
  },
  {
    slug: "cedar-advisory",
    shot: "/shots/cedar-advisory.jpg",
    liveUrl: "/demo/cedar-advisory/index.html",
    title: "Cedar & Co. Advisory",
    category: "Web Design",
    industry: "Professional services",
    service: "Web Design",
    projectType: "Advisory practice site",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary:
      "A four-person advisory firm that kept losing bids to firms ten times its size.",
    challenge:
      "Their old site copied the words big consultancies use. 'Global reach'. Stock photos of glass towers. That invited the exact comparison they always lose. Visitors could not tell what the firm did, who would do the work, or what it would cost.",
    approach:
      "We stopped trying to look big and started being exact. Named people with real backgrounds. Types of work with price bands. Clear timelines. A page that says out loud what they will not take on. Small firms win when the buyer can picture the first meeting.",
    built: [
      "Services split by type of work, not by industry",
      "Team pages with names and direct contact details",
      "A page on how an engagement runs, with price bands and timelines",
      "A 'work we do not take' section",
    ],
    direction:
      "Orderly and text-led. Near-black on warm white, one slate blue accent, thin lines to organise the page. No photos of people in meetings. The grid is strict on purpose. For an advisory firm, visible order is the argument.",
    result:
      "Concept build. In practice, a buyer can work out fit, rough cost and who to contact before sending an email.",
    takeaway:
      "A small firm wins on being exact. Every page should use that, not hide it.",
    tags: ["B2B", "Typography", "Trust"],
    visual: {
      archetype: "website",
      bg: "#FFFFFF",
      ink: "#101418",
      accent: "#2C4A6E",
      muted: "#6B7480",
      head: "'Inter Tight', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      variant: 2,
      words: ["CEDAR & CO.", "Advisory", "Fees", "Who we are"],
    },
  },
  {
    slug: "fieldstone-build",
    shot: "/shots/fieldstone-build.jpg",
    liveUrl: "/demo/fieldstone-build/index.html",
    title: "Fieldstone Build",
    category: "Web Design",
    industry: "Construction",
    service: "Web Design",
    projectType: "Contractor portfolio",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary:
      "A builder with 600 site photos on a phone, and almost none of them on the website.",
    challenge:
      "Building work is judged on proof. This builder had plenty: frames, pours, finishes, snagging. The website showed four finished houses and a contact form. Clients could not judge the quality. So the firm kept being asked to match prices from builders who cut corners.",
    approach:
      "We built the site around the order of the work, not a photo gallery. Each job is a sequence: survey, groundwork, structure, finish. Every stage has photos and a short note. This makes skill visible. It also makes a very low quote look odd by comparison.",
    built: [
      "A project timeline page with photos at each stage",
      "A trade and certificate block with registration numbers you can check",
      "A service area map with a realistic travel range",
      "An enquiry form that asks for the job stage and the site address",
    ],
    direction:
      "Strong and plain. Concrete grey, black, and a safety yellow used only for directions. Tight headings, wide letter spacing on labels, sharp corners everywhere. Nothing soft. The look comes from site signs, not brochures.",
    result:
      "Concept build. The aim is better questions. Enquiries arrive with the stage and the location already stated, so the builder can price or say no faster.",
    takeaway:
      "In building work, showing the middle of the job proves more than showing the end.",
    tags: ["Trades", "Proof", "Local"],
    visual: {
      archetype: "website",
      bg: "#EDEDEA",
      ink: "#131313",
      accent: "#E0A800",
      muted: "#6E6E68",
      head: "'Archivo', Impact, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      variant: 3,
      words: ["FIELDSTONE", "Projects", "Stage 03", "Get a price"],
    },
  },
  {
    slug: "luma-skin-studio",
    shot: "/shots/luma-skin-studio.jpg",
    liveUrl: "/demo/luma-skin-studio/index.html",
    title: "Luma Skin Studio",
    category: "Web Design",
    industry: "Beauty",
    service: "Web Design",
    projectType: "Treatment booking site",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary:
      "A skin clinic that asked people to book before it told them anything.",
    challenge:
      "Skin treatment is a careful, slightly worrying purchase. The old site opened with a booking box. That meant new visitors had to pick a treatment they did not understand before they could read about it. Regulars were fine. New clients left.",
    approach:
      "We split the two groups. Regulars get a booking link at the top: one tap, done. New clients pick what is bothering them, read what the treatment really involves, see the honest range of results, then book. Two paths, one site.",
    built: [
      "A concern-to-treatment guide in plain language",
      "Staff qualifications, and who should not have each treatment",
      "Two booking paths: new and returning clients",
      "Aftercare pages you can read without an account",
    ],
    direction:
      "Calm and clean, not cold. Soft sand background, deep plum ink, muted rose accent. One geometric sans throughout. No fancy serifs, because the trust here is medical, not editorial. Lots of space and short lines, so a worried reader keeps moving.",
    result:
      "Concept build. There is no booking data. The aim is to remove the need to understand the treatment list before you understand your own problem.",
    takeaway:
      "When a purchase feels risky, comfort has to come before the button.",
    tags: ["Health", "Booking", "UX writing"],
    visual: {
      archetype: "website",
      bg: "#F7F1EC",
      ink: "#3A2437",
      accent: "#C98B8B",
      muted: "#8D7A85",
      head: "'Outfit', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      variant: 0,
      words: ["LUMA", "Concerns", "Treatments", "Book"],
    },
  },
  {
    slug: "open-door-learning",
    shot: "/shots/open-door-learning.jpg",
    liveUrl: "/demo/open-door-learning/index.html",
    title: "Open Door Learning",
    category: "Web Design",
    industry: "Education",
    service: "Web Design",
    projectType: "Enrolment site",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary:
      "A learning centre where parents and adult learners needed very different answers from one site.",
    challenge:
      "One menu served two groups with opposite questions. Parents want safety, staff numbers, term dates and pickup times. Adults want cost, evening classes and whether the certificate counts for anything. Putting both together gave half-answers to everyone.",
    approach:
      "We split the site at the first click and kept it split. Each path has its own words, its own proof and its own form. Shared pages, like the safety policy and the staff list, appear in both paths with a different framing.",
    built: [
      "Two paths from the first click, with separate sign-up forms",
      "A term calendar with dates you can download",
      "Course pages that state hours, cost and certificates plainly",
      "A safety and policy section",
    ],
    direction:
      "Friendly but tidy. Chalk white, navy ink, bright ochre for directions. Rounded headings that feel easy, not childish. Strong numbering and clear section lines, so a parent reading on a phone at 10pm can find the date they need.",
    result:
      "Concept build. Neither group has to read the other group's content before reaching a form.",
    takeaway:
      "Two audiences with different questions need two paths, not one middle road.",
    tags: ["Education", "IA", "Dual audience"],
    visual: {
      archetype: "website",
      bg: "#FCFBF7",
      ink: "#1B2A44",
      accent: "#D98E14",
      muted: "#71798A",
      head: "'Outfit', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      variant: 1,
      words: ["OPEN DOOR", "For parents", "For adults", "Term dates"],
    },
  },
  {
    slug: "harbour-and-home",
    shot: "/shots/harbour-and-home.jpg",
    liveUrl: "/demo/harbour-and-home/index.html",
    title: "Harbour & Home",
    category: "Web Design",
    industry: "Real estate",
    service: "Web Design",
    projectType: "Property discovery site",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary:
      "Property search that starts with how you want to live, not how many bedrooms you need.",
    challenge:
      "Every property site filters on the same four fields, so every agency looks the same and competes only on what it has to sell. Buyers describe what they want in other words: near a good school, a quiet street, room for a workshop, a short walk to the market.",
    approach:
      "We kept the normal filters, because you need them, but we put lifestyle choices first and matched them behind the scenes. 'Walkable' becomes a set of areas. 'Room to work' becomes floor space plus a spare building. The buyer uses their own words, and the system uses its own.",
    built: [
      "Lifestyle choices mapped to real filters",
      "Listing pages with area information and travel times",
      "A saved search and viewing request flow",
      "A photo rule: no wide-angle distortion",
    ],
    direction:
      "More magazine than shop. Cool stone background, deep teal ink, brass accent. Big photos at one fixed shape across every listing, so houses compare fairly. A serif for place names and a plain sans for facts. The split shows what is story and what is data.",
    result:
      "Concept build. No enquiry data. It shows a search pattern that sets an agency apart without needing more stock.",
    takeaway:
      "If everyone filters on the same four fields, change the question.",
    tags: ["Property", "Search UX", "Editorial"],
    visual: {
      archetype: "website",
      bg: "#EFEFEA",
      ink: "#15343A",
      accent: "#A57A2E",
      muted: "#6F8085",
      head: "'Fraunces', Georgia, serif",
      body: "'Inter', system-ui, sans-serif",
      variant: 2,
      words: ["HARBOUR & HOME", "Walkable", "Quiet street", "Room to work"],
    },
  },
];
