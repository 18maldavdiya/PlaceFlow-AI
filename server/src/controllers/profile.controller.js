import * as profileService from "../services/profile.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Every handler reads `req.user.id` only — never a param/body-supplied id —
 * so a student can never read or edit another student's profile. Mounted
 * behind `protect` + `authorize("student")` in routes/profile.routes.js.
 */

export const getProfile = asyncHandler(async (req, res) => {
  const data = await profileService.getProfile(req.user.id);
  new ApiResponse(200, data, "Profile fetched.").send(res);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = await profileService.updateProfile(req.user.id, req.body);
  new ApiResponse(200, data, "Profile updated successfully.").send(res);
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest("No image file was provided.");
  }
  const data = await profileService.updateProfileImage(
    req.user.id,
    req.file.filename,
  );
  new ApiResponse(200, data, "Profile photo updated successfully.").send(res);
});

// ---------- Phase 5.2B: Skills / Projects / Experience / Certificates ----------

export const addSkill = asyncHandler(async (req, res) => {
  const data = await profileService.addSkill(req.user.id, req.body);
  new ApiResponse(201, data, "Skill added.").send(res);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const data = await profileService.updateSkill(
    req.user.id,
    req.params.skillId,
    req.body,
  );
  new ApiResponse(200, data, "Skill updated.").send(res);
});

export const deleteSkill = asyncHandler(async (req, res) => {
  const data = await profileService.deleteSkill(req.user.id, req.params.skillId);
  new ApiResponse(200, data, "Skill removed.").send(res);
});

export const addProject = asyncHandler(async (req, res) => {
  const data = await profileService.addProject(req.user.id, req.body);
  new ApiResponse(201, data, "Project added.").send(res);
});

export const updateProject = asyncHandler(async (req, res) => {
  const data = await profileService.updateProject(
    req.user.id,
    req.params.projectId,
    req.body,
  );
  new ApiResponse(200, data, "Project updated.").send(res);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const data = await profileService.deleteProject(
    req.user.id,
    req.params.projectId,
  );
  new ApiResponse(200, data, "Project removed.").send(res);
});

export const addExperience = asyncHandler(async (req, res) => {
  const data = await profileService.addExperience(req.user.id, req.body);
  new ApiResponse(201, data, "Experience added.").send(res);
});

export const updateExperience = asyncHandler(async (req, res) => {
  const data = await profileService.updateExperience(
    req.user.id,
    req.params.experienceId,
    req.body,
  );
  new ApiResponse(200, data, "Experience updated.").send(res);
});

export const deleteExperience = asyncHandler(async (req, res) => {
  const data = await profileService.deleteExperience(
    req.user.id,
    req.params.experienceId,
  );
  new ApiResponse(200, data, "Experience removed.").send(res);
});

export const addCertificate = asyncHandler(async (req, res) => {
  const data = await profileService.addCertificate(req.user.id, req.body);
  new ApiResponse(201, data, "Certificate added.").send(res);
});

export const updateCertificate = asyncHandler(async (req, res) => {
  const data = await profileService.updateCertificate(
    req.user.id,
    req.params.certificateId,
    req.body,
  );
  new ApiResponse(200, data, "Certificate updated.").send(res);
});

export const deleteCertificate = asyncHandler(async (req, res) => {
  const data = await profileService.deleteCertificate(
    req.user.id,
    req.params.certificateId,
  );
  new ApiResponse(200, data, "Certificate removed.").send(res);
});

export default {
  getProfile,
  updateProfile,
  uploadProfileImage,
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
