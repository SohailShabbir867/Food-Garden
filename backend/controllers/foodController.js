// backend/controllers/foodController.js
// Public-facing (no auth required) endpoints for browsing the menu
// catalogue — used by the buyer-side Menu and FoodDetail pages.

const Food = require("../models/Food");
const escapeRegex = require("../utils/escapeRegex");
const mongoose = require("mongoose");

/**
 * GET /api/foods
 * Lists all AVAILABLE food items (isAvailable: true only — hidden/out of
 * stock items never reach the public catalogue). Supports:
 *   ?category=Burgers   -> exact category match
 *   ?search=zinger      -> case-insensitive match on title, category, or vendor name
 */
const listFoods = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isAvailable: true };
    if (category && category !== "All") filter.category = String(category);
    if (search) {
      const expression = { $regex: escapeRegex(String(search).slice(0, 80)), $options: "i" };
      filter.$or = [{ title: expression }, { category: expression }, { vendorName: expression }];
    }

    const foods = await Food.find(filter)
      .populate("vendor", "storeName owner logo")
      .sort({ createdAt: -1 });
    res.json({ foods });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/foods/:id
 * A single food item's full details (for the FoodDetail page).
 * Returns 404 if the item doesn't exist OR is currently unavailable —
 * buyers should never be able to open a listing that's been hidden.
 */
const getFood = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }
    const food = await Food.findOne({ _id: req.params.id, isAvailable: true }).populate("vendor", "storeName owner logo");
    if (!food) return res.status(404).json({ message: "Food item not found" });
    res.json({ food });
  } catch (error) {
    next(error);
  }
};

module.exports = { listFoods, getFood };
