import mongoose from "mongoose";

import { applySoftDelete } from "./softDeletePlugin.js";

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

export const GENDER_VALUES = Object.freeze([
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

export const SKILL_CATEGORIES = Object.freeze([
  "programming_languages",
  "frameworks",
  "libraries",
  "databases",
  "tools",
  "operating_systems",
  "soft_skills",
  "languages_known",
]);

export const INTERNSHIP_TYPES = Object.freeze([
  "internship",
  "full_time",
  "part_time",
  "contract",
  "freelance",
]);

/**
 * Skills, projects, experience, and certificates are small, bounded lists
 * always read and written as a unit with the profile they belong to — the
 * textbook case for embedding rather than a separate collection (see the
 * Phase 1 blueprint's MongoDB modeling guidance). Each gets its own `_id`
 * (Mongoose does this automatically for subdocuments) so
 * PUT/DELETE /profile/<section>/:id can target one entry without touching
 * the rest.
 */
const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: { values: SKILL_CATEGORIES, message: "Select a valid skill category" },
      required: [true, "Skill category is required"],
    },
    name: { type: String, trim: true, required: [true, "Skill name is required"], maxlength: 60 },
  },
  { timestamps: true },
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: [true, "Project title is required"], maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    technologies: [{ type: String, trim: true, maxlength: 40 }],
    githubUrl: { type: String, trim: true, default: "" },
    liveUrl: { type: String, trim: true, default: "" },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true, required: [true, "Company is required"], maxlength: 150 },
    role: { type: String, trim: true, required: [true, "Role is required"], maxlength: 100 },
    location: { type: String, trim: true, maxlength: 100, default: "" },
    internshipType: {
      type: String,
      enum: { values: INTERNSHIP_TYPES, message: "Select a valid internship type" },
      required: [true, "Internship type is required"],
    },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: true },
);

const certificateSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, "Certificate name is required"], maxlength: 150 },
    issuer: { type: String, trim: true, required: [true, "Issuer is required"], maxlength: 150 },
    issueDate: { type: Date, required: [true, "Issue date is required"] },
    expiryDate: { type: Date, default: null },
    credentialId: { type: String, trim: true, maxlength: 100, default: "" },
    certificateUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

/**
 * Extends a student's `User` document with academic/placement/profile
 * fields the Authentication module deliberately doesn't own (User is
 * locked — see server/src/models/user.model.js). One document per student,
 * created lazily on first dashboard or profile visit.
 *
 * Phase 5.2A (Student Profile Foundation) added everything from `firstName`
 * through `profileImage` below — `branch`, `semester`,
 * `placementReadinessScore`, and `savedJobs` predate it and are untouched.
 * Phase 5.2B added `skills`, `projects`, `experience`, and `certificates` —
 * `firstName` through `profileImage` (Personal + Academic Information) are
 * now locked too and untouched here.
 */
const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: String,
      trim: true,
      default: "",
    },
    semester: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
    },
    placementReadinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    // ---------- Personal information ----------
    firstName: { type: String, trim: true, maxlength: 60, default: "" },
    lastName: { type: String, trim: true, maxlength: 60, default: "" },
    phoneNumber: {
      type: String,
      trim: true,
      match: [PHONE_REGEX, "Enter a valid phone number"],
      default: "",
    },
    gender: {
      type: String,
      enum: { values: GENDER_VALUES, message: "Select a valid gender" },
      default: null,
    },
    dateOfBirth: { type: Date, default: null },
    address: { type: String, trim: true, maxlength: 250, default: "" },
    city: { type: String, trim: true, maxlength: 100, default: "" },
    state: { type: String, trim: true, maxlength: 100, default: "" },
    country: { type: String, trim: true, maxlength: 100, default: "" },
    pincode: { type: String, trim: true, maxlength: 12, default: "" },

    // ---------- Academic information ----------
    collegeName: { type: String, trim: true, maxlength: 150, default: "" },
    university: { type: String, trim: true, maxlength: 150, default: "" },
    degree: { type: String, trim: true, maxlength: 100, default: "" },
    cgpa: { type: Number, min: 0, max: 10, default: null },
    graduationYear: { type: Number, default: null },
    enrollmentNumber: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },
    studentId: { type: String, trim: true, maxlength: 50, default: "" },

    // ---------- Profile photo ----------
    // Stores only the uploaded filename (served by GET /profile/image/:filename,
    // see routes/profile.routes.js) — not a full URL, so swapping this for
    // Cloudinary later only touches the service layer, not stored data.
    profileImage: { type: String, trim: true, default: "" },

    // ---------- Skills / Projects / Experience / Certificates (Phase 5.2B) ----------
    skills: [skillSchema],
    projects: [projectSchema],
    experience: [experienceSchema],
    certificates: [certificateSchema],
  },
  { timestamps: true },
);

studentProfileSchema.plugin(applySoftDelete);
studentProfileSchema.index({ user: 1 }, { unique: true });

export const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema,
);
export default StudentProfile;
