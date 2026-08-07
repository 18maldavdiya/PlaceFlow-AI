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

/**
 * Phase 5.2B — Skills / Projects / Experience / Certificates. Mirrors
 * server/src/models/studentProfile.model.js's SKILL_CATEGORIES and
 * INTERNSHIP_TYPES exactly.
 */
export const SKILL_CATEGORY_OPTIONS = Object.freeze([
  { value: "programming_languages", label: "Programming Languages" },
  { value: "frameworks", label: "Frameworks" },
  { value: "libraries", label: "Libraries" },
  { value: "databases", label: "Databases" },
  { value: "tools", label: "Tools" },
  { value: "operating_systems", label: "Operating Systems" },
  { value: "soft_skills", label: "Soft Skills" },
  { value: "languages_known", label: "Languages Known" },
]);

export const SKILL_CATEGORY_LABELS = Object.freeze(
  Object.fromEntries(
    SKILL_CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
  ),
);

export const INTERNSHIP_TYPE_OPTIONS = Object.freeze([
  { value: "internship", label: "Internship" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
]);
