// backend/routes/vendorRoutes.js
// All vendor-facing API routes. Protected by JWT + vendor/admin role check.

const express = require("express");

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

module.exports = function createVendorRoutes(io) {
  const router = express.Router();

  // Apply JWT protection to ALL vendor routes
  router.use(protect);
  // Allow both "vendor" and "admin" roles (admin can manage any vendor's data)
  router.use(authorize("vendor", "admin"));

  // ── Dashboard ────────────────────────────────────────────────
  router.get("/dashboard/stats", getVendorDashboardStats);

  // ── Analytics ────────────────────────────────────────────────
  router.get("/analytics/weekly", getVendorWeeklyAnalytics);
  router.get("/analytics/top-foods", getVendorTopFoods);

  // ── Menu (Food CRUD) ─────────────────────────────────────────
  router
    .route("/menu")
    .get(getVendorMenu)
    .post(addVendorFood);

  router
    .route("/menu/:id")
    .put(updateVendorFood)
    .delete(deleteVendorFood);

  // ── Orders ───────────────────────────────────────────────────
  router.get("/orders", getVendorOrders);
  router.put("/orders/:id/status", (req, res, next) => {
    req.io = io; // Attach Socket.IO instance to request
    updateVendorOrderStatus(req, res, next);
  });

  // ── Store Profile ────────────────────────────────────────────
  router
    .route("/profile")
    .get(getVendorProfile)
    .put(updateVendorProfile);

  return router;
};
