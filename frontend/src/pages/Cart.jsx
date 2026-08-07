import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaStore,
  FaPepperHot,
  FaCheese,
  FaArrowRight,
  FaTag,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, cartCount } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Delivery fee rules: Free if subtotal > 1500, else 150 PKR
  const freeDeliveryThreshold = 1500;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const discountAmount = Math.round((subtotal * discount) / 100);
  const grandTotal = Math.max(0, subtotal + deliveryFee + tax - discountAmount);

  const deliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    if (promoCode.trim().toUpperCase() === "FOOD10" || promoCode.trim().toUpperCase() === "FOODGARDEN") {
      setDiscount(10);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === "SUPER20") {
      setDiscount(20);
      setPromoApplied(true);
    } else {
      setPromoError("Invalid code. Try 'FOOD10' for 10% off!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 gap-4">
          <div>
            <span className="text-[#e21b70] font-bold text-xs uppercase tracking-widest block mb-1">
              Your Selection
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3A0519]">
              Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
            </h1>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1.5 self-start md:self-auto bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
            >
              <FaTrash size={13} /> Clear Entire Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100 max-w-2xl mx-auto my-12"
          >
            <div className="w-24 h-24 bg-pink-50 text-[#e21b70] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FaShoppingBag size={44} />
            </div>
            <h2 className="text-2xl font-bold text-[#3A0519] mb-3">Your cart feels lonely!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any delicious meals yet. Browse our top vendors and satisfy your cravings.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#e21b70] hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-[#e21b70]/30 transition-all hover:scale-105"
            >
              Explore Menu <FaArrowRight />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Items List (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Delivery Bar */}
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold text-[#3A0519] mb-2">
                  <span className="flex items-center gap-2">
                    <FaTruck className="text-[#e21b70]" />
                    {subtotal >= freeDeliveryThreshold
                      ? "🎉 You unlocked FREE Delivery!"
                      : `Add ${formatPKR(freeDeliveryThreshold - subtotal)} more for FREE Delivery`}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">{Math.round(deliveryProgress)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryProgress}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-[#e21b70] to-[#3A0519] rounded-full"
                  />
                </div>
              </div>

              {/* Cart Items Cards */}
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.cartItemId || item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-center"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-36 h-32 rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                        {/* Title & Vendor */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="text-xl font-bold text-[#3A0519] leading-snug">
                              {item.name}
                            </h3>
                            {item.vendorName && (
                              <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                <FaStore className="text-gray-400" /> {item.vendorName}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartItemId || item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove item"
                          >
                            <FaTrash size={15} />
                          </button>
                        </div>

                        {/* Selected Options / Customizations */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {/* Spice Badge */}
                          {item.spice && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                              <FaPepperHot className="text-amber-500" size={11} />
                              {item.spice}
                            </span>
                          )}

                          {/* Add-ons Badges */}
                          {item.addOns && item.addOns.length > 0 && (
                            item.addOns.map((addOn, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 bg-pink-50 text-[#e21b70] text-xs font-semibold px-2.5 py-1 rounded-lg border border-pink-100"
                              >
                                <FaCheese className="text-pink-400" size={10} />
                                {addOn}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Quantity Selector & Price Row */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                        {/* Selector */}
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#e21b70] hover:text-white transition-colors"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="font-extrabold text-[#3A0519] w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#e21b70] hover:text-white transition-colors"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs text-gray-400 block font-medium">
                            {formatPKR(item.price)} each
                          </span>
                          <span className="text-lg font-extrabold text-[#e21b70]">
                            {formatPKR(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT: Order Summary Sticky Card (4 Cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-28 space-y-6">
                <h2 className="text-xl font-extrabold text-[#3A0519] pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Promo Code Form */}
                <div>
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Promo Code (FOOD10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-sm text-gray-800 uppercase tracking-wider placeholder:normal-case placeholder:text-gray-400 focus:outline-none focus:border-[#e21b70] disabled:opacity-60"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={promoApplied || !promoCode.trim()}
                      className="bg-[#3A0519] hover:bg-[#e21b70] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {promoApplied ? "Applied!" : "Apply"}
                    </button>
                  </form>
                  {promoError && <p className="text-red-500 text-xs mt-1.5 font-medium">{promoError}</p>}
                  {promoApplied && (
                    <p className="text-green-600 text-xs mt-1.5 font-semibold">
                      🎉 Promo discount applied! ({discount}% OFF)
                    </p>
                  )}
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-3 text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">{formatPKR(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-800">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-extrabold uppercase text-xs">FREE</span>
                      ) : (
                        formatPKR(deliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-bold text-gray-800">{formatPKR(tax)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount ({discount}%)</span>
                      <span>-{formatPKR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-base font-extrabold text-[#3A0519]">Total</span>
                    <span className="text-2xl font-black text-[#e21b70]">{formatPKR(grandTotal)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/payment")}
                  className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#e21b70]/30 transition-all flex items-center justify-center gap-2 text-base"
                >
                  Proceed to Checkout <FaArrowRight />
                </motion.button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs pt-2">
                  <FaShieldAlt className="text-green-500" />
                  <span>100% Secure Checkout & Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
