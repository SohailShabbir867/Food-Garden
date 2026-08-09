import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaUtensils } from "react-icons/fa";
import { fetchMyOrder } from "../services/api";

const TrackOrder = () => {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("id") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const orderNumber = params.get("id");

  useEffect(() => {
    if (!orderNumber) return;
    setError("");
    fetchMyOrder(orderNumber).then(({ order: data }) => setOrder(data)).catch((err) => { setOrder(null); setError(err.message); });
  }, [orderNumber]);

  const submit = (event) => { event.preventDefault(); if (input.trim()) setParams({ id: input.trim() }); };
  const formatPKR = (value) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value);

  return <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4"><div className="max-w-3xl mx-auto"><div className="text-center mb-8"><p className="text-xs font-extrabold uppercase tracking-widest text-[#e21b70]">Order Tracking</p><h1 className="text-3xl font-black text-[#3A0519]">Track Your Order</h1></div><form onSubmit={submit} className="mx-auto mb-8 flex max-w-md gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Order number, e.g. FG-12345678" className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm"/><button className="rounded-xl bg-[#3A0519] px-5 text-white"><FaSearch /></button></form>{error && <p className="text-center text-red-600">{error}</p>}{order ? <article className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex justify-between border-b pb-4"><div><h2 className="font-black text-[#3A0519]">{order.orderNumber}</h2><p className="text-xs text-gray-500">{order.vendorName}</p></div><span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#e21b70]">{order.status}</span></div><div className="py-4 space-y-2">{order.items.map((item) => <div key={item._id} className="flex justify-between text-sm"><span>{item.title} × {item.quantity}</span><span>{formatPKR(item.price * item.quantity)}</span></div>)}</div><p className="text-sm text-gray-500">Delivering to: {order.deliveryAddress}</p><p className="mt-2 font-black text-[#e21b70]">Total: {formatPKR(order.totalPrice)}</p></article> : !error && <div className="rounded-3xl bg-white p-12 text-center text-gray-500"><FaUtensils className="mx-auto mb-3 text-3xl text-[#e21b70]"/>Enter an order number to see its live status.</div>}<div className="mt-6 text-center"><Link to="/my-orders" className="text-sm font-bold text-[#e21b70]">View all orders</Link></div></div></div>;
};

export default TrackOrder;
