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
    { label: "Today's Revenue", value: "PKR 18,450", icon: <FaMoneyBillWave className="text-emerald-500" />, change: "+12% from yesterday", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Total Orders Today", value: "24 Orders", icon: <FaClipboardList className="text-[#A53860]" />, change: "4 pending kitchen", bg: "bg-[#A53860]/10", border: "border-[#A53860]/20" },
    { label: "Active Listed Dishes", value: "14 Items", icon: <FaUtensils className="text-accent" />, change: "All in stock", bg: "bg-pink-50", border: "border-pink-100" },
    { label: "Kitchen Rating", value: "4.9 / 5.0", icon: <FaStar className="text-yellow-500" />, change: "128 reviews", bg: "bg-yellow-50", border: "border-yellow-100" },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-br from-primary via-primary-light to-primary text-white p-8 sm:p-10 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3A0519]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-full mb-4">
            Vendor Kitchen Overview
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">Welcome Back, Burger Hub! <span className="inline-block animate-wave">👋</span></h1>
          <p className="text-gray-300 text-sm sm:text-base font-medium max-w-xl">
            Your kitchen is active. Manage menu items, fulfill live orders, and connect with your buyers easily.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/vendor/add-food"
            className="group bg-accent hover:bg-accent-hover text-white font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-accent/30 flex items-center gap-3 hover:-translate-y-1"
          >
            <FaPlus className="group-hover:rotate-90 transition-transform duration-300" /> 
            <span>Post New Food</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
            className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group"
          >
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">
                {stat.label}
              </span>
              <h3 className="text-2xl font-black text-primary tracking-tight">{stat.value}</h3>
              <span className="text-xs text-gray-500 font-medium mt-1 block">{stat.change}</span>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h3 className="text-lg font-black text-primary mb-4 px-2">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/vendor/add-food"
            className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-pink-200 transition-all duration-300 flex flex-col gap-4 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-accent flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm">
              <FaPlus />
            </div>
            <div>
              <h4 className="font-bold text-primary text-lg group-hover:text-accent transition-colors">
                Post New Dish
              </h4>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">Add photos, price, spice levels & customizable add-ons to your menu.</p>
            </div>
          </Link>

          <Link
            to="/vendor/orders"
            className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#A53860]/30 transition-all duration-300 flex flex-col gap-4 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#A53860]/10 text-[#A53860] flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:bg-[#A53860] group-hover:text-white transition-all duration-300 shadow-sm">
              <FaClipboardList />
            </div>
            <div>
              <h4 className="font-bold text-primary text-lg group-hover:text-[#A53860] transition-colors">
                View Kitchen Orders
              </h4>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">Track pending, preparing & dispatched orders in real-time.</p>
            </div>
          </Link>

          <Link
            to="/chat"
            className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col gap-4 group hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <FaComments />
            </div>
            <div>
              <h4 className="font-bold text-primary text-lg group-hover:text-emerald-600 transition-colors">
                Buyer Live Chat
              </h4>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">Respond to customer questions instantly and provide great service.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
