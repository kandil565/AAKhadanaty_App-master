import express from "express";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc  Add a review
// @route POST /api/reviews
router.post("/", protect, async (req, res) => {
  try {
    const { providerId, bookingId, rating, comment } = req.body;

    if (!providerId || !bookingId || !rating) {
      return res.status(400).json({ success: false, message: "providerId, bookingId, and rating are required" });
    }

    // Verify booking belongs to user and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    if (booking.status !== "completed") {
      return res.status(400).json({ success: false, message: "Can only review completed bookings" });
    }
    if (booking.isReviewed) {
      return res.status(400).json({ success: false, message: "This booking has already been reviewed" });
    }

    const review = await Review.create({
      userId: req.user.id,
      providerId,
      bookingId,
      rating,
      comment: comment || "",
    });

    // Mark booking as reviewed
    await Booking.findByIdAndUpdate(bookingId, { isReviewed: true });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "You already reviewed this booking" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Get reviews for a provider
// @route GET /api/reviews/provider/:providerId
router.get("/provider/:providerId", async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
