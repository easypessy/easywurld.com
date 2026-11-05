import express, { type NextFunction, type Request, type Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.ts";
import { apiRouter } from "./routes.ts";
import { csrfGuard } from "./auth.ts";
import { HttpError } from "./lib/errors.ts";
import { logEvent } from "./services/automation.ts";

export function createApp(): express.Express {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  /* Security headers. No third-party scripts are needed by the portal. */
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    res.setHeader(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "img-src 'self' data: blob:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "script-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    );
    next();
  });

  /* Raw body is retained for webhook signature verification. */
  app.use(
    express.json({
      limit: "2mb",
      verify: (req, _res, buf) => {
        (req as Request).rawBody = Buffer.from(buf);
      },
    }),
  );

  app.use("/api", csrfGuard);
  app.use("/api", apiRouter);

  /* Static SPA + client-side routing (production). */
  const publicDir = config.publicDir;
  if (fs.existsSync(publicDir)) {
    app.use(
      express.static(publicDir, {
        index: false,
        setHeaders(res, filePath) {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      }),
    );
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(publicDir, "index.html"));
    });
  }

  /* Error handler: never leak stack traces to the browser. */
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message, code: err.code, details: err.details });
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error("[api]", message);
    logEvent({
      event: "server.error",
      status: "failed",
      detail: { path: req.path, method: req.method },
      error: message,
      retriable: false,
    });
    if (res.headersSent) return;
    res.status(500).json({ error: "Something went wrong. The team has been notified." });
  });

  return app;
}
