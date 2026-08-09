// backend/models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    targetRole: {
      type: String,
      enum: ["all", "buyer", "vendor"],
      default: "all",
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderName: {
      type: String,
      default: "Super Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
