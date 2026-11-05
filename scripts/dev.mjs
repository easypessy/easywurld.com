#!/usr/bin/env node
/**
 * Runs the ops API and the Vite dev server together.
 * The browser talks only to Vite (port 3000); Vite proxies /api to port 3001,
 * so the preview host never needs to know about the backend port.
 */
import { spawn } from "node:child_process";

const children = [];
let shuttingDown = false;

function run(name, command, args) {
  const child = spawn(command, args, { stdio: "inherit", env: process.env });
  child.on("exit", (code) => {
    if (shuttingDown) return;
    console.log(`[dev] ${name} exited with code ${code}`);
    shutdown(code ?? 0);
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    try {
      child.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  }
  setTimeout(() => process.exit(code), 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("api", process.execPath, [
  "--disable-warning=ExperimentalWarning",
  "--import",
  "tsx",
  "server/index.ts",
]);

setTimeout(() => {
  run("web", process.platform === "win32" ? "npx.cmd" : "npx", ["vite", "--host"]);
}, 700);
