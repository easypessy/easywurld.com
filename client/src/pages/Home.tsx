import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { projects, CATEGORIES, countFor } from "@/data";
import {
  BRAND,
  HOME_CTA,
  HOME_HERO,
  HOME_PROBLEMS,
  HOME_SEO,
  HOME_PROCESS,
  HOME_SERVICES,
  HOME_WHY,
  HOME_WORK,
  MARQUEE,
} from "@/data/content";
import ProjectCard from "@/components/site/ProjectCard";
import HomeHero from "@/components/site/HomeHero";
import { Seo, Reveal } from "@/components/site/Layout";

export default function Home() {
  const feature = projects.filter(p => (p.weight ?? 1) >= 2).slice(0, 6);
  return (
    <>
      <Seo title={HOME_SEO.title} description={HOME_SEO.description} path="/" />

      {/* HOMEPAGE HERO — headline plus the dimensional Easywurld brand scene */}
      <HomeHero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map(dup => (
            <div key={dup} style={{ display: "flex" }}>
              {MARQUEE.map(t => (
                <span className="marquee-item" key={t}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEMS */}
      <section>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{HOME_PROBLEMS.eyebrow}</p>
            <h2 style={{ maxWidth: "18ch" }}>{HOME_PROBLEMS.title}</h2>
          </Reveal>
          <div style={{ marginTop: 32 }}>
            {HOME_PROBLEMS.items.map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 60}>
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
                  <span className="kicker">0{i + 1}</span>
                  <h3 style={{ margin: 0, fontSize: "var(--t-md)" }}>
                    {title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--t-sm)",
                      color: "var(--muted)",
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

      {/* SERVICES */}
      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{HOME_SERVICES.eyebrow}</p>
            <h2 style={{ maxWidth: "20ch" }}>{HOME_SERVICES.title}</h2>
          </Reveal>
          <div style={{ marginTop: 30, borderTop: "1px solid var(--line)" }}>
            {HOME_SERVICES.items.map(({ n, title, body }, i) => (
              <Reveal key={n} delay={i * 40}>
                <Link
                  href="/services"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1.1fr 1.5fr 24px",
                    gap: 22,
                    padding: "18px 0",
                    borderBottom: "1px solid var(--line)",
                    alignItems: "center",
                  }}
                  className="svc-row"
                >
                  <span className="kicker">{n}</span>
                  <h3 style={{ margin: 0, fontSize: "var(--t-md)" }}>
                    {title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--t-sm)",
                      color: "var(--muted)",
                    }}
                  >
                    {body}
                  </p>
                  <ArrowUpRight size={18} style={{ color: "var(--muted)" }} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section>
        <div className="wrap">
          <Reveal>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                gap: 30,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p className="eyebrow">{HOME_WORK.eyebrow}</p>
                <h2 style={{ maxWidth: "16ch", margin: 0 }}>
                  {HOME_WORK.title}
                </h2>
              </div>
              <Link href="/projects" className="textlink">
                All {projects.length} projects →
              </Link>
            </div>
          </Reveal>
          <div
            className="note"
            style={{ margin: "22px 0 30px", maxWidth: "70ch" }}
          >
            <p>{HOME_WORK.note}</p>
          </div>
          <div className="work-grid">
            {feature.map(p => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
          <div
            style={{
              marginTop: 36,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.map(c => (
              <Link
                key={c}
                href={`/projects?c=${encodeURIComponent(c)}`}
                className="filters"
              >
                <button type="button">
                  {c}
                  <span className="n">{countFor(c)}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>
              {HOME_PROCESS.eyebrow}
            </p>
            <h2 style={{ maxWidth: "14ch", color: "var(--paper)" }}>
              {HOME_PROCESS.title}
            </h2>
          </Reveal>
          <div
            className="grid-2"
            style={{ marginTop: 34, alignItems: "start" }}
          >
            {/* Same hairline and 22px padding as the first numbered row, so both
                columns start their text on the same line. The photo and the list
                fill what used to be dead space under the intro. */}
            <div className="process-intro">
              <p>{HOME_PROCESS.intro}</p>
              <figure className="process-figure">
                <img
                  src={HOME_PROCESS.figure.src}
                  alt={HOME_PROCESS.figure.alt}
                  width={1400}
                  height={933}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{HOME_PROCESS.figure.caption}</figcaption>
              </figure>
            </div>
            <div>
              {HOME_PROCESS.items.map(({ title, body }, i) => (
                <Reveal key={title} delay={i * 70}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "48px 1fr",
                      gap: 22,
                      padding: "22px 0",
                      borderTop: "1px solid rgba(255,255,255,.18)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--fm)",
                        fontSize: ".72rem",
                        color: "#A9C4A0",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <h3
                        style={{
                          margin: "0 0 6px",
                          color: "var(--paper)",
                          fontSize: "var(--t-md)",
                        }}
                      >
                        {title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "#C3D2C8",
                          fontSize: "var(--t-sm)",
                        }}
                      >
                        {body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section>
        <div className="wrap grid-2 why-grid">
          <Reveal>
            <div className="why-head">
              <p className="eyebrow">{HOME_WHY.eyebrow}</p>
              <h2 style={{ maxWidth: "15ch" }}>{HOME_WHY.title}</h2>
              {/* The heading is short, which left a tall gap on this side. A photograph
                  gives the left column its own weight so the two columns balance. */}
              <figure className="why-figure">
                <img
                  src={HOME_WHY.figure.src}
                  alt={HOME_WHY.figure.alt}
                  width={1400}
                  height={933}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{HOME_WHY.figure.caption}</figcaption>
              </figure>
            </div>
          </Reveal>
          <Reveal delay={80}>
            {/* Top-aligned on desktop, then dropped to sit level with the heading
                rather than with the eyebrow above it. */}
            <div className="why-copy">
              {HOME_WHY.paragraphs.map(t => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
              <Link href="/about" className="textlink">
                {HOME_WHY.link} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--beige-2)" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <Reveal>
            <h2 style={{ maxWidth: "18ch", marginInline: "auto" }}>
              {HOME_CTA.title}
            </h2>
            <p
              className="lead"
              style={{ maxWidth: "48ch", marginInline: "auto" }}
            >
              {HOME_CTA.lead}
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
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                {HOME_CTA.whatsapp}
              </a>
              <Link href="/free-review" className="btn btn-solid">
                {HOME_CTA.review}
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                {HOME_CTA.contact}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
