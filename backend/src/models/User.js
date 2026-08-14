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
      minlength: 10,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    country: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    profile: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user", "employee"],
      default: "user",
    },
    preferredCurrency: {
      type: String,
      enum: ["USD", "EUR",  "INR"],
      default: "INR",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
