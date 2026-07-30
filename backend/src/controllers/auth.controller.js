import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import PendingRegistration from "../models/PendingRegistration.js";
import User from "../models/User.js";
import { sendOTPEmail } from "../services/mail.service.js";
import { generateOTP } from "../utils/generateOTP.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

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

    const hashedPassword = await hashPassword(password);

    const profile = req.file ? req.file.path : "";

    const otp = generateOTP();

    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save temporary registration
    await PendingRegistration.create({
      fullName,
      email,
      password: hashedPassword,
      country,
      phone,
      profile: profile,
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
          60 - secondsPassed,
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

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pendingUser = await PendingRegistration.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Check expiration
    if (pendingUser.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, pendingUser.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Create actual user
    const user = await User.create({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
      country: pendingUser.country,
      phone: pendingUser.phone,
      profile: pendingUser.profile,
      isVerified: true,
    });

    // Delete temporary record
    await PendingRegistration.deleteOne({
      email,
    });

    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      safeUser,
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

    const user = await User.findOne({ email });

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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = await bcrypt.hash(refreshToken, 10);

    await user.save();

    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
      safeUser,
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
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
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

    const isMatch = await bcrypt.compare(otp, pendingUser.otp);

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

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update text fields
    if (req.body.fullName !== undefined) user.fullName = req.body.fullName;

    if (req.body.country !== undefined) user.country = req.body.country;

    if (req.body.phone !== undefined) user.phone = req.body.phone;

    // Remove profile image
    if (req.body.removeProfile === "true" || req.body.removeProfile === true) {
      if (user.profile?.publicId) {
        await deleteFromCloudinary(user.profile.publicId);
      }

      user.profile = {
        url: "",
        publicId: "",
      };
    }

    // Upload new profile image
    else if (req.file) {
      if (user.profile?.publicId) {
        await deleteFromCloudinary(user.profile.publicId);
      }

      const image = await uploadToCloudinary(req.file.path, "profiles");

      user.profile = image;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.refreshToken;
    x;
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Rotate tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = await bcrypt.hash(newRefreshToken, 10);

    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      // message: "Invalid or expired refresh token",
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        );

        const user = await User.findById(decoded.id);

        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch (_) {
        // Ignore invalid or expired refresh tokens
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const { search = "" } = req.query;

    let filter = {};

    if (search.trim()) {
      const keyword = search.trim();

      // Search by ID or Name
      filter = mongoose.Types.ObjectId.isValid(keyword)
        ? {
            $or: [
              { _id: keyword },
              { fullName: { $regex: keyword, $options: "i" } },
            ],
          }
        : {
            fullName: { $regex: keyword, $options: "i" },
          };
    }

    const [users, totalUsers, activeUsers, verifiedUsers, adminUsers] =
      await Promise.all([
        User.find(filter)
          .select("-password -refreshToken")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        User.countDocuments(filter),

        User.countDocuments({ ...filter, isActive: true }),

        User.countDocuments({ ...filter, isVerified: true }),

        User.countDocuments({ ...filter, role: "admin" }),
      ]);

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        verifiedUsers,
        adminUsers,
      },

      pagination: {
        total: totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
      },

      data: users,
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
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profile) {
      try {
        await fs.unlink(path.join(process.cwd(), user.profile));
      } catch (_) {}
    }

    // Invalidate refresh token
    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
