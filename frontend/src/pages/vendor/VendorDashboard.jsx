// src/pages/vendor/VendorDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaUtensils,
  FaClipboardList,
  FaMoneyBillWave,
  FaStar,
  FaComments,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";
import { fetchVendorStats, fetchWeeklyAnalytics } from "../../services/vendorApi";
import { toast } from "react-toastify";

const statusColors = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Preparing: "bg-blue-100 text-blue-700 border-blue-200",
  "On the Way": "bg-purple-100 text-purple-700 border-purple-200",
  Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const formatPKR = (v) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(v || 0);

const VendorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [vendorInfo, setVendorInfo] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, weeklyRes] = await Promise.all([
          fetchVendorStats(),
          fetchWeeklyAnalytics(),
        ]);
        setStats(statsRes.stats);
        setVendorInfo(statsRes.vendor);
        setRecentOrders(statsRes.recentOrders || []);
        setWeekly(weeklyRes.weekly || []);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard data");
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Today's Revenue",
          value: formatPKR(stats.todayRevenue),
          icon: <FaMoneyBillWave className="text-emerald-500" />,
          change: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth}% from yesterday`,
          up: stats.revenueGrowth >= 0,
          bg: "bg-emerald-50",
          border: "border-emerald-100",
        },
        {
          label: "Today's Orders",
          value: `${stats.todayOrderCount} Orders`,
          icon: <FaClipboardList className="text-[#A53860]" />,
          change: `${stats.pendingOrders} pending`,
          bg: "bg-[#A53860]/10",
          border: "border-[#A53860]/20",
        },
        {
          label: "Active Menu Items",
          value: `${stats.activeItems} / ${stats.totalItems}`,
          icon: <FaUtensils className="text-pink-500" />,
          change: "items available",
          bg: "bg-pink-50",
          border: "border-pink-100",
        },
        {
          label: "Kitchen Rating",
          value: `${stats.kitchenRating} / 5.0`,
          icon: <FaStar className="text-yellow-500" />,
          change: "All-time rating",
          bg: "bg-yellow-50",
          border: "border-yellow-100",
        },
      ]
    : [];

  const maxRevenue = Math.max(...weekly.map((d) => d.revenue), 1);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-br from-primary via-primary-light to-primary text-white p-8 sm:p-10 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3A0519]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-full mb-4">
            Vendor Kitchen Overview
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
            Welcome Back, {vendorInfo?.storeName || "Kitchen"}!{" "}
            <span className="inline-block">👋</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base font-medium max-w-xl">
            {vendorInfo?.status === "approved"
              ? "Your kitchen is active. Manage menu items, fulfill live orders, and connect with buyers."
              : "Your store is pending approval. Contact admin to activate."}
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
      {loadingStats ? (
        <div className="flex items-center justify-center py-16">
          <FaSpinner className="text-4xl text-[#e21b70] animate-spin" />
          <span className="ml-3 text-gray-500 font-bold">Loading dashboard...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
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
                <span className={`text-xs font-medium mt-1 flex items-center gap-1 ${stat.up === false ? "text-red-500" : "text-emerald-600"}`}>
                  {stat.up === true ? <FaArrowUp size={9} /> : stat.up === false ? <FaArrowDown size={9} /> : null}
                  {stat.change}
                </span>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Weekly Revenue Chart */}
      {!loadingStats && weekly.length > 0 && (
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-primary">Weekly Revenue</h3>
              <p className="text-xs text-gray-400 font-medium">Last 7 days</p>
            </div>
            <span className="text-xs font-bold text-[#e21b70] bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100">
              Total: {formatPKR(weekly.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </div>

          <div className="flex items-end gap-2 h-32">
            {weekly.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-gray-500">
                  {day.revenue > 0 ? formatPKR(day.revenue).replace("PKR", "₨") : ""}
                </span>
                <div
                  className="w-full rounded-xl transition-all duration-500 bg-gradient-to-t from-[#e21b70] to-pink-400"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 8 : 2)}%`, minHeight: "4px" }}
                />
                <span className="text-[10px] font-black text-gray-400">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-primary">Recent Orders</h3>
            <Link to="/vendor/orders" className="text-xs font-bold text-[#e21b70] hover:underline">
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FaBoxOpen className="text-3xl mx-auto mb-2 text-pink-200" />
              <p className="text-sm font-bold">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between bg-slate-50/80 p-3 rounded-xl border border-gray-100 text-xs">
                  <div>
                    <p className="font-mono font-black text-[#3A0519]">{order.orderNumber}</p>
                    <p className="text-gray-500 font-medium mt-0.5">{order.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusColors[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {order.status}
                    </span>
                    <p className="font-black text-[#3A0519] mt-1">{formatPKR(order.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-black text-primary mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { to: "/vendor/add-food", icon: <FaPlus />, label: "Post New Dish", sub: "Add photos, price & options", color: "text-[#e21b70]", bg: "bg-pink-50 hover:bg-[#e21b70] hover:text-white" },
              { to: "/vendor/orders", icon: <FaClipboardList />, label: "Manage Orders", sub: "Track & update kitchen orders", color: "text-[#A53860]", bg: "bg-[#A53860]/10 hover:bg-[#A53860] hover:text-white" },
              { to: "/vendor/menu", icon: <FaUtensils />, label: "Menu Management", sub: "Update prices & availability", color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-600 hover:text-white" },
              { to: "/chat", icon: <FaComments />, label: "Buyer Live Chat", sub: "Respond to customer inquiries", color: "text-emerald-600", bg: "bg-emerald-50 hover:bg-emerald-600 hover:text-white" },
            ].map(({ to, icon, label, sub, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-transparent hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all duration-200 ${bg} ${color}`}>
                  {icon}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-[#3A0519] group-hover:text-[#e21b70] transition-colors">{label}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
