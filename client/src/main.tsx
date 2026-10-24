import { createRoot } from "react-dom/client";
import App from "./App";
import { captureSource } from "./lib/wa";
import "./index.css";

/* Read ?src=CODE before the first render, so even the first page a visitor lands
   on produces a source-tagged WhatsApp link. */
captureSource();

/* The crawler-facing copy in index.html (#prerender) is removed once the app
   takes over, so the live DOM keeps exactly one <h1> and one set of landmarks. */
document.getElementById("prerender")?.remove();

createRoot(document.getElementById("root")!).render(<App />);
