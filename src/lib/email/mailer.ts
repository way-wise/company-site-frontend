import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP transport for outbound site email. Server-only: SMTP_PASS is a real
 * credential and must never be bundled into client JS, which is what the
 * "server-only" import above enforces at build time.
 */

const requireEnv = (name: string) => {
   const value = process.env[name];
   if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
   }
   return value;
};

let transporter: Transporter | null = null;

/**
 * Lazily built and cached. Serverless keeps the module alive between warm
 * invocations, so this reuses one connection pool instead of reconnecting per
 * request. Built lazily (not at import time) so a missing env var surfaces as a
 * handled 500 rather than crashing the route at module load.
 */
export const getTransporter = (): Transporter => {
   if (transporter) return transporter;

   const port = Number(requireEnv("SMTP_PORT"));

   transporter = nodemailer.createTransport({
      host: requireEnv("SMTP_HOST"),
      port,
      // 465 is implicit TLS; 587 starts plaintext and upgrades via STARTTLS.
      secure: port === 465,
      auth: {
         user: requireEnv("SMTP_USER"),
         pass: requireEnv("SMTP_PASS"),
      },
   });

   return transporter;
};

/** Comma-separated recipient list, e.g. "sales@x.com, hello@y.com". */
export const getNotificationRecipients = (): string[] => {
   return requireEnv("CONTACT_NOTIFY_TO")
      .split(",")
      .map((address) => address.trim())
      .filter(Boolean);
};

/**
 * The envelope sender. Must be a mailbox the SMTP account is allowed to send
 * as, or the provider will reject it (or spam-folder it). Defaults to SMTP_USER.
 */
export const getFromAddress = (): string => {
   const from = process.env.SMTP_FROM || requireEnv("SMTP_USER");
   return `"Way Wise Tech Website" <${from}>`;
};
