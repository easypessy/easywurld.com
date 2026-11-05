/**
 * Database backup:  npm run ops:backup
 * Writes a consistent snapshot to data/backups/easywurld-<timestamp>.db using
 * SQLite's VACUUM INTO (safe while the server is running).
 * Copy that file plus data/storage/ to your off-site backup of choice.
 */
import fs from "node:fs";
import path from "node:path";
import { config } from "../config.ts";
import { backupTo } from "../db/db.ts";

const dir = path.join(config.dataDir, "backups");
fs.mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = path.join(dir, `easywurld-${stamp}.db`);
backupTo(file);

const size = fs.statSync(file).size;
console.log(`Backup written: ${file} (${(size / 1024).toFixed(1)} KB)`);

const keep = 14;
const backups = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("easywurld-") && f.endsWith(".db"))
  .sort()
  .reverse();
for (const old of backups.slice(keep)) {
  fs.rmSync(path.join(dir, old), { force: true });
  console.log(`Removed old backup: ${old}`);
}
