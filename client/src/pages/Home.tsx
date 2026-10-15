import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { projects, CATEGORIES, countFor } from "@/data";
import ProjectCard from "@/components/site/ProjectCard";
import HomeHero from "@/components/site/HomeHero";
import { Seo, Reveal, WA } from "@/components/site/Layout";

const PROBLEMS = [
  ["People can't tell what you do", "The message changed three times as the business grew and the website never caught up."],
  ["The work is good, the presence isn't", "Referrals convert; strangers don't, because there is nothing for them to judge."],
  ["Enquiries arrive and go cold", "Not a lead problem. A follow-up problem, and nobody owns it."],
  ["Everything is done twice", "The same questions, the same quotes, the same posts — all retyped by hand."],
];

const SERVICES = [
  ["01", "Digital marketing strategy", "Audience, positioning, content and customer journeys — the thinking before the making."],
  ["02", "Web design", "Business, service and local sites built to be understood in ten seconds."],
  ["03", "Landing pages", "One offer, one action, and the objections handled in between."],
  ["04", "business systems", "Receptionists, qualification and follow-up workflows with honest boundaries."],
  ["05", "Social media management", "A content system that survives a busy month."],
  ["06", "Copywriting & business content", "Plain words for websites, offers, emails and services."],
  ["07", "Reports & presentations", "Documents people finish reading."],
];

const PROCESS = [
  ["Understand", "We get close to the business, the audience and the real problem — which is often not the one described."],
  ["Simplify", "We find the useful message and remove everything competing with it."],
  ["Build", "We turn the thinking into clear, working, maintainable output."],
  ["Optimize", "We look at what is working, fix what isn't, and hand over something you can run."],
];

export default function Home() {
  const feature = projects.filter((p) => (p.weight ?? 1) >= 2).slice(0, 6);
  return (
    <>
      <Seo
        title="Easywurld | Web Design & SEO for Lagos Small Businesses"
        description="Web design, SEO and content for small businesses in Lagos. Clear sites that rank, load fast and turn visitors into enquiries. Simplify. Optimize. Grow."
        path="/"
      />

      {/* HOMEPAGE HERO — dimensional Easywurld brand scene */}
      <HomeHero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "flex" }}>
              {["Strategy", "Web design", "Landing pages", "business systems", "Social media",
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
            <h2 style={{ maxWidth: "20ch" }}>Seven services, one connected system.</h2>
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
                <h2 style={{ maxWidth: "16ch", margin: 0 }}>A body of work with a point of view.</h2>
              </div>
              <Link href="/projects" className="textlink">
                All {projects.length} projects →
              </Link>
            </div>
          </Reveal>
          <div className="note" style={{ margin: "22px 0 30px", maxWidth: "70ch" }}>
            <p>
              Easywurld is a young studio. Every project below is a <strong>concept</strong> or
              <strong> sample</strong> build, and each one says so on its card. We don't publish
              client names, testimonials or performance figures we cannot evidence.
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
            <p style={{ color: "#C3D2C8", maxWidth: "40ch" }}>
              Four stages, run in order, with a deliverable you can hold at the end of each.
              Nothing starts until we agree what the actual problem is — most briefs describe
              a symptom.
            </p>
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
        <div className="wrap grid-2">
          <Reveal>
            <p className="eyebrow">05 / Why work with Easywurld</p>
            <h2 style={{ maxWidth: "15ch" }}>Small enough to care about the detail.</h2>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <p>
                You deal with the person doing the work. There is no account manager relaying
                messages, and no junior quietly assigned to your project after the pitch.
              </p>
              <p>
                We work across strategy, design, words and systems, so the parts fit together
                instead of being handed between three suppliers who never speak.
              </p>
              <p>
                And we tell you when something isn't worth doing. A cheaper answer that solves
                the problem is a better outcome than a larger invoice.
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
