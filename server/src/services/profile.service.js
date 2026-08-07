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

    // ---------- Phase 5.2B ----------
    skills: profile.skills.map(serializeSkill),
    projects: profile.projects.map(serializeProject),
    experience: profile.experience.map(serializeExperience),
    certificates: profile.certificates.map(serializeCertificate),
  };
}

function toDateOnly(date) {
  return date ? date.toISOString().split("T")[0] : null;
}

function serializeSkill(skill) {
  return {
    id: skill._id.toString(),
    category: skill.category,
    name: skill.name,
  };
}

function serializeProject(project) {
  return {
    id: project._id.toString(),
    title: project.title,
    description: project.description,
    technologies: project.technologies,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    startDate: toDateOnly(project.startDate),
    endDate: toDateOnly(project.endDate),
    isCurrent: project.isCurrent,
  };
}

function serializeExperience(experience) {
  return {
    id: experience._id.toString(),
    company: experience.company,
    role: experience.role,
    location: experience.location,
    internshipType: experience.internshipType,
    startDate: toDateOnly(experience.startDate),
    endDate: toDateOnly(experience.endDate),
    isCurrent: experience.isCurrent,
    description: experience.description,
  };
}

function serializeCertificate(certificate) {
  return {
    id: certificate._id.toString(),
    name: certificate.name,
    issuer: certificate.issuer,
    issueDate: toDateOnly(certificate.issueDate),
    expiryDate: toDateOnly(certificate.expiryDate),
    credentialId: certificate.credentialId,
    certificateUrl: certificate.certificateUrl,
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

// ---------- Skills (Phase 5.2B) ----------

function assertNoDuplicateSkill(profile, { category, name }, excludeId = null) {
  const normalized = name.trim().toLowerCase();
  const isDuplicate = profile.skills.some(
    (skill) =>
      (!excludeId || skill._id.toString() !== excludeId) &&
      skill.category === category &&
      skill.name.trim().toLowerCase() === normalized,
  );
  if (isDuplicate) {
    throw ApiError.conflict("You've already added this skill.");
  }
}

export async function addSkill(studentId, { category, name }) {
  const user = await User.findById(studentId);
  if (!user) throw ApiError.notFound("User not found.");
  const profile = await getOrCreateStudentProfile(studentId);

  assertNoDuplicateSkill(profile, { category, name });
  profile.skills.push({ category, name: name.trim() });
  await profile.save();
  return serializeProfile(user, profile);
}

export async function updateSkill(studentId, skillId, { category, name }) {
  const user = await User.findById(studentId);
  if (!user) throw ApiError.notFound("User not found.");
  const profile = await getOrCreateStudentProfile(studentId);

  const skill = profile.skills.id(skillId);
  if (!skill) throw ApiError.notFound("Skill not found.");

  assertNoDuplicateSkill(profile, { category, name }, skillId);
  skill.category = category;
  skill.name = name.trim();
  await profile.save();
  return serializeProfile(user, profile);
}

export async function deleteSkill(studentId, skillId) {
  const user = await User.findById(studentId);
  if (!user) throw ApiError.notFound("User not found.");
  const profile = await getOrCreateStudentProfile(studentId);

  const skill = profile.skills.id(skillId);
  if (!skill) throw ApiError.notFound("Skill not found.");
  skill.deleteOne();
  await profile.save();
  return serializeProfile(user, profile);
}

// ---------- Generic embedded-list CRUD (Projects / Experience / Certificates) ----------
// Shared plumbing for three sections that are shaped identically at the
// data-access level (an embedded array on StudentProfile, addressed by
// subdocument _id) — only the field whitelist and business rules differ.

function pickFields(payload, fields) {
  const result = {};
  fields.forEach((field) => {
    if (payload[field] !== undefined) result[field] = payload[field];
  });
  return result;
}

async function addEntry(studentId, listField, data) {
  const user = await User.findById(studentId);
  if (!user) throw ApiError.notFound("User not found.");
  const profile = await getOrCreateStudentProfile(studentId);
  profile[listField].push(data);
  await profile.save();
  return serializeProfile(user, profile);
}

async function updateEntry(studentId, listField, entryId, data) {
  const user = await User.findById(studentId);
  if (!user) throw ApiError.notFound("User not found.");
  const profile = await getOrCreateStudentProfile(studentId);
  const entry = profile[listField].id(entryId);
  if (!entry) throw ApiError.notFound("Entry not found.");
  Object.assign(entry, data);
  await profile.save();
  return serializeProfile(user, profile);
}

async function deleteEntry(studentId, listField, entryId) {
  const user = await User.findById(studentId);
  if (!user) throw ApiError.notFound("User not found.");
  const profile = await getOrCreateStudentProfile(studentId);
  const entry = profile[listField].id(entryId);
  if (!entry) throw ApiError.notFound("Entry not found.");
  entry.deleteOne();
  await profile.save();
  return serializeProfile(user, profile);
}

/** A project/experience entry marked "current" never keeps a stored end date. */
function normalizeDateRange(fields) {
  if (fields.isCurrent) {
    fields.endDate = null;
  } else if (fields.endDate === "") {
    fields.endDate = null;
  }
  return fields;
}

// ---------- Projects ----------

const PROJECT_FIELDS = [
  "title",
  "description",
  "technologies",
  "githubUrl",
  "liveUrl",
  "startDate",
  "endDate",
  "isCurrent",
];

export async function addProject(studentId, payload) {
  const fields = normalizeDateRange(pickFields(payload, PROJECT_FIELDS));
  return addEntry(studentId, "projects", fields);
}

export async function updateProject(studentId, projectId, payload) {
  const fields = normalizeDateRange(pickFields(payload, PROJECT_FIELDS));
  return updateEntry(studentId, "projects", projectId, fields);
}

export async function deleteProject(studentId, projectId) {
  return deleteEntry(studentId, "projects", projectId);
}

// ---------- Experience ----------

const EXPERIENCE_FIELDS = [
  "company",
  "role",
  "location",
  "internshipType",
  "startDate",
  "endDate",
  "isCurrent",
  "description",
];

export async function addExperience(studentId, payload) {
  const fields = normalizeDateRange(pickFields(payload, EXPERIENCE_FIELDS));
  return addEntry(studentId, "experience", fields);
}

export async function updateExperience(studentId, experienceId, payload) {
  const fields = normalizeDateRange(pickFields(payload, EXPERIENCE_FIELDS));
  return updateEntry(studentId, "experience", experienceId, fields);
}

export async function deleteExperience(studentId, experienceId) {
  return deleteEntry(studentId, "experience", experienceId);
}

// ---------- Certificates ----------

const CERTIFICATE_FIELDS = [
  "name",
  "issuer",
  "issueDate",
  "expiryDate",
  "credentialId",
  "certificateUrl",
];

export async function addCertificate(studentId, payload) {
  const fields = pickFields(payload, CERTIFICATE_FIELDS);
  if (fields.expiryDate === "") fields.expiryDate = null;
  return addEntry(studentId, "certificates", fields);
}

export async function updateCertificate(studentId, certificateId, payload) {
  const fields = pickFields(payload, CERTIFICATE_FIELDS);
  if (fields.expiryDate === "") fields.expiryDate = null;
  return updateEntry(studentId, "certificates", certificateId, fields);
}

export async function deleteCertificate(studentId, certificateId) {
  return deleteEntry(studentId, "certificates", certificateId);
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

export default {
  getProfile,
  updateProfile,
  updateProfileImage,
  addSkill,
  updateSkill,
  deleteSkill,
  addProject,
  updateProject,
  deleteProject,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate,
};
