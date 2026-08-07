// src/pages/vendor/VendorOrders.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaComments,
  FaPhoneAlt,
  FaUtensils,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const DEFAULT_VENDOR_ORDERS = [
  {
    id: "FG-984120",
    customerName: "Sohail Shabbir",
    phone: "0300 1234567",
    address: "House 12-B, Block 4, Gulshan-e-Iqbal, Karachi",
    status: "Preparing",
    time: "10 mins ago",
    items: [
      { name: "Classic Beef Burger", quantity: 2, price: 599, spice: "Spicy" },
      { name: "Loaded Fries", quantity: 1, price: 299, spice: "Masala Blast" },
    ],
    totalAmount: 1497,
    paymentMethod: "JazzCash",
  },
  {
    id: "FG-871230",
    customerName: "Hamza Sheikh",
    phone: "0312 9876543",
    address: "Flat 402, PECHS Block 2, Karachi",
    status: "Pending",
    time: "2 mins ago",
    items: [
      { name: "Zinger Crunch Burger", quantity: 1, price: 499, spice: "Mild" },
    ],
    totalAmount: 499,
    paymentMethod: "Cash on Delivery",
  },
];

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

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
        setOrders(savedOrders);
      } else {
        setOrders(DEFAULT_VENDOR_ORDERS);
      }
    } catch (e) {
      setOrders(DEFAULT_VENDOR_ORDERS);
    }
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order #${orderId} status updated to "${newStatus}"!`);
  };

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
            Order Fulfillment Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3A0519]">Manage Incoming Orders</h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Accept buyer orders, update kitchen preparation status, and dispatch riders.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2 overflow-x-auto">
        {["All", "Pending", "Preparing", "Out for Delivery", "Delivered"].map((tab) => (
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
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
            <FaClipboardList className="text-4xl text-pink-200 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-[#3A0519]">No Orders Found</h3>
            <p className="text-xs text-gray-500">There are no orders in "{activeTab}" status.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Order Card Header */}
              <div className="bg-slate-50 p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-[#3A0519]">Order {order.id}</span>
                  <span className="text-xs text-gray-400 font-bold">{order.time || "Recently"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500">Payment: <strong className="text-[#3A0519]">{order.paymentMethod}</strong></span>
                  <span className="bg-pink-50 text-[#e21b70] border border-pink-200 px-3 py-1 rounded-full text-xs font-extrabold">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Items List */}
                <div className="lg:col-span-7 space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                    Ordered Dishes
                  </h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50/70 p-3 rounded-2xl border border-gray-100 text-xs">
                      <div>
                        <span className="font-extrabold text-[#3A0519]">{item.name}</span>{" "}
                        <span className="text-[#e21b70] font-bold">x{item.quantity}</span>
                        {item.spice && <span className="text-gray-400 block text-[10px]">Spice: {item.spice}</span>}
                      </div>
                      <span className="font-black text-[#3A0519]">{formatPKR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Customer Details & Actions */}
                <div className="lg:col-span-5 bg-pink-50/30 p-5 rounded-2xl border border-pink-100 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider mb-2">
                      Buyer Info & Address
                    </h4>
                    <p className="text-xs font-extrabold text-[#3A0519]">{order.customerName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-[#e21b70]" /> {order.address}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-mono font-bold">
                      <FaPhoneAlt className="text-gray-400" /> {order.phone}
                    </p>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="pt-3 border-t border-pink-100 space-y-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Update Order Status:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, "Preparing")}
                        className="py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                      >
                        Start Preparing
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, "Out for Delivery")}
                        className="py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                      >
                        Dispatch Rider
                      </button>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(order.id, "Delivered")}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                    >
                      Mark Completed / Delivered
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
