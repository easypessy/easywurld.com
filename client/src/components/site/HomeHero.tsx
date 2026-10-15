import { useEffect, useRef, type PointerEvent } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { WA } from "@/components/site/Layout";

/** Homepage-only hero. CSS owns the motion; the artwork is purely decorative. */
export default function HomeHero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const motionAllowedRef = useRef(true);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateDepth = () => {
      frameRef.current = null;
      const element = sceneRef.current;
      if (!element) return;

      if (reducedMotion.matches) {
        element.style.setProperty("--scene-depth-y", "0px");
        return;
      }

      const bounds = element.getBoundingClientRect();
      const travel = window.innerHeight + bounds.height;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / travel));
      element.style.setProperty("--scene-depth-y", `${(12 - progress * 24).toFixed(1)}px`);
    };
    const scheduleDepth = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updateDepth);
    };
    const syncMotionPreference = () => {
      motionAllowedRef.current = !reducedMotion.matches;
      if (reducedMotion.matches) {
        scene.style.setProperty("--scene-rotate-x", "0deg");
        scene.style.setProperty("--scene-rotate-y", "0deg");
      }
      scheduleDepth();
    };

    motionAllowedRef.current = !reducedMotion.matches;
    scheduleDepth();
    window.addEventListener("scroll", scheduleDepth, { passive: true });
    window.addEventListener("resize", scheduleDepth, { passive: true });
    reducedMotion.addEventListener("change", syncMotionPreference);

    return () => {
      window.removeEventListener("scroll", scheduleDepth);
      window.removeEventListener("resize", scheduleDepth);
      reducedMotion.removeEventListener("change", syncMotionPreference);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!motionAllowedRef.current || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--scene-rotate-x", `${(-y * 6).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--scene-rotate-y", `${(x * 8).toFixed(2)}deg`);
  }

  function resetPointer(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--scene-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--scene-rotate-y", "0deg");
  }

  return (
    <section className="home-hero">
      <div className="wrap home-hero-grid">
        <div className="home-hero-copy">
          <p className="eyebrow">Independent digital studio · Lagos, Nigeria</p>

          <div className="home-brand-lockup">
            <picture>
              <source srcSet="/brand/mark-256.webp" type="image/webp" />
              <img
                src="/brand/mark.png"
                alt=""
                className="home-brand-mark"
                width={76}
                height={76}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <div className="home-brand-type">
              <h1 className="wordmark">Easywurld</h1>
              <p className="home-slogan">Simplify. Optimize. Grow.</p>
            </div>
          </div>

          <p className="lead home-hero-lead">
            Web design, SEO and content for small businesses in Lagos. Clear sites
            that rank, load fast and turn visitors into enquiries — strategy, design,
            words and practical systems, in one place.
          </p>

          <div className="home-hero-actions">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
              Start a project <ArrowUpRight size={17} />
            </a>
            <Link href="/projects" className="btn btn-ghost">
              Explore our work
            </Link>
            <Link href="/services" className="home-services-link">
              Our services <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="lh-row home-lh-row">
            <span className="lh-chip"><b>LIVE TEST</b>Lighthouse · Mobile &amp; desktop</span>
            <a
              className="lh-link"
              href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwebsite-builder-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Run a site check <ArrowUpRight size={14} />
            </a>
            <span className="home-lh-note">Results are measured live — no sample scores.</span>
          </div>
        </div>

        <div
          ref={sceneRef}
          className="hero-scene"
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          onPointerCancel={resetPointer}
        >
          <div className="hero-scene-tilt">
            <div className="hero-scene-glow" />
            <div className="hero-orbit hero-orbit-outer" />
            <div className="hero-orbit hero-orbit-inner" />

            <svg className="hero-circuit-art" viewBox="0 0 520 520" focusable="false">
              <path className="hero-circuit-path hero-circuit-path-one" d="M75 335h80l38-38v-71l48-48h69" />
              <path className="hero-circuit-path hero-circuit-path-two" d="M345 145h54v68l-42 42v90h75" />
              <path className="hero-circuit-path hero-circuit-path-three" d="M121 386h70l53 53h107" />
              <circle className="hero-circuit-node node-one" cx="310" cy="178" r="7" />
              <circle className="hero-circuit-node node-two" cx="357" cy="255" r="6" />
              <circle className="hero-circuit-node node-three" cx="351" cy="439" r="5" />
              <circle className="hero-circuit-node node-four" cx="75" cy="335" r="5" />
            </svg>

            <div className="hero-mark-well">
              <picture>
                <source srcSet="/brand/mark-512.webp" type="image/webp" />
                <img src="/brand/mark.png" alt="" className="hero-mark-image" width={242} height={242} decoding="async" />
              </picture>
            </div>

            <div className="hero-float-card hero-card-strategy">
              <span className="hero-card-index">01</span>
              <span><b>Strategy</b><small>Understand</small></span>
            </div>
            <div className="hero-float-card hero-card-design">
              <span className="hero-card-index">02</span>
              <span><b>Web design</b><small>Simplify</small></span>
            </div>
            <div className="hero-float-card hero-card-systems">
              <span className="hero-card-index">03</span>
              <span><b>Systems</b><small>Optimize</small></span>
            </div>
          </div>
          <p className="hero-scene-caption">A clear path from idea to next step</p>
        </div>
      </div>
    </section>
  );
}
