import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { Seo, Reveal, WA } from "@/components/site/Layout";

/* The offer we lead every pitch with. It has to stay true: we run this check
   ourselves, within a day, and we tell people when they don't need us. */
const WHAT_YOU_GET = [
  [
    "01",
    "A voice note",
    "Sixty to ninety seconds, recorded while we look at your site on a real phone. Not a document nobody opens.",
  ],
  [
    "02",
    "Three points, written down",
    "The one costing you enquiries. The easy one you can fix this week. And the one to leave alone for now.",
  ],
  [
    "03",
    "An honest answer",
    "If your site is fine, or the person who built it is doing a good job, we say so. That is a useful result too.",
  ],
];

const STEPS = [
  ["Send your link", "WhatsApp is fastest. Your web address, your business name, and one line about what you sell."],
  ["We check it properly", "We open it on a phone on mobile data, time how long it takes, and run it through Google's speed test."],
  ["You get it within a day", "The voice note and the three points land in the same WhatsApp thread. No form, no account, no call."],
];

const SEND_TEXT = encodeURIComponent(
  "Hello Easywurld, I'd like the free 3-point website review.\n\nMy site: \nMy business: \nWhat we sell: ",
);
const REVIEW_LINK = `${WA}?text=${SEND_TEXT}`;

export default function FreeReview() {
  return (
    <>
      <Seo
        title="Free website review for Lagos businesses | Easywurld"
        description="Send us your link. Within 24 hours you get a voice note and three points: what is costing you enquiries, what to fix first, and what to leave alone. No charge, no sales call."
        path="/free-review"
      />

      <section style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Free website review</p>
            <h1 style={{ maxWidth: "18ch" }}>
              Send us your link. We'll tell you what's costing you enquiries.
            </h1>
            <p className="lead" style={{ maxWidth: "54ch", marginTop: 18 }}>
              Within 24 hours you get a voice note and three points: what is costing you
              enquiries, what to fix first, and what to leave alone for now.
            </p>
            <p style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <a
                href={REVIEW_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <MessageCircle size={18} /> Send my link on WhatsApp
              </a>
              <span className="kicker">Free · 24 hours · No sales call</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">What you get</p>
            <h2 style={{ maxWidth: "20ch" }}>Three things, and nothing you have to sign up for.</h2>
          </Reveal>
          <div style={{ marginTop: 34 }}>
            {WHAT_YOU_GET.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 60}>
                <div style={{
                  display: "grid", gridTemplateColumns: "56px 1fr 1.4fr", gap: 24,
                  padding: "20px 0", borderTop: "1px solid var(--line)", alignItems: "start",
                }} className="prob-row">
                  <span className="kicker">{n}</span>
                  <h3 style={{ margin: 0, fontSize: "var(--t-md)" }}>{t}</h3>
                  <p style={{ margin: 0, fontSize: "var(--t-sm)", color: "var(--ink-2)" }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 style={{ maxWidth: "18ch" }}>Three steps. You only do the first one.</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 34 }}>
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 70}>
                <div>
                  <span className="kicker">0{i + 1}</span>
                  <h3 style={{ marginTop: 10, fontSize: "var(--t-md)" }}>{t}</h3>
                  <p style={{ fontSize: "var(--t-sm)", color: "var(--ink-2)" }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="note" style={{ marginTop: 12, maxWidth: "68ch" }}>
            <p>
              <strong>What you need to send:</strong> your link, your business name, and one
              line about what you sell. That is all. If you have a website you are unhappy
              with, or no website yet and a social page instead, both are fine.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>What this is not</p>
            <h2 style={{ maxWidth: "16ch", color: "var(--paper)" }}>So you know what you're getting into.</h2>
            <ul style={{
              listStyle: "none", padding: 0, margin: "30px 0 0", maxWidth: "62ch",
              borderTop: "1px solid rgba(255,255,255,.16)",
            }}>
              {[
                "Not a sales call. We won't phone you or ask you to book a meeting.",
                "No obligation. Most people read the review and fix the easy things themselves. That is a fine outcome.",
                "We don't fix it for free. The review tells you what to do. Building it is the paid work.",
                "No list, no spam. We don't ask for your email and we won't add you to anything.",
                "If your current person is doing a good job, we say so. We would rather keep our word than win a project.",
              ].map((t) => (
                <li key={t} style={{
                  padding: "15px 0 15px 26px", position: "relative",
                  borderBottom: "1px solid rgba(255,255,255,.16)",
                  color: "#C3D2C8", fontSize: "var(--t-sm)",
                }}>
                  <span style={{
                    position: "absolute", left: 4, top: "1.6em",
                    width: 9, height: 1, background: "#A9C4A0",
                  }} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige-2)" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <Reveal>
            <h2 style={{ maxWidth: "18ch", marginInline: "auto" }}>
              Ready when you are.
            </h2>
            <p className="lead" style={{ maxWidth: "46ch", marginInline: "auto" }}>
              Send your link and we'll get started. One review per business, and it stays free
              while we're building our own record.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
              <a href={REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <MessageCircle size={18} /> Send my link on WhatsApp
              </a>
              <Link href="/contact" className="btn btn-ghost">
                I already know what I need <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
