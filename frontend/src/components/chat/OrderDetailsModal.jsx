import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaShoppingBag,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaMotorcycle,
  FaUtensils,
  FaChevronRight,
} from "react-icons/fa";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen || !order) return null;

  const steps = [
    { label: "Order Placed", done: true },
    { label: "Preparing", done: true },
    { label: "On the Way", done: order.status === "On the Way" },
    { label: "Delivered", done: order.status === "Delivered" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-10 select-none"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3A0519] to-[#670D2F] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <FaShoppingBag className="text-amber-300 text-base" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-xs text-white/70">{order.vendorName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* ETA Banner */}
            <div className="p-3.5 bg-rose-50 dark:bg-slate-800/80 rounded-2xl border border-rose-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FaClock className="text-[#e21b70] text-lg animate-pulse" />
                <div>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 block">
                    Estimated Delivery
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {order.estimatedDelivery || "20 - 25 Mins"}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#e21b70] text-white text-[10px] font-bold">
                {order.status || "In Preparation"}
              </span>
            </div>

            {/* Progress Tracker */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                Live Status
              </h4>
              <div className="grid grid-cols-4 gap-1.5 relative">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.done
                          ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-400 border border-gray-200 dark:border-slate-700"
                      }`}
                    >
                      {step.done ? <FaCheckCircle className="text-xs" /> : idx + 1}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-slate-400">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Order Items
              </h4>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-slate-800/40">
                {(order.items || [
                  { name: order.itemName || "Tasty Food", price: order.totalPrice || "15.99", qty: 1 }
                ]).map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#e21b70] font-bold text-[11px] flex items-center justify-center">
                        {item.qty}x
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 text-xs text-gray-600 dark:text-slate-400">
              <FaMapMarkerAlt className="text-[#e21b70] text-sm mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white block mb-0.5">
                  Delivery Address
                </span>
                <span>{order.deliveryAddress || "124 Food Street, Block 4, Downtown"}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block">Total Amount</span>
              <span className="text-base font-extrabold text-[#3A0519] dark:text-rose-400">
                ${order.totalPrice || "15.99"}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/track-order");
              }}
              className="px-4 py-2.5 rounded-xl bg-[#e21b70] hover:bg-[#c81660] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#e21b70]/20 transition-all"
            >
              <span>Full Order Tracker</span>
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
