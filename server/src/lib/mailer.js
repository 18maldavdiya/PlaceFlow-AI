import nodemailer from "nodemailer";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Shared Nodemailer transporter, configured once from environment
 * variables. `src/emails/` builds on top of this (templates + send
 * functions) once transactional email features exist — this module only
 * owns the SMTP connection.
 */
export const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.secure,
  auth: env.smtp.user
    ? {
        user: env.smtp.user,
        pass: env.smtp.pass,
      }
    : undefined,
});

export async function verifyMailerConnection() {
  if (!env.smtp.host) {
    logger.warn(
      "SMTP is not configured — set SMTP_* env vars before sending email.",
    );
    return false;
  }

  try {
    await transporter.verify();
    logger.info("SMTP transporter verified and ready.");
    return true;
  } catch (error) {
    logger.error(`SMTP transporter verification failed: ${error.message}`);
    return false;
  }
}

export default transporter;
