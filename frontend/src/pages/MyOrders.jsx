// src/pages/MyOrders.jsx

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaRedo,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaMapMarkerAlt,
  FaReceipt,
  FaArrowRight,
  FaUtensils,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Cart1 from "../assets/cart/Cart1.jpg";
import Cart4 from "../assets/cart/Cart4.jpg";
import Cart3 from "../assets/cart/Cart3.jpg";

const DEFAULT_MOCK_ORDERS = [
  {
    id: "FG-894102",
    date: "Aug 7, 2026, 09:30 PM",
    status: "Delivered",
    items: [
      {
        id: 1,
        name: "Classic Beef Burger",
        price: 599,
        image: Cart1,
        spice: "Spicy",
        addOns: [{ label: "Extra Cheese", price: 80 }],
        quantity: 2,
        vendorName: "Burger Hub",
      },
      {
        id: 2,
        name: "Cheesy Fries",
        price: 349,
        image: Cart4,
        spice: "Mild",
        addOns: [],
        quantity: 1,
        vendorName: "Fries Factory",
      },
    ],
    totalAmount: 1627,
    paymentMethod: "jazzcash",
    address: "House #45, Block 5, Gulshan-e-Iqbal, Karachi",
    customerName: "Sohail Shabbir",
    phone: "0300 1234567",
  },
  {
    id: "FG-771249",
    date: "Aug 5, 2026, 02:15 PM",
    status: "Delivered",
    items: [
      {
        id: 4,
        name: "Supreme Chicken Pizza",
        price: 1299,
        image: Cart4,
        spice: "Medium Spicy",
        addOns: [{ label: "Stuffed Crust", price: 200 }],
        quantity: 1,
        vendorName: "Pizza Craze",
      },
      {
        id: 3,
        name: "Chicken Biryani (Special)",
        price: 450,
        image: Cart3,
        spice: "Extra Spicy 🌶️",
        addOns: [],
        quantity: 2,
        vendorName: "Desi Delight",
      },
    ],
    totalAmount: 2399,
    paymentMethod: "easypaisa",
    address: "Flat B-12, Royal Apartments, PECHS, Karachi",
    customerName: "Sohail Shabbir",
    phone: "0300 1234567",
  },
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Load orders from localStorage or default mocks
  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("food_garden_orders") || "[]");
      if (savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        setOrders(DEFAULT_MOCK_ORDERS);
      }
    } catch (e) {
      setOrders(DEFAULT_MOCK_ORDERS);
    }
  }, []);

  // Reorder same food handler
  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        spice: item.spice || "Regular",
        addOns: item.addOns || [],
        quantity: item.quantity || 1,
        vendorName: item.vendorName,
      });
    });

    toast.success(
      <div>
        <p className="font-bold">Reordering Food Items! 🍕</p>
        <p className="text-xs">Items added to cart. Moving to cart...</p>
      </div>
    );

    setTimeout(() => {
      navigate("/cart");
    }, 600);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
            <FaCheckCircle className="text-emerald-500" /> Delivered
          </span>
        );
      case "Out for Delivery":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
            <FaTruck className="text-blue-500" /> Out for Delivery
          </span>
        );
      case "Preparing":
      default:
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
            <FaClock className="text-amber-500 animate-spin" /> Preparing in Kitchen
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-pink-50/20 to-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-pink-100 pb-6">
          <div>
            <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
              Buyer Account Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#3A0519] tracking-tight">
              My Orders & Reorder
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
              View past food orders and reorder your favorite meals with one click.
            </p>
          </div>

          <Link
            to="/menu"
            className="bg-[#3A0519] hover:bg-[#520723] text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
          >
            <FaUtensils /> Explore Full Menu
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-md">
            <div className="w-20 h-20 bg-pink-50 text-[#e21b70] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
              <FaShoppingBag />
            </div>
            <h3 className="text-2xl font-bold text-[#3A0519] mb-2">No Past Orders Found</h3>
            <p className="text-gray-500 text-sm mb-6">
              You haven't placed any food orders yet. Explore our delicious menu and order now!
            </p>
            <Link
              to="/menu"
              className="px-6 py-3 bg-[#e21b70] hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-lg transition hover:scale-105 inline-flex items-center gap-2"
            >
              Order Delicious Food <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(58,5,25,0.05)] overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#e21b70] font-black text-sm flex items-center justify-center border border-pink-100">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#3A0519] text-base">
                          Order {order.id}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs font-medium block">
                        Placed on {order.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <button
                      type="button"
                      onClick={() => setActiveTrackingOrder(order)}
                      className="text-xs font-bold text-[#e21b70] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Track Order <FaChevronRight size={10} />
                    </button>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="p-6 divide-y divide-gray-100">
                  {order.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-xs flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-extrabold text-[#3A0519] text-sm sm:text-base">
                            {item.name} <span className="text-[#e21b70] font-bold text-xs">x{item.quantity}</span>
                          </h4>

                          {/* Customizations */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {item.spice && (
                              <span className="bg-pink-50 text-[#e21b70] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-pink-100">
                                🌶️ {item.spice}
                              </span>
                            )}
                            {item.addOns && item.addOns.map((addon, aIdx) => (
                              <span key={aIdx} className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-200">
                                + {addon.label}
                              </span>
                            ))}
                            {item.vendorName && (
                              <span className="text-gray-400 text-[10px] font-medium">
                                via {item.vendorName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-[#3A0519] text-sm">
                          {formatPKR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Reorder Action Bar */}
                <div className="bg-gray-50/60 p-5 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-500 space-y-1 text-center sm:text-left">
                    <div>
                      <span className="font-bold text-gray-700">Delivery Address:</span> {order.address}
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Payment Method:</span>{" "}
                      <span className="uppercase font-extrabold text-[#3A0519]">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">
                        Total Paid
                      </span>
                      <span className="text-xl font-black text-[#e21b70]">
                        {formatPKR(order.totalAmount)}
                      </span>
                    </div>

                    {/* REORDER BUTTON */}
                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-[#e21b70] hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-md shadow-[#e21b70]/25 flex items-center gap-2 cursor-pointer"
                    >
                      <FaRedo className="text-xs" /> Reorder Same Food
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* TRACKING TIMELINE MODAL */}
      <AnimatePresence>
        {activeTrackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs text-[#e21b70] font-extrabold uppercase tracking-wider block">
                    Live Status Tracking
                  </span>
                  <h3 className="text-xl font-black text-[#3A0519]">
                    Order {activeTrackingOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTrackingOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-pink-100">
                <div className="relative pl-10 flex items-start gap-3">
                  <div className="absolute left-2 -translate-x-1/2 top-1.5 w-5 h-5 rounded-full bg-[#e21b70] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-[#3A0519]">Order Received</h5>
                    <p className="text-[11px] text-gray-500">Vendor received your order details.</p>
                  </div>
                </div>

                <div className="relative pl-10 flex items-start gap-3">
                  <div className="absolute left-2 -translate-x-1/2 top-1.5 w-5 h-5 rounded-full bg-[#e21b70] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-[#3A0519]">Kitchen Preparation</h5>
                    <p className="text-[11px] text-gray-500">Chef is preparing your fresh meal.</p>
                  </div>
                </div>

                <div className="relative pl-10 flex items-start gap-3">
                  <div className="absolute left-2 -translate-x-1/2 top-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                    🚚
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-emerald-700">Rider Dispatched</h5>
                    <p className="text-[11px] text-gray-500">Food rider is on the way to your address.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTrackingOrder(null)}
                className="w-full mt-6 py-3 bg-[#3A0519] text-white font-extrabold text-xs rounded-xl hover:bg-[#520723] transition cursor-pointer"
              >
                Close Tracking
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
