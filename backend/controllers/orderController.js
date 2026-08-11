const Food = require("../models/Food");
const Order = require("../models/Order");

const makeOrderNumber = () => `FG-${Date.now().toString().slice(-8)}${Math.floor(10 + Math.random() * 90)}`;

const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, phone, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !deliveryAddress || !phone) {
      return res.status(400).json({ message: "Items, delivery address and phone are required" });
    }

    const ids = items.map((item) => item.foodId || item.id);
    const uniqueIds = [...new Set(ids.map(String))];
    const foods = await Food.find({ _id: { $in: uniqueIds }, isAvailable: true }).populate("vendor", "storeName");
    if (foods.length !== uniqueIds.length) return res.status(400).json({ message: "One or more cart items are unavailable" });

    const byId = new Map(foods.map((food) => [food._id.toString(), food]));
    const orderItems = items.map((item) => {
      const food = byId.get(String(item.foodId || item.id));
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Each item must have a valid quantity");
      return { food: food._id, title: food.title, quantity, price: food.price };
    });

    const vendorIds = [...new Set(foods.map((food) => food.vendor?._id?.toString()))];
    if (vendorIds.length !== 1 || !vendorIds[0]) {
      return res.status(400).json({ message: "Please place separate orders for items from different vendors" });
    }

    const vendor = foods[0].vendor;
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const order = await Order.create({
      orderNumber: makeOrderNumber(),
      buyer: req.user._id,
      buyerName: req.user.name,
      vendor: vendor._id,
      vendorName: vendor.storeName,
      items: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || "Cash on Delivery",
      deliveryAddress: deliveryAddress.trim(),
      phone: phone.trim(),
    });

    await Food.bulkWrite(orderItems.map((item) => ({ updateOne: { filter: { _id: item.food }, update: { $inc: { salesCount: item.quantity } } } })));
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id, hiddenByBuyer: { $ne: true } }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

const getMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ buyer: req.user._id, orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

const deleteMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.hiddenByBuyer = true;
    await order.save();

    res.json({ message: "Order removed from history successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getMyOrder, deleteMyOrder };
