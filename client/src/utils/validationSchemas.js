import { z } from "zod";

import { PUBLIC_REGISTRATION_ROLES } from "@/constants/app";

/**
 * Zod schemas for the authentication forms and the Student Profile forms.
 * Mirrors the rules enforced server-side in
 * server/src/validators/auth.validator.js and
 * server/src/validators/profile.validator.js — client-side validation is
 * purely a UX layer; the API re-validates everything and is the actual
 * source of truth.
 */

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    STRONG_PASSWORD_REGEX,
    "Include an uppercase letter, a lowercase letter, a number, and a symbol",
  );

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters"),
    email: emailField,
    phoneNumber: z
      .string()
      .trim()
      .regex(PHONE_REGEX, "Enter a valid phone number"),
    // Only the roles the public endpoint accepts — Admin/TPO registration
    // is rejected server-side with a 403 regardless, but there's no reason
    // to offer them in the form or let a hand-crafted request past client
    // validation only to bounce off the API.
    role: z.enum(PUBLIC_REGISTRATION_ROLES, {
      errorMap: () => ({ message: "Select a role" }),
    }),
    college: z.string().trim().max(150).optional().or(z.literal("")),
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---------- Student Profile (Phase 5.2A) ----------

const CURRENT_YEAR = new Date().getFullYear();

/** Treats an empty string (an untouched number input) as "not provided" rather than 0. */
function optionalNumber(schema) {
  return z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : val,
    schema.optional(),
  );
}

export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Enter a valid phone number"),
  gender: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  address: z.string().trim().max(250).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  pincode: z.string().trim().max(12).optional().or(z.literal("")),
});

export const academicInfoSchema = z.object({
  collegeName: z.string().trim().min(2, "College name is required"),
  university: z.string().trim().max(150).optional().or(z.literal("")),
  degree: z.string().trim().min(2, "Degree is required"),
  branch: z.string().trim().min(2, "Branch is required"),
  semester: optionalNumber(
    z.coerce
      .number()
      .min(1, "Semester must be between 1 and 12")
      .max(12, "Semester must be between 1 and 12"),
  ),
  cgpa: optionalNumber(
    z.coerce
      .number()
      .min(0, "CGPA must be between 0 and 10")
      .max(10, "CGPA must be between 0 and 10"),
  ),
  graduationYear: z.coerce
    .number({ invalid_type_error: "Enter a valid graduation year" })
    .min(1950, "Enter a valid graduation year")
    .max(CURRENT_YEAR + 10, "Enter a valid graduation year"),
  enrollmentNumber: z.string().trim().max(50).optional().or(z.literal("")),
  studentId: z.string().trim().max(50).optional().or(z.literal("")),
});
