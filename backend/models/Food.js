// backend/models/Food.js

const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Food title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      enum: ["Burgers", "Pizza", "Rolls", "Desi", "Drinks", "Desserts", "Others"],
      default: "Burgers",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    vendorName: {
      type: String,
      default: "Food Garden Kitchen",
    },
    image: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    spiceLevels: {
      type: [{ label: String, priceExtra: { type: Number, default: 0 } }],
      default: [],
    },
    addOns: {
      type: [{ label: String, price: { type: Number, default: 0 } }],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
