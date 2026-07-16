import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    fullName: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: String,

    country: String,

    phone: Number,

    profile: {
      type: String,
      default: null,
    },

    otp: String,

    attempts: {
      type: Number,
      default: 0,
    },
    lastOtpSentAt: {
      type: Date,
      default: Date.now,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("PendingRegistration", pendingRegistrationSchema);
