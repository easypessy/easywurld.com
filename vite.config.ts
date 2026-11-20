import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { renderPrerender } from "./client/src/data/content";

/**
 * Injects the crawler-facing copy into index.html#prerender.
 *
 * The words come from client/src/data/content.ts — the same module the pages
 * render — so the static HTML and the React app cannot drift apart. The block
 * is removed the moment the app mounts (see client/src/main.tsx).
 */
function prerenderPlugin(): Plugin {
  return {
    name: "easywurld-prerender",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(
          '<div id="prerender"></div>',
          `<div id="prerender">${renderPrerender()}</div>`
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "es2020",
  },
  server: {
    port: 3000,
    strictPort: false, // will find the next available port if 3000 is busy
    host: true,
    allowedHosts: ["localhost", "127.0.0.1", ".e2b.app"],
  },
});
