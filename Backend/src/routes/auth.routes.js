import express from "express";

import {
  register,
  login,
  getProfile,
  updateUser,
  deleteUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
} from "../controllers/auth.controllers.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOrUser } from "../middlewares/AdminorUser.middleware.js";
import { validation } from "../middlewares/validation.middleware.js";
import {
  emailValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  updateProfileValidation,
  verifyOtpValidation,
} from "../validators/auth.validator.js";
import { forgotPasswordLimiter, loginLimiter, otpLimiter, registerLimiter, uploadLimiter, verifyOtpLimiter } from "../middlewares/rateLimit.middleware.js";
import { profileUpload } from "../middlewares/types.multer.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  profileUpload.single("profile"),
  validation(registerValidation),
  register,
);

router.post("/resend-otp", otpLimiter, validation(emailValidation), resendOTP);

router.post(
  "/verify-otp",
  verifyOtpLimiter,
  validation(verifyOtpValidation),
  verifyOTP,
);

router.post("/login",loginLimiter, validation(loginValidation), login);

router.get("/profile", protect, getProfile);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validation(emailValidation),
  forgotPassword,
);
router.post(
  "/verify-forgot-password",
  otpLimiter,
  validation(verifyOtpValidation),
  verifyForgotPassword,
);
router.post(
  "/reset-password",
  validation(resetPasswordValidation),
  resetPassword,
);

router.put(
  "/updateUser",
  protect,
  uploadLimiter,
  profileUpload.single("profile"),
  validation(updateProfileValidation),
  updateUser,
);

router.delete("/delete", protect, deleteUser);

export default router;