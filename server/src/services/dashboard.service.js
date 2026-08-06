import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { StudentProfile } from "../models/studentProfile.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const REQUIRED_PROFILE_FIELD_LABELS = Object.freeze({
  fullName: "Full name",
  phoneNumber: "Phone number",
  college: "College",
  branch: "Branch",
  semester: "Semester",
});

/**
 * Every dashboard function is scoped to `studentId` and reads only that
 * student's own data — there is no cross-student query anywhere in this
 * file. Profile/Resume/Jobs/Applications modules will layer real writes on
 * top of `StudentProfile`/`Application` later; this file only reads.
 */

async function getOrCreateStudentProfile(studentId) {
  let profile = await StudentProfile.findOne({ user: studentId });
  if (!profile) {
    profile = await StudentProfile.create({ user: studentId });

    // A student's very first dashboard visit gets one real notification
    // instead of an empty panel — not a fake array, an actual document.
    await Notification.create({
      recipient: studentId,
      type: "system",
      message: "Welcome to PlaceFlow AI! Complete your profile to get matched with better opportunities.",
    });
  }
  return profile;
}

export async function getDashboardSummary(studentId) {
  const user = await User.findById(studentId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  const profile = await getOrCreateStudentProfile(studentId);

  const [applications, interviews, offers] = await Promise.all([
    Application.countDocuments({ student: studentId }),
    Application.countDocuments({
      student: studentId,
      "interview.scheduledAt": { $ne: null },
    }),
    Application.countDocuments({ student: studentId, status: "offered" }),
  ]);

  return {
    profile: {
      fullName: user.fullName,
      college: user.college,
      branch: profile.branch,
      semester: profile.semester,
      placementReadinessScore: profile.placementReadinessScore,
    },
    stats: {
      applications,
      interviews,
      offers,
      savedJobs: profile.savedJobs.length,
    },
  };
}

export async function getRecentApplications(studentId, limit = 5) {
  const applications = await Application.find({ student: studentId })
    .sort({ appliedAt: -1 })
    .limit(limit)
    .populate("job", "company role");

  return applications
    .filter((application) => application.job)
    .map((application) => ({
      id: application._id.toString(),
      company: application.job.company,
      role: application.job.role,
      appliedAt: application.appliedAt,
      status: application.status,
    }));
}

export async function getUpcomingInterviews(studentId, limit = 5) {
  const applications = await Application.find({
    student: studentId,
    "interview.scheduledAt": { $ne: null, $gte: new Date() },
    "interview.status": "scheduled",
  })
    .sort({ "interview.scheduledAt": 1 })
    .limit(limit)
    .populate("job", "company role");

  return applications
    .filter((application) => application.job)
    .map((application) => ({
      id: application._id.toString(),
      company: application.job.company,
      role: application.job.role,
      interviewAt: application.interview.scheduledAt,
      mode: application.interview.mode,
      status: application.interview.status,
    }));
}

export async function getRecommendedJobs(studentId, limit = 6) {
  const profile = await StudentProfile.findOne({ user: studentId });
  const savedJobIds = new Set(
    (profile?.savedJobs ?? []).map((id) => id.toString()),
  );

  // Simple recency-based listing, not real matching — that's the AI
  // module's job, explicitly out of scope here.
  const jobs = await Job.find({ isActive: true })
    .sort({ postedAt: -1 })
    .limit(limit);

  return jobs.map((job) => ({
    id: job._id.toString(),
    company: job.company,
    role: job.role,
    location: job.location,
    salaryRange: job.salaryRange,
    eligibility: job.eligibility,
    isSaved: savedJobIds.has(job._id.toString()),
  }));
}

export async function getNotifications(studentId, limit = 5) {
  const notifications = await Notification.find({ recipient: studentId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return notifications.map((notification) => ({
    id: notification._id.toString(),
    type: notification.type,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  }));
}

export async function getProfileCompletion(studentId) {
  const user = await User.findById(studentId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  const profile = await getOrCreateStudentProfile(studentId);

  const values = {
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    college: user.college,
    branch: profile.branch,
    semester: profile.semester,
  };

  const missingFields = Object.entries(values)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([key]) => REQUIRED_PROFILE_FIELD_LABELS[key]);

  const totalFields = Object.keys(values).length;
  const completedFields = totalFields - missingFields.length;
  const percentage = Math.round((completedFields / totalFields) * 100);

  return { percentage, missingFields };
}

export default {
  getDashboardSummary,
  getRecentApplications,
  getUpcomingInterviews,
  getRecommendedJobs,
  getNotifications,
  getProfileCompletion,
};
