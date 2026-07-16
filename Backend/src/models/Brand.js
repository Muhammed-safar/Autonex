import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    logo: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/i],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

brandSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);

// Generate/refresh slug whenever the name changes
brandSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

brandSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update?.name) {
    update.slug = slugify(update.name, {
      lower: true,
      strict: true,
    });
  }
});

export default mongoose.model("Brand", brandSchema);