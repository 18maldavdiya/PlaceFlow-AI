import { env } from "@/config/env";

/**
 * App-wide constants that aren't environment-specific configuration.
 * Values that legitimately differ per environment belong in config/env.js
 * instead — this file is for names, limits, and labels that are the same
 * everywhere.
 */
export const APP_NAME = env.appName;

export const ROLES = Object.freeze({
  SUPER_ADMIN: "super_admin",
  COLLEGE_ADMIN: "college_admin",
  TPO: "tpo",
  STUDENT: "student",
  RECRUITER: "recruiter",
  HR: "hr",
  INTERVIEWER: "interviewer",
  ALUMNI: "alumni",
});

export const QUERY_KEYS = Object.freeze({
  HEALTH: "health",
});

export const LOCAL_STORAGE_KEYS = Object.freeze({
  THEME: "placeflow:theme",
});
