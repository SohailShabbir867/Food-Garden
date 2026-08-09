// src/pages/vendor/VendorOrders.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaClipboardList, FaMapMarkerAlt, FaPhoneAlt,
  FaSpinner, FaBoxOpen,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchVendorOrders, updateOrderStatus } from "../../services/vendorApi";

const TABS = ["All", "Pending", "Preparing", "On the Way", "Delivered", "Cancelled"];

const statusStyles = {
  Pending:        "bg-amber-50 text-amber-700 border-amber-200",
  Preparing:      "bg-blue-50 text-blue-700 border-blue-200",
  "On the Way":   "bg-purple-50 text-purple-700 border-purple-200",
  Delivered:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled:      "bg-red-50 text-red-600 border-red-200",
};

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== "All" ? { status: activeTab } : {};
      const res = await fetchVendorOrders({ ...params, limit: 50 });
      setOrders(res.orders || []);
    } catch (err) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.order.status } : o))
      );
      toast.success(`Order updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
            Order Fulfillment Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3A0519]">Manage Kitchen Orders</h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Accept orders, update kitchen status, and dispatch riders.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-extrabold text-[#e21b70] border border-pink-200 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "↻"} Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex-shrink-0 ${
              activeTab === tab
                ? "bg-[#e21b70] text-white shadow-md shadow-[#e21b70]/20"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
            <FaSpinner className="text-3xl text-[#e21b70] animate-spin" />
            <span className="ml-3 text-gray-400 font-bold text-sm">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-14 rounded-3xl text-center border border-gray-100">
            <FaBoxOpen className="text-4xl text-pink-200 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-[#3A0519]">No Orders Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              No "{activeTab}" orders at the moment.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-slate-50 p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-[#3A0519]">
                    Order #{order.orderNumber}
                  </span>
                  <span className="text-xs text-gray-400 font-bold">
                    {timeAgo(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500">
                    Payment: <strong className="text-[#3A0519]">{order.paymentMethod}</strong>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${statusStyles[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Items */}
                <div className="lg:col-span-7 space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                    Ordered Dishes
                  </h4>
                  {(order.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-slate-50/70 p-3 rounded-2xl border border-gray-100 text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-[#3A0519]">{item.title}</span>{" "}
                        <span className="text-[#e21b70] font-bold">×{item.quantity}</span>
                      </div>
                      <span className="font-black text-[#3A0519]">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
                    <span className="font-extrabold text-gray-500">Total Amount</span>
                    <span className="font-black text-[#3A0519] text-base">{formatPKR(order.totalPrice)}</span>
                  </div>
                </div>

                {/* Customer + Actions */}
                <div className="lg:col-span-5 bg-pink-50/30 p-5 rounded-2xl border border-pink-100 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider mb-2">
                      Buyer Info
                    </h4>
                    <p className="text-xs font-extrabold text-[#3A0519]">
                      {order.buyer?.name || order.buyerName}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-xs text-gray-500 flex items-start gap-1 mt-1">
                        <FaMapMarkerAlt className="text-[#e21b70] mt-0.5 flex-shrink-0" />
                        {order.deliveryAddress}
                      </p>
                    )}
                    {(order.buyer?.phone || order.phone) && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-mono font-bold">
                        <FaPhoneAlt className="text-gray-400" />
                        {order.buyer?.phone || order.phone}
                      </p>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="pt-3 border-t border-pink-100 space-y-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Update Status:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order._id, "Preparing")}
                        disabled={updatingId === order._id || order.status === "Preparing"}
                        className="py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        {updatingId === order._id ? <FaSpinner className="animate-spin" size={10} /> : null}
                        Start Prep
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order._id, "On the Way")}
                        disabled={updatingId === order._id || order.status === "On the Way"}
                        className="py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        Dispatch
                      </button>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Delivered")}
                      disabled={updatingId === order._id || order.status === "Delivered"}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      Mark Delivered ✓
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, "Cancelled")}
                      disabled={updatingId === order._id || ["Delivered", "Cancelled"].includes(order.status)}
                      className="w-full py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-extrabold rounded-xl transition cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
