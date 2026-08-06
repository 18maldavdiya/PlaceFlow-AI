import { PUBLIC_REGISTRATION_ROLES, USER_ROLES } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Manual, dependency-free request validation for the auth routes — no
 * schema library is part of the locked backend stack, so each validator is
 * a small Express middleware that checks `req.body` and calls
 * `next(ApiError.badRequest(...))` on failure, per validators/README.md's
 * documented convention. Controllers can assume anything that reaches them
 * has already passed these checks.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Min 8 chars, at least one lowercase, one uppercase, one digit, one symbol.
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

function collectErrors(checks) {
  return checks.filter(Boolean);
}

export function validateRegisterInput(req, res, next) {
  const { fullName, email, password, confirmPassword, role, phoneNumber } =
    req.body ?? {};

  // Admin and TPO are real, supported roles (USER_ROLES) — just not ones
  // the public endpoint may hand out. Checked first, and rejected with its
  // own 403, so this reads as an authorization failure rather than getting
  // lumped in with the 400 field-validation errors below. Those roles are
  // reserved for an authenticated admin panel to assign later.
  if (role && USER_ROLES.includes(role) && !PUBLIC_REGISTRATION_ROLES.includes(role)) {
    return next(
      ApiError.forbidden(
        "Public registration is not available for the Admin or TPO role. These accounts are created by an authenticated administrator.",
      ),
    );
  }

  const errors = collectErrors([
    (!fullName || fullName.trim().length < 2) &&
      "Full name must be at least 2 characters.",
    (!email || !EMAIL_REGEX.test(email)) && "Enter a valid email address.",
    (!password || !STRONG_PASSWORD_REGEX.test(password)) &&
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.",
    password !== confirmPassword && "Passwords do not match.",
    (!role || !PUBLIC_REGISTRATION_ROLES.includes(role)) &&
      "Select a valid role (student or recruiter).",
    (!phoneNumber || !PHONE_REGEX.test(phoneNumber)) &&
      "Enter a valid phone number.",
  ]);

  if (errors.length > 0) {
    return next(ApiError.badRequest("Registration details are invalid", errors));
  }
  return next();
}

export function validateLoginInput(req, res, next) {
  const { email, password } = req.body ?? {};

  const errors = collectErrors([
    (!email || !EMAIL_REGEX.test(email)) && "Enter a valid email address.",
    !password && "Password is required.",
  ]);

  if (errors.length > 0) {
    return next(ApiError.badRequest("Login details are invalid", errors));
  }
  return next();
}

export function validateForgotPasswordInput(req, res, next) {
  const { email } = req.body ?? {};

  if (!email || !EMAIL_REGEX.test(email)) {
    return next(
      ApiError.badRequest("Forgot password details are invalid", [
        "Enter a valid email address.",
      ]),
    );
  }
  return next();
}

export function validateResetPasswordInput(req, res, next) {
  const { password, confirmPassword } = req.body ?? {};

  const errors = collectErrors([
    (!password || !STRONG_PASSWORD_REGEX.test(password)) &&
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.",
    password !== confirmPassword && "Passwords do not match.",
  ]);

  if (errors.length > 0) {
    return next(ApiError.badRequest("Reset password details are invalid", errors));
  }
  return next();
}

export default {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
};
