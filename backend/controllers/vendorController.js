// backend/controllers/vendorController.js
// All business logic for the Vendor Kitchen portal.

const asyncHandler = require("express-async-handler");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");
const Order = require("../models/Order");

// ─────────────────────────────────────────────────────────────────────────────
// Helper: find the Vendor document linked to the currently logged-in user.
// Creates a lightweight stub if none exists yet (first-time vendor login).
// ─────────────────────────────────────────────────────────────────────────────
const getVendorForUser = async (user) => {
  let vendor = await Vendor.findOne({ owner: user._id });

  if (!vendor) {
    // Auto-create a pending vendor profile so the dashboard doesn't crash
    vendor = await Vendor.create({
      storeName: user.name ? `${user.name}'s Kitchen` : "New Kitchen",
      owner: user._id,
      ownerName: user.name || "Vendor",
      email: user.email,
      status: "pending",
    });
  }

  return vendor;
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Vendor Dashboard Stats
// @route  GET /api/vendor/dashboard/stats
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const getVendorDashboardStats = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  // Date window: start of today (UTC)
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // Today's orders for this vendor
  const todayOrders = await Order.find({
    vendor: vendor._id,
    createdAt: { $gte: todayStart },
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const todayOrderCount = todayOrders.length;

  // Yesterday's orders for growth %
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayOrders = await Order.find({
    vendor: vendor._id,
    createdAt: { $gte: yesterdayStart, $lt: todayStart },
  });
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const revenueGrowth =
    yesterdayRevenue === 0
      ? 100
      : Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);

  // Active menu items
  const activeItems = await Food.countDocuments({ vendor: vendor._id, isAvailable: true });
  const totalItems = await Food.countDocuments({ vendor: vendor._id });

  // Pending orders count
  const pendingOrders = await Order.countDocuments({
    vendor: vendor._id,
    status: "Pending",
  });

  // All-time total revenue
  const allOrders = await Order.find({ vendor: vendor._id, status: "Delivered" });
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Recent 5 orders for activity feed
  const recentOrders = await Order.find({ vendor: vendor._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("orderNumber buyerName status totalPrice createdAt");

  res.json({
    vendor: {
      id: vendor._id,
      storeName: vendor.storeName,
      status: vendor.status,
      rating: vendor.rating,
      cuisine: vendor.cuisine,
      city: vendor.city,
    },
    stats: {
      todayRevenue,
      todayOrderCount,
      revenueGrowth,
      activeItems,
      totalItems,
      pendingOrders,
      totalRevenue,
      kitchenRating: vendor.rating,
    },
    recentOrders,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Get this vendor's menu items
// @route  GET /api/vendor/menu
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const getVendorMenu = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const { category, search, available } = req.query;

  const filter = { vendor: vendor._id };
  if (category && category !== "All") filter.category = category;
  if (available === "true") filter.isAvailable = true;
  if (available === "false") filter.isAvailable = false;
  if (search) filter.title = { $regex: search, $options: "i" };

  const foods = await Food.find(filter).sort({ createdAt: -1 });

  res.json({ count: foods.length, foods });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Add a new food item to this vendor's menu
// @route  POST /api/vendor/menu
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const addVendorFood = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const { title, description, price, category, image, isAvailable } = req.body;

  if (!title || !price) {
    res.status(400);
    throw new Error("Title and price are required");
  }

  const food = await Food.create({
    title,
    description: description || "",
    price: Number(price),
    category: category || "Others",
    image: image || "",
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    vendor: vendor._id,
    vendorName: vendor.storeName,
  });

  res.status(201).json({ message: "Food item added successfully", food });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Update a food item (details or availability toggle)
// @route  PUT /api/vendor/menu/:id
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const updateVendorFood = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const food = await Food.findOne({ _id: req.params.id, vendor: vendor._id });
  if (!food) {
    res.status(404);
    throw new Error("Food item not found or not owned by this vendor");
  }

  const { title, description, price, category, image, isAvailable } = req.body;

  if (title !== undefined) food.title = title;
  if (description !== undefined) food.description = description;
  if (price !== undefined) food.price = Number(price);
  if (category !== undefined) food.category = category;
  if (image !== undefined) food.image = image;
  if (isAvailable !== undefined) food.isAvailable = Boolean(isAvailable);

  await food.save();

  res.json({ message: "Food item updated", food });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Delete a food item from this vendor's menu
// @route  DELETE /api/vendor/menu/:id
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteVendorFood = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const food = await Food.findOne({ _id: req.params.id, vendor: vendor._id });
  if (!food) {
    res.status(404);
    throw new Error("Food item not found or not owned by this vendor");
  }

  await food.deleteOne();

  res.json({ message: `"${food.title}" removed from your menu` });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Get all orders for this vendor with optional status filter
// @route  GET /api/vendor/orders
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const getVendorOrders = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const { status, limit = 50, page = 1 } = req.query;

  const filter = { vendor: vendor._id };
  if (status && status !== "All") filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("buyer", "name email avatar phone");

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    orders,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Update order status (kitchen fulfillment flow)
// @route  PUT /api/vendor/orders/:id/status
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const updateVendorOrderStatus = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const { status } = req.body;
  const allowed = ["Pending", "Preparing", "On the Way", "Delivered", "Cancelled"];

  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Allowed: ${allowed.join(", ")}`);
  }

  const order = await Order.findOne({ _id: req.params.id, vendor: vendor._id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found or not assigned to this vendor");
  }

  order.status = status;
  await order.save();

  res.json({
    message: `Order #${order.orderNumber} updated to "${status}"`,
    order,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Get vendor store profile
// @route  GET /api/vendor/profile
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);
  res.json({ vendor });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Update vendor store profile
// @route  PUT /api/vendor/profile
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const { storeName, cuisine, phone, city, banner, logo } = req.body;

  if (storeName !== undefined) vendor.storeName = storeName;
  if (cuisine !== undefined) vendor.cuisine = cuisine;
  if (phone !== undefined) vendor.phone = phone;
  if (city !== undefined) vendor.city = city;
  if (banner !== undefined) vendor.banner = banner;
  if (logo !== undefined) vendor.logo = logo;

  await vendor.save();

  res.json({ message: "Store profile updated successfully", vendor });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Get weekly revenue/orders chart data (last 7 days)
// @route  GET /api/vendor/analytics/weekly
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const getVendorWeeklyAnalytics = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - i);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCHours(23, 59, 59, 999);

    const dayOrders = await Order.find({
      vendor: vendor._id,
      createdAt: { $gte: start, $lte: end },
    });

    const label = start.toLocaleDateString("en-US", { weekday: "short" });
    const revenue = dayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    days.push({ label, revenue, orders: dayOrders.length });
  }

  res.json({ weekly: days });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Get top selling food items for this vendor
// @route  GET /api/vendor/analytics/top-foods
// @access vendor / admin
// ─────────────────────────────────────────────────────────────────────────────
const getVendorTopFoods = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user);

  const topFoods = await Food.find({ vendor: vendor._id })
    .sort({ salesCount: -1 })
    .limit(5)
    .select("title price category salesCount rating image isAvailable");

  res.json({ topFoods });
});

module.exports = {
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
};
