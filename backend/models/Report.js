// backend/models/Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportNumber: {
      type: String,
      unique: true,
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reporterName: {
      type: String,
      required: true,
    },
    reporterEmail: {
      type: String,
      default: "",
    },
    targetType: {
      type: String,
      enum: ["user", "vendor", "food", "order"],
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    resolutionNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
