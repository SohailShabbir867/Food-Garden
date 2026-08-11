// backend/models/Vendor.js

const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "Lahore",
    },
    cuisine: {
      type: String,
      default: "Pakistani / Fast Food",
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    banner: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    // Store bio shown on the vendor's public profile / "About" section.
    // Written by vendorController.updateVendorProfile.
    description: {
      type: String,
      default: "",
      trim: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
