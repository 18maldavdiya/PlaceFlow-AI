import express, { Router } from "express";
import multer from "multer";

import * as profileController from "../controllers/profile.controller.js";
import { UPLOADS_DIR, profileImageUpload } from "../config/multer.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { validateUpdateProfileInput } from "../validators/profile.validator.js";

const router = Router();

/**
 * Public read access to uploaded profile photos — same trust model as any
 * avatar URL (Gravatar, etc.): the filename embeds the user id and a
 * timestamp, isn't guessable, and a profile photo isn't sensitive data on
 * its own. Registered before the `protect` gate below so <img> tags never
 * need to carry auth. multer only serves GET/HEAD here — POST /image below
 * still reaches the upload handler.
 */
router.use("/image", express.static(UPLOADS_DIR));

router.use(protect, authorize("student"));

router.get("/", profileController.getProfile);
router.put("/", validateUpdateProfileInput, profileController.updateProfile);

/**
 * Translates multer's own error shape (e.g. file-too-large) into the app's
 * ApiError convention locally, scoped to this one route — errorHandler.js
 * itself is locked and untouched.
 */
function handleProfileImageUpload(req, res, next) {
  profileImageUpload.single("profileImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image must be 2MB or smaller."
          : err.message;
      return next(ApiError.badRequest(message));
    }
    if (err) return next(err);
    return next();
  });
}

router.post("/image", handleProfileImageUpload, profileController.uploadProfileImage);

export default router;
