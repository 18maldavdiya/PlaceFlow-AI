import { GENDER_VALUES } from "../models/studentProfile.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Manual, dependency-free validation for PUT /profile, following the same
 * convention as validators/auth.validator.js — a middleware that checks
 * `req.body` and calls `next(ApiError.badRequest(...))` on failure.
 */

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const CURRENT_YEAR = new Date().getFullYear();

function collectErrors(checks) {
  return checks.filter(Boolean);
}

function isBlank(value) {
  return value === undefined || value === null || value === "";
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

export default { validateUpdateProfileInput };
