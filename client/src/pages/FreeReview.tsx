import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { BRAND, FREE_REVIEW_PAGE } from "@/data/content";
import { Seo, Reveal } from "@/components/site/Layout";

const { seo, eyebrow, title, lead, cta, meta, get, how, not, cta2 } =
  FREE_REVIEW_PAGE;

const REVIEW_LINK = `${BRAND.whatsapp}?text=${encodeURIComponent(FREE_REVIEW_PAGE.whatsappTemplate)}`;

export default function FreeReview() {
  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path="/free-review"
      />

      <section style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 style={{ maxWidth: "18ch" }}>{title}</h1>
            <p className="lead" style={{ maxWidth: "54ch", marginTop: 18 }}>
              {lead}
            </p>
            <p
              style={{
                marginTop: 26,
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <a
                href={REVIEW_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <MessageCircle size={18} /> {cta}
              </a>
              <span className="kicker">{meta}</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{get.eyebrow}</p>
            <h2 style={{ maxWidth: "20ch" }}>{get.title}</h2>
          </Reveal>
          <div style={{ marginTop: 34 }}>
            {get.items.map(({ n, title: t, body }, i) => (
              <Reveal key={n} delay={i * 60}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr 1.4fr",
                    gap: 24,
                    padding: "20px 0",
                    borderTop: "1px solid var(--line)",
                    alignItems: "start",
                  }}
                  className="prob-row"
                >
                  <span className="kicker">{n}</span>
                  <h3 style={{ margin: 0, fontSize: "var(--t-md)" }}>{t}</h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--t-sm)",
                      color: "var(--ink-2)",
                    }}
                  >
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{how.eyebrow}</p>
            <h2 style={{ maxWidth: "18ch" }}>{how.title}</h2>
          </Reveal>
          <div className="grid-3" style={{ marginTop: 34 }}>
            {how.steps.map(({ title: t, body }, i) => (
              <Reveal key={t} delay={i * 70}>
                <div>
                  <span className="kicker">0{i + 1}</span>
                  <h3 style={{ marginTop: 10, fontSize: "var(--t-md)" }}>
                    {t}
                  </h3>
                  <p style={{ fontSize: "var(--t-sm)", color: "var(--ink-2)" }}>
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="note" style={{ marginTop: 12, maxWidth: "68ch" }}>
            <p>
              <strong>{how.noteLabel}</strong> {how.note}
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>
              {not.eyebrow}
            </p>
            <h2 style={{ maxWidth: "16ch", color: "var(--paper)" }}>
              {not.title}
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "30px 0 0",
                maxWidth: "62ch",
                borderTop: "1px solid rgba(255,255,255,.16)",
              }}
            >
              {not.items.map(t => (
                <li
                  key={t}
                  style={{
                    padding: "15px 0 15px 26px",
                    position: "relative",
                    borderBottom: "1px solid rgba(255,255,255,.16)",
                    color: "#C3D2C8",
                    fontSize: "var(--t-sm)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 4,
                      top: "1.6em",
                      width: 9,
                      height: 1,
                      background: "#A9C4A0",
                    }}
                  />
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
              {cta2.title}
            </h2>
            <p
              className="lead"
              style={{ maxWidth: "46ch", marginInline: "auto" }}
            >
              {cta2.lead}
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 30,
              }}
            >
              <a
                href={REVIEW_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <MessageCircle size={18} /> {cta2.whatsapp}
              </a>
              <Link href="/contact" className="btn btn-ghost">
                {cta2.contact} <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
