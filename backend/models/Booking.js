import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      default: null,
    },
    serviceName: {
      type: String,
      required: [true, "Please provide a service name"],
    },
    serviceType: {
      type: String,
      enum: ["ac", "plumbing", "cleaning", "electrical", "therapy", "consultation", "counseling", "massage", "training"],
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please provide a booking date"],
    },
    time: {
      type: String,
      required: [true, "Please provide a time"],
    },
    duration: {
      type: Number,
      default: 60, // in minutes
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    fixedPrice: {
      type: Boolean,
      default: true,
    },
    priceSource: {
      type: String,
      enum: ["fixed", "custom"],
      default: "fixed",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    // Customer info denormalized for quick access
    customerName: {
      type: String,
      default: "",
    },
    customerPhone: {
      type: String,
      default: "",
    },
    customerEmail: {
      type: String,
      default: "",
    },
    therapistName: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: "Home Visit",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Indexes for better queries
bookingSchema.index({ userId: 1, date: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model("Booking", bookingSchema);
