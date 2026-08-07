// src/pages/vendor/VendorMenu.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaUtensils,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { allFoods } from "../../data/foodData";

const VendorMenu = () => {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Load foods from dataset and localStorage
  useEffect(() => {
    try {
      const vendorSaved = JSON.parse(localStorage.getItem("food_garden_vendor_foods") || "[]");
      const combined = [...vendorSaved, ...allFoods];
      // Filter unique by ID
      const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
      setFoods(unique);
    } catch (e) {
      setFoods(allFoods);
    }
  }, []);

  // Filter logic
  const filteredFoods = foods.filter((food) => {
    const matchesCat = categoryFilter === "All" || food.category === categoryFilter;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Toggle Stock Status
  const handleToggleStock = (foodId) => {
    setFoods((prev) =>
      prev.map((f) =>
        f.id === foodId ? { ...f, inStock: f.inStock === false ? true : false } : f
      )
    );
    toast.success("Stock status updated!");
  };

  // Delete Food Item
  const handleDeleteFood = (foodId, foodName) => {
    if (window.confirm(`Are you sure you want to remove "${foodName}" from your menu?`)) {
      setFoods((prev) => prev.filter((f) => f.id !== foodId));
      toast.info(`"${foodName}" removed from menu.`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
            Vendor Kitchen Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3A0519]">Manage Vendor Menu</h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Post new items, update prices, or modify food options for your buyers.
          </p>
        </div>

        <Link
          to="/vendor/add-food"
          className="bg-[#e21b70] hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-[#e21b70]/30 flex items-center gap-2"
        >
          <FaPlus /> Post New Food Item
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search your menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <FaFilter className="text-gray-400 text-xs" />
          {["All", "Fast Food", "Pizza", "Desi", "Snacks", "Drinks"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer flex-shrink-0 ${
                categoryFilter === cat
                  ? "bg-[#3A0519] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Foods Table / Grid */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                <th className="py-4 px-6">Dish Details</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Base Price</th>
                <th className="py-4 px-4">Availability</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold">
              {filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No menu items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-50/70 transition">
                    {/* Dish Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={food.images[0]}
                          alt={food.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-100 flex-shrink-0 shadow-xs"
                        />
                        <div>
                          <h4 className="font-extrabold text-[#3A0519] text-sm">{food.name}</h4>
                          <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs font-medium">
                            {food.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 font-bold text-gray-700">
                      <span className="bg-pink-50 text-[#e21b70] text-[11px] px-2.5 py-1 rounded-full border border-pink-100">
                        {food.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-black text-[#3A0519] text-sm">
                      {formatPKR(food.basePrice)}
                    </td>

                    {/* Stock Status */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStock(food.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 cursor-pointer border ${
                          food.inStock === false
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {food.inStock === false ? (
                          <>
                            <FaTimesCircle /> Out of Stock
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> In Stock
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/food/${food.id}`)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                          title="View Live Page"
                        >
                          <FaEye size={12} />
                        </button>
                        <button
                          onClick={() => navigate("/vendor/add-food")}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer"
                          title="Edit Item"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id, food.name)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                          title="Delete Item"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorMenu;
