import User from "../models/User.js";
import ServiceProvider from "../models/ServiceProvider.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role, isAdmin) => {
  return jwt.sign({ id, role, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, services, city, experience, bio } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Validate role
    const userRole = role === "serviceProvider" ? "serviceProvider" : "user";
    const isAdmin = false;

    const user = await User.create({
      name,
      email: trimmedEmail,
      phone,
      password,
      role: userRole,
      isAdmin,
    });

    // If service provider, create provider profile
    let providerProfile = null;
    if (userRole === "serviceProvider") {
      if (!services || services.length === 0) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ success: false, message: "Service providers must select at least one service" });
      }
      providerProfile = await ServiceProvider.create({
        userId: user._id,
        services: services,
        city: city || "Cairo",
        experience: experience || 1,
        bio: bio || "",
      });
    }

    const token = generateToken(user._id, user.role, user.isAdmin);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isAdmin: user.isAdmin,
        providerProfileId: providerProfile?._id || null,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated. Please contact support." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Get provider profile ID if service provider
    let providerProfileId = null;
    if (user.role === "serviceProvider") {
      const provider = await ServiceProvider.findOne({ userId: user._id });
      providerProfileId = provider?._id || null;
    }

    const effectiveRole = user.isAdmin ? "admin" : user.role;
    const token = generateToken(user._id, effectiveRole, user.isAdmin);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: effectiveRole,
        isAdmin: user.isAdmin,
        providerProfileId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let providerProfileId = null;
    if (user.role === "serviceProvider") {
      const provider = await ServiceProvider.findOne({ userId: user._id });
      providerProfileId = provider?._id || null;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.isAdmin ? "admin" : user.role,
        isAdmin: user.isAdmin,
        providerProfileId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
