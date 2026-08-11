// backend/routes/adminRoutes.js
//
// Route map for the Admin dashboard. Every single route below requires:
//   1. A valid JWT (via `protect`) — proves the request is a logged-in user.
//   2. role === "admin" (via `authorize("admin")`) — proves that user is an admin.
// Both checks are applied once via `router.use(...)` so no individual route
// below needs to repeat them.

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

// Gate: must be logged in AND have role "admin" to reach anything below.
router.use(protect);
router.use(authorize("admin"));

// ── Dashboard Statistics ─────────────────────────────────────────
// GET  /api/admin/dashboard/stats  -> counters + charts + activity feed
router.get("/dashboard/stats", getDashboardStats);

// ── User Management ──────────────────────────────────────────────
// GET    /api/admin/users            -> list/search/filter users
// PUT    /api/admin/users/:id/status -> block / unblock / mark pending
// DELETE /api/admin/users/:id        -> permanently delete a user
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// ── Vendor Management ────────────────────────────────────────────
// GET /api/admin/vendors            -> list/filter vendor storefronts
// PUT /api/admin/vendors/:id/status -> approve/reject (approval also
//                                      promotes the owner's User.role)
router.get("/vendors", getVendors);
router.put("/vendors/:id/status", updateVendorStatus);

// ── Food Management (platform-wide) ──────────────────────────────
// GET    /api/admin/foods            -> every menu item, all vendors
// PUT    /api/admin/foods/:id/status -> toggle availability (soft-hide)
// DELETE /api/admin/foods/:id        -> permanent delete
router.get("/foods", getFoods);
router.put("/foods/:id/status", toggleFoodAvailability);
router.delete("/foods/:id", deleteFood);

// ── Order Management (platform-wide) ─────────────────────────────
// GET /api/admin/orders            -> every order, all vendors
// PUT /api/admin/orders/:id/status -> manual admin override of status
router.get("/orders", getOrders);
router.put("/orders/:id/status", updateOrderStatus);

// ── Report Management (user-submitted complaints) ────────────────
// GET    /api/admin/reports            -> list all reports
// PUT    /api/admin/reports/:id/status -> triage: open/investigating/resolved
// DELETE /api/admin/reports/:id        -> remove a report record
router.get("/reports", getReports);
router.put("/reports/:id/status", updateReportStatus);
router.delete("/reports/:id", deleteReport);

// ── Support Contacts (public contact-form inbox) ─────────────────
// GET  /api/admin/contacts            -> inbox of submitted tickets
// POST /api/admin/contacts/:id/reply  -> reply to a ticket's thread
// PUT  /api/admin/contacts/:id/status -> unread / read / replied
router.get("/contacts", getContacts);
router.post("/contacts/:id/reply", replyToContact);
router.put("/contacts/:id/status", updateContactStatus);

// ── Notification Management (admin broadcasts) ───────────────────
// POST /api/admin/notifications -> send a broadcast to buyers/vendors/all
// GET  /api/admin/notifications -> history of past broadcasts
router.post("/notifications", sendNotification);
router.get("/notifications", getNotifications);

module.exports = router;
