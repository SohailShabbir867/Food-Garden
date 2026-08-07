// src/pages/Menu.jsx

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaStore, FaArrowRight, FaShoppingCart, FaUtensils } from "react-icons/fa";
import { allFoods, categories } from "../data/foodData";
import { toast } from "react-toastify";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const filteredFoods =
    selectedCategory === "All"
      ? allFoods
      : allFoods.filter((item) => item.category === selectedCategory);

  const handleQuickAdd = (food, e) => {
    e.stopPropagation();
    const cartItem = {
      id: food.id,
      name: food.name,
      price: food.basePrice,
      image: food.images[0],
      spice: food.spiceLevels[0].label,
      addOns: [],
      quantity: 1,
      vendorName: food.vendorName,
    };
    addToCart(cartItem);
    toast.success(`${food.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#e21b70] font-bold tracking-wider uppercase text-sm mb-2 block">
            Delicious Options
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#3A0519] mb-4">
            Our Full Menu
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Choose from a wide variety of meals prepared by top-rated vendors in your area.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all flex-shrink-0 flex items-center gap-2 ${
              selectedCategory === "All"
                ? "bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30"
                : "bg-white text-gray-600 hover:bg-pink-50 hover:text-[#e21b70] border border-gray-200"
            }`}
          >
            <FaUtensils size={12} /> All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all flex-shrink-0 flex items-center gap-2 ${
                selectedCategory === cat.name
                  ? "bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30"
                  : "bg-white text-gray-600 hover:bg-pink-50 hover:text-[#e21b70] border border-gray-200"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFoods.map((food) => (
            <motion.div
              key={food.id}
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/food/${food.id}`)}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer group"
            >
              {/* Image */}
              <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#3A0519] text-xs font-bold py-1.5 px-3 rounded-full shadow-sm z-10">
                  {food.category}
                </span>
                <span className="absolute top-4 right-4 bg-[#e21b70] text-white font-bold py-1.5 px-3.5 rounded-full shadow-md z-10 text-sm">
                  {formatPKR(food.basePrice)}
                </span>
                <img
                  src={food.images[0]}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#3A0519] group-hover:text-[#e21b70] transition-colors">
                      {food.name}
                    </h3>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <FaStore className="text-gray-400" /> {food.vendorName}
                    </span>
                    <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 font-bold px-2 py-0.5 rounded-md">
                      <FaStar className="text-yellow-400" /> {food.rating} ({food.reviews})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/food/${food.id}`)}
                    className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-[#3A0519] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    Details <FaArrowRight size={10} />
                  </button>
                  <button
                    onClick={(e) => handleQuickAdd(food, e)}
                    className="py-2.5 px-3 bg-[#e21b70] hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#e21b70]/20"
                  >
                    <FaShoppingCart size={11} /> Quick Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;

