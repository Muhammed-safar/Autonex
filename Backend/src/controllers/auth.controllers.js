import bcrypt from "bcryptjs";
import PendingRegistration from "../models/PendingRegistration.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateOTP } from "../utils/GenerateOtp.js";
import { sendOTPEmail } from "../Services/mail.service.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, country, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Remove old pending registration if exists
    await PendingRegistration.deleteOne({ email });

    // Hash password
    const hashedPassword = await hashPassword(password);

    const profile = req.file ? req.file.path : null;

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save temporary registration
    await PendingRegistration.create({
      fullName,
      email,
      password: hashedPassword,
      country,
      phone,
      profile : profile,
      otp: hashedOTP,
      lastOtpSentAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pendingUser = await PendingRegistration.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "OTP expired or registration not found",
      });
    }

    // Check OTP attempts
    if (pendingUser.attempts >= 5) {
      await PendingRegistration.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "Too many incorrect attempts. Please register again.",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, pendingUser.otp);

    if (!isMatch) {
      pendingUser.attempts += 1;
      await pendingUser.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Create verified user
    const user = await User.create({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
      country: pendingUser.country,
      phone: pendingUser.phone,
      profile: pendingUser.profile,
      isVerified: true,
    });

    // Delete pending registration
    await PendingRegistration.deleteOne({ email });

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully.",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resendOTP = async (req, res) => {
  try {

    const { email } = req.body;

    const pendingUser = await PendingRegistration.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    // 60-second cooldown
    const secondsPassed =
      (Date.now() - pendingUser.lastOtpSentAt.getTime()) / 1000;

    if (secondsPassed < 60) {

      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil(
          60 - secondsPassed
        )} seconds before requesting another OTP.`,
      });

    }

    const otp = generateOTP();

    pendingUser.otp = await bcrypt.hash(otp, 10);

    pendingUser.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pendingUser.lastOtpSentAt = new Date();

    pendingUser.attempts = 0;

    await pendingUser.save();

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.fullName) updateData.fullName = req.body.fullName;
    if (req.body.country) updateData.country = req.body.country;
    if (req.body.phone) updateData.phone = req.body.phone;

    if (req.file) {
      updateData.profile = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Delete previous OTP if any
    await PendingRegistration.deleteOne({ email });

    // Store OTP temporarily
    await PendingRegistration.create({
      email,
      otp: hashedOTP,
      attempts: 0,
      lastOtpSentAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const verifyForgotPassword = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const pendingUser = await PendingRegistration.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "OTP expired.",
      });
    }

    if (pendingUser.attempts >= 5) {

      await PendingRegistration.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "Too many attempts.",
      });

    }

    const isMatch = await bcrypt.compare(
      otp,
      pendingUser.otp
    );

    if (!isMatch) {

      pendingUser.attempts++;

      await pendingUser.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });

    }

    pendingUser.isOtpVerified = true;

    pendingUser.attempts = 0;

    await pendingUser.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const resetPassword = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find pending verification
    const pendingUser = await PendingRegistration.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Verification not found.",
      });
    }

    // OTP not verified
    if (!pendingUser.isOtpVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify OTP first.",
      });
    }

    // Find actual user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Hash new password
    user.password = await hashPassword(password);

    await user.save();

    // Delete temporary verification
    await PendingRegistration.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};