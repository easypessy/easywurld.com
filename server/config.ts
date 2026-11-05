import path from "node:path";
import fs from "node:fs";

/**
 * All runtime configuration. Everything is optional except where noted: the
 * system runs fully offline with SQLite + local storage, and integrations switch
 * on when their credentials are present. No secret is ever sent to the browser.
 */

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

function bool(name: string, fallback = false): boolean {
  const v = env(name).toLowerCase();
  if (!v) return fallback;
  return ["1", "true", "yes", "on"].includes(v);
}

const root = path.resolve(import.meta.dirname, "..");
const dataDir = path.resolve(env("DATA_DIR", path.join(root, "data")));

export const config = {
  root,
  dataDir,
  dbFile: path.resolve(env("DB_FILE", path.join(dataDir, "easywurld.db"))),
  storageDir: path.resolve(env("STORAGE_DIR", path.join(dataDir, "storage"))),
  publicDir: path.resolve(env("PUBLIC_DIR", path.join(root, "dist", "public"))),

  env: env("NODE_ENV", "development"),
  isProd: env("NODE_ENV", "development") === "production",
  port: Number(env("PORT", "3001")),

  /** Session lifetime in days. */
  sessionDays: Number(env("SESSION_DAYS", "30")),
  /** Comma-separated admin emails allowed to bootstrap the first admin account. */
  adminEmails: env("ADMIN_EMAILS")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),

  admin: {
    email: env("EASYWURLD_ADMIN_EMAIL", "hello@easywurld.com"),
    whatsapp: env("EASYWURLD_WHATSAPP", "2349050690837"),
    name: env("EASYWURLD_ADMIN_NAME", "Easywurld"),
    siteUrl: env("SITE_URL", "http://localhost:3000"),
  },

  payments: {
    /** Paystack: HMAC-SHA512 signature over the raw body using the secret key. */
    paystackSecret: env("PAYSTACK_SECRET_KEY"),
    /** Optional live re-verification of a transaction reference. */
    paystackVerify: bool("PAYSTACK_VERIFY", true),
    /** Flutterwave: static `verif-hash` header value. */
    flutterwaveHash: env("FLUTTERWAVE_VERIF_HASH"),
    flutterwaveSecret: env("FLUTTERWAVE_SECRET_KEY"),
    /** Stripe: HMAC-SHA256 over `t.payload` using the signing secret. */
    stripeSecret: env("STRIPE_WEBHOOK_SECRET"),
    /** Generic signed webhook used for tests and any other provider. */
    genericSecret: env("WEBHOOK_SECRET", ""),
  },

  storage: {
    /** local | gdrive | dropbox — where the 01…06 workspace lives. */
    provider: (env("STORAGE_PROVIDER", "local") as "local" | "gdrive" | "dropbox"),
    /** Google Drive OAuth access token (or a service-account-derived token). */
    driveToken: env("GOOGLE_DRIVE_ACCESS_TOKEN"),
    driveRootFolderId: env("GOOGLE_DRIVE_ROOT_FOLDER_ID"),
    driveRefreshToken: env("GOOGLE_DRIVE_REFRESH_TOKEN"),
    driveClientId: env("GOOGLE_DRIVE_CLIENT_ID"),
    driveClientSecret: env("GOOGLE_DRIVE_CLIENT_SECRET"),
    /** Share each project folder read-only with the client's email. */
    driveShareWithClients: bool("GOOGLE_DRIVE_SHARE_WITH_CLIENTS", false),
    /** Dropbox access token, used as secondary/large-media storage. */
    dropboxToken: env("DROPBOX_ACCESS_TOKEN"),
    dropboxRoot: env("DROPBOX_ROOT", "/EASYWURLD CLIENTS"),
  },

  notion: {
    token: env("NOTION_TOKEN"),
    clientsDb: env("NOTION_CLIENTS_DB"),
    projectsDb: env("NOTION_PROJECTS_DB"),
    tasksDb: env("NOTION_TASKS_DB"),
    deliveriesDb: env("NOTION_DELIVERIES_DB"),
    logDb: env("NOTION_LOG_DB"),
    enabled: Boolean(env("NOTION_TOKEN")),
  },

  smtp: {
    host: env("SMTP_HOST"),
    port: Number(env("SMTP_PORT", "587")),
    user: env("SMTP_USER"),
    pass: env("SMTP_PASS"),
    from: env("SMTP_FROM", "Easywurld <hello@easywurld.com>"),
    secure: bool("SMTP_SECURE", false),
  },

  whatsapp: {
    /** Meta WhatsApp Cloud API. */
    token: env("WHATSAPP_TOKEN"),
    phoneNumberId: env("WHATSAPP_PHONE_NUMBER_ID"),
    /** Fallback channel is a click-to-chat link, always available. */
    clickToChat: true,
  },

  limits: {
    maxUploadBytes: Number(env("MAX_UPLOAD_MB", "25")) * 1024 * 1024,
    maxBodyBytes: 1024 * 1024,
    loginAttemptsPerWindow: 10,
    loginWindowMs: 15 * 60 * 1000,
  },

  /** Used to boot a demo dataset in non-production environments. */
  seedDemo: bool("SEED_DEMO", false),
};

export function ensureDirs(): void {
  for (const dir of [config.dataDir, path.dirname(config.dbFile), config.storageDir]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function integrationStatus() {
  return {
    database: { name: "SQLite (node:sqlite)", configured: true, detail: config.dbFile },
    storage: {
      name: config.storage.provider,
      configured:
        config.storage.provider === "local" ||
        (config.storage.provider === "gdrive" && Boolean(config.storage.driveToken && config.storage.driveRootFolderId)) ||
        (config.storage.provider === "dropbox" && Boolean(config.storage.dropboxToken)),
      detail: config.storage.provider === "local" ? config.storageDir : "see docs/ops/02-integrations.md",
    },
    email: {
      name: "SMTP",
      configured: Boolean(config.smtp.host && config.smtp.user),
      detail: config.smtp.host || "not configured — notifications stay in the outbox",
    },
    whatsapp: {
      name: "WhatsApp Cloud API",
      configured: Boolean(config.whatsapp.token && config.whatsapp.phoneNumberId),
      detail: config.whatsapp.token ? "configured" : "not configured — click-to-chat links are used instead",
    },
    notion: {
      name: "Notion",
      configured: Boolean(config.notion.token && config.notion.clientsDb),
      detail: config.notion.token ? "token present" : "not configured",
    },
    payments: {
      paystack: Boolean(config.payments.paystackSecret),
      flutterwave: Boolean(config.payments.flutterwaveHash),
      stripe: Boolean(config.payments.stripeSecret),
      generic: Boolean(config.payments.genericSecret),
    },
    drive: Boolean(config.storage.driveToken),
    dropbox: Boolean(config.storage.dropboxToken),
  };
}

export type IntegrationStatus = ReturnType<typeof integrationStatus>;
