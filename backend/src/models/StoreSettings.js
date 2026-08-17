import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
  {
    defaultCurrency: {
      type: String,
      enum: ["USD", "INR", "EUR"],
      default: "INR",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("StoreSettings", storeSettingsSchema);