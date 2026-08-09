import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShoppingBag, FaUtensils } from "react-icons/fa";
import { fetchMyOrders } from "../services/api";

const formatPKR = (amount) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOrders().then(({ orders: data }) => setOrders(data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap justify-between gap-4 border-b border-pink-100 pb-6">
          <div><p className="text-[#e21b70] text-xs font-extrabold uppercase tracking-widest">Buyer Account</p><h1 className="text-3xl font-black text-[#3A0519]">My Orders</h1></div>
          <Link to="/menu" className="inline-flex items-center gap-2 rounded-xl bg-[#3A0519] px-5 py-3 text-xs font-extrabold text-white"><FaUtensils /> Browse Menu</Link>
        </div>
        {loading && <p className="text-center text-gray-500 py-12">Loading your orders…</p>}
        {error && <p className="text-center text-red-600 py-12">{error}</p>}
        {!loading && !error && orders.length === 0 && <div className="rounded-3xl bg-white p-12 text-center shadow-sm"><FaShoppingBag className="mx-auto mb-4 text-4xl text-[#e21b70]" /><h2 className="text-xl font-bold text-[#3A0519]">No orders yet</h2><p className="mt-2 text-sm text-gray-500">Your confirmed orders will appear here.</p></div>}
        <div className="space-y-5">
          {orders.map((order) => <article key={order._id} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex flex-wrap justify-between gap-3 border-b border-gray-100 pb-4"><div><h2 className="font-black text-[#3A0519]">Order {order.orderNumber}</h2><p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p></div><span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#e21b70]">{order.status}</span></div>
            <div className="divide-y divide-gray-100 py-3">{order.items.map((item) => <div key={item._id} className="flex justify-between py-3 text-sm"><span>{item.title} × {item.quantity}</span><strong>{formatPKR(item.price * item.quantity)}</strong></div>)}</div>
            <div className="flex flex-wrap justify-between gap-3 pt-3 text-sm"><span className="text-gray-500">{order.vendorName} · {order.paymentMethod}</span><div className="flex gap-4 items-center"><strong className="text-[#e21b70]">{formatPKR(order.totalPrice)}</strong><Link to={`/orders?id=${order.orderNumber}`} className="inline-flex items-center gap-1 font-bold text-[#e21b70]">Track <FaArrowRight size={11} /></Link></div></div>
          </article>)}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
