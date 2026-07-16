import express from "express";
import { login, register , getProfile, deleteUser, verifyOTP, resendOTP, forgotPassword, verifyForgotPassword, resetPassword, updateUser } from "../controllers/auth.controllers.js";

import { protect} from "../middlewares/auth.middleware.js";
import { adminOrUser } from "../middlewares/AdminorUser.middleware.js";
import { validation } from "../middlewares/validation.middleware.js";
import { loginValidation, registerValidation, updateProfileValidation } from "../validators/auth.validator.js";
import upload from "../middlewares/upload.middleware.js";



const router = express.Router();

router.post("/register", upload.single("profile"), validation(registerValidation), register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password", verifyForgotPassword);
router.post("/reset-password", resetPassword);

router.post("/login", validation(loginValidation), login);
router.get("/profile", protect, getProfile);
router.put("/update-User", protect, upload.single("profile"), validation(updateProfileValidation), updateUser);
router.delete("/delete-User", protect, adminOrUser, deleteUser);



export default router;