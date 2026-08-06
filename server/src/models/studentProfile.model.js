import mongoose from "mongoose";

import { applySoftDelete } from "./softDeletePlugin.js";

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

export const GENDER_VALUES = Object.freeze([
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

/**
 * Extends a student's `User` document with academic/placement/profile
 * fields the Authentication module deliberately doesn't own (User is
 * locked — see server/src/models/user.model.js). One document per student,
 * created lazily on first dashboard or profile visit.
 *
 * Phase 5.2A (Student Profile Foundation) added everything from `firstName`
 * through `profileImage` below — `branch`, `semester`,
 * `placementReadinessScore`, and `savedJobs` predate it and are untouched.
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
