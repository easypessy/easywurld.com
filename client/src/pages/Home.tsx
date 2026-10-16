import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { projects, CATEGORIES, countFor } from "@/data";
import ProjectCard from "@/components/site/ProjectCard";
import HomeHero from "@/components/site/HomeHero";
import { Seo, Reveal, WA } from "@/components/site/Layout";

const PROBLEMS = [
  ["People can't tell what you do", "Your business grew and changed. The website still says what you said three years ago."],
  ["Your work is good, your website isn't", "People who know you say yes. Strangers look you up, find nothing to trust, and leave."],
  ["Messages come in, then go cold", "That is not a lead problem. It is a follow-up problem, and nobody owns it."],
  ["Everything gets done twice", "The same questions, the same quotes, the same posts. All typed out again by hand."],
];

const SERVICES = [
  ["01", "Digital marketing strategy", "Who you are talking to, what you say, and where you say it. The thinking before the making."],
  ["02", "Web design", "Sites for businesses and services. A visitor should know what you do in ten seconds."],
  ["03", "Landing pages", "One offer, one action. We answer the doubts in between."],
  ["04", "Business systems", "Enquiry desks, lead checks and follow-up flows. Simple, and clear about what they can't do."],
  ["05", "Social media management", "A content plan that still works in a busy month."],
  ["06", "Copywriting & business content", "Plain words for your website, offers, emails and service pages."],
  ["07", "Reports & presentations", "Reports and decks people read to the end."],
];

const PROCESS = [
  ["Understand", "We learn about your business, your customers and the real problem. It is often not the one you first described."],
  ["Simplify", "We find the message that matters and cut everything getting in its way."],
  ["Build", "We make the thing. Clear, working, and easy to keep running."],
  ["Optimize", "We check what works, fix what doesn't, and hand you something you can run."],
];

export default function Home() {
  const feature = projects.filter((p) => (p.weight ?? 1) >= 2).slice(0, 6);
  return (
    <>
      <Seo
        title="Easywurld | Simplify. Optimize. Grow."
        description="Marketing clarity for small businesses in Lagos — strategy, web design, copywriting, social media and simple systems. Simplify. Optimize. Grow."
        path="/"
      />

      {/* HOMEPAGE HERO — headline plus the dimensional Easywurld brand scene */}
      <HomeHero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "flex" }}>
              {["Strategy", "Web design", "Landing pages", "Business systems", "Social media",
                "Copywriting", "Reports & decks", "Lagos, Nigeria"].map((t) => (
                <span className="marquee-item" key={t}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEMS */}
      <section>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">01 / What usually brings people here</p>
            <h2 style={{ maxWidth: "18ch" }}>Four problems, over and over.</h2>
          </Reveal>
          <div style={{ marginTop: 32 }}>
            {PROBLEMS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 60}>
                <div style={{
                  display: "grid", gridTemplateColumns: "56px 1fr 1.4fr", gap: 24,
                  padding: "20px 0", borderTop: "1px solid var(--line)", alignItems: "start",
                }} className="prob-row">
                  <span className="kicker">0{i + 1}</span>
                  <h3 style={{ margin: 0, fontSize: "var(--t-md)" }}>{t}</h3>
                  <p style={{ margin: 0, fontSize: "var(--t-sm)", color: "var(--muted)" }}>{d}</p>
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
            <p className="eyebrow">02 / What we do</p>
            <h2 style={{ maxWidth: "20ch" }}>Seven services that fit together.</h2>
          </Reveal>
          <div style={{ marginTop: 30, borderTop: "1px solid var(--line)" }}>
            {SERVICES.map(([n, t, d], i) => (
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
        </div>
      </section>

      {/* SELECTED WORK */}
      <section>
        <div className="wrap">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 30, flexWrap: "wrap" }}>
              <div>
                <p className="eyebrow">03 / Selected work</p>
                <h2 style={{ maxWidth: "16ch", margin: 0 }}>Real designs, with the thinking behind them.</h2>
              </div>
              <Link href="/projects" className="textlink">
                All {projects.length} projects →
              </Link>
            </div>
          </Reveal>
          <div className="note" style={{ margin: "22px 0 30px", maxWidth: "70ch" }}>
            <p>
              Easywurld is a young studio. Every project below is a <strong>concept</strong> or
              <strong> sample</strong> build, and each card says so. We don't list client names,
              testimonials or numbers we can't prove.
            </p>
          </div>
          <div className="work-grid">
            {feature.map((p) => <ProjectCard key={p.slug} p={p} />)}
          </div>
          <div style={{ marginTop: 36, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/projects?c=${encodeURIComponent(c)}`} className="filters">
                <button type="button">{c}<span className="n">{countFor(c)}</span></button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>04 / How we work</p>
            <h2 style={{ maxWidth: "14ch", color: "var(--paper)" }}>
              Understand. Simplify. Build. Optimize.
            </h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 34, alignItems: "start" }}>
            {/* Same hairline and 22px padding as the first numbered row, so both
                columns start their text on the same line. The photo and the list
                fill what used to be dead space under the intro. */}
            <div className="process-intro">
              <p>
                Four steps, in order. You get something you can hold at the end of each one.
                We don't start until we agree on the real problem. Most briefs only describe
                the symptom.
              </p>
              <figure className="process-figure">
                <img
                  src="/demo/img/consultant-desk.jpg"
                  alt="A desk with an open notebook, a laptop and a printed report, ready for a planning session."
                  width={1400}
                  height={933}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Every stage ends with something written down.</figcaption>
              </figure>
            </div>
            <div>
              {PROCESS.map(([t, d], i) => (
                <Reveal key={t} delay={i * 70}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "48px 1fr", gap: 22,
                    padding: "22px 0", borderTop: "1px solid rgba(255,255,255,.18)",
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

      {/* WHY */}
      <section>
        <div className="wrap grid-2 why-grid">
          <Reveal>
            <div className="why-head">
              <p className="eyebrow">05 / Why work with Easywurld</p>
              <h2 style={{ maxWidth: "15ch" }}>Small enough to care about the little things.</h2>
              {/* The heading is short, which left a tall gap on this side. A photograph
                  gives the left column its own weight so the two columns balance. */}
              <figure className="why-figure">
                <img
                  src="/demo/img/firm-office.jpg"
                  alt="A meeting table with a written plan set out for review."
                  width={1400}
                  height={933}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>One team, from the first call to handover.</figcaption>
              </figure>
            </div>
          </Reveal>
          <Reveal delay={80}>
            {/* Top-aligned on desktop, then dropped to sit level with the heading
                rather than with the eyebrow above it. */}
            <div className="why-copy">
              <p>
                You talk to the person doing the work. Nobody passes messages along, and no
                one new takes over after the first meeting.
              </p>
              <p>
                We do the plan, the design, the words and the systems. So the parts fit
                together, instead of being split between three people who never talk.
              </p>
              <p>
                And we tell you when something is not worth paying for. A cheaper answer that
                fixes the problem beats a bigger bill.
              </p>
              <Link href="/about" className="textlink">More about how we work →</Link>
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
              A question, half an idea, or a project ready to start. WhatsApp is the fastest
              way to reach us.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                Message us on WhatsApp
              </a>
              <Link href="/free-review" className="btn btn-solid">
                Get a free 3-point review
              </Link>
              <Link href="/contact" className="btn btn-ghost">Use the form instead</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
