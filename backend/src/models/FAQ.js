import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster loading
faqSchema.index({ isActive: 1, order: 1 });
faqSchema.index({ category: 1 });

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;