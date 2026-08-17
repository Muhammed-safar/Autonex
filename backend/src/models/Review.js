import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Proof of purchase — verified server-side:
        // 1. belongs to this user
        // 2. contains this product in items[].productId
        // 3. orderStatus === "DELIVERED"
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must not exceed 5"],
        },

        comment: {
            type: String,
            trim: true,
            minlength: [10, "Comment must be at least 10 characters"],
            maxlength: [1000, "Comment must not exceed 1000 characters"],
        },

        // Set to true when user edits their review after creation
        isEdited: {
            type: Boolean,
            default: false,
        },

        // Admin moderation toggle — false hides from public but keeps in DB
        isVisible: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Compound unique: database-level enforcement of one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Fast public product review listing (visible reviews, newest first)
reviewSchema.index({ product: 1, isVisible: 1, createdAt: -1 });

// Fast "my reviews" user profile queries
reviewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);