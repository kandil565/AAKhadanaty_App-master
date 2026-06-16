import express from "express";
import User from "../models/User.js";
import ServiceProvider from "../models/ServiceProvider.js";
import Booking from "../models/Booking.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require auth and admin role
const adminProtect = [protect, authorize("admin")];

// @desc  Get dashboard statistics
// @route GET /api/admin/stats
router.get("/stats", adminProtect, async (req, res) => {
  try {
    const [totalUsers, totalProviders, totalBookings, completedBookings] = await Promise.all([
      User.countDocuments({ role: "user" }),
      ServiceProvider.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "completed" }),
    ]);

    const revenueResult = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalBookings,
        completedBookings,
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Get all users
// @route GET /api/admin/users
router.get("/users", adminProtect, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["user", "serviceProvider"] } })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Get all service providers
// @route GET /api/admin/providers
router.get("/providers", adminProtect, async (req, res) => {
  try {
    const providers = await ServiceProvider.find()
      .populate("userId", "name email phone isActive")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: providers.length, data: providers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Get all bookings
// @route GET /api/admin/bookings
router.get("/bookings", adminProtect, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate("userId", "name phone email")
      .populate("providerId", "userId city")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Toggle user active status
// @route PUT /api/admin/users/:id/toggle
router.put("/users/:id/toggle", adminProtect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? "activated" : "deactivated"}`, data: { isActive: user.isActive } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Delete user
// @route DELETE /api/admin/users/:id
router.delete("/users/:id", adminProtect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Also delete provider profile if exists
    await ServiceProvider.deleteOne({ userId: req.params.id });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc  Verify/unverify provider
// @route PUT /api/admin/providers/:id/verify
router.put("/providers/:id/verify", adminProtect, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });

    provider.isVerified = !provider.isVerified;
    await provider.save();

    res.json({ success: true, message: `Provider ${provider.isVerified ? "verified" : "unverified"}`, data: { isVerified: provider.isVerified } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
