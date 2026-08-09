import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUniversity,
  FaMobileAlt,
  FaCreditCard,
  FaCheckCircle,
  FaArrowRight,
  FaLock,
  FaTruck,
  FaCopy,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import JazzCashLogo from "../assets/logo/jazzcash.png";
import EasyPaisaLogo from "../assets/logo/easypasa.png";
import BankLogo from "../assets/logo/bank_transfer.png";
import CodLogo from "../assets/logo/cod.png";
import CardLogo from "../assets/logo/card.png";
import { createOrder } from "../services/api";

const PaymentPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Karachi",
    area: "",
    address: "",
    instructions: "",
    paymentMethod: "jazzcash", // 'jazzcash' | 'easypaisa' | 'bank' | 'cod' | 'card'
    transactionId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Fee Calculations (No tax)
  const freeDeliveryThreshold = 1500;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all required contact and location fields!");
      return;
    }

    if (
      (form.paymentMethod === "jazzcash" ||
        form.paymentMethod === "easypaisa" ||
        form.paymentMethod === "bank") &&
      !form.transactionId
    ) {
      toast.error("Please enter your Transaction Reference ID!");
      return;
    }

    setLoading(true);

    try {
      const { order } = await createOrder({
        items: cartItems.map((item) => ({ foodId: item.id, quantity: item.quantity })),
        deliveryAddress: `${form.address}, ${form.area ? `${form.area}, ` : ""}${form.city}`,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
      });
      setPlacedOrderId(order.orderNumber);
      setOrderComplete(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(error.message || "Unable to place your order");
    } finally {
      setLoading(false);
    }
    toast.success("Order placed successfully! 🎉");
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-pink-50/20 to-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Steps Indicator */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-pink-100 pb-6">
          <div>
            <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
              Finalize Your Order
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#3A0519] tracking-tight">
              Checkout & Payment
            </h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white px-5 py-3 rounded-full border border-pink-100 shadow-sm text-xs font-bold">
            <Link to="/cart" className="text-gray-400 hover:text-[#e21b70] flex items-center gap-1.5 transition">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px]">1</span>
              Cart
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#e21b70] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#e21b70] text-white flex items-center justify-center text-[10px]">2</span>
              Payment & Address
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px]">3</span>
              Confirmation
            </span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ──────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN: Customer Info, Location, Payment Method    */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-8">
            {/* SECTION 1: Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_10px_30px_rgba(58,5,25,0.05)]"
            >
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#e21b70] flex items-center justify-center text-lg font-bold">
                  <FaUser />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#3A0519]">Contact Details</h2>
                  <p className="text-xs text-gray-500 font-medium">Where should we send your live order updates?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                    Full Name *
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e21b70] transition-colors text-sm" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Ali Raza"
                      required
                      className="w-full bg-slate-50/70 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-[#3A0519] font-semibold text-sm placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                    Phone Number *
                  </label>
                  <div className="relative group">
                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e21b70] transition-colors text-sm" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0300-1234567"
                      required
                      className="w-full bg-slate-50/70 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-[#3A0519] font-semibold text-sm placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e21b70] transition-colors text-sm" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-slate-50/70 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-[#3A0519] font-semibold text-sm placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SECTION 2: Delivery Location & Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_10px_30px_rgba(58,5,25,0.05)]"
            >
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#e21b70] flex items-center justify-center text-lg font-bold">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#3A0519]">Delivery Location</h2>
                  <p className="text-xs text-gray-500 font-medium">Specify your exact doorstep address</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* City */}
                <div>
                  <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-slate-50/70 border border-gray-200 rounded-2xl py-3.5 px-4 text-[#3A0519] font-semibold text-sm focus:bg-white focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15 transition-all cursor-pointer shadow-inner"
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>

                {/* Area / Sector */}
                <div>
                  <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                    Area / Sector
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="e.g. DHA Phase 5 / Gulshan"
                    className="w-full bg-slate-50/70 border border-gray-200 rounded-2xl py-3.5 px-4 text-[#3A0519] font-semibold text-sm placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15 transition-all shadow-inner"
                  />
                </div>

                {/* Full Address */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                    Street Address / House & Flat No *
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="House #123, Street 4, Block B..."
                    required
                    className="w-full bg-slate-50/70 border border-gray-200 rounded-2xl py-3.5 px-4 text-[#3A0519] font-semibold text-sm placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15 transition-all resize-none shadow-inner"
                  ></textarea>
                </div>

                {/* Special Instructions */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                    Rider Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    placeholder="e.g. Ring the bell twice or leave at reception"
                    className="w-full bg-slate-50/70 border border-gray-200 rounded-2xl py-3.5 px-4 text-[#3A0519] font-semibold text-sm placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15 transition-all shadow-inner"
                  />
                </div>
              </div>
            </motion.div>

            {/* SECTION 3: Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_10px_30px_rgba(58,5,25,0.05)]"
            >
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-[#e21b70]/10 text-[#e21b70] flex items-center justify-center text-xl font-bold">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#3A0519]">Payment Method</h2>
                  <p className="text-xs text-gray-500 font-medium">Select how you would like to pay for your order</p>
                </div>
              </div>

              {/* Grid of Payment Options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {/* JazzCash */}
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "jazzcash" })}
                  className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                    form.paymentMethod === "jazzcash"
                      ? "border-red-500 bg-red-50/60 text-red-800 shadow-lg shadow-red-500/10 font-bold"
                      : "border-gray-100 hover:border-gray-300 text-gray-600 bg-slate-50/60"
                  }`}
                >
                  {form.paymentMethod === "jazzcash" && (
                    <FaCheckCircle className="absolute top-2.5 right-2.5 text-red-600 text-sm" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-sm border border-red-100">
                    <img src={JazzCashLogo} alt="JazzCash" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-xs font-extrabold text-[#3A0519]">JazzCash</span>
                </motion.button>

                {/* EasyPaisa */}
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "easypaisa" })}
                  className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                    form.paymentMethod === "easypaisa"
                      ? "border-emerald-500 bg-emerald-50/60 text-emerald-900 shadow-lg shadow-emerald-500/10 font-bold"
                      : "border-gray-100 hover:border-gray-300 text-gray-600 bg-slate-50/60"
                  }`}
                >
                  {form.paymentMethod === "easypaisa" && (
                    <FaCheckCircle className="absolute top-2.5 right-2.5 text-emerald-600 text-sm" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-sm border border-emerald-100">
                    <img src={EasyPaisaLogo} alt="EasyPaisa" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-xs font-extrabold text-[#3A0519]">EasyPaisa</span>
                </motion.button>

                {/* Bank Transfer */}
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "bank" })}
                  className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                    form.paymentMethod === "bank"
                      ? "border-blue-600 bg-blue-50/60 text-blue-900 shadow-lg shadow-blue-500/10 font-bold"
                      : "border-gray-100 hover:border-gray-300 text-gray-600 bg-slate-50/60"
                  }`}
                >
                  {form.paymentMethod === "bank" && (
                    <FaCheckCircle className="absolute top-2.5 right-2.5 text-blue-600 text-sm" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-sm border border-blue-100">
                    <img src={BankLogo} alt="Bank Transfer" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-xs font-extrabold text-[#3A0519]">Bank Transfer</span>
                </motion.button>

                {/* Cash on Delivery */}
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "cod" })}
                  className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                    form.paymentMethod === "cod"
                      ? "border-amber-500 bg-amber-50/60 text-amber-900 shadow-lg shadow-amber-500/10 font-bold"
                      : "border-gray-100 hover:border-gray-300 text-gray-600 bg-slate-50/60"
                  }`}
                >
                  {form.paymentMethod === "cod" && (
                    <FaCheckCircle className="absolute top-2.5 right-2.5 text-amber-500 text-sm" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-sm border border-amber-100">
                    <img src={CodLogo} alt="Cash on Delivery" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-xs font-extrabold text-[#3A0519]">Cash on Delivery</span>
                </motion.button>

                {/* Card */}
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: "card" })}
                  className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer sm:col-span-2 ${
                    form.paymentMethod === "card"
                      ? "border-purple-600 bg-purple-50/60 text-purple-900 shadow-lg shadow-purple-500/10 font-bold"
                      : "border-gray-100 hover:border-gray-300 text-gray-600 bg-slate-50/60"
                  }`}
                >
                  {form.paymentMethod === "card" && (
                    <FaCheckCircle className="absolute top-2.5 right-2.5 text-purple-600 text-sm" />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-sm border border-purple-100">
                    <img src={CardLogo} alt="Credit Card" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <span className="text-xs font-extrabold text-[#3A0519]">Credit / Debit Card</span>
                </motion.button>
              </div>

              {/* DYNAMIC PAYMENT INSTRUCTIONS BOX */}
              <AnimatePresence mode="wait">
                {/* JazzCash Box */}
                {form.paymentMethod === "jazzcash" && (
                  <motion.div
                    key="jazzcash"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-6 bg-gradient-to-br from-red-50/90 to-red-100/30 border border-red-200 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-red-700 font-extrabold text-base">
                        <img src={JazzCashLogo} alt="JazzCash" className="w-7 h-7 object-contain bg-white rounded-lg p-0.5 shadow-xs border border-red-200" />
                        <span>JazzCash Payment Instructions</span>
                      </div>
                      <span className="bg-red-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
                        Total: {formatPKR(grandTotal)}
                      </span>
                    </div>

                    {/* Step Guide */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-red-900 font-semibold">
                      <div className="bg-white p-2.5 rounded-xl border border-red-100 flex items-center gap-2 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">1</span>
                        <span>Open JazzCash App</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-red-100 flex items-center gap-2 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">2</span>
                        <span>Send {formatPKR(grandTotal)}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-red-100 flex items-center gap-2 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">3</span>
                        <span>Paste TRX ID below</span>
                      </div>
                    </div>

                    {/* Account Details Box */}
                    <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold">Account Title:</span>
                        <strong className="text-gray-900 font-extrabold text-sm">Food Garden Official</strong>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-gray-500 font-bold">JazzCash Number:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-red-600 font-mono text-base font-black tracking-wider">0300 1234567</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("03001234567", "JazzCash Number")}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors border border-red-200 flex items-center gap-1 cursor-pointer"
                          >
                            <FaCopy size={10} /> Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reference Input */}
                    <div>
                      <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                        Enter Transaction Reference ID (TRX ID) *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={form.transactionId}
                        onChange={handleChange}
                        placeholder="e.g. 082910394812"
                        className="w-full bg-white border border-red-300 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 font-mono font-extrabold text-gray-900 shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}

                {/* EasyPaisa Box */}
                {form.paymentMethod === "easypaisa" && (
                  <motion.div
                    key="easypaisa"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-6 bg-gradient-to-br from-emerald-50/90 to-emerald-100/30 border border-emerald-200 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-base">
                        <img src={EasyPaisaLogo} alt="EasyPaisa" className="w-7 h-7 object-contain bg-white rounded-lg p-0.5 shadow-xs border border-emerald-200" />
                        <span>EasyPaisa Payment Instructions</span>
                      </div>
                      <span className="bg-emerald-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
                        Total: {formatPKR(grandTotal)}
                      </span>
                    </div>

                    {/* Step Guide */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-emerald-900 font-semibold">
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">1</span>
                        <span>Open EasyPaisa App</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">2</span>
                        <span>Send {formatPKR(grandTotal)}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0">3</span>
                        <span>Paste TRX ID below</span>
                      </div>
                    </div>

                    {/* Account Details Box */}
                    <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold">Account Title:</span>
                        <strong className="text-gray-900 font-extrabold text-sm">Food Garden Pvt Ltd</strong>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-gray-500 font-bold">EasyPaisa Number:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-emerald-600 font-mono text-base font-black tracking-wider">0312 7654321</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("03127654321", "EasyPaisa Number")}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors border border-emerald-200 flex items-center gap-1 cursor-pointer"
                          >
                            <FaCopy size={10} /> Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reference Input */}
                    <div>
                      <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                        Enter Transaction Reference ID (TRX ID) *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={form.transactionId}
                        onChange={handleChange}
                        placeholder="e.g. 98127391823"
                        className="w-full bg-white border border-emerald-300 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-mono font-extrabold text-gray-900 shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Bank Box */}
                {form.paymentMethod === "bank" && (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-6 bg-gradient-to-br from-blue-50/90 to-blue-100/30 border border-blue-200 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-blue-900 font-extrabold text-base">
                        <img src={BankLogo} alt="Bank Transfer" className="w-7 h-7 object-contain bg-white rounded-lg p-0.5 shadow-xs border border-blue-200" />
                        <span>Direct Bank Transfer Instructions</span>
                      </div>
                      <span className="bg-blue-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
                        Total: {formatPKR(grandTotal)}
                      </span>
                    </div>

                    {/* Account Details Box */}
                    <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold">Bank Name:</span>
                        <strong className="text-gray-900 font-extrabold text-sm">Meezan Bank Limited</strong>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-gray-500 font-bold">Account Title:</span>
                        <strong className="text-gray-900 font-extrabold text-sm">Food Garden Online Services</strong>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-gray-500 font-bold">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-blue-700 font-mono text-sm font-black">01029384756192</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("01029384756192", "Account Number")}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded transition-colors border border-blue-200 flex items-center gap-1 cursor-pointer"
                          >
                            <FaCopy size={10} /> Copy
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className="text-gray-500 font-bold">IBAN:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900 font-mono text-xs font-extrabold">PK92MEZN0001029384756192</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("PK92MEZN0001029384756192", "IBAN")}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded transition-colors border border-blue-200 flex items-center gap-1 cursor-pointer"
                          >
                            <FaCopy size={10} /> Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                        Enter Bank Transaction Reference No *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={form.transactionId}
                        onChange={handleChange}
                        placeholder="e.g. MEZN-98231023"
                        className="w-full bg-white border border-blue-300 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-mono font-extrabold text-gray-900 shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}

                {/* COD Box */}
                {form.paymentMethod === "cod" && (
                  <motion.div
                    key="cod"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-200 rounded-3xl space-y-2 text-sm text-amber-900 shadow-sm"
                  >
                    <div className="flex items-center gap-2 font-extrabold text-base text-amber-800">
                      <FaTruck /> Cash on Delivery Selected
                    </div>
                    <p className="text-xs text-amber-800/80 leading-relaxed">
                      Please keep exact cash <strong className="font-extrabold text-amber-950">{formatPKR(grandTotal)}</strong> ready when our delivery hero arrives at your doorstep.
                    </p>
                  </motion.div>
                )}

                {/* Card Form */}
                {form.paymentMethod === "card" && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-6 bg-gradient-to-br from-purple-50/90 to-purple-100/30 border border-purple-200 rounded-3xl space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-purple-900 font-extrabold text-base">
                      <FaCreditCard /> Credit / Debit Card Details
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="4532 •••• •••• 8921"
                        className="w-full bg-white border border-purple-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 font-mono font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={form.cardExpiry}
                          onChange={handleChange}
                          placeholder="12/28"
                          className="w-full bg-white border border-purple-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          name="cardCvc"
                          value={form.cardCvc}
                          onChange={handleChange}
                          placeholder="•••"
                          maxLength="4"
                          className="w-full bg-white border border-purple-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN: Order Summary & Place Order Button        */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-[0_15px_35px_rgba(58,5,25,0.08)] sticky top-28 space-y-6">
              <h2 className="text-xl font-extrabold text-[#3A0519] pb-3 border-b border-pink-100 flex justify-between items-center">
                <span>Order Summary</span>
                <span className="text-xs text-[#e21b70] bg-pink-50 px-3 py-1 rounded-full font-bold">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </span>
              </h2>

              {/* Items List Snapshot */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Your cart is empty.</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 py-2.5 border-b border-gray-50 last:border-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 bg-gray-100 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#3A0519] truncate">{item.name}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                          {item.spice && (
                            <span className="text-amber-700 font-semibold">🌶️ {item.spice}</span>
                          )}
                          {item.addOns && item.addOns.length > 0 && (
                            <span className="text-[#e21b70] font-semibold">+ {item.addOns.length} add-ons</span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-gray-600 block mt-0.5">
                          Qty: {item.quantity} × {formatPKR(item.price)}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold text-[#e21b70]">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-3.5 text-sm text-gray-600 pt-4 border-t border-pink-100">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-extrabold text-[#3A0519]">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-extrabold text-[#3A0519]">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 font-black uppercase text-xs bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                        FREE
                      </span>
                    ) : (
                      formatPKR(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-pink-100 flex justify-between items-center">
                  <span className="text-base font-extrabold text-[#3A0519]">Total Payable</span>
                  <span className="text-3xl font-black text-[#e21b70] tracking-tight">{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full bg-[#e21b70] hover:bg-[#c01560] text-white font-extrabold py-4 rounded-2xl shadow-[0_10px_25px_rgba(226,27,112,0.35)] transition-all flex items-center justify-center gap-2.5 text-base disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <>
                    Confirm & Place Order <FaArrowRight />
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs pt-1 font-medium">
                <FaLock className="text-green-500" />
                <span>256-bit SSL Encrypted & 100% Guaranteed</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SUCCESS MODAL POPUP AFTER ORDER PLACEMENT                */}
      {/* ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative border border-pink-100 overflow-hidden"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <FaCheckCircle size={44} />
              </div>

              <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
                Order Placed Successfully!
              </span>
              <h2 className="text-2xl font-black text-[#3A0519] mb-2">Thank you for your order</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your order <strong className="text-[#3A0519] font-bold">{placedOrderId}</strong> has been confirmed and sent to the vendor's kitchen!
              </p>

              <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-left text-xs space-y-2 mb-6 font-semibold">
                <div className="flex justify-between">
                  <span className="text-gray-500">Deliver To:</span>
                  <span className="font-bold text-[#3A0519] truncate max-w-[200px]">{form.name} ({form.city})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-bold text-[#e21b70] uppercase">{form.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Arrival:</span>
                  <span className="font-bold text-green-600">30 - 40 Mins 🛵</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3.5 bg-[#e21b70] hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-[#e21b70]/25 transition-all text-sm cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentPage;
