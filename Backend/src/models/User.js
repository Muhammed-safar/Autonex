import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    profile: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: true, // Users are only created after OTP verification
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);