import { Link } from "wouter";
import { CATEGORIES, countFor } from "@/data";
import { BRAND, SERVICES_PAGE } from "@/data/content";
import { Seo, Reveal } from "@/components/site/Layout";

const { seo, eyebrow, title, lead, detail, pricing } = SERVICES_PAGE;

export default function Services() {
  return (
    <>
      <Seo title={seo.title} description={seo.description} path="/services" />
      <section style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 style={{ maxWidth: "16ch" }}>{title}</h1>
            <p className="lead" style={{ maxWidth: "54ch", marginTop: 18 }}>
              {lead}
            </p>
          </Reveal>
        </div>
      </section>

      {CATEGORIES.map((c, i) => {
        const d = detail[c];
        const alt = i % 2 === 1;
        return (
          <section
            key={c}
            style={{
              background: alt ? "var(--beige)" : "transparent",
              paddingBlock: "clamp(48px,6vw,84px)",
            }}
          >
            <div className="wrap">
              <Reveal>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.9fr 1.4fr",
                    gap: 56,
                  }}
                  className="svc-detail"
                >
                  <div>
                    <p className="eyebrow">0{i + 1}</p>
                    <h2 style={{ fontSize: "var(--t-xl)", maxWidth: "14ch" }}>
                      {c}
                    </h2>
                    <Link
                      href={`/projects?c=${encodeURIComponent(c)}`}
                      className="textlink"
                    >
                      {countFor(c)} projects →
                    </Link>
                  </div>
                  <div>
                    <p style={{ fontSize: "var(--t-md)", color: "var(--ink)" }}>
                      {d.blurb}
                    </p>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "22px 0",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px 24px",
                      }}
                    >
                      {d.items.map(it => (
                        <li
                          key={it}
                          style={{
                            fontSize: "var(--t-sm)",
                            color: "var(--ink-2)",
                            paddingLeft: 16,
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "0.72em",
                              width: 8,
                              height: 1,
                              background: "var(--accent)",
                            }}
                          />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <div className="note">
                      <p>
                        <strong>You get:</strong> {d.deliver}
                      </p>
                    </div>
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
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>
              {pricing.eyebrow}
            </p>
            <h2 style={{ color: "var(--paper)", maxWidth: "14ch" }}>
              {pricing.title}
            </h2>
          </div>
          <div>
            {pricing.paragraphs.map(t => (
              <p key={t.slice(0, 24)} style={{ color: "#C3D2C8" }}>
                {t}
              </p>
            ))}
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
              style={{ marginTop: 10 }}
            >
              {pricing.cta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
