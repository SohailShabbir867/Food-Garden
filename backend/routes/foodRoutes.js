const express = require("express");
const { listFoods, getFood } = require("../controllers/foodController");

const router = express.Router();
router.get("/", listFoods);
router.get("/:id", getFood);

module.exports = router;
