import express from "express";

import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getAllUsers,
  getUserById,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { ownerOrAdmin } from "../middlewares/userOrAdmin.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  emailValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  updateProfileValidation,
  verifyOtpValidation,
} from "../validators/auth.validator.js";
import {
  otpLimiter,
  loginLimiter,
  registerLimiter,
  verifyOtpLimiter,
  uploadLimiter,
  forgotPasswordLimiter,
} from "../middlewares/rateLimiter.js";
import { profileUpload } from "../middlewares/multer/types.multer.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  profileUpload.single("profile"),
  validate(registerValidation),
  register,
);

router.post("/resend-otp", otpLimiter, validate(emailValidation), resendOTP);

router.post(
  "/verify-otp",
  verifyOtpLimiter,
  validate(verifyOtpValidation),
  verifyOTP,
);

router.post("/login", loginLimiter, validate(loginValidation), login);

router.get("/profile", protect, getProfile);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(emailValidation),
  forgotPassword,
);
router.post(
  "/verify-forgot-password",
  otpLimiter,
  validate(verifyOtpValidation),
  verifyForgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordValidation),
  resetPassword,
);

router.put(
  "/updateUser",
  protect,
  uploadLimiter,
  profileUpload.single("profile"),
  validate(updateProfileValidation),
  updateProfile,
);

router.post("/refresh", refreshToken);

router.post("/logout", protect, logout);

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/:id", protect, adminOnly, getUserById);

router.delete("/delete", protect, deleteUser);

export default router;
