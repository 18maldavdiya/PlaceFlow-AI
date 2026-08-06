/**
 * Options and keys specific to the Student Profile page. Mirrors
 * server/src/models/studentProfile.model.js's GENDER_VALUES exactly.
 */
export const GENDER_OPTIONS = Object.freeze([
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
]);

export const PROFILE_QUERY_KEY = "student-profile";

export const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB, matches server/src/config/multer.js
export const ALLOWED_PROFILE_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
