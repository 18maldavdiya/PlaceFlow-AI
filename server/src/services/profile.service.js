import fs from "node:fs";
import path from "node:path";

import { UPLOADS_DIR } from "../config/multer.js";
import { Notification } from "../models/notification.model.js";
import { StudentProfile } from "../models/studentProfile.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Fields the student can edit through PUT /profile — everything else on
 * the document (placementReadinessScore, savedJobs, soft-delete fields) is
 * either owned by another module or read-only here.
 */
const EDITABLE_FIELDS = [
  "firstName",
  "lastName",
  "phoneNumber",
  "gender",
  "dateOfBirth",
  "address",
  "city",
  "state",
  "country",
  "pincode",
  "collegeName",
  "university",
  "degree",
  "branch",
  "semester",
  "cgpa",
  "graduationYear",
  "enrollmentNumber",
  "studentId",
];

/**
 * Comprehensive completeness check across the full Personal + Academic
 * field set introduced in Phase 5.2A. Deliberately separate from
 * dashboard.service.js's own `getProfileCompletion` (5 core fields,
 * unchanged) — that function lives in the locked Dashboard module and
 * can't be edited or imported from here (it isn't exported), so this is a
 * parallel, wider calculation scoped to the Profile page rather than a
 * blind duplicate of it.
 */
const COMPLETION_FIELD_LABELS = Object.freeze({
  firstName: "First name",
  lastName: "Last name",
  phoneNumber: "Phone number",
  gender: "Gender",
  dateOfBirth: "Date of birth",
  address: "Address",
  city: "City",
  state: "State",
  country: "Country",
  collegeName: "College name",
  degree: "Degree",
  branch: "Branch",
  semester: "Semester",
  cgpa: "CGPA",
  graduationYear: "Graduation year",
});

/**
 * Finds a student's profile, creating a blank one on first visit — to
 * either this page or the Dashboard, whichever the student reaches first.
 * Seeds first/last name and college from the User record (registration-time
 * values) purely as friendly form defaults; nothing here writes back to
 * User. Mirrors dashboard.service.js's own lazy-create (which isn't
 * exported, so can't be reused directly) including the one-time welcome
 * notification, so that notification fires exactly once regardless of
 * which module the student opens first.
 */
async function getOrCreateStudentProfile(studentId) {
  let profile = await StudentProfile.findOne({ user: studentId });
  if (!profile) {
    const user = await User.findById(studentId);
    const [firstName = "", ...rest] = (user?.fullName ?? "").trim().split(/\s+/);

    profile = await StudentProfile.create({
      user: studentId,
      firstName,
      lastName: rest.join(" "),
      phoneNumber: user?.phoneNumber ?? "",
      collegeName: user?.college ?? "",
    });

    await Notification.create({
      recipient: studentId,
      type: "system",
      message:
        "Welcome to PlaceFlow AI! Complete your profile to get matched with better opportunities.",
    });
  }
  return profile;
}

function computeCompletion(profile) {
  const missingFields = Object.entries(COMPLETION_FIELD_LABELS)
    .filter(([field]) => {
      const value = profile[field];
      return value === undefined || value === null || value === "";
    })
    .map(([, label]) => label);

  const total = Object.keys(COMPLETION_FIELD_LABELS).length;
  const percentage = Math.round(((total - missingFields.length) / total) * 100);
  return { percentage, missingFields };
}

function serializeProfile(user, profile) {
  return {
    fullName: user.fullName,
    email: user.email,
    personal: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth
        ? profile.dateOfBirth.toISOString().split("T")[0]
        : "",
      address: profile.address,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      pincode: profile.pincode,
    },
    academic: {
      collegeName: profile.collegeName,
      university: profile.university,
      degree: profile.degree,
      branch: profile.branch,
      semester: profile.semester,
      cgpa: profile.cgpa,
      graduationYear: profile.graduationYear,
      enrollmentNumber: profile.enrollmentNumber,
      studentId: profile.studentId,
    },
    profileImageUrl: profile.profileImage
      ? `/profile/image/${profile.profileImage}`
      : null,
    placementReadinessScore: profile.placementReadinessScore,
    completion: computeCompletion(profile),
  };
}

export async function getProfile(studentId) {
  const user = await User.findById(studentId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  const profile = await getOrCreateStudentProfile(studentId);
  return serializeProfile(user, profile);
}

export async function updateProfile(studentId, payload) {
  const user = await User.findById(studentId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  const profile = await getOrCreateStudentProfile(studentId);

  EDITABLE_FIELDS.forEach((field) => {
    if (payload[field] === undefined) return;
    if (field === "semester" || field === "cgpa" || field === "graduationYear") {
      profile[field] = payload[field] === "" ? null : Number(payload[field]);
    } else if (field === "dateOfBirth") {
      profile[field] = payload[field] === "" ? null : payload[field];
    } else {
      profile[field] = payload[field];
    }
  });

  await profile.save();
  return serializeProfile(user, profile);
}

export async function updateProfileImage(studentId, filename) {
  const user = await User.findById(studentId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  const profile = await getOrCreateStudentProfile(studentId);
  const previousImage = profile.profileImage;

  profile.profileImage = filename;
  await profile.save();

  if (previousImage) {
    fs.unlink(path.join(UPLOADS_DIR, previousImage), () => {
      // Best-effort cleanup — an already-missing old file isn't an error
      // worth surfacing to the request that just successfully replaced it.
    });
  }

  return serializeProfile(user, profile);
}

export default { getProfile, updateProfile, updateProfileImage };
