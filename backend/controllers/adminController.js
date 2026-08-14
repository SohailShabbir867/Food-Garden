// backend/controllers/adminController.js
//
// All business logic for the Admin dashboard: platform-wide statistics,
// user/vendor/food/order moderation, support ticket replies, and
// broadcast notifications. Every route in here is locked to role "admin"
// by the `protect` + `authorize("admin")` middleware in adminRoutes.js.

const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");
const Order = require("../models/Order");
const Report = require("../models/Report");
const Notification = require("../models/Notification");
const Contact = require("../models/Contact");
const escapeRegex = require("../utils/escapeRegex");
const mongoose = require("mongoose");

// ═════════════════════════════════════════════════════════════════════════
// 1. DASHBOARD OVERVIEW
// ═════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/dashboard/stats
 *
 * Builds everything the Admin Dashboard's landing page needs in one call:
 *  - top-line counters (users, vendors, orders, revenue)
 *  - a 7-month growth chart (users vs vendors)
 *  - a 7-day orders bar chart
 *  - a revenue trend chart
 *  - a merged "recent activity" feed (newest signups, orders, reports)
 *  - "quick stats" sidebar numbers (open/resolved reports, blocked users, etc.)
 *
 * NOTE: the historical chart data (Feb-Jul) is currently hardcoded sample
 * data — only the most recent month's real counts are blended in. This is
 * intentional scaffolding so the chart isn't empty on a fresh database;
 * replace with a real month-by-month aggregation once there's enough
 * historical data to make it meaningful.
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // ── Top-line counters ───────────────────────────────────────────────
    const totalUsers = await User.countDocuments({ role: { $in: ["buyer", "vendor"] } });
    const totalVendors = await Vendor.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Revenue only counts orders that actually completed (Delivered),
    // so cancelled/pending orders don't inflate the number.
    const revenueAggregate = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].total : 0;

    // ── Quick Stats sidebar ──────────────────────────────────────────────
    const openReports = await Report.countDocuments({ status: { $ne: "resolved" } });
    const resolvedReports = await Report.countDocuments({ status: "resolved" });
    const blockedUsers = await User.countDocuments({ status: "blocked" });
    const notificationsSent = await Notification.countDocuments();

    const totalReports = openReports + resolvedReports;
    // Guard against divide-by-zero when there are no reports yet — default to 100%.
    const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 100;

    // ── Chart data (last 6 months trend, blended with live counts) ──────
    const userGrowthData = [
      { month: "Feb", users: 40, vendors: 5 },
      { month: "Mar", users: 80, vendors: 9 },
      { month: "Apr", users: 130, vendors: 15 },
      { month: "May", users: 190, vendors: 22 },
      { month: "Jun", users: 260, vendors: 30 },
      { month: "Jul", users: Math.max(350, totalUsers - 50), vendors: Math.max(41, totalVendors - 10) },
      { month: "Aug", users: totalUsers > 0 ? totalUsers : 420, vendors: totalVendors > 0 ? totalVendors : 55 },
    ];

    const revenueData = [
      { month: "Feb", revenue: 12000 },
      { month: "Mar", revenue: 28000 },
      { month: "Apr", revenue: 45000 },
      { month: "May", revenue: 38000 },
      { month: "Jun", revenue: 62000 },
      { month: "Jul", revenue: 78000 },
      { month: "Aug", revenue: totalRevenue > 0 ? totalRevenue : 95000 },
    ];

    const ordersData = [
      { day: "Mon", orders: 34 },
      { day: "Tue", orders: 52 },
      { day: "Wed", orders: 41 },
      { day: "Thu", orders: 67 },
      { day: "Fri", orders: 89 },
      { day: "Sat", orders: 112 },
      { day: "Sun", orders: Math.max(78, totalOrders) },
    ];

    // ── Recent activity feed ────────────────────────────────────────────
    // Pull the 3 newest of each entity type, tag them with a `type` so the
    // frontend can pick an icon, then merge + sort by date and keep the top 6.
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(3);
    const recentReports = await Report.find().sort({ createdAt: -1 }).limit(3);

    const recentActivity = [];

    recentUsers.forEach((u) => {
      recentActivity.push({
        id: `u-${u._id}`,
        type: u.role === "vendor" ? "vendor" : "user",
        message: `New ${u.role} '${u.name}' registered`,
        time: "Recently",
        status: u.status === "blocked" ? "error" : "success",
        createdAt: u.createdAt,
      });
    });

    recentOrders.forEach((o) => {
      recentActivity.push({
        id: `o-${o._id}`,
        type: "order",
        message: `Order #${o.orderNumber} marked as ${o.status.toLowerCase()}`,
        time: "Recently",
        status: o.status === "Delivered" ? "success" : "warning",
        createdAt: o.createdAt,
      });
    });

    recentReports.forEach((r) => {
      recentActivity.push({
        id: `r-${r._id}`,
        type: "report",
        message: `Report #${r.reportNumber} (${r.subject})`,
        time: "Recently",
        status: r.status === "resolved" ? "success" : "error",
        createdAt: r.createdAt,
      });
    });

    // Merge all three activity types into one timeline, newest first.
    recentActivity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      stats: { totalUsers, totalVendors, totalOrders, totalRevenue },
      userGrowthData,
      revenueData,
      ordersData,
      recentActivity: recentActivity.slice(0, 6),
      quickStats: { openReports, resolvedReports, blockedUsers, notificationsSent, resolutionRate },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════
