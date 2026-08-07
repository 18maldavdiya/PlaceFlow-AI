import {
  INTERNSHIP_TYPES,
  SKILL_CATEGORIES,
  GENDER_VALUES,
} from "../models/studentProfile.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Manual, dependency-free validation for PUT /profile and the Phase 5.2B
 * section endpoints (skills/projects/experience/certificates), following
 * the same convention throughout — a middleware that checks `req.body` and
 * calls `next(ApiError.badRequest(...))` on failure.
 */

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const URL_REGEX = /^https?:\/\/[^\s$.?#][^\s]*$/i;
const CURRENT_YEAR = new Date().getFullYear();
const TODAY = new Date();

function collectErrors(checks) {
  return checks.filter(Boolean);
}

function isBlank(value) {
  return value === undefined || value === null || value === "";
}

function isValidDate(value) {
  if (isBlank(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

/**
 * Shared start/end/isCurrent validation for Projects and Experience —
 * the exact same three rules apply to both ("Current Project" and
 * "Current" role work identically): a valid start date is required; if not
 * marked current, a valid end date is required and can't be before start.
 */
function validateDateRange({ startDate, endDate, isCurrent }, errors) {
  if (!isValidDate(startDate)) {
    errors.push("Enter a valid start date.");
    return;
  }
  if (isCurrent) return;

  if (isBlank(endDate)) {
    errors.push("Provide an end date, or mark this as current.");
    return;
  }
  if (!isValidDate(endDate)) {
    errors.push("Enter a valid end date.");
    return;
  }
  if (new Date(endDate) < new Date(startDate)) {
    errors.push("End date cannot be before the start date.");
  }
}

export function validateUpdateProfileInput(req, res, next) {
  const {
    firstName,
    lastName,
    phoneNumber,
    gender,
    semester,
    collegeName,
    degree,
    branch,
    cgpa,
    graduationYear,
  } = req.body ?? {};

  const errors = collectErrors([
    (isBlank(firstName) || firstName.trim().length < 1) &&
      "First name is required.",
    (isBlank(lastName) || lastName.trim().length < 1) &&
      "Last name is required.",
    (isBlank(phoneNumber) || !PHONE_REGEX.test(phoneNumber)) &&
      "Enter a valid phone number.",
    !isBlank(gender) && !GENDER_VALUES.includes(gender) && "Select a valid gender.",
    (isBlank(collegeName) || collegeName.trim().length < 2) &&
      "College name is required.",
    (isBlank(branch) || branch.trim().length < 2) && "Branch is required.",
    (isBlank(degree) || degree.trim().length < 2) && "Degree is required.",
    !isBlank(semester) &&
      (Number(semester) < 1 || Number(semester) > 12) &&
      "Semester must be between 1 and 12.",
    !isBlank(cgpa) &&
      (Number(cgpa) < 0 || Number(cgpa) > 10) &&
      "CGPA must be between 0 and 10.",
    (isBlank(graduationYear) ||
      Number(graduationYear) < 1950 ||
      Number(graduationYear) > CURRENT_YEAR + 10) &&
      "Enter a valid graduation year.",
  ]);

  if (errors.length > 0) {
    return next(ApiError.badRequest("Profile details are invalid", errors));
  }
  return next();
}

// ---------- Phase 5.2B: Skills / Projects / Experience / Certificates ----------

export function validateSkillInput(req, res, next) {
  const { category, name } = req.body ?? {};

  const errors = collectErrors([
    (isBlank(category) || !SKILL_CATEGORIES.includes(category)) &&
      "Select a valid skill category.",
    (isBlank(name) || name.trim().length < 1) && "Skill name is required.",
  ]);

  if (errors.length > 0) {
    return next(ApiError.badRequest("Skill details are invalid", errors));
  }
  return next();
}

export function validateProjectInput(req, res, next) {
  const { title, githubUrl, liveUrl, startDate, endDate, isCurrent } =
    req.body ?? {};

  const errors = collectErrors([
    (isBlank(title) || title.trim().length < 2) &&
      "Project title is required.",
    !isBlank(githubUrl) && !URL_REGEX.test(githubUrl) && "Enter a valid GitHub URL.",
    !isBlank(liveUrl) && !URL_REGEX.test(liveUrl) && "Enter a valid live URL.",
  ]);

  validateDateRange({ startDate, endDate, isCurrent }, errors);

  if (errors.length > 0) {
    return next(ApiError.badRequest("Project details are invalid", errors));
  }
  return next();
}

export function validateExperienceInput(req, res, next) {
  const {
    company,
    role,
    internshipType,
    startDate,
    endDate,
    isCurrent,
  } = req.body ?? {};

  const errors = collectErrors([
    (isBlank(company) || company.trim().length < 2) && "Company is required.",
    (isBlank(role) || role.trim().length < 2) && "Role is required.",
    (isBlank(internshipType) || !INTERNSHIP_TYPES.includes(internshipType)) &&
      "Select a valid internship type.",
  ]);

  validateDateRange({ startDate, endDate, isCurrent }, errors);

  if (errors.length > 0) {
    return next(ApiError.badRequest("Experience details are invalid", errors));
  }
  return next();
}

export function validateCertificateInput(req, res, next) {
  const { name, issuer, issueDate, expiryDate, certificateUrl } =
    req.body ?? {};

  const errors = collectErrors([
    (isBlank(name) || name.trim().length < 2) &&
      "Certificate name is required.",
    (isBlank(issuer) || issuer.trim().length < 2) && "Issuer is required.",
    !isBlank(certificateUrl) &&
      !URL_REGEX.test(certificateUrl) &&
      "Enter a valid certificate URL.",
  ]);

  if (!isValidDate(issueDate)) {
    errors.push("Enter a valid issue date.");
  } else if (new Date(issueDate) > TODAY) {
    errors.push("Issue date cannot be in the future.");
  } else if (!isBlank(expiryDate)) {
    if (!isValidDate(expiryDate)) {
      errors.push("Enter a valid expiry date.");
    } else if (new Date(expiryDate) < new Date(issueDate)) {
      errors.push("Expiry date cannot be before the issue date.");
    }
  }

  if (errors.length > 0) {
    return next(
      ApiError.badRequest("Certificate details are invalid", errors),
    );
  }
  return next();
}

export default {
  validateUpdateProfileInput,
  validateSkillInput,
  validateProjectInput,
  validateExperienceInput,
  validateCertificateInput,
};
