import express from "express";
import ServiceProvider from "../models/ServiceProvider.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @desc  Get all service providers (public)
// @route GET /api/providers
router.get("/", async (req, res) => {
  try {
    const { service, city, sort } = req.query;
    let query = { isActive: true };
    if (service) query.services = { $in: [service] };
    if (city) query.city = new RegExp(city, "i");

    let sortOption = {};
    if (sort === "rating") sortOption = { averageRating: -1 };
    else if (sort === "experience") sortOption = { experience: -1 };

    const providers = await ServiceProvider.find(query)
      .populate("userId", "name profileImage")
      .sort(sortOption)
      .lean();

    res.json({ success: true, count: providers.length, data: providers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Get single provider
// @route GET /api/providers/:id
router.get("/:id", async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate("userId", "name profileImage bio")
      .lean();
    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });

    const reviews = await Review.find({ providerId: req.params.id })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ success: true, data: { ...provider, reviews } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Update provider profile
// @route PUT /api/providers/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });

    // Only owner or admin can update
    if (provider.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const allowedFields = ["services", "city", "experience", "bio", "profileImage"];
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) provider[f] = req.body[f];
    });

    await provider.save();
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Get provider orders
// @route GET /api/providers/:id/orders
router.get("/:id/orders", protect, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });

    if (provider.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { status } = req.query;
    let query = { providerId: req.params.id };
    if (status) query.status = status;

    const orders = await Booking.find(query)
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Get my provider profile (logged in provider)
// @route GET /api/providers/me/profile
router.get("/me/profile", protect, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.id })
      .populate("userId", "name email phone")
      .lean();
    if (!provider) return res.status(404).json({ success: false, message: "No provider profile found" });
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