// 2. USER MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/users
 * Lists users with optional filters: ?search=name-or-email&role=buyer&status=active
 */
exports.getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};

    if (search) {
      // Case-insensitive partial match on name OR email.
      // escapeRegex prevents regex-injection from special characters in the search box.
      query.$or = [
        { name: { $regex: escapeRegex(String(search).slice(0, 80)), $options: "i" } },
        { email: { $regex: escapeRegex(String(search).slice(0, 80)), $options: "i" } },
      ];
    }
    if (role && role !== "all") query.role = String(role);
    if (status && status !== "all") query.status = String(status);

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

/**
 * PUT /api/admin/users/:id/status
 * Body: { status: "active" | "blocked" | "pending" }
 * Used by the "block/unblock user" action in ManageUsers.jsx.
 */
exports.updateUserStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Permanently deletes a user account. Does NOT cascade-delete their
 * orders/vendor profile — those stay orphaned by design so order history
 * isn't lost. Revisit if GDPR-style "right to be forgotten" is needed later.
 */
exports.deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════
// 3. VENDOR MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/vendors
 * Lists all vendor storefronts with optional ?status=pending|approved|rejected.
 * `owner` is populated so the admin table can show the vendor's account name/email.
 */
exports.getVendors = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== "all") query.status = String(status);

    const vendors = await Vendor.find(query).populate("owner", "name email").sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors", error: error.message });
  }
};

/**
 * PUT /api/admin/vendors/:id/status
 * Body: { status: "pending" | "approved" | "rejected" }
 *
 * Approving a vendor also promotes their linked User account's `role` to
 * "vendor" — this is what unlocks the Vendor portal (/vendor/*) for them
 * on the frontend, since ProtectedRoute checks req.user.role.
 */
exports.updateVendorStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }
    const { status } = req.body;
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.status = status;
    await vendor.save();

    // Promote the owning user to the "vendor" role the moment they're approved.
    if (status === "approved" && vendor.owner) {
      await User.findByIdAndUpdate(vendor.owner, { role: "vendor" });
    }

    res.json({ message: `Vendor status updated to ${status}`, vendor });
  } catch (error) {
    res.status(500).json({ message: "Failed to update vendor status", error: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════
// 4. FOOD MANAGEMENT (platform-wide, across all vendors)
// ═════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/foods
 * Every menu item on the platform, regardless of vendor. `vendor` is
 * populated with just the store name so the table can show "sold by X".
 */
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("vendor", "storeName").sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch foods", error: error.message });
  }
};

/**
 * PUT /api/admin/foods/:id/status
 * Flips a food item's availability (used to hide a listing without deleting
 * it — e.g. while investigating a complaint about it).
 */
exports.toggleFoodAvailability = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food item not found" });

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json({ message: "Food availability toggled", food });
  } catch (error) {
    res.status(500).json({ message: "Failed to update food item", error: error.message });
  }
};

