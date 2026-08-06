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

export default { getProfile, updateProfile, uploadProfileImage };
