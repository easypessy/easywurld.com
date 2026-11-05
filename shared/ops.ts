/**
 * Shared operations vocabulary: statuses, labels and the service template
 * registry. Imported by the server (to seed templates) and by the portal/admin
 * UI (to render labels). Keeping one source of truth prevents the UI and the
 * database drifting apart.
 */

export type ProjectStatus =
  | "awaiting_onboarding"
  | "awaiting_client_materials"
  | "ready_to_start"
  | "in_progress"
  | "internal_review"
  | "awaiting_client_approval"
  | "revision_requested"
  | "completed"
  | "delivered"
  | "archived";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  awaiting_onboarding: "Awaiting onboarding",
  awaiting_client_materials: "Awaiting client materials",
  ready_to_start: "Ready to begin",
  in_progress: "In progress",
  internal_review: "Internal review",
  awaiting_client_approval: "Awaiting client approval",
  revision_requested: "Revision requested",
  completed: "Completed",
  delivered: "Delivered",
  archived: "Archived",
};

/** Linear pipeline used to compute progress and to show the client timeline. */
export const PROJECT_PIPELINE: ProjectStatus[] = [
  "awaiting_onboarding",
  "awaiting_client_materials",
  "ready_to_start",
  "in_progress",
  "internal_review",
  "awaiting_client_approval",
  "revision_requested",
  "delivered",
  "completed",
  "archived",
];

export function progressFor(status: ProjectStatus): number {
  switch (status) {
    case "awaiting_onboarding":
      return 10;
    case "awaiting_client_materials":
      return 25;
    case "ready_to_start":
      return 35;
    case "in_progress":
      return 55;
    case "internal_review":
      return 70;
    case "awaiting_client_approval":
      return 80;
    case "revision_requested":
      return 65;
    case "delivered":
      return 95;
    case "completed":
      return 100;
    case "archived":
      return 100;
    default:
      return 0;
  }
}

export type ClientStatus = "invited" | "onboarding" | "active" | "paused" | "completed" | "archived";

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  invited: "Invited",
  onboarding: "Onboarding",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type Priority = "low" | "normal" | "high" | "urgent";
export type DeliveryStatus = "draft" | "submitted" | "approved" | "revision_requested" | "superseded";

export const CLIENT_VISIBLE_TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "blocked", "done"];

export type QuestionnaireFieldType = "text" | "longtext" | "select" | "multiselect" | "url" | "date";

export interface QuestionnaireField {
  key: string;
  label: string;
  type: QuestionnaireFieldType;
  required?: boolean;
  help?: string;
  options?: string[];
}

export interface TemplateTask {
  title: string;
  description?: string;
  offsetDays: number;
  priority: Priority;
  visibleToClient?: boolean;
}

export interface TemplateMilestone {
  title: string;
  offsetDays: number;
}

export interface ServiceTemplate {
  key: string;
  name: string;
  category: string;
  description: string;
  defaultDays: number;
  revisionLimit: number;
  questionnaire: QuestionnaireField[];
  milestones: TemplateMilestone[];
  tasks: TemplateTask[];
}

const brandFields: QuestionnaireField[] = [
  { key: "business_name", label: "Business name", type: "text", required: true },
  { key: "business_description", label: "What the business does, in plain words", type: "longtext", required: true },
  { key: "target_audience", label: "Who the customer is", type: "longtext", required: true },
  { key: "phone", label: "WhatsApp or phone number", type: "text", required: true },
];

/**
 * Reusable, editable templates. Copy is written for Easywurld's actual services;
 * nothing here forces a website buyer to answer social-media questions.
 */
