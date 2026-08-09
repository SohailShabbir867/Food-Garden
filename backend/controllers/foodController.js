const Food = require("../models/Food");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const listFoods = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isAvailable: true };
    if (category && category !== "All") filter.category = category;
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

const getFood = async (req, res, next) => {
  try {
    const food = await Food.findOne({ _id: req.params.id, isAvailable: true }).populate("vendor", "storeName owner logo");
    if (!food) return res.status(404).json({ message: "Food item not found" });
    res.json({ food });
  } catch (error) {
    next(error);
  }
};

module.exports = { listFoods, getFood };
