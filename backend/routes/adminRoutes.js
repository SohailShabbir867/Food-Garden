// backend/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getVendors,
  updateVendorStatus,
  getFoods,
  toggleFoodAvailability,
  getOrders,
  updateOrderStatus,
  getReports,
  updateReportStatus,
  getContacts,
  replyToContact,
  updateContactStatus,
  sendNotification,
  getNotifications,
  deleteFood,
  deleteReport,
} = require("../controllers/adminController");

// Protect all admin routes (verify token & role === 'admin')
router.use(protect);
router.use(authorize("admin"));

// Dashboard Statistics
router.get("/dashboard/stats", getDashboardStats);

// User Management
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Vendor Management
router.get("/vendors", getVendors);
router.put("/vendors/:id/status", updateVendorStatus);

// Food Management
router.get("/foods", getFoods);
router.put("/foods/:id/status", toggleFoodAvailability);
router.delete("/foods/:id", deleteFood);

// Order Management
router.get("/orders", getOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Report Management
router.get("/reports", getReports);
router.put("/reports/:id/status", updateReportStatus);
router.delete("/reports/:id", deleteReport);

// Support Contacts Management
router.get("/contacts", getContacts);
router.post("/contacts/:id/reply", replyToContact);
router.put("/contacts/:id/status", updateContactStatus);

// Notification Management
router.post("/notifications", sendNotification);
router.get("/notifications", getNotifications);

module.exports = router;
