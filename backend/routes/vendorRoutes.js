// backend/routes/vendorRoutes.js
// All vendor-facing API routes. Protected by JWT + vendor/admin role check.

const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getVendorDashboardStats,
  getVendorMenu,
  addVendorFood,
  updateVendorFood,
  deleteVendorFood,
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorProfile,
  updateVendorProfile,
  getVendorWeeklyAnalytics,
  getVendorTopFoods,
} = require("../controllers/vendorController");

// Apply JWT protection to ALL vendor routes
router.use(protect);
// Allow both "vendor" and "admin" roles (admin can manage any vendor's data)
router.use(authorize("vendor", "admin"));

// ── Dashboard ────────────────────────────────────────────────
// GET /api/vendor/dashboard/stats
router.get("/dashboard/stats", getVendorDashboardStats);

// ── Analytics ────────────────────────────────────────────────
// GET /api/vendor/analytics/weekly
router.get("/analytics/weekly", getVendorWeeklyAnalytics);
// GET /api/vendor/analytics/top-foods
router.get("/analytics/top-foods", getVendorTopFoods);

// ── Menu (Food CRUD) ─────────────────────────────────────────
// GET    /api/vendor/menu           — list all food items (with filters)
// POST   /api/vendor/menu           — add new food item
// PUT    /api/vendor/menu/:id       — update food item
// DELETE /api/vendor/menu/:id       — delete food item
router
  .route("/menu")
  .get(getVendorMenu)
  .post(addVendorFood);

router
  .route("/menu/:id")
  .put(updateVendorFood)
  .delete(deleteVendorFood);

// ── Orders ───────────────────────────────────────────────────
// GET /api/vendor/orders              — get all kitchen orders (with status filter)
// PUT /api/vendor/orders/:id/status   — update order fulfillment status
router.get("/orders", getVendorOrders);
router.put("/orders/:id/status", updateVendorOrderStatus);

// ── Store Profile ────────────────────────────────────────────
// GET /api/vendor/profile    — fetch store profile
// PUT /api/vendor/profile    — update store profile
router
  .route("/profile")
  .get(getVendorProfile)
  .put(updateVendorProfile);

module.exports = router;