/**
 * DELETE /api/admin/foods/:id
 * Permanently removes a listing (unlike toggleFoodAvailability, this
 * can't be undone — used for policy-violating items, not routine hiding).
 */
exports.deleteFood = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: "Food item not found" });

    res.json({ message: "Food item deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food item", error: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════
// 5. ORDER MANAGEMENT (platform-wide oversight)
// ═════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/orders
 * All orders across every vendor, optionally filtered by ?status=.
 * (Vendors only see their own orders via /api/vendor/orders — this is
 * the platform-wide admin view.)
 */
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== "all") query.status = String(status);

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

/**
 * PUT /api/admin/orders/:id/status
 * Lets an admin override an order's status directly (e.g. force-cancel a
 * stuck order). Normal fulfillment updates come from the vendor via
 * /api/vendor/orders/:id/status instead.
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════
// 6. REPORT MANAGEMENT (user-submitted complaints/flags)
// ═════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/reports
 * All complaint/flag reports (against a user, vendor, food item, or order).
 */
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error: error.message });
  }
};

/**
 * PUT /api/admin/reports/:id/status
 * Body: { status?: "open"|"investigating"|"resolved", resolutionNote?: string }
 * Moves a report through its triage lifecycle and optionally records how
 * it was resolved.
 */
exports.updateReportStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }
    const { status, resolutionNote } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ message: "Report not found" });

    if (status) report.status = status;
    if (resolutionNote) report.resolutionNote = resolutionNote;

    await report.save();
    res.json({ message: "Report status updated", report });
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error: error.message });
  }
};

/**
 * DELETE /api/admin/reports/:id
 * Permanently removes a report record (e.g. spam/duplicate reports).
 */
exports.deleteReport = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete report", error: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════
// 7. SUPPORT CONTACTS (the public "Contact Us" form inbox)
// ═════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/contacts
 * The full inbox of messages submitted through the public contact form
 * (see contactController.createContact for how they're created).
 */
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact inquiries", error: error.message });
  }
};

/**
 * POST /api/admin/contacts/:id/reply
 * Body: { replyText: string }
 * Appends an admin reply to the ticket's thread and marks it "replied".
 * NOTE: this only stores the reply in the database — it does not currently
 * email the reply back to the person who submitted the ticket. If that's
 * expected, wire in sendEmail() here using the ticket's `email` field.
 */
exports.replyToContact = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }
    const { replyText } = req.body;
    if (!replyText || !replyText.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact inquiry not found" });

    contact.replies.push({
      sender: "admin",
      text: replyText.trim(),
      sentAt: new Date(),
    });
    contact.status = "replied";
    await contact.save();

    res.json({ message: "Reply sent successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Failed to add reply", error: error.message });
  }
};

/**
 * PUT /api/admin/contacts/:id/status
 * Body: { status: "unread" | "read" | "replied" }
 * Manually re-tag a ticket's status (e.g. mark as read without replying).
 */
exports.updateContactStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ message: "Contact inquiry not found" });

    contact.status = status;
    await contact.save();

    res.json({ message: `Contact status updated to ${status}`, contact });
  } catch (error) {
    res.status(500).json({ message: "Failed to update contact status", error: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════
// 8. SYSTEM NOTIFICATIONS (admin broadcasts to users/vendors)
// ═════════════════════════════════════════════════════════════════════════

/**
 * POST /api/admin/notifications
 * Body: { title, message, targetRole?: "all"|"buyer"|"vendor" }
 * Creates a broadcast notification record. `req.user` is the admin sending
 * it (attached by the `protect` middleware), used to stamp who sent it.
 * NOTE: this only stores the notification — it does not push it in real time
 * or email it. Wire this into Socket.io (see socket/chatSocket.js for the
 * pattern) or sendEmail() if live delivery is needed later.
 */
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, targetRole } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notification = await Notification.create({
      title,
      message,
      targetRole: targetRole || "all",
      sender: req.user._id,
      senderName: req.user.name || "Super Admin",
    });

    res.status(201).json({ message: "Notification broadcasted successfully", notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
};

/**
 * GET /api/admin/notifications
 * History of every notification the admin team has broadcast, newest first.
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};
