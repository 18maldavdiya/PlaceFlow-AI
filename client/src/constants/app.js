import { env } from "@/config/env";

/**
 * App-wide constants that aren't environment-specific configuration.
 * Values that legitimately differ per environment belong in config/env.js
 * instead — this file is for names, limits, and labels that are the same
 * everywhere.
 */
export const APP_NAME = env.appName;

/**
 * The four roles the authentication foundation supports — must stay in
 * sync with `USER_ROLES` in server/src/models/user.model.js. Narrower than
 * the full role set sketched in the Phase 1 blueprint (which also
 * envisioned College Admin, HR, Interviewer, and Alumni); those are
 * deferred until the modules that need them are actually built.
 */
export const ROLES = Object.freeze({
  STUDENT: "student",
  RECRUITER: "recruiter",
  TPO: "tpo",
  ADMIN: "admin",
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.STUDENT]: "Student",
  [ROLES.RECRUITER]: "Recruiter",
  [ROLES.TPO]: "TPO",
  [ROLES.ADMIN]: "Admin",
});

/**
 * The subset of ROLES the public Register page may offer. Admin and TPO
 * stay in ROLES/ROLE_LABELS — the system still fully supports them — but
 * those accounts are only ever created by an authenticated admin panel
 * (not built yet), never by public self-registration. Mirrors
 * `PUBLIC_REGISTRATION_ROLES` in server/src/models/user.model.js; the
 * server re-enforces this independently, so this constant is a UX
 * convenience, not the actual security boundary.
 */
export const PUBLIC_REGISTRATION_ROLES = Object.freeze([
  ROLES.STUDENT,
  ROLES.RECRUITER,
]);

export const QUERY_KEYS = Object.freeze({
  HEALTH: "health",
});

export const LOCAL_STORAGE_KEYS = Object.freeze({
  THEME: "placeflow:theme",
});
