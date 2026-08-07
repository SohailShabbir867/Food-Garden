// src/pages/TrackOrder.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaComments,
  FaSearch,
  FaUtensils,
  FaStore,
  FaRedo,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Cart1 from "../assets/cart/Cart1.jpg";
import Cart4 from "../assets/cart/Cart4.jpg";

const DEFAULT_ACTIVE_ORDER = {
  id: "FG-984120",
  date: "Just now",
  status: "Out for Delivery",
  estimatedTime: "18 - 25 Mins",
  rider: {
    name: "Ali Hassan",
    phone: "+92 312 8923412",
    vehicle: "Honda CD 70 (KCR-9081)",
    rating: "4.9 ★",
  },
  vendor: {
    name: "Burger Hub",
    phone: "+92 300 9988112",
  },
  items: [
    {
      id: 1,
      name: "Classic Beef Burger",
      price: 599,
      image: Cart1,
      spice: "Extra Spicy 🌶️",
      addOns: [{ label: "Extra Cheese", price: 80 }],
      quantity: 2,
    },
    {
      id: 2,
      name: "Loaded Fries",
      price: 299,
      image: Cart4,
      spice: "Masala Blast",
      addOns: [],
      quantity: 1,
    },
  ],
  totalAmount: 1647,
  address: "House 12-B, Block 4, Gulshan-e-Iqbal, Karachi",
  paymentMethod: "JazzCash (Paid)",
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get("id");

  const [activeOrder, setActiveOrder] = useState(DEFAULT_ACTIVE_ORDER);
  const [searchIdInput, setSearchIdInput] = useState(queryOrderId || "");
  const navigate = useNavigate();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("food_garden_orders") || "[]");
      if (savedOrders.length > 0) {
        // Find queried order or take most recent
        const matched = queryOrderId
          ? savedOrders.find((o) => o.id === queryOrderId)
          : savedOrders[0];
        
        if (matched) {
          setActiveOrder({
            ...DEFAULT_ACTIVE_ORDER,
            ...matched,
            estimatedTime: matched.status === "Delivered" ? "Delivered" : "15 - 20 Mins",
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [queryOrderId]);

  const handleSearchOrder = (e) => {
    e.preventDefault();
    if (!searchIdInput.trim()) return;
    try {
      const savedOrders = JSON.parse(localStorage.getItem("food_garden_orders") || "[]");
      const found = savedOrders.find(
        (o) => o.id.toLowerCase() === searchIdInput.trim().toLowerCase()
      );
      if (found) {
        setActiveOrder({
          ...DEFAULT_ACTIVE_ORDER,
          ...found,
        });
        toast.success(`Found order #${found.id}!`);
      } else {
        toast.error(`Order #${searchIdInput} not found in database.`);
      }
    } catch (err) {
      toast.error("Could not find order.");
    }
  };

  const getStepStatusClass = (stepIndex) => {
    // 0: Order Placed, 1: Kitchen Preparing, 2: Out for Delivery, 3: Delivered
    const currentStatus = activeOrder.status;
    let activeStep = 2; // Default to Out for Delivery
    if (currentStatus === "Preparing") activeStep = 1;
    if (currentStatus === "Delivered") activeStep = 3;

    if (stepIndex < activeStep) {
      return "bg-emerald-500 text-white border-emerald-500";
    }
    if (stepIndex === activeStep) {
      return "bg-[#e21b70] text-white border-[#e21b70] animate-bounce";
    }
    return "bg-gray-100 text-gray-400 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-pink-50/20 to-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-10">
          <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full inline-block mb-3">
            Real-Time Live Delivery 🚚
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3A0519] tracking-tight mb-2">
            Track Active Food Order
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Monitor live status, rider contact, and estimated arrival time for your fresh food delivery.
          </p>

          {/* Search Order Input */}
          <form onSubmit={handleSearchOrder} className="max-w-md mx-auto mt-6 flex gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Enter Order ID e.g. FG-894102"
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70] shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-[#3A0519] hover:bg-[#520723] text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {/* MAIN ORDER TRACKING CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(58,5,25,0.06)] overflow-hidden mb-8"
        >
          {/* Card Banner */}
          <div className="bg-gradient-to-r from-[#1a0009] via-[#3A0519] to-[#1a0009] text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#e21b70] text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md">
                  Active Order
                </span>
                <span className="text-gray-300 text-xs font-mono">Order ID: {activeOrder.id}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Status: <span className="text-pink-400">{activeOrder.status}</span>
              </h2>
            </div>

            {/* Estimated Time Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center">
              <span className="text-[10px] text-gray-300 uppercase tracking-widest font-extrabold block">
                Estimated Delivery
              </span>
              <span className="text-xl font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
                <FaClock className="text-[#e21b70]" /> {activeOrder.estimatedTime}
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────── */}
          {/* STEPPER PROGRESS BAR                               */}
          {/* ─────────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {/* Stepper Connecting Line */}
              <div className="absolute top-4 left-1/8 right-1/8 h-1 bg-gray-100 z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${getStepStatusClass(0)}`}>
                  ✓
                </div>
                <span className="text-xs font-extrabold text-[#3A0519] mt-2 block">Placed</span>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:block">Confirmed</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${getStepStatusClass(1)}`}>
                  👩‍🍳
                </div>
                <span className="text-xs font-extrabold text-[#3A0519] mt-2 block">Preparing</span>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:block">In Kitchen</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${getStepStatusClass(2)}`}>
                  🚚
                </div>
                <span className="text-xs font-extrabold text-[#3A0519] mt-2 block">On The Way</span>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:block">Rider Dispatched</span>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${getStepStatusClass(3)}`}>
                  🏡
                </div>
                <span className="text-xs font-extrabold text-[#3A0519] mt-2 block">Delivered</span>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:block">Doorstep</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────── */}
          {/* RIDER & VENDOR DETAILS                             */}
          {/* ─────────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
            {/* Rider Details */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-pink-50 text-[#e21b70] flex items-center justify-center text-lg font-bold border border-pink-100">
                  🚚
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">
                    Assigned Rider
                  </span>
                  <h4 className="font-extrabold text-[#3A0519] text-base">
                    {activeOrder.rider?.name || "Rider Assigned"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {activeOrder.rider?.vehicle || "Bike Rider"}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${activeOrder.rider?.phone || "03001234567"}`}
                className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition shadow-xs"
                title="Call Rider"
              >
                <FaPhoneAlt size={14} />
              </a>
            </div>

            {/* Vendor Details */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-100">
                  <FaStore />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">
                    Restaurant Partner
                  </span>
                  <h4 className="font-extrabold text-[#3A0519] text-base">
                    {activeOrder.items[0]?.vendorName || "Food Garden Vendor"}
                  </h4>
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span> Live Kitchen Active
                  </p>
                </div>
              </div>
              <Link
                to="/chat"
                className="w-10 h-10 rounded-full bg-pink-50 text-[#e21b70] border border-pink-200 flex items-center justify-center hover:bg-pink-100 transition shadow-xs"
                title="Chat with Vendor"
              >
                <FaComments size={16} />
              </Link>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────── */}
          {/* ORDER ITEMS LIST                                   */}
          {/* ─────────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 border-t border-gray-100">
            <h3 className="text-base font-extrabold text-[#3A0519] mb-4 flex items-center gap-2">
              <FaUtensils className="text-[#e21b70]" /> Order Summary Items
            </h3>

            <div className="divide-y divide-gray-100 mb-6">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <h5 className="font-extrabold text-[#3A0519] text-sm">
                        {item.name} <span className="text-[#e21b70] font-bold">x{item.quantity}</span>
                      </h5>
                      {item.spice && (
                        <span className="text-[10px] text-gray-500 font-semibold block">
                          Spice: {item.spice}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-extrabold text-[#3A0519] text-sm">
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Total & Reorder Link */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 space-y-0.5 text-center sm:text-left">
                <div><span className="font-bold text-gray-700">Delivery Address:</span> {activeOrder.address}</div>
                <div><span className="font-bold text-gray-700">Payment:</span> {activeOrder.paymentMethod}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Total Amount</span>
                  <span className="text-xl font-black text-[#e21b70]">{formatPKR(activeOrder.totalAmount)}</span>
                </div>

                <Link
                  to="/my-orders"
                  className="bg-[#e21b70] hover:bg-pink-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition shadow-md shadow-[#e21b70]/20 flex items-center gap-2"
                >
                  <FaRedo /> Go to Order History & Reorder
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrder;
