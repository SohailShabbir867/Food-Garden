// src/pages/vendor/VendorDashboard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaUtensils,
  FaClipboardList,
  FaMoneyBillWave,
  FaStar,
  FaArrowRight,
  FaComments,
} from "react-icons/fa";

const VendorDashboard = () => {
  const stats = [
    { label: "Today's Revenue", value: "PKR 18,450", icon: <FaMoneyBillWave className="text-emerald-500" />, change: "+12% from yesterday" },
    { label: "Total Orders Today", value: "24 Orders", icon: <FaClipboardList className="text-blue-500" />, change: "4 pending kitchen" },
    { label: "Active Listed Dishes", value: "14 Items", icon: <FaUtensils className="text-[#e21b70]" />, change: "All in stock" },
    { label: "Kitchen Rating", value: "4.9 / 5.0", icon: <FaStar className="text-yellow-400" />, change: "128 reviews" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1a0009] via-[#3A0519] to-[#1a0009] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
            Vendor Kitchen Overview
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Welcome Back, Burger Hub! 👋</h1>
          <p className="text-gray-300 text-xs sm:text-sm font-medium mt-1">
            Your kitchen is active. Manage menu items, fulfill live orders, and chat with buyers.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/vendor/add-food"
            className="bg-[#e21b70] hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition shadow-lg shadow-[#e21b70]/30 flex items-center gap-2"
          >
            <FaPlus /> Post New Food
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider block mb-1">
                {stat.label}
              </span>
              <h3 className="text-2xl font-black text-[#3A0519]">{stat.value}</h3>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">{stat.change}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl border border-gray-100">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/vendor/add-food"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#e21b70] flex items-center justify-center text-lg font-bold group-hover:scale-110 transition">
            <FaPlus />
          </div>
          <div>
            <h4 className="font-extrabold text-[#3A0519] text-base group-hover:text-[#e21b70] transition">
              Post New Dish
            </h4>
            <p className="text-xs text-gray-500">Add photos, price, spice levels & add-ons</p>
          </div>
        </Link>

        <Link
          to="/vendor/orders"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition">
            <FaClipboardList />
          </div>
          <div>
            <h4 className="font-extrabold text-[#3A0519] text-base group-hover:text-blue-600 transition">
              View Kitchen Orders
            </h4>
            <p className="text-xs text-gray-500">Track pending, preparing & dispatched orders</p>
          </div>
        </Link>

        <Link
          to="/chat"
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold group-hover:scale-110 transition">
            <FaComments />
          </div>
          <div>
            <h4 className="font-extrabold text-[#3A0519] text-base group-hover:text-emerald-600 transition">
              Buyer Live Chat
            </h4>
            <p className="text-xs text-gray-500">Respond to customer questions instantly</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VendorDashboard;
