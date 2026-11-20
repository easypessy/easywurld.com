import { useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { CATEGORIES } from "@/data";
import { BRAND, CONTACT_PAGE } from "@/data/content";
import { Seo, Reveal } from "@/components/site/Layout";

const {
  seo,
  eyebrow,
  title,
  lead,
  whatsappTitle,
  whatsappBody,
  nextTitle,
  next,
  location,
  form,
} = CONTACT_PAGE;

export default function Contact() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    /* Honeypot: real visitors never see or fill this field. If it has a value
       we assume a bot and quietly do nothing. */
    if (get("company")) {
      setSent(true);
      return;
    }

    const lines = [
      CONTACT_PAGE.messageIntro,
      "",
      `Name: ${get("name")}`,
      `Business: ${get("business") || "—"}`,
      `Needs help with: ${get("service")}`,
      `Link: ${get("link") || "—"}`,
      `Contact: ${get("contact") || "—"}`,
      "",
      `What I'm trying to solve: ${get("problem") || "—"}`,
    ];
    /* Best-effort capture. Opening WhatsApp below is the primary path; this
       just records the brief if the visitor closes the tab before sending.
       Nothing here blocks or delays the WhatsApp open. */
    fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: get("name"),
        business: get("business"),
        service: get("service"),
        problem: get("problem"),
        link: get("link"),
        contact: get("contact"),
        company: get("company"),
        page: "contact",
      }),
      keepalive: true,
    }).catch(() => {});

    window.open(
      `${BRAND.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener"
    );
    setSent(true);
  }

  const field = form.fields;

  return (
    <>
      <Seo title={seo.title} description={seo.description} path="/contact" />
      <section style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 style={{ maxWidth: "14ch" }}>{title}</h1>
            <p className="lead" style={{ maxWidth: "50ch", marginTop: 16 }}>
              {lead}
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 10 }}>
        <div className="wrap grid-2" style={{ alignItems: "start" }}>
          <Reveal>
            <div>
              <h3>{whatsappTitle}</h3>
              <p>{whatsappBody}</p>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <MessageCircle size={18} /> {BRAND.phoneDisplay}
              </a>

              <div
                style={{
                  marginTop: 40,
                  borderTop: "1px solid var(--line)",
                  paddingTop: 26,
                }}
              >
                <h3>{nextTitle}</h3>
                <ol
                  style={{
                    paddingLeft: 18,
                    color: "var(--ink-2)",
                    fontSize: "var(--t-sm)",
                    lineHeight: 1.9,
                  }}
                >
                  {next.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </div>

              <div className="note" style={{ marginTop: 26 }}>
                <p>{location}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <form
              onSubmit={submit}
              style={{
                background: "var(--white)",
                border: "1px solid var(--line)",
                padding: "30px 28px",
              }}
            >
              <p className="kicker" style={{ marginBottom: 22 }}>
                {form.kicker}
              </p>

              {/* Honeypot — visually hidden, not announced to screen readers. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="company">{field.company.label}</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder={field.company.placeholder}
                />
              </div>

              <div className="field">
                <label htmlFor="name">{field.name.label}</label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={field.name.placeholder}
                />
              </div>
              <div className="field">
                <label htmlFor="business">{field.business.label}</label>
                <input
                  id="business"
                  name="business"
                  autoComplete="organization"
                  placeholder={field.business.placeholder}
                />
              </div>
              <div className="field">
                <label htmlFor="service">{field.service.label}</label>
                <select
                  id="service"
                  name="service"
                  defaultValue={CATEGORIES[0]}
                >
                  {CATEGORIES.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                  <option>{CONTACT_PAGE.fallbackService}</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="problem">{field.problem.label}</label>
                <textarea
                  id="problem"
                  name="problem"
                  rows={4}
                  placeholder={field.problem.placeholder}
                />
              </div>
              <div className="field">
                <label htmlFor="link">{field.link.label}</label>
                <input
                  id="link"
                  name="link"
                  placeholder={field.link.placeholder}
                />
                <span className="hint">{field.link.hint}</span>
              </div>
              <div className="field">
                <label htmlFor="contact">{field.contact.label}</label>
                <input
                  id="contact"
                  name="contact"
                  required
                  placeholder={field.contact.placeholder}
                />
              </div>

              <button
                type="submit"
                className="btn btn-solid"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {form.submit} <ArrowUpRight size={17} />
              </button>
              <p className="hint" style={{ marginTop: 12, marginBottom: 0 }}>
                {form.footnote}
              </p>
              {sent && (
                <p role="status" className="note" style={{ marginTop: 16 }}>
                  {form.sent}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
