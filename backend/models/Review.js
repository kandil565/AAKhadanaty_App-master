import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

// One review per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({ providerId: 1 });
reviewSchema.index({ userId: 1 });

// After saving, update provider's average rating
reviewSchema.post("save", async function () {
  try {
    const ServiceProvider = mongoose.model("ServiceProvider");
    const reviews = await mongoose.model("Review").find({ providerId: this.providerId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await ServiceProvider.findByIdAndUpdate(this.providerId, {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (err) {
    console.error("Error updating provider rating:", err);
  }
});

export default mongoose.model("Review", reviewSchema);
