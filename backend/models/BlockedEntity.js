// backend/models/BlockedEntity.js
const mongoose = require("mongoose");

const blockedEntitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ip", "deviceMac", "email"],
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      default: "Excessive failed login attempts",
    },
    blockedBy: {
      type: String,
      default: "System Threat Auto-Block",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

blockedEntitySchema.index({ type: 1, value: 1 });

module.exports = mongoose.model("BlockedEntity", blockedEntitySchema);
