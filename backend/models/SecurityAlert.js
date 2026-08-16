// backend/models/SecurityAlert.js
const mongoose = require("mongoose");

const securityAlertSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "unknown",
    },
    ip: {
      type: String,
      required: true,
      trim: true,
    },
    deviceInfo: {
      browser: { type: String, default: "Unknown" },
      os: { type: String, default: "Unknown" },
      platform: { type: String, default: "Unknown" },
      screenResolution: { type: String, default: "Unknown" },
      timezone: { type: String, default: "Unknown" },
      language: { type: String, default: "Unknown" },
    },
    location: {
      country: { type: String, default: "Unknown" },
      countryCode: { type: String, default: "UN" },
      city: { type: String, default: "Unknown" },
      region: { type: String, default: "Unknown" },
      lat: { type: Number, default: 0 },
      lon: { type: Number, default: 0 },
      isp: { type: String, default: "Unknown" },
    },
    userAgent: {
      type: String,
      default: "Unknown",
    },
    attemptCount: {
      type: Number,
      default: 1,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["active", "locked", "blocked", "resolved"],
      default: "active",
    },
    lockoutUntil: {
      type: Date,
      default: null,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
    incidentLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        reason: { type: String, default: "Failed login attempt" },
        ip: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SecurityAlert", securityAlertSchema);
