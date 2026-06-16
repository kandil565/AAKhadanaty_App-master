import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    services: {
      type: [String],
      enum: ["ac", "plumbing", "cleaning", "electrical"],
      required: [true, "Please provide at least one service"],
    },
    city: {
      type: String,
      required: [true, "Please provide a city"],
      default: "Cairo",
    },
    experience: {
      type: Number,
      default: 1, // years
      min: 0,
    },
    bio: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Virtual to populate user info
serviceProviderSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

serviceProviderSchema.set("toJSON", { virtuals: true });
serviceProviderSchema.set("toObject", { virtuals: true });

// Indexes
serviceProviderSchema.index({ services: 1 });
serviceProviderSchema.index({ averageRating: -1 });
serviceProviderSchema.index({ city: 1 });

export default mongoose.model("ServiceProvider", serviceProviderSchema);
