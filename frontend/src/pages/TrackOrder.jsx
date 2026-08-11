import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
  FaShoppingBag,
  FaComments,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCreditCard,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";
import { fetchMyOrder, fetchMyOrders } from "../services/api";
import socket from "../socket";
import { toast } from "react-toastify";

const STATUSES = ["Pending", "Preparing", "On the Way", "Delivered"];

const statusMeta = {
  Pending: {
    icon: <FaClock />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    desc: "Your order has been received by the kitchen and is awaiting confirmation.",
  },
  Preparing: {
    icon: <FaFire />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    desc: "The chef is preparing your fresh meal right now!",
  },
  "On the Way": {
    icon: <FaTruck />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    desc: "Your food is packed and out for delivery with the rider.",
  },
  Delivered: {
    icon: <FaCheckCircle />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    desc: "Order delivered successfully! Enjoy your meal 🎉",
  },
  Cancelled: {
    icon: <FaBoxOpen />,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    desc: "This order was cancelled by the vendor/kitchen.",
  },
};

const formatPKR = (value) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

const TrackOrder = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("id") || "");
  const [order, setOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const queryOrderNumber = params.get("id");

  // Load recent orders list for quick-switching & auto-defaulting
  const loadRecentOrders = useCallback(async () => {
    try {
      const res = await fetchMyOrders();
      const list = res.orders || [];
      setRecentOrders(list);
      return list;
    } catch {
      return [];
    }
  }, []);

  // Load order details by order number
  const loadOrderDetails = useCallback(async (targetNumber) => {
    if (!targetNumber) return;
    setLoading(true);
    setError("");
    try {
      const { order: data } = await fetchMyOrder(targetNumber);
      setOrder(data);
      setLastUpdated(new Date());
    } catch (err) {
      setOrder(null);
      setError(err.message || "Order not found");
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount / query change
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const list = await loadRecentOrders();
      if (!isMounted) return;

      const targetNumber = queryOrderNumber || list[0]?.orderNumber;
      if (targetNumber) {
        setInput(targetNumber);
        await loadOrderDetails(targetNumber);
      } else {
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [queryOrderNumber, loadRecentOrders, loadOrderDetails]);

  // Real-time socket listener
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      const updatedNum = data.orderNumber;
      const newStatus = data.status;

      toast.info(`🔔 Order ${updatedNum} updated to: "${newStatus}"`, {
        icon: "🚀",
      });

      setRecentOrders((prev) =>
        prev.map((o) => (o.orderNumber === updatedNum ? { ...o, status: newStatus } : o))
      );

      setOrder((prev) => {
        if (!prev || prev.orderNumber === updatedNum || prev._id === data.orderId) {
          setLastUpdated(new Date());
          return prev ? { ...prev, status: newStatus } : prev;
        }
        return prev;
      });
    };

    socket.on("orderStatusUpdated", handleStatusUpdate);
    return () => socket.off("orderStatusUpdated", handleStatusUpdate);
  }, []);

  // Form submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      setParams({ id: trimmed });
      loadOrderDetails(trimmed);
    }
  };

  // Switch active order
  const handleSelectOrder = (ordNum) => {
    setInput(ordNum);
    setParams({ id: ordNum });
    loadOrderDetails(ordNum);
  };

  // Open Chat with Vendor
  // Uses vendor.owner (the vendor's User ID) when available — this lets the chat
  // page create a real backend thread via POST /api/chats.
  // Falls back to vendorName search if the owner ID isn't populated.
  const handleMessageVendor = () => {
    if (!order) return;
    const vendorUserId = order.vendor?.owner?._id || order.vendor?.owner || order.vendor?._id || order.vendor;
    const vName = order.vendorName || order.vendor?.storeName || "Vendor";
    const ordId = order.orderNumber || "";

    if (vendorUserId) {
      navigate(
        `/chat?vendorId=${encodeURIComponent(vendorUserId)}&orderId=${encodeURIComponent(ordId)}&vendorName=${encodeURIComponent(vName)}`
      );
    } else {
      // Fallback: search by name only (no chat thread creation without real ID)
      navigate(`/chat?vendorName=${encodeURIComponent(vName)}&orderId=${encodeURIComponent(ordId)}`);
    }
  };

  // Progress index helper
  const getProgress = (status) => {
    if (status === "Cancelled") return -1;
    const idx = STATUSES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const activeOrderNumber = queryOrderNumber || order?.orderNumber || input;
  const meta = order ? statusMeta[order.status] || statusMeta.Pending : statusMeta.Pending;
  const progress = order ? getProgress(order.status) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-pink-50/20 to-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e21b70]/10 text-[#e21b70] text-xs font-black uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-[#e21b70] animate-ping" />
            Live Real-Time Order Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3A0519] tracking-tight">Track Your Order</h1>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            Stay updated in real-time as your vendor prepares and dispatches your order.
          </p>
        </div>

        {/* Recent Orders Quick-Switch Pills */}
        {recentOrders.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <FaShoppingBag className="text-[#e21b70]" /> Your Recent Orders:
              </span>
              <span className="text-[11px] font-medium text-gray-400">Click to switch order</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentOrders.slice(0, 5).map((o) => {
                const isSelected = activeOrderNumber === o.orderNumber;
                const oMeta = statusMeta[o.status] || statusMeta.Pending;
                return (
                  <button
                    key={o._id}
                    onClick={() => handleSelectOrder(o.orderNumber)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-[#3A0519] text-white border-[#3A0519] shadow-md scale-102"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-mono">#{o.orderNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${oMeta.bg} ${oMeta.color}`}>
                      {o.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mx-auto mb-8 flex max-w-lg gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Order #, e.g. FG-7992602025"
              className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70] shadow-2xs bg-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-[#3A0519] px-6 text-white hover:bg-[#2A0312] transition-all font-bold text-sm shadow-md flex items-center gap-2"
          >
            <FaSearch size={14} />
            <span className="hidden sm:inline">Track</span>
          </button>
        </form>

        {/* Loading State */}
        {loading && !order && (
          <div className="flex items-center justify-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
            <FaSpinner className="animate-spin text-2xl text-[#e21b70] mr-3" />
            <span className="text-gray-500 font-medium">Fetching real-time status...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => activeOrderNumber && loadOrderDetails(activeOrderNumber)}
              className="mt-3 text-sm font-bold text-[#e21b70] hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Active Order Card */}
        {order && (
          <article className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            
            {/* Header & Direct Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-black text-[#3A0519] text-2xl tracking-tight">Order {order.orderNumber}</h2>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  From <strong className="text-gray-800 font-bold">{order.vendorName}</strong> · {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons: Message Vendor + Refresh */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* DIRECT MESSAGE VENDOR BUTTON */}
                <button
                  onClick={handleMessageVendor}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#e21b70] hover:bg-[#b8125a] text-white text-xs font-black shadow-md shadow-[#e21b70]/25 transition-all duration-200 active:scale-95 cursor-pointer"
                  title="Directly chat with this vendor about your order"
                >
                  <FaComments size={14} />
                  <span>Message Vendor</span>
                </button>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-black border transition-all duration-300 ${meta.bg} ${meta.color} ${meta.border}`}
                >
                  {meta.icon} {order.status}
                </span>

                <button
                  onClick={() => loadOrderDetails(order.orderNumber)}
                  disabled={loading}
                  className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 focus:outline-none"
                  title="Refresh Live Status"
                >
                  <FaSyncAlt size={13} className={loading ? "animate-spin text-[#e21b70]" : ""} />
                </button>
              </div>
            </div>

            {/* Visual Progress Tracker */}
            {order.status !== "Cancelled" && (
              <div className="py-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/80">
                <div className="flex items-center justify-between relative mb-4">
                  {/* Background Track Line */}
                  <div className="absolute top-5 left-8 right-8 h-1 bg-gray-200 rounded-full" />
                  
                  {/* Active Progress Line */}
                  <div
                    className="absolute top-5 left-8 h-1 bg-gradient-to-r from-[#e21b70] via-purple-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(progress / (STATUSES.length - 1)) * (100 - 10)}%` }}
                  />

                  {/* Step Nodes */}
                  {STATUSES.map((s, idx) => {
                    const done = idx <= progress;
                    const active = idx === progress;
                    const sMeta = statusMeta[s];
                    return (
                      <div key={s} className="flex flex-col items-center z-10 relative">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center text-base transition-all duration-500 ${
                            active
                              ? `${sMeta.bg} ${sMeta.color} ring-4 ring-[#e21b70]/20 shadow-lg scale-110 border-2 border-white`
                              : done
                              ? "bg-[#e21b70] text-white shadow-md"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          {sMeta.icon}
                        </div>
                        <span
                          className={`text-[11px] font-black mt-2 ${
                            active ? sMeta.color : done ? "text-[#e21b70]" : "text-gray-400"
                          }`}
                        >
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Status Explanation Box */}
                <div className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium ${meta.bg} ${meta.color} ${meta.border}`}>
                  <FaInfoCircle size={14} className="shrink-0" />
                  <span>{meta.desc}</span>
                </div>
              </div>
            )}

            {/* Cancelled Alert Box */}
            {order.status === "Cancelled" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-red-600 font-bold text-sm">This order was cancelled by the kitchen or vendor.</p>
              </div>
            )}

            {/* Dishes Summary */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FaUtensils className="text-[#e21b70]" /> Ordered Dishes
              </p>
              <div className="bg-gray-50/70 rounded-2xl p-4 divide-y divide-gray-100 border border-gray-100">
                {order.items?.map((item) => (
                  <div key={item._id || item.title} className="flex justify-between items-center py-2.5 text-sm">
                    <span className="text-gray-800 font-bold">
                      {item.title} <span className="text-[#e21b70] text-xs font-black ml-1">× {item.quantity}</span>
                    </span>
                    <span className="font-black text-gray-900">{formatPKR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details & Payment */}
            <div className="border-t border-gray-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-[#e21b70]" /> Delivery Address
                </p>
                <p className="text-gray-800 font-bold text-xs leading-relaxed">{order.deliveryAddress}</p>
                {order.phone && (
                  <p className="text-gray-500 text-xs font-semibold flex items-center gap-1 mt-1">
                    <FaPhoneAlt size={10} className="text-gray-400" /> {order.phone}
                  </p>
                )}
              </div>

              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FaCreditCard className="text-[#e21b70]" /> Payment Details
                </p>
                <p className="text-gray-800 font-bold text-xs">{order.paymentMethod}</p>
                <p className="text-xl font-black text-[#e21b70] pt-1">
                  Total: {formatPKR(order.totalPrice)}
                </p>
              </div>
            </div>

            {/* Live Socket Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Socket Connected
              </span>
              {lastUpdated && <span>Updated: {lastUpdated.toLocaleTimeString()}</span>}
            </div>

          </article>
        )}

        {/* Empty state when no order exists */}
        {!order && !error && !loading && (
          <div className="rounded-3xl bg-white p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            <FaUtensils className="mx-auto mb-3 text-3xl text-[#e21b70]" />
            <h3 className="font-bold text-gray-800 text-base mb-1">No Active Orders Selected</h3>
            <p className="text-xs text-gray-400">Place an order or enter an Order # above to track live progress.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#e21b70] bg-[#e21b70]/10 hover:bg-[#e21b70]/20 px-5 py-2.5 rounded-xl transition-all"
          >
            View Full Order History <FaChevronRight size={10} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
