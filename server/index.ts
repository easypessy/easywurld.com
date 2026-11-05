import { createApp } from "./app.ts";
import { config, ensureDirs } from "./config.ts";
import { seedTemplates } from "./services/templates.ts";
import { dispatchPending } from "./services/notifications.ts";
import { logEvent } from "./services/automation.ts";

ensureDirs();
seedTemplates();

const app = createApp();
const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`Easywurld ops API listening on http://0.0.0.0:${config.port}`);
  console.log(`  database : ${config.dbFile}`);
  console.log(`  storage  : ${config.storage.provider} (${config.storageDir})`);
  console.log(`  env      : ${config.env}`);
});

/* Notification retries: every minute, deliver anything still queued. */
const timer = setInterval(() => {
  dispatchPending(25)
    .then((res) => {
      if (res.sent || res.failed || res.logged) {
        console.log(`[notifications] sent=${res.sent} failed=${res.failed} logged=${res.logged}`);
      }
    })
    .catch((err) => logEvent({ event: "notification.dispatch_failed", status: "failed", error: err }));
}, 60_000);
timer.unref?.();

function shutdown(signal: string) {
  console.log(`\n${signal} received — closing`);
  clearInterval(timer);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
