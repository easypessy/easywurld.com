import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export const WA = "https://wa.me/2349050690837";

/* ---------- SEO: per-route head management ---------- */
export function Seo({
  title, description, path, type = "website",
}: { title: string; description: string; path: string; type?: string }) {
  useEffect(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://website-builder-portfolio.vercel.app";
    const url = origin + path;
    document.title = title;

    const set = (sel: string, attr: string, val: string, create: () => Element) => {
      let el = document.head.querySelector(sel);
      if (!el) { el = create(); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    const meta = (name: string, content: string, prop = false) =>
      set(`meta[${prop ? "property" : "name"}="${name}"]`, "content", content, () => {
        const m = document.createElement("meta");
        m.setAttribute(prop ? "property" : "name", name);
        return m;
      });

    meta("description", description);
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("og:url", url, true);
    meta("og:type", type, true);
    meta("og:site_name", "Easywurld", true);
    meta("og:image", origin + "/brand/og.png", true);
    meta("og:image:width", "1200", true);
    meta("og:image:height", "630", true);
    meta("twitter:card", "summary_large_image");
    meta("twitter:image", origin + "/brand/og.png");
    meta("twitter:title", title);
    meta("twitter:description", description);
    set('link[rel="canonical"]', "href", url, () => {
      const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l;
    });
  }, [title, description, path, type]);
  return null;
}

/* ---------- reveal on scroll (motion-safe) ---------- */
export function Reveal({ children, delay = 0, as: As = "div" }: any) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in"); return;
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </As>
  );
}

const NAV = [
  ["Projects", "/projects"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();
  useEffect(() => { setOpen(false); }, [loc]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="logo" aria-label="Easywurld — home">
          <picture>
            <source srcSet="/brand/mark-256.webp" type="image/webp" />
            <img src="/brand/mark.png" alt="" className="logo-mark" width={44} height={44} fetchPriority="high" decoding="async" />
          </picture>
          <span>
            EASYWURLD
            <small>SIMPLIFY. OPTIMIZE. GROW.</small>
          </span>
        </Link>
        <nav id="main-nav" data-open={open} aria-label="Main">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={loc.startsWith(href) ? "on" : ""}>
              {label}
            </Link>
          ))}
          <a className="btn btn-solid" href={WA} target="_blank" rel="noopener noreferrer">
            Start a project
          </a>
        </nav>
        <button
          className="burger" onClick={() => setOpen((o) => !o)}
          aria-expanded={open} aria-controls="main-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div>
            <div className="logo" style={{ color: "var(--paper)" }}>
              <picture>
                <source srcSet="/brand/mark-light-128.webp" type="image/webp" />
                <img src="/brand/mark-light.png" alt="" className="logo-mark" width={46} height={46} loading="lazy" decoding="async" />
              </picture>
              <span>
                EASYWURLD<small style={{ color: "#9FB3A6" }}>SIMPLIFY. OPTIMIZE. GROW.</small>
              </span>
            </div>
            <p style={{ color: "#C3D2C8", marginTop: 18, maxWidth: "34ch", fontSize: "var(--t-sm)" }}>
              Marketing clarity for small businesses. Strategy, design, content and
              practical digital systems — Lagos, Nigeria.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <div className="ftr-links">
              <Link href="/services">Digital marketing strategy</Link>
              <Link href="/services">Web design</Link>
              <Link href="/services">Landing pages</Link>
              <Link href="/services">business systems</Link>
              <Link href="/services">Copywriting</Link>
              <Link href="/services">Reports & presentations</Link>
            </div>
          </div>
          <div>
            <h4>Projects</h4>
            <div className="ftr-links">
              <Link href="/projects">All projects</Link>
              <Link href="/projects?c=Web+Design">Web design</Link>
              <Link href="/projects?c=Business+Systems">business systems</Link>
              <Link href="/projects?c=Social+Media">Social media</Link>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <div className="ftr-links">
              <a href={WA} target="_blank" rel="noopener noreferrer">WhatsApp · 0905 069 0837</a>
              <Link href="/contact">Start a project</Link>
              <Link href="/about">About Easywurld</Link>
            </div>
          </div>
        </div>
        <div className="ftr-base">
          <span>© {new Date().getFullYear()} Easywurld. All rights reserved.</span>
          <span>Concept and sample work is labelled on every project. No client results are claimed.</span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loc] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc]);
  return (
    <>
      <Header />
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}
