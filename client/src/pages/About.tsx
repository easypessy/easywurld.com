import { Link } from "wouter";
import { projects } from "@/data";
import { Seo, Reveal, WA } from "@/components/site/Layout";

export default function About() {
  return (
    <>
      <Seo
        title="About Easywurld — A small digital studio in Lagos"
        description="Easywurld is an independent digital studio in Lagos combining marketing strategy, web design, content and practical business systems for small businesses."
        path="/about"
      />
      <section style={{ paddingBottom: 20 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">About</p>
            <h1 style={{ maxWidth: "15ch" }}>Small enough to care deeply.</h1>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap grid-2">
          <Reveal>
            <div>
              <p className="lead">
                Easywurld is an independent digital studio based in Lagos. We work with small
                businesses that want thoughtful work without the theatre that usually comes
                attached to it.
              </p>
              <p>
                The studio exists because of a pattern we kept seeing: a business hires a
                designer, a separate copywriter, someone for social, and a developer. Each does
                competent work. None of them speak to each other, and the result is a business
                that says four different things in four different voices.
              </p>
              <p>
                So we kept strategy, design, words and systems in one place. Not because we're
                better at all four than a specialist would be, but because the joins are where
                small businesses lose most of their money.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <h3>What we're honest about</h3>
              <p>
                We're a young studio. The portfolio on this site is concept and sample work,
                and every single project says so on its own card. We don't have client logos to
                show you, we haven't invented testimonials, and we don't quote conversion
                percentages we can't evidence.
              </p>
              <p>
                We'd rather you judge the thinking. There are{" "}
                <Link href="/projects" className="textlink">{projects.length} projects</Link> here,
                each with a written case study explaining the problem, the decision and what we'd
                change. That's a more useful thing to assess than a wall of logos.
              </p>
              <h3 style={{ marginTop: 34 }}>What we decline</h3>
              <p>
                Work that needs a claim we can't support. Systems that pretend to be human
                where that matters — healthcare, money, anything with a legal consequence.
                And projects where the honest answer is that the client doesn't need us yet.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">What brings people here</p>
            <h2 style={{ maxWidth: "18ch" }}>Four problems, over and over.</h2>
          </Reveal>
          <div style={{ marginTop: 32 }}>
            {[
              ["People can't tell what you do", "The message changed three times as the business grew and the website never caught up."],
              ["The work is good, the presence isn't", "Referrals convert; strangers don't, because there is nothing for them to judge."],
              ["Enquiries arrive and go cold", "Not a lead problem. A follow-up problem, and nobody owns it."],
              ["Everything is done twice", "The same questions, the same quotes, the same posts — all retyped by hand."],
            ].map(([t, d], i) => (
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

      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <p className="eyebrow">How we work</p>
          <h2 style={{ maxWidth: "20ch" }}>Four stages, in order, with something at the end of each.</h2>
          <div className="grid-2" style={{ marginTop: 44 }}>
            <div>
              <h3>You deal with the person doing the work</h3>
              <p>
                No account manager relaying messages, no junior quietly reassigned after the
                pitch. The person in the first conversation is the person building the thing.
              </p>
              <h3 style={{ marginTop: 28 }}>Everything is handed over</h3>
              <p>
                Templates, content systems, documentation. If you can't run it after we leave,
                we've built you a dependency rather than a solution.
              </p>
            </div>
            <div>
              <h3>We write things down</h3>
              <p>
                Decisions, scope, price, and what's excluded — before work starts. Most
                disagreements in this industry are really documentation failures.
              </p>
              <h3 style={{ marginTop: 28 }}>We'll tell you to spend less</h3>
              <p>
                If a smaller piece of work solves the problem, that's the recommendation. It's
                a worse invoice and a better outcome, and the second one matters more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap grid-2">
          <Reveal>
            <p className="eyebrow">Why Easywurld</p>
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
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ maxWidth: "20ch", marginInline: "auto" }}>Tell us what you're trying to solve.</h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              Message us on WhatsApp
            </a>
            <Link href="/contact" className="btn btn-ghost">Send a brief</Link>
          </div>
        </div>
      </section>
    </>
  );
}
