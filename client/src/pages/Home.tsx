import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data";
import ProjectCard from "@/components/site/ProjectCard";
import HomeHero from "@/components/site/HomeHero";
import { Seo, Reveal, WA } from "@/components/site/Layout";

/* Homepage shows three pillars only. The full list of seven — strategy,
   web design, landing pages, Business systems, social, copywriting and
   reports — lives on /services. */
const PILLARS = [
  ["01", "Web design & landing pages", "Business and campaign pages built to be understood in ten seconds, and to load quickly on a phone."],
  ["02", "SEO", "Clean structure, honest page titles and local signals, so customers searching in Lagos find you first."],
  ["03", "Content & marketing strategy", "Positioning, words and campaigns planned together, in plain language your customers recognise."],
];

const PROCESS = [
  ["Understand", "We get close to the business, the audience and the real problem — which is often not the one described."],
  ["Simplify", "We find the useful message and remove everything competing with it."],
  ["Build", "We turn the thinking into clear, working, maintainable output."],
  ["Optimize", "We look at what is working, fix what isn't, and hand over something you can run."],
];

export default function Home() {
  const featured = projects.filter((p) => (p.weight ?? 1) >= 2).slice(0, 3);
  return (
    <>
      <Seo
        title="Easywurld | Web Design & SEO for Lagos Small Businesses"
        description="Web design, SEO and content for small businesses in Lagos. Clear sites that rank, load fast and turn visitors into enquiries. Simplify. Optimize. Grow."
        path="/"
      />

      <HomeHero />

      {/* SELECTED WORK — three projects, aligned, one tag each */}
      <section>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">01 · Selected work</p>
            <h2 style={{ maxWidth: "16ch", margin: 0 }}>A body of work with a point of view.</h2>
          </Reveal>
          <p className="work-note">
            Easywurld is a young studio. Every project below is a concept or sample
            build, and each one says so on its card — we don't publish client names
            or results we cannot evidence.
          </p>
          <div className="work-grid work-grid--home">
            {featured.map((p) => <ProjectCard key={p.slug} p={p} />)}
          </div>
          <div style={{ marginTop: 34 }}>
            <Link href="/projects" className="textlink">
              All {projects.length} projects →
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES — three pillars, numbered rows, no cards */}
      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">02 · Services</p>
            <h2 style={{ maxWidth: "20ch" }}>Three pillars, one connected system.</h2>
          </Reveal>
          <div style={{ marginTop: 30, borderTop: "1px solid var(--line)" }}>
            {PILLARS.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 40}>
                <Link href="/services" style={{
                  display: "grid", gridTemplateColumns: "56px 1.1fr 1.5fr 24px", gap: 22,
                  padding: "18px 0", borderBottom: "1px solid var(--line)", alignItems: "center",
                }} className="svc-row">
                  <span className="kicker">{n}</span>
                  <h3 style={{ margin: 0, fontSize: "var(--t-md)" }}>{t}</h3>
                  <p style={{ margin: 0, fontSize: "var(--t-sm)", color: "var(--muted)" }}>{d}</p>
                  <ArrowUpRight size={18} style={{ color: "var(--muted)" }} />
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 26 }}>
            <Link href="/services" className="textlink">All seven services →</Link>
          </div>
        </div>
      </section>

      {/* HOW WE WORK — the dark section, unchanged in spirit */}
      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>03 · How we work</p>
            <h2 style={{ maxWidth: "14ch", color: "var(--paper)" }}>
              Understand. Simplify. Build. Optimize.
            </h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 34, alignItems: "start" }}>
            <p style={{ color: "#C3D2C8", maxWidth: "40ch" }}>
              Four stages, run in order, with a deliverable you can hold at the end of each.
              Nothing starts until we agree what the actual problem is — most briefs describe
              a symptom.
            </p>
            <div>
              {PROCESS.map(([t, d], i) => (
                <Reveal key={t} delay={i * 70}>
                  <div className="proc-row" style={{
                    display: "grid", gridTemplateColumns: "48px 1fr", gap: 22,
                    borderTop: "1px solid rgba(255,255,255,.18)",
                  }}>
                    <span style={{ fontFamily: "var(--fm)", fontSize: ".72rem", color: "#A9C4A0" }}>
                      0{i + 1}
                    </span>
                    <div>
                      <h3 style={{ margin: "0 0 6px", color: "var(--paper)", fontSize: "var(--t-md)" }}>{t}</h3>
                      <p style={{ margin: 0, color: "#C3D2C8", fontSize: "var(--t-sm)" }}>{d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SITE CHECK — the Lighthouse link, moved out of the hero */}
      <section className="site-check">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">04 · Site check</p>
            <h2 style={{ maxWidth: "20ch" }}>See how this site scores, live.</h2>
            <p style={{ maxWidth: "52ch" }}>
              No sample scores and no screenshots of a good day. Run Google's own
              test against this page and read the same numbers we read.
            </p>
            <div className="lh-row" style={{ marginTop: 22 }}>
              <span className="lh-chip"><b>LIVE TEST</b>Lighthouse · Mobile &amp; desktop</span>
              <a
                className="lh-link"
                href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwebsite-builder-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Run a site check <ArrowUpRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--beige-2)" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <Reveal>
            <h2 style={{ maxWidth: "18ch", marginInline: "auto" }}>
              Tell us what you're trying to solve.
            </h2>
            <p className="lead" style={{ maxWidth: "48ch", marginInline: "auto" }}>
              A question, a half-formed idea, or a project ready to start. WhatsApp is the
              fastest way to reach us.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                Message us on WhatsApp
              </a>
              <Link href="/contact" className="btn btn-ghost">Use the form instead</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
