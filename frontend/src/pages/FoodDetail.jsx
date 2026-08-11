import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaStar,
  FaShoppingCart,
  FaComments,
  FaArrowLeft,
  FaFire,
  FaPlus,
  FaMinus,
  FaCheckSquare,
  FaRegSquare,
  FaStore,
  FaTag,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { fetchFood } from "../services/api";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [food, setFood] = useState(null);
  const [loadingFood, setLoadingFood] = useState(true);

  useEffect(() => {
    setLoadingFood(true);
    fetchFood(id).then(setFood).catch(() => setFood(null)).finally(() => setLoadingFood(false));
  }, [id]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSpice, setSelectedSpice] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const isOwnItem = React.useMemo(() => {
    if (!user || user.role !== "vendor" || !food) return false;
    const vendorUserId = food.vendorOwnerId || food.vendorId;
    if (vendorUserId && (vendorUserId === user._id || vendorUserId.toString() === user._id.toString())) {
      return true;
    }
    if (user.restaurantName && food.vendorName) {
      return user.restaurantName.trim().toLowerCase() === food.vendorName.trim().toLowerCase();
    }
    return false;
  }, [user, food]);

  if (loadingFood) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-[#3A0519]">Loading food item…</div>;
  }

  if (!food) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#3A0519]">
        <h2 className="text-3xl font-bold mb-4">Item not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#e21b70] text-white rounded-full font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const images = food.images.length ? food.images : [food.image].filter(Boolean);

  const toggleAddOn = (index) => {
    setSelectedAddOns((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addOnTotal = selectedAddOns.reduce(
    (sum, i) => sum + food.addOns[i].price,
    0
  );
  const spiceExtra = food.spiceLevels[selectedSpice].priceExtra;
  const unitPrice = food.basePrice + spiceExtra + addOnTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (isOwnItem) {
      toast.warning("You cannot order your own food items!");
      return;
    }
    const cartItem = {
      id: food.id,
      name: food.name,
      price: unitPrice,
      image: images[0] || "",
      spice: food.spiceLevels[selectedSpice].label,
      addOns: selectedAddOns.map((i) => food.addOns[i].label),
      quantity,
      vendorName: food.vendorName,
    };
    addToCart(cartItem);
    toast.success(`${quantity}x ${food.name} added to cart!`);
  };

  const handleChatVendor = () => {
    const targetVendorId = food.vendorOwnerId || food.vendorId;
    navigate(`/chat?vendorId=${targetVendorId}&vendorName=${encodeURIComponent(food.vendorName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#3A0519] font-semibold hover:text-[#e21b70] transition-colors"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── LEFT: Image Gallery ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage]}
                alt={food.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Category badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#3A0519] text-xs font-bold py-1.5 px-3 rounded-full shadow">
              {food.category}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-3 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`rounded-xl overflow-hidden border-2 transition-all duration-200 w-24 h-16 flex-shrink-0 ${
                  activeImage === i
                    ? "border-[#e21b70] shadow-lg shadow-[#e21b70]/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Details & Customization ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {food.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs font-bold text-[#e21b70] bg-pink-50 border border-pink-200 px-3 py-1 rounded-full"
              >
                <FaTag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>

          {/* Name */}
          <h1 className="text-4xl font-extrabold text-[#3A0519] leading-tight">
            {food.name}
          </h1>

          {/* Vendor + Rating Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {food.vendorAvatar ? (
                <img
                  src={food.vendorAvatar}
                  alt={food.vendorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#3A0519] text-white flex items-center justify-center font-bold text-xs">
                  {(food.vendorName || "V")[0].toUpperCase()}
                </div>
              )}
              <span className="text-gray-600 font-semibold flex items-center gap-1.5">
                <FaStore className="text-[#3A0519]" />
                {food.vendorName}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
              <FaStar className="text-yellow-400 w-3.5 h-3.5" />
              <span className="font-bold text-gray-800 text-sm">{food.rating}</span>
              <span className="text-gray-400 text-xs">({food.reviews} reviews)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-base border-l-4 border-[#e21b70] pl-4 italic">
            {food.description}
          </p>

          {/* Base Price */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Base price:</span>
            <span className="text-2xl font-extrabold text-[#3A0519]">
              {formatPKR(food.basePrice)}
            </span>
          </div>

          {/* ── Spice Level ── */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-[#3A0519] font-bold text-lg mb-3 flex items-center gap-2">
              <FaFire className="text-orange-500" /> Spice Level
            </h3>
            <div className="flex flex-wrap gap-3">
              {food.spiceLevels.map((level, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSpice(i)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all duration-200 ${
                    selectedSpice === i
                      ? "bg-[#e21b70] border-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30"
                      : "bg-white border-gray-200 text-gray-600 hover:border-[#e21b70] hover:text-[#e21b70]"
                  }`}
                >
                  {level.label}
                  {level.priceExtra > 0 && (
                    <span className="ml-1 text-xs opacity-80">
                      +{formatPKR(level.priceExtra)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Add-Ons ── */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-[#3A0519] font-bold text-lg mb-3">
              ✨ Add-Ons / Extras
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {food.addOns.map((addOn, i) => {
                const isSelected = selectedAddOns.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleAddOn(i)}
                    className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-[#3A0519] border-[#3A0519] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#3A0519]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isSelected ? (
                        <FaCheckSquare className="text-[#e21b70] flex-shrink-0" />
                      ) : (
                        <FaRegSquare className="text-gray-400 flex-shrink-0" />
                      )}
                      {addOn.label}
                    </span>
                    <span className={`font-bold flex-shrink-0 ${isSelected ? "text-pink-300" : "text-[#e21b70]"}`}>
                      +{formatPKR(addOn.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Quantity + Total ── */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div>
              <p className="text-gray-400 text-sm mb-1">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#e21b70] hover:text-white flex items-center justify-center transition-colors font-bold text-[#3A0519]"
                >
                  <FaMinus size={12} />
                </button>
                <span className="text-2xl font-extrabold text-[#3A0519] w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#e21b70] hover:text-white flex items-center justify-center transition-colors font-bold text-[#3A0519]"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Total Price</p>
              <motion.p
                key={totalPrice}
                initial={{ scale: 1.2, color: "#e21b70" }}
                animate={{ scale: 1, color: "#3A0519" }}
                className="text-3xl font-extrabold text-[#3A0519]"
              >
                {formatPKR(totalPrice)}
              </motion.p>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          {isOwnItem ? (
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center space-y-2 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-amber-900 font-extrabold text-sm sm:text-base">
                <FaExclamationTriangle className="text-amber-600 text-lg shrink-0" />
                <span>You cannot order this item — this is your own food listing!</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-700 font-medium">
                Vendors cannot place orders for items from their own restaurant menu ({food.vendorName}).
              </p>
            </div>
          ) : isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#e21b70] hover:bg-[#c01560] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#e21b70]/30 transition-colors"
              >
                <FaShoppingCart /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleChatVendor}
                className="flex-1 py-4 bg-[#3A0519] hover:bg-[#1a0009] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <FaComments /> Chat with Vendor
              </motion.button>
            </div>
          ) : (
            <div className="p-5 bg-pink-50/80 border-2 border-pink-200 rounded-2xl text-center space-y-3 shadow-xs">
              <p className="text-sm font-bold text-[#3A0519]">
                Please log in to chat with vendor or add items to your cart.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-[#e21b70] hover:bg-pink-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <FaLock size={11} /> Login to Order & Chat
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FoodDetail;
