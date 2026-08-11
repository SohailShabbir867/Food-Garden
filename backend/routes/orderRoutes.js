const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { createOrder, getMyOrders, getMyOrder, deleteMyOrder } = require("../controllers/orderController");

const router = express.Router();
router.use(protect, authorize("buyer"));
router.get("/", getMyOrders);
router.post("/", createOrder);
router.get("/:orderNumber", getMyOrder);
router.delete("/:id", deleteMyOrder);

module.exports = router;
