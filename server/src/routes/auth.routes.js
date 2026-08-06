import { Router } from "express";

import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validateRegisterInput, authController.register);
router.post("/login", validateLoginInput, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);

router.post(
  "/forgot-password",
  validateForgotPasswordInput,
  authController.forgotPassword,
);
router.post(
  "/reset-password/:token",
  validateResetPasswordInput,
  authController.resetPassword,
);
router.get("/verify-email/:token", authController.verifyEmail);

export default router;
