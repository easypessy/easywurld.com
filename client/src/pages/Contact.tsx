import { useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { CATEGORIES } from "@/data";
import { Seo, Reveal } from "@/components/site/Layout";
import { waMessage, waOpen } from "@/lib/wa";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const lines = [
      "Hello Easywurld, I'd like to discuss a project.",
      "",
      `Name: ${get("name")}`,
      `Business: ${get("business") || "—"}`,
      `Needs help with: ${get("service")}`,
      `Link: ${get("link") || "—"}`,
      `Contact: ${get("contact") || "—"}`,
      "",
      `What I'm trying to solve: ${get("problem") || "—"}`,
    ];
    window.open(waMessage(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  }

  return (
    <>
      <Seo
        title="Contact Easywurld — Start a project"
        description="Tell Easywurld what you are trying to solve. WhatsApp 0905 069 0837, or send a short brief through the form."
        path="/contact"
      />
      <section style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h1 style={{ maxWidth: "14ch" }}>Tell us what you're trying to solve.</h1>
            <p className="lead" style={{ maxWidth: "50ch", marginTop: 16 }}>
              A question, half an idea, or a project ready to start. WhatsApp is the fastest
              way to reach us. We usually reply the same day.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 10 }}>
        <div className="wrap grid-2" style={{ alignItems: "start" }}>
          <Reveal>
            <div>
              <h3>Straight to WhatsApp</h3>
              <p>
                If you would rather just talk, skip the form. Tell us the problem in one
                sentence and we will take it from there.
              </p>
              <a href={waOpen()} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <MessageCircle size={18} /> 0905 069 0837
              </a>

              <div style={{ marginTop: 40, borderTop: "1px solid var(--line)", paddingTop: 26 }}>
                <h3>What happens next</h3>
                <ol style={{ paddingLeft: 18, color: "var(--ink-2)", fontSize: "var(--t-sm)", lineHeight: 1.9 }}>
                  <li>We reply with questions, or tell you it is not a good fit.</li>
                  <li>A short call. Fifteen minutes, no slide deck.</li>
                  <li>A written plan and a price, before anything starts.</li>
                </ol>
              </div>

              <div className="note" style={{ marginTop: 26 }}>
                <p>
                  We are based in Lagos, Nigeria. We work with businesses anywhere, but most
                  of our clients are one WhatsApp message and one time zone away.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form onSubmit={submit} style={{
              background: "var(--white)", border: "1px solid var(--line)", padding: "30px 28px",
            }}>
              <p className="kicker" style={{ marginBottom: 22 }}>Send a short brief</p>

              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" required autoComplete="name" placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="business">Business</label>
                <input id="business" name="business" autoComplete="organization" placeholder="Business name" />
              </div>
              <div className="field">
                <label htmlFor="service">What do you need help with?</label>
                <select id="service" name="service" defaultValue={CATEGORIES[0]}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  <option>Not sure yet</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="problem">What are you trying to solve?</label>
                <textarea id="problem" name="problem" rows={4}
                  placeholder="One or two sentences is plenty." />
              </div>
              <div className="field">
                <label htmlFor="link">Website or social link</label>
                <input id="link" name="link" placeholder="@yourbusiness or https://…" />
                <span className="hint">Optional, but it saves us asking later.</span>
              </div>
              <div className="field">
                <label htmlFor="contact">How should we reach you?</label>
                <input id="contact" name="contact" placeholder="Phone, email or WhatsApp number" />
              </div>

              <button type="submit" className="btn btn-solid" style={{ width: "100%", justifyContent: "center" }}>
                Continue on WhatsApp <ArrowUpRight size={17} />
              </button>
              <p className="hint" style={{ marginTop: 12, marginBottom: 0 }}>
                This form opens WhatsApp with your answers filled in. Nothing is saved on this
                website, and nothing is sent anywhere else.
              </p>
              {sent && (
                <p role="status" className="note" style={{ marginTop: 16 }}>
                  WhatsApp should have opened in a new tab. If it did not, use the button above,
                  or message 0905 069 0837.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
