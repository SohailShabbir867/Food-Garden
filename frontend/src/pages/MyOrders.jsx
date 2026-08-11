import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShoppingBag, FaUtensils, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { fetchMyOrders, removeMyOrder } from "../services/api";
import socket from "../socket";
import { toast } from "react-toastify";

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);

const statusColors = {
  Pending:      "bg-amber-50 text-amber-700 border-amber-200",
  Preparing:    "bg-blue-50 text-blue-700 border-blue-200",
  "On the Way": "bg-purple-50 text-purple-700 border-purple-200",
  Delivered:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled:    "bg-red-50 text-red-600 border-red-200",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyOrders()
      .then(({ orders: data }) => setOrders(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Real-time socket listener — update status badge live
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === data.orderNumber ? { ...o, status: data.status } : o
        )
      );
    };

    socket.on("orderStatusUpdated", handleStatusUpdate);
    return () => socket.off("orderStatusUpdated", handleStatusUpdate);
  }, []);

  // Remove order handler
  const handleRemoveOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order from your history?")) {
      return;
    }
    try {
      setDeletingId(orderId);
      await removeMyOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success("Order removed from history.");
    } catch (err) {
      toast.error(err.message || "Failed to remove order");
    } finally {
      setDeletingId(null);
    }
  };

  // Restrict to maximum 5 previous orders
  const displayedOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4 border-b border-pink-100 pb-6">
          <div>
            <p className="text-[#e21b70] text-xs font-extrabold uppercase tracking-widest">
              Buyer Account
            </p>
            <h1 className="text-3xl font-black text-[#3A0519]">My Orders</h1>
            {orders.length > 0 && (
              <p className="text-xs text-gray-500 font-medium mt-1">
                Showing {displayedOrders.length} of {orders.length} recent order{orders.length > 1 ? "s" : ""} (Max 5 previous orders)
              </p>
            )}
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-xl bg-[#3A0519] px-5 py-3 text-xs font-extrabold text-white hover:bg-[#2A0312] transition-colors shadow-sm"
          >
            <FaUtensils /> Browse Menu
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="animate-spin text-2xl text-[#e21b70] mr-3" />
            <span className="text-gray-500 font-medium">Loading your orders…</span>
          </div>
        )}

        {error && <p className="text-center text-red-600 py-12 font-medium">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-gray-100">
            <FaShoppingBag className="mx-auto mb-4 text-4xl text-[#e21b70]" />
            <h2 className="text-xl font-bold text-[#3A0519]">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your confirmed orders will appear here.
            </p>
          </div>
        )}

        <div className="space-y-5">
          {displayedOrders.map((order) => {
            const colorClass = statusColors[order.status] || statusColors.Pending;
            const isDeleting = deletingId === order._id;

            return (
              <article
                key={order._id}
                className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                {/* Header: Order Number, Date, Status, Remove Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="font-black text-[#3A0519] text-base">
                      Order {order.orderNumber}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border transition-all duration-300 ${colorClass}`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleRemoveOrder(order._id)}
                      disabled={isDeleting}
                      title="Remove from order history"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all border border-red-100 focus:outline-none disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <FaSpinner className="animate-spin" size={11} />
                      ) : (
                        <FaTrashAlt size={11} />
                      )}
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100 py-3">
                  {order.items?.map((item) => (
                    <div key={item._id || item.title} className="flex justify-between py-3 text-sm">
                      <span className="text-gray-800 font-medium">
                        {item.title} × {item.quantity}
                      </span>
                      <strong className="text-gray-900">{formatPKR(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                {/* Footer: Vendor info & Total / Track / Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-sm border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    {order.vendorName} · {order.paymentMethod}
                  </span>
                  <div className="flex gap-4 items-center">
                    <strong className="text-[#e21b70] text-base">
                      {formatPKR(order.totalPrice)}
                    </strong>
                    <Link
                      to={`/orders?id=${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 font-bold text-xs bg-[#e21b70]/10 hover:bg-[#e21b70]/20 text-[#e21b70] px-3.5 py-1.5 rounded-xl transition-all"
                    >
                      Track <FaArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
