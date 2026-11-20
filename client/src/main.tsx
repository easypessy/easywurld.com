import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import "./index.css";

/* The crawler-facing copy in index.html (#prerender) is removed once the app
   takes over, so the live DOM keeps exactly one <h1> and one set of landmarks. */
document.getElementById("prerender")?.remove();

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    {/* Privacy-friendly and cookie-less. Set VITE_ANALYTICS=false to disable. */}
    {import.meta.env.VITE_ANALYTICS !== "false" && <Analytics />}
  </>
);
