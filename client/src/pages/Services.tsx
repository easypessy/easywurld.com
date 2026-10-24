import { Link } from "wouter";
import { CATEGORIES, countFor } from "@/data";
import { Seo, Reveal } from "@/components/site/Layout";
import { waOpen } from "@/lib/wa";

const DETAIL: Record<string, { blurb: string; items: string[]; deliver: string }> = {
  "Digital Marketing": {
    blurb:
      "The thinking that comes before any design: who you are for, what you say, where you say it, and what happens next.",
    items: ["Marketing strategy", "Audience research", "Positioning", "Content strategy",
      "Campaign planning", "Customer journey mapping", "Brand messaging", "Marketing systems"],
    deliver: "A written plan you can use without us. Not a slide deck we present and take away.",
  },
  "Web Design": {
    blurb:
      "Websites for businesses, services and local shops. We build around the three questions your visitors arrive with.",
    items: ["Business websites", "Corporate sites", "Service websites", "Local business sites",
      "E-commerce-style sites", "Portfolio websites", "Responsive build", "Content editing setup"],
    deliver: "A working site you own, on phones and computers, with the content set up so you can change it.",
  },
  "Landing Pages": {
    blurb:
      "One offer, one action. Pages for launches, campaigns and enquiries. Every section has to earn its place.",
    items: ["Lead-generation pages", "Product launches", "Service pages", "Campaign pages",
      "Event registration", "Sales pages", "Consultation booking", "Offer pages"],
    deliver: "One page, built to get a reply, with the doubts answered before we ask for anything.",
  },
  "Business Systems": {
    blurb:
      "Simple assistants and workflows with clear limits. We decide what they should say no to before we decide what they do.",
    items: ["Out-of-hours enquiry desks", "Customer support assistants", "Sales assistants",
      "Lead qualification", "Appointment workflows", "Order capture", "Internal knowledge desks",
      "Follow-up sequences"],
    deliver: "A written workflow, the conversation design, and the rules that keep it honest.",
  },
  "Social Media": {
    blurb:
      "A content plan that fits the time you really have, not the time a plan assumes you have.",
    items: ["Social strategy", "Content pillars", "Content calendars", "Campaign concepts",
      "Caption frameworks", "Grid direction", "Templates for non-designers", "Handover training"],
    deliver: "A calendar, templates and rules your team can run after we leave.",
  },
  "Copywriting": {
    blurb:
      "Plain, exact words for websites, offers, emails and products. Written to be read, not to sound clever.",
    items: ["Website copy", "Landing-page copy", "Sales copy", "Product descriptions",
      "Service descriptions", "Email sequences", "Brand messaging", "FAQ and objection copy"],
    deliver: "Final words in a document you can paste, plus a short guide so you can write more later.",
  },
  "Reports & Presentations": {
    blurb:
      "Business documents people read to the end, designed for where they will really be read.",
    items: ["Business reports", "Seminar and project reports", "Proposals", "Pitch decks",
      "Training presentations", "Executive summaries", "Briefing documents", "Document templates"],
    deliver: "A designed document and a reusable template, so the next one takes an hour.",
  },
};

export default function Services() {
  return (
    <>
      <Seo
        title="Services — Websites, Copy, Social & Systems in Lagos | Easywurld"
        description="Marketing plans, web design, landing pages, simple systems, social media, copywriting and business reports for small businesses in Lagos."
        path="/services"
      />
      <section style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Services</p>
            <h1 style={{ maxWidth: "16ch" }}>Seven services that work as one.</h1>
            <p className="lead" style={{ maxWidth: "54ch", marginTop: 18 }}>
              Most small businesses don't need seven suppliers. They need a plan, a design,
              words and systems that agree with each other. That is why we keep them together.
            </p>
          </Reveal>
        </div>
      </section>

      {CATEGORIES.map((c, i) => {
        const d = DETAIL[c];
        const alt = i % 2 === 1;
        return (
          <section key={c} style={{ background: alt ? "var(--beige)" : "transparent", paddingBlock: "clamp(48px,6vw,84px)" }}>
            <div className="wrap">
              <Reveal>
                <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.4fr", gap: 56 }} className="svc-detail">
                  <div>
                    <p className="eyebrow">0{i + 1}</p>
                    <h2 style={{ fontSize: "var(--t-xl)", maxWidth: "14ch" }}>{c}</h2>
                    <Link href={`/projects?c=${encodeURIComponent(c)}`} className="textlink">
                      {countFor(c)} projects →
                    </Link>
                  </div>
                  <div>
                    <p style={{ fontSize: "var(--t-md)", color: "var(--ink)" }}>{d.blurb}</p>
                    <ul style={{
                      listStyle: "none", padding: 0, margin: "22px 0",
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px",
                    }}>
                      {d.items.map((it) => (
                        <li key={it} style={{
                          fontSize: "var(--t-sm)", color: "var(--ink-2)",
                          paddingLeft: 16, position: "relative",
                        }}>
                          <span style={{
                            position: "absolute", left: 0, top: "0.72em", width: 8, height: 1,
                            background: "var(--accent)",
                          }} />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <div className="note"><p><strong>You get:</strong> {d.deliver}</p></div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap grid-2">
          <div>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>Pricing</p>
            <h2 style={{ color: "var(--paper)", maxWidth: "14ch" }}>What it costs</h2>
          </div>
          <div>
            <p style={{ color: "#C3D2C8" }}>
              We don't put fixed prices here, because a one-page site and a seven-page site
              are not the same job. What we do is give you a number before any work starts.
              In writing. With what is included, and what is not.
            </p>
            <p style={{ color: "#C3D2C8" }}>
              Send us a short description of the problem on WhatsApp. You will get a price
              range the same day, or an honest answer that this is not a job we should take.
            </p>
            <a href={waOpen()} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{ marginTop: 10 }}>
              Ask for a range
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
