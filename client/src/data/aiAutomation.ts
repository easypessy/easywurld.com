import type { Project } from "./types";

export const aiAutomation: Project[] = [
  {
    slug: "after-hours-reception",
    shot: "/shots/after-hours-reception.jpg",
    liveUrl: "/demo/after-hours-reception/index.html",
    title: "After-hours Reception",
    category: "Business Systems",
    industry: "Dental practice",
    service: "Business Systems & Workflows",
    projectType: "Out-of-hours enquiry desk",
    status: "Concept Project",
    year: "2026",
    weight: 3,
    summary: "Catching the enquiries that come in after the practice closes.",
    challenge:
      "Many enquiries arrive between 6pm and midnight, when nobody is at the desk. By morning, the caller has booked with a practice that answered. Voicemail does not fix this. Most people do not leave a message.",
    approach:
      "A helper with three jobs only. It answers simple questions from the practice's own notes. It records why the person called. It books a call-back time. It is never allowed to give medical advice, and it says so in plain words when asked.",
    built: [
      "Conversation rules with a hard stop on medical advice",
      "Answers limited to hours, location, fees, insurers and parking",
      "Call-back times that match real front-desk gaps",
      "A morning summary of every overnight conversation",
    ],
    direction:
      "Plain text on white, with a clear 'not a clinician' note. No avatar. No jokes. No fake typing dots. In health care, a helper that pretends to be a person is a risk.",
    result:
      "Concept workflow. It has never run live, so there is no data. The aim is simple: an evening enquiry becomes a booked call-back instead of a missed call.",
    takeaway: "The win is catching the enquiry, not answering every question.",
    tags: ["Healthcare", "Boundaries", "Out-of-hours"],
    visual: {
      archetype: "chat", bg: "#F7F9FA", ink: "#152026", accent: "#1F7A8C", muted: "#6D7E86",
      head: "'Inter Tight', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 0,
      words: ["Are you open Saturday?", "We open 9–2 on Saturdays.", "Book a call-back", "Not a clinician"],
    },
  },
  {
    slug: "market-lane-assistant",
    shot: "/shots/market-lane-assistant.jpg",
    liveUrl: "/demo/market-lane-assistant/index.html",
    title: "Market Lane Assistant",
    category: "Business Systems",
    industry: "Retail",
    service: "Business Systems & Workflows",
    projectType: "Product finder assistant",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary: "A stock finder that cannot make up products.",
    challenge:
      "Staff spent much of the day walking to the stockroom to check sizes. Common chatbots made it worse. They answered with confidence about products the shop had never sold.",
    approach:
      "Answers can only come from the shop's own stock list, refreshed every night. If an item is not on the list, the helper says it is not in stock and offers the closest match. It has no other way to answer.",
    built: [
      "Answers tied to the stock list, with no room to invent",
      "Out-of-stock replies that offer another item, not an apology",
      "Size and fit answers taken from real product details",
      "Handover to a staff member with the conversation attached",
    ],
    direction:
      "Useful beats friendly. A tight layout, product cards inside the chat, real photos and live prices. Short answers. A shop assistant who talks too much is a bad shop assistant.",
    result:
      "Concept workflow. It shows a helper built around its limits, not one with limits added later.",
    takeaway: "A helper is only as honest as the data it is not allowed to leave.",
    tags: ["Retail", "Grounding", "Catalogue"],
    visual: {
      archetype: "chat", bg: "#FFFFFF", ink: "#1B1A18", accent: "#B5533C", muted: "#78736C",
      head: "'Outfit', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 1,
      words: ["Do you have this in 42?", "Yes — 2 left in store.", "Reserve it", "From live catalogue"],
    },
  },
  {
    slug: "estateflow-lead-qualification",
    shot: "/shots/estateflow-lead-qualification.jpg",
    liveUrl: "/demo/estateflow-lead-qualification/index.html",
    title: "EstateFlow Lead Desk",
    category: "Business Systems",
    industry: "Real estate",
    service: "Business Systems & Workflows",
    projectType: "Lead qualification workflow",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary: "Sorting property enquiries by fit before an agent calls.",
    challenge:
      "Agents spent the first ten minutes of every call on budget, area, timing and finance. That is the exact information that decides whether the call was worth making.",
    approach:
      "A WhatsApp flow asks the four questions in a normal way and accepts vague answers. Then it sorts them. Ready buyers go to an agent with a short summary. The rest go to a follow-up list. It never quotes prices or gives valuations.",
    built: [
      "Four questions that accept partial answers",
      "Budget bands that allow ranges and 'not sure'",
      "Clear routes: to an agent, to follow-up, or a polite no",
      "A short summary card sent to the agent before the call",
    ],
    direction:
      "Built for WhatsApp. The diagram is the main thing here: a simple flow from left to right, with decision points and clear dead ends. Plain enough for an owner who is not technical to check.",
    result:
      "Concept workflow. No real enquiry data. The point is that agents start a call already knowing the first four answers.",
    takeaway: "Sorting enquiries is a traffic problem, not a sales problem.",
    tags: ["Property", "WhatsApp", "Routing"],
    visual: {
      archetype: "workflow", bg: "#F5F7F4", ink: "#18281F", accent: "#2E7D52", muted: "#6E7D72",
      head: "'Source Serif 4', Georgia, serif", body: "'Inter', system-ui, sans-serif", variant: 0,
      words: ["Enquiry", "Qualify", "Route", "Agent"],
    },
  },
  {
    slug: "bookflow-appointments",
    shot: "/shots/bookflow-appointments.jpg",
    liveUrl: "/demo/bookflow-appointments/index.html",
    title: "BookFlow Appointments",
    category: "Business Systems",
    industry: "Salon & clinic",
    service: "Business Systems & Workflows",
    projectType: "Booking and reminder workflow",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary: "Booking, moving and reminding, with no receptionist in the middle.",
    challenge:
      "Cancellations and late changes were handled by phone tag. Each one cost staff time twice: once to rebook, and once to fill the empty slot.",
    approach:
      "The helper runs the whole appointment: book it, confirm it, remind 24 hours before, and offer a cancelled slot to a waiting list. That last part is what saves money, and it happens without anyone lifting a finger.",
    built: [
      "Bookings that follow the real calendar",
      "Reminders at 24 hours and again at 2 hours",
      "An automatic offer to the waiting list when someone cancels",
      "A rebooking flow that never double-books",
    ],
    direction:
      "Shown as a simple map, not a chat log: booked, confirmed, cancelled, refilled. The interesting part is how one state moves to the next, not the wording.",
    result:
      "Concept workflow. It has not run live, so there is no measured drop in no-shows. It shows how empty slots get filled.",
    takeaway: "In a booking system, the money is in refilling cancellations, not in taking bookings.",
    tags: ["Scheduling", "Waitlist", "Lifecycle"],
    visual: {
      archetype: "workflow", bg: "#FAF7FB", ink: "#2A1F33", accent: "#7A4FBF", muted: "#7A7080",
      head: "'Lora', Georgia, serif", body: "'Inter', system-ui, sans-serif", variant: 1,
      words: ["Booked", "Confirmed", "Cancelled", "Refilled"],
    },
  },
  {
    slug: "vendorreply-order-capture",
    shot: "/shots/vendorreply-order-capture.jpg",
    liveUrl: "/demo/vendorreply-order-capture/index.html",
    title: "VendorReply",
    category: "Business Systems",
    industry: "E-commerce",
    service: "Business Systems & Workflows",
    projectType: "Order capture from social DMs",
    status: "Concept Project",
    year: "2026",
    weight: 2,
    summary: "Turning Instagram and WhatsApp chats into tidy orders.",
    challenge:
      "The seller built orders by scrolling back through old chats. Item, size, colour, address, proof of payment, all buried in one long thread. Mistakes happened often, and they cost money.",
    approach:
      "The helper reads the chat and fills in an order card, asking only for what is missing. Proof of payment is always checked by a person. It is never confirmed by the system, because that is where fraud gets in.",
    built: [
      "Chats read into a tidy order record",
      "Follow-up questions only for what is missing",
      "A payment flag that a person has to confirm",
      "A daily order export a bookkeeper can use",
    ],
    direction:
      "Two panels side by side: the messy chat on one side, the clean order card on the other. That picture explains the whole idea without a word.",
    result:
      "Concept workflow. It shows messy chat turned into clean records, with a person still checking the payment.",
    takeaway: "Let the system type it up. Keep the trust call with a person.",
    tags: ["Social commerce", "Extraction", "Human-in-the-loop"],
    visual: {
      archetype: "workflow", bg: "#FFF9F2", ink: "#2B1D12", accent: "#D97706", muted: "#83725F",
      head: "'Lora', Georgia, serif", body: "'Inter', system-ui, sans-serif", variant: 2,
      words: ["DM thread", "Extract", "Order card", "Verify payment"],
    },
  },
  {
    slug: "carepath-internal-assistant",
    shot: "/shots/carepath-internal-assistant.jpg",
    liveUrl: "/demo/carepath-internal-assistant/index.html",
    title: "Carepath Internal Desk",
    category: "Business Systems",
    industry: "Healthcare admin",
    service: "Business Systems & Workflows",
    projectType: "Internal knowledge assistant",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary: "Helping staff find the current policy, not last year's.",
    challenge:
      "Policies, rotas and referral rules were spread over a shared drive, three email threads and one person's memory. New staff asked around. People guessed. Sometimes the guess was out of date.",
    approach:
      "A staff-only helper that can only read approved documents. Every answer names the document and its date. If two versions disagree, it shows both instead of picking one. Sorting out a conflict is a human job.",
    built: [
      "Answers only from approved documents, always with the source named",
      "The document date shown on every answer",
      "A warning when two versions disagree",
      "The same access rules staff already have",
    ],
    direction:
      "Plain on purpose: a search box, an answer, and the source line. Institutional grey, one blue link. Anything fancier would weaken the point, which is proof.",
    result:
      "Concept workflow. It was never deployed. The aim is that every answer can be checked against a named document.",
    takeaway: "For rules and policies, the source matters more than the answer.",
    tags: ["Internal", "Knowledge", "Governance"],
    visual: {
      archetype: "chat", bg: "#F4F5F7", ink: "#1C2026", accent: "#2557A7", muted: "#6E747E",
      head: "'Inter Tight', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 2,
      words: ["Which referral form?", "Form R-12 (rev. Mar 2026)", "Source: Policy 4.2", "Two versions found"],
    },
  },
  {
    slug: "follow-up-loop",
    shot: "/shots/follow-up-loop.jpg",
    liveUrl: "/demo/follow-up-loop/index.html",
    title: "Follow-up Loop",
    category: "Business Systems",
    industry: "Professional services",
    service: "Business Systems & Workflows",
    projectType: "Customer follow-up workflow",
    status: "Concept Project",
    year: "2026",
    weight: 1,
    summary: "The three follow-up messages nobody ever sends.",
    challenge:
      "Good enquiries went cold for one reason: no follow-up. The owner meant to, then did not. After two weeks it felt awkward to try.",
    approach:
      "Three light messages, each with something new: a useful example, a real answer to their question, then one plain ask. If the person replies, the messages stop at once and a human takes over.",
    built: [
      "Messages on day 2, day 6 and day 14",
      "Each message adds something new, never just a nudge",
      "Anything they send stops the sequence at once",
      "An opt-out that is always respected",
    ],
    direction:
      "Shown as a timeline with the real message text at each step, so you can judge the tone yourself.",
    result:
      "Concept workflow. No reply data. It shows a follow-up pattern that does not depend on the owner remembering.",
    takeaway: "Follow-up fails because there is no system, not because people do not care.",
    tags: ["Sales", "Sequences", "Tone"],
    visual: {
      archetype: "workflow", bg: "#F6F5F2", ink: "#20211E", accent: "#5B7553", muted: "#75766F",
      head: "'Outfit', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", variant: 3,
      words: ["Day 2", "Day 6", "Day 14", "Reply → stop"],
    },
  },
];
