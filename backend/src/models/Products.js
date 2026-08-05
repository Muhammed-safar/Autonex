import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    size: String,

    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "INR"],
      default: "USD",
      immutable: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    totalSold: {
      type: Number,
      default: 0,
    },

    displayPriority: {
      type: Number,
      default: 0,
    },

    images: [
      {
        url: String,
        publicId: String,
        alt: String,
      },
    ],

    variants: [variantSchema],

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
