import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaUtensils,
  FaSpinner,
  FaCheckCircle,
  FaFire,
  FaTruck,
  FaBoxOpen,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";
import { fetchMyOrder } from "../services/api";
import socket from "../socket";

const STATUSES = ["Pending", "Preparing", "On the Way", "Delivered"];

const statusMeta = {
  Pending:      { icon: <FaClock />,       color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
  Preparing:    { icon: <FaFire />,        color: "text-blue-600",    bg: "bg-blue-50",     border: "border-blue-200" },
  "On the Way": { icon: <FaTruck />,       color: "text-purple-600",  bg: "bg-purple-50",   border: "border-purple-200" },
  Delivered:    { icon: <FaCheckCircle />,  color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200" },
  Cancelled:    { icon: <FaBoxOpen />,      color: "text-red-600",     bg: "bg-red-50",      border: "border-red-200" },
};

const formatPKR = (value) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

const TrackOrder = () => {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("id") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const orderNumber = params.get("id");

  const loadOrder = useCallback(async () => {
    if (!orderNumber) return;
    setLoading(true);
    setError("");
    try {
      const { order: data } = await fetchMyOrder(orderNumber);
      setOrder(data);
      setLastUpdated(new Date());
    } catch (err) {
      setOrder(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  // Initial fetch
  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Auto-poll every 15 seconds
  useEffect(() => {
    if (!orderNumber) return;
    const interval = setInterval(loadOrder, 15000);
    return () => clearInterval(interval);
  }, [orderNumber, loadOrder]);

  // Real-time socket listener
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      if (data.orderNumber === orderNumber) {
        setOrder((prev) => prev ? { ...prev, status: data.status } : prev);
        setLastUpdated(new Date());
      }
    };

    socket.on("orderStatusUpdated", handleStatusUpdate);
    return () => socket.off("orderStatusUpdated", handleStatusUpdate);
  }, [orderNumber]);

  const submit = (event) => {
    event.preventDefault();
    if (input.trim()) setParams({ id: input.trim() });
  };

  // Progress bar helper
  const getProgress = (status) => {
    if (status === "Cancelled") return -1;
    const idx = STATUSES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const meta = order ? (statusMeta[order.status] || statusMeta.Pending) : statusMeta.Pending;
  const progress = order ? getProgress(order.status) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-pink-50/20 to-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#e21b70]">
            Live Order Tracking
          </p>
          <h1 className="text-3xl font-black text-[#3A0519]">Track Your Order</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your order number to see its real-time status
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={submit} className="mx-auto mb-8 flex max-w-md gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Order number, e.g. FG-12345678"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70]"
          />
          <button className="rounded-xl bg-[#3A0519] px-5 text-white hover:bg-[#5a1035] transition-colors">
            <FaSearch />
          </button>
        </form>

        {/* Loading */}
        {loading && !order && (
          <div className="flex items-center justify-center py-16 bg-white rounded-3xl shadow-sm">
            <FaSpinner className="animate-spin text-2xl text-[#e21b70] mr-3" />
            <span className="text-gray-500 font-medium">Fetching order...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
            <p className="text-red-600 font-semibold">{error}</p>
            <button onClick={loadOrder} className="mt-3 text-sm font-bold text-[#e21b70]">
              Try Again
            </button>
          </div>
        )}

        {/* Order Detail */}
        {order && (
          <article className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            {/* Top row */}
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <h2 className="font-black text-[#3A0519] text-lg">{order.orderNumber}</h2>
                <p className="text-xs text-gray-500">{order.vendorName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                >
                  {meta.icon} {order.status}
                </span>
                <button
                  onClick={loadOrder}
                  disabled={loading}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"
                  title="Refresh status"
                >
                  <FaSyncAlt size={12} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* Progress Tracker */}
            {order.status !== "Cancelled" && (
              <div className="py-4">
                <div className="flex items-center justify-between relative">
                  {/* Progress bar background */}
                  <div className="absolute top-5 left-8 right-8 h-1 bg-gray-200 rounded-full" />
                  {/* Progress bar filled */}
                  <div
                    className="absolute top-5 left-8 h-1 bg-gradient-to-r from-[#e21b70] to-[#ff6b9d] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(progress / (STATUSES.length - 1)) * (100 - 10)}%` }}
                  />

                  {STATUSES.map((s, idx) => {
                    const done = idx <= progress;
                    const active = idx === progress;
                    const sMeta = statusMeta[s];
                    return (
                      <div key={s} className="flex flex-col items-center z-10 relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
                            active
                              ? `${sMeta.bg} ${sMeta.color} ring-4 ring-${sMeta.color}/20 shadow-lg`
                              : done
                              ? "bg-[#e21b70] text-white shadow-md"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {sMeta.icon}
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-2 ${
                            active ? sMeta.color : done ? "text-[#e21b70]" : "text-gray-400"
                          }`}
                        >
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cancelled state */}
            {order.status === "Cancelled" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-red-600 font-bold">This order has been cancelled.</p>
              </div>
            )}

            {/* Items */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Order Items</p>
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm py-1.5">
                  <span className="text-gray-800">
                    {item.title} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-800">{formatPKR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Address & Total */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Delivering to:</span> {order.deliveryAddress}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Payment:</span> {order.paymentMethod}
              </p>
              <p className="text-lg font-black text-[#e21b70]">
                Total: {formatPKR(order.totalPrice)}
              </p>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <p className="text-[10px] text-gray-400 text-right font-medium">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </article>
        )}

        {/* Empty state */}
        {!order && !error && !loading && (
          <div className="rounded-3xl bg-white p-12 text-center text-gray-500 shadow-sm">
            <FaUtensils className="mx-auto mb-3 text-3xl text-[#e21b70]" />
            Enter an order number to see its live status.
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/my-orders" className="text-sm font-bold text-[#e21b70] hover:underline">
            View all orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