export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    key: "website-design",
    name: "Website design & build",
    category: "Web Design",
    description: "Full marketing website: discovery, structure, design, build, launch.",
    defaultDays: 28,
    revisionLimit: 2,
    questionnaire: [
      ...brandFields,
      { key: "pages_needed", label: "Pages you need", type: "longtext", required: true, help: "Home, About, Services, Contact, etc." },
      { key: "website_goal", label: "What should the website do for you?", type: "select", options: ["Get enquiries", "Sell products", "Show credibility", "Explain a complex offer"], required: true },
      { key: "existing_site", label: "Existing website (if any)", type: "url" },
      { key: "references", label: "Websites you like and why", type: "longtext" },
      { key: "brand_assets", label: "Do you have a logo and brand colours?", type: "select", options: ["Yes, ready to send", "Logo only", "Nothing yet — I need direction"] },
      { key: "domain_hosting", label: "Domain and hosting access", type: "select", options: ["I have both", "Domain only", "Neither — advise me"] },
    ],
    milestones: [
      { title: "Discovery and requirements", offsetDays: 2 },
      { title: "Structure and content plan", offsetDays: 7 },
      { title: "Design concepts", offsetDays: 12 },
      { title: "Build and QA", offsetDays: 21 },
      { title: "Launch", offsetDays: 28 },
    ],
    tasks: [
      { title: "Send welcome email and onboarding questionnaire", offsetDays: 0, priority: "high", visibleToClient: true },
      { title: "Collect brand assets and page requirements", offsetDays: 3, priority: "high", visibleToClient: true },
      { title: "Write page structure and content outline", offsetDays: 7, priority: "normal" },
      { title: "Design homepage concept", offsetDays: 10, priority: "normal" },
      { title: "Build pages and responsive checks", offsetDays: 18, priority: "high" },
      { title: "Internal QA pass (links, forms, mobile, speed)", offsetDays: 22, priority: "high" },
      { title: "Client review and approval", offsetDays: 25, priority: "urgent", visibleToClient: true },
      { title: "Launch, handover and archive workspace", offsetDays: 28, priority: "normal", visibleToClient: true },
    ],
  },
  {
    key: "landing-page",
    name: "Landing page",
    category: "Landing Pages",
    description: "Single high-intent page built around one offer and one action.",
    defaultDays: 10,
    revisionLimit: 2,
    questionnaire: [
      ...brandFields,
      { key: "offer", label: "The offer this page sells", type: "longtext", required: true },
      { key: "primary_action", label: "The one action visitors should take", type: "text", required: true },
      { key: "proof", label: "Proof you can show (testimonials, numbers, reviews)", type: "longtext" },
      { key: "deadline", label: "Is there a date this must be live by?", type: "date" },
    ],
    milestones: [
      { title: "Offer and audience brief", offsetDays: 2 },
      { title: "Copy and structure", offsetDays: 5 },
      { title: "Design and build", offsetDays: 8 },
      { title: "Review and publish", offsetDays: 10 },
    ],
    tasks: [
      { title: "Send onboarding brief", offsetDays: 0, priority: "high", visibleToClient: true },
      { title: "Draft page copy", offsetDays: 4, priority: "normal" },
      { title: "Design and build the page", offsetDays: 7, priority: "normal" },
      { title: "Client review and approval", offsetDays: 9, priority: "urgent", visibleToClient: true },
      { title: "Publish and hand over", offsetDays: 10, priority: "normal", visibleToClient: true },
    ],
  },
  {
    key: "social-media",
    name: "Social media management",
    category: "Social Media",
    description: "Monthly content engine: strategy, calendar, drafts, approvals, reporting.",
    defaultDays: 30,
    revisionLimit: 3,
    questionnaire: [
      ...brandFields,
      { key: "platforms", label: "Platforms to manage", type: "multiselect", options: ["Instagram", "Facebook", "TikTok", "LinkedIn", "X"] , required: true },
      { key: "account_handles", label: "Account handles", type: "text", required: true },
      { key: "posting_frequency", label: "Posts per week", type: "select", options: ["3", "5", "7+"], required: true },
      { key: "brand_guidelines", label: "Brand guidelines or tone notes", type: "longtext" },
      { key: "access_method", label: "How will you give account access?", type: "select", options: ["Meta Business Suite invite", "Login shared via secure note", "I will post what you send"], required: true },
      { key: "content_bank", label: "Existing photos, videos or product images", type: "longtext", help: "Upload to folder 02 — Client Materials." },
    ],
    milestones: [
      { title: "Strategy and positioning", offsetDays: 4 },
      { title: "Content calendar approved", offsetDays: 8 },
      { title: "First content batch drafted", offsetDays: 14 },
      { title: "Publishing cycle", offsetDays: 24 },
      { title: "Month-end performance report", offsetDays: 30 },
    ],
    tasks: [
      { title: "Send onboarding questionnaire", offsetDays: 0, priority: "high", visibleToClient: true },
      { title: "Collect account access and brand assets", offsetDays: 3, priority: "urgent", visibleToClient: true },
      { title: "Build content pillars and monthly calendar", offsetDays: 6, priority: "high" },
      { title: "Draft first content batch", offsetDays: 12, priority: "normal" },
      { title: "Client approval of drafts", offsetDays: 14, priority: "urgent", visibleToClient: true },
      { title: "Schedule approved posts", offsetDays: 16, priority: "normal" },
      { title: "Publish and monitor", offsetDays: 24, priority: "normal" },
      { title: "Prepare performance report", offsetDays: 29, priority: "normal", visibleToClient: true },
    ],
  },
  {
    key: "copywriting",
    name: "Copywriting",
    category: "Copywriting",
    description: "Persuasion copy for pages, emails, profiles or campaigns.",
    defaultDays: 7,
    revisionLimit: 2,
    questionnaire: [
      ...brandFields,
      { key: "copy_type", label: "What are we writing?", type: "select", options: ["Website pages", "Landing page", "Email sequence", "Social captions", "Profile/bio"], required: true },
      { key: "product_details", label: "Product or service details, prices and facts", type: "longtext", required: true },
      { key: "tone", label: "Desired tone", type: "select", options: ["Warm and plain", "Bold and direct", "Premium and calm", "Playful"], required: true },
      { key: "objective", label: "What the copy must achieve", type: "longtext", required: true },
      { key: "must_avoid", label: "Claims or phrases to avoid", type: "longtext" },
    ],
    milestones: [
      { title: "Brief confirmed", offsetDays: 1 },
      { title: "First draft", offsetDays: 4 },
      { title: "Client review", offsetDays: 6 },
      { title: "Final document", offsetDays: 7 },
    ],
    tasks: [
      { title: "Confirm brief and objective", offsetDays: 1, priority: "high", visibleToClient: true },
      { title: "Write first draft in Google Doc", offsetDays: 4, priority: "normal" },
      { title: "Client review and approval", offsetDays: 6, priority: "urgent", visibleToClient: true },
      { title: "Deliver final document", offsetDays: 7, priority: "normal", visibleToClient: true },
    ],
  },
  {
    key: "ai-automation",
    name: "AI business automation",
    category: "Business Systems",
    description: "Design, build and document an automation for a real business process.",
    defaultDays: 21,
    revisionLimit: 2,
    questionnaire: [
      ...brandFields,
      { key: "process", label: "The process you want automated", type: "longtext", required: true },
      { key: "current_workflow", label: "How it works today, step by step", type: "longtext", required: true },
      { key: "volume", label: "How often does this happen?", type: "select", options: ["Several times a day", "Daily", "Weekly", "Monthly"], required: true },
      { key: "tools_used", label: "Tools and accounts involved", type: "longtext", required: true },
      { key: "access_needs", label: "Access you can provide", type: "multiselect", options: ["Google Workspace", "WhatsApp Business", "Instagram/Facebook", "CRM or spreadsheet", "Payment platform"] },
      { key: "success_measure", label: "What does success look like?", type: "longtext", required: true },
    ],
    milestones: [
      { title: "Process audit", offsetDays: 3 },
      { title: "System design approved", offsetDays: 7 },
      { title: "Build and integration", offsetDays: 14 },
      { title: "Testing with real data", offsetDays: 18 },
      { title: "Demonstration and handover", offsetDays: 21 },
    ],
    tasks: [
      { title: "Send process questionnaire", offsetDays: 0, priority: "high", visibleToClient: true },
      { title: "Map current workflow and failure points", offsetDays: 4, priority: "high" },
      { title: "Design automation and get approval", offsetDays: 7, priority: "high", visibleToClient: true },
      { title: "Build the automation", offsetDays: 13, priority: "normal" },
      { title: "Test with sample and real data", offsetDays: 17, priority: "high" },
      { title: "Client demonstration and approval", offsetDays: 19, priority: "urgent", visibleToClient: true },
      { title: "Write documentation and hand over", offsetDays: 21, priority: "normal", visibleToClient: true },
    ],
  },
  {
    key: "reports-presentations",
    name: "Reports & presentations",
    category: "Reports & Presentations",
    description: "Structured research, reports, decks and document formatting.",
    defaultDays: 7,
    revisionLimit: 2,
    questionnaire: [
      { key: "contact_name", label: "Who is this for?", type: "text", required: true },
      { key: "topic", label: "Topic or title", type: "text", required: true },
      { key: "purpose", label: "What is it for and who will read it?", type: "longtext", required: true },
      { key: "format", label: "Required format", type: "select", options: ["PDF report", "Word document", "PowerPoint deck", "Google Slides"], required: true },
      { key: "instructions", label: "Instructions or marking criteria", type: "longtext" },
      { key: "references", label: "Reference materials (upload or link)", type: "longtext" },
      { key: "deadline", label: "Deadline", type: "date", required: true },
    ],
    milestones: [
      { title: "Brief and sources confirmed", offsetDays: 1 },
      { title: "Outline approved", offsetDays: 2 },
      { title: "Draft", offsetDays: 5 },
      { title: "Final document", offsetDays: 7 },
    ],
    tasks: [
      { title: "Confirm topic, format and deadline", offsetDays: 1, priority: "high", visibleToClient: true },
      { title: "Collect reference materials", offsetDays: 2, priority: "normal" },
      { title: "Produce outline for approval", offsetDays: 3, priority: "normal", visibleToClient: true },
      { title: "Write and format draft", offsetDays: 5, priority: "normal" },
      { title: "Client review and approval", offsetDays: 6, priority: "urgent", visibleToClient: true },
      { title: "Deliver final file", offsetDays: 7, priority: "normal", visibleToClient: true },
    ],
  },
  {
    key: "digital-marketing",
    name: "Digital marketing strategy",
    category: "Digital Marketing",
    description: "Audit, channel plan, messaging and a 90-day execution roadmap.",
    defaultDays: 14,
    revisionLimit: 2,
    questionnaire: [
      ...brandFields,
      { key: "current_channels", label: "Where you market today", type: "longtext", required: true },
      { key: "budget", label: "Monthly marketing budget range", type: "select", options: ["Under ₦100k", "₦100k–₦500k", "₦500k–₦2m", "Above ₦2m", "Not yet decided"], required: true },
      { key: "main_problem", label: "The single biggest marketing problem", type: "longtext", required: true },
      { key: "competitors", label: "Competitors you watch", type: "longtext" },
      { key: "past_results", label: "What has worked or failed before", type: "longtext" },
    ],
    milestones: [
      { title: "Marketing audit", offsetDays: 4 },
      { title: "Strategy draft", offsetDays: 9 },
      { title: "Review session", offsetDays: 12 },
      { title: "Final strategy document", offsetDays: 14 },
    ],
    tasks: [
      { title: "Send marketing audit questionnaire", offsetDays: 0, priority: "high", visibleToClient: true },
      { title: "Audit channels, funnel and messaging", offsetDays: 5, priority: "high" },
      { title: "Draft strategy and 90-day plan", offsetDays: 9, priority: "normal" },
      { title: "Review session with client", offsetDays: 12, priority: "high", visibleToClient: true },
      { title: "Deliver final strategy document", offsetDays: 14, priority: "normal", visibleToClient: true },
    ],
  },
  {
    key: "standalone-offer",
    name: "Standalone offer / digital product",
    category: "Offers",
    description: "Self-serve ₦5,000 products: delivery files, access link and follow-up.",
    defaultDays: 1,
    revisionLimit: 0,
    questionnaire: [
      { key: "contact_name", label: "Full name", type: "text", required: true },
      { key: "confirmation_email", label: "Best email for the download link", type: "text", required: true },
      { key: "business_type", label: "What type of business do you run?", type: "text", required: true },
      { key: "biggest_question", label: "What do you want help with first?", type: "longtext" },
    ],
    milestones: [
      { title: "Payment verified", offsetDays: 0 },
      { title: "Access delivered", offsetDays: 1 },
    ],
    tasks: [
      { title: "Verify payment and send access", offsetDays: 0, priority: "urgent", visibleToClient: true },
      { title: "Send quick-start guidance", offsetDays: 1, priority: "normal", visibleToClient: true },
    ],
  },
];

export const templateByKey = (key: string) => SERVICE_TEMPLATES.find((t) => t.key === key);

/** Map a purchased offer slug or a free-text service name onto a template. */
export function resolveTemplateKey(input: { serviceKey?: string; offerSlug?: string; serviceName?: string }): string {
  if (input.serviceKey && templateByKey(input.serviceKey)) return input.serviceKey;
  if (input.offerSlug) return "standalone-offer";
  const name = (input.serviceName || "").toLowerCase();
  if (!name) return "website-design";
  if (name.includes("social")) return "social-media";
  if (name.includes("landing")) return "landing-page";
  if (name.includes("copy") || name.includes("writ")) return "copywriting";
  if (name.includes("automation") || name.includes("system")) return "ai-automation";
  if (name.includes("report") || name.includes("presentation") || name.includes("deck")) return "reports-presentations";
  if (name.includes("marketing") || name.includes("strategy")) return "digital-marketing";
  if (name.includes("website") || name.includes("web design")) return "website-design";
  return "website-design";
}
