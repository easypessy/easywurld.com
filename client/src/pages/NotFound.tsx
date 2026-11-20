import { Link } from "wouter";
import { ArrowLeft, Compass } from "lucide-react";
import { Seo } from "@/components/site/Layout";

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found | Easywurld"
        description="That page could not be found. It may have moved, or the link may be wrong."
        path="/404"
      />
      <section
        style={{
          minHeight: "62vh",
          display: "flex",
          alignItems: "center",
          paddingBlock: "80px 96px",
        }}
      >
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Error 404
          </p>
          <h1 style={{ maxWidth: "16ch", marginInline: "auto" }}>
            This page isn&apos;t here any more.
          </h1>
          <p
            className="lead"
            style={{ maxWidth: "46ch", marginInline: "auto" }}
          >
            It may have moved, or the link may be wrong. The work and the
            services are still where they were.
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
            <Link href="/" className="btn btn-solid">
              <ArrowLeft size={17} /> Back to the homepage
            </Link>
            <Link href="/projects" className="btn btn-ghost">
              <Compass size={17} /> See the projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
