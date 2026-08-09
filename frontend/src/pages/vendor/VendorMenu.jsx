// src/pages/vendor/VendorMenu.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaSearch,
  FaUtensils, FaCheckCircle, FaTimesCircle,
  FaFilter, FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchVendorMenu,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../../services/vendorApi";

const CATEGORIES = ["All", "Burgers", "Pizza", "Rolls", "Desi", "Drinks", "Desserts", "Others"];

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const BLANK_FORM = { title: "", description: "", price: "", category: "Burgers", image: "", isAvailable: true };

const VendorMenu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Add / Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // food object or null
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  // ── Load menu from backend ───────────────────────────────
  const loadMenu = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== "All") params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await fetchVendorMenu(params);
      setFoods(res.foods || []);
    } catch (err) {
      toast.error(err.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(loadMenu, 300); // debounce search
    return () => clearTimeout(timer);
  }, [loadMenu]);

  // ── Toggle availability ──────────────────────────────────
  const handleToggleAvailability = async (food) => {
    try {
      const res = await updateFoodItem(food._id, { isAvailable: !food.isAvailable });
      setFoods((prev) =>
        prev.map((f) => (f._id === food._id ? res.food : f))
      );
      toast.success(`"${food.title}" marked as ${!food.isAvailable ? "Available" : "Out of Stock"}`);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async (food) => {
    if (!window.confirm(`Remove "${food.title}" from your menu?`)) return;
    try {
      await deleteFoodItem(food._id);
      setFoods((prev) => prev.filter((f) => f._id !== food._id));
      toast.info(`"${food.title}" removed`);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  // ── Open modal ───────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(BLANK_FORM);
    setShowModal(true);
  };

  const openEdit = (food) => {
    setEditing(food);
    setForm({
      title: food.title,
      description: food.description || "",
      price: food.price,
      category: food.category,
      image: food.image || "",
      isAvailable: food.isAvailable,
    });
    setShowModal(true);
  };

  // ── Save (add or update) ─────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) {
      toast.warn("Title and price are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateFoodItem(editing._id, form);
        setFoods((prev) => prev.map((f) => (f._id === editing._id ? res.food : f)));
        toast.success("Item updated!");
      } else {
        const res = await addFoodItem(form);
        setFoods((prev) => [res.food, ...prev]);
        toast.success("New item added!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
            Kitchen Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3A0519]">Manage Menu</h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            {foods.length} item{foods.length !== 1 ? "s" : ""} in your menu
          </p>
        </div>

        <button
          onClick={openAdd}
          className="bg-[#e21b70] hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-[#e21b70]/30 flex items-center gap-2 cursor-pointer"
        >
          <FaPlus /> Post New Food Item
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
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

        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <FaFilter className="text-gray-400 text-xs flex-shrink-0" />
          {CATEGORIES.map((cat) => (
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

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="text-3xl text-[#e21b70] animate-spin" />
            <span className="ml-3 text-gray-400 font-bold text-sm">Loading menu...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Dish Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Availability</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold">
                {foods.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <FaUtensils className="text-3xl text-pink-200 mx-auto mb-2" />
                      <p className="text-gray-400 font-bold">No items found</p>
                      <button
                        onClick={openAdd}
                        className="mt-3 text-[#e21b70] font-extrabold text-xs hover:underline cursor-pointer"
                      >
                        + Add your first item
                      </button>
                    </td>
                  </tr>
                ) : (
                  foods.map((food) => (
                    <tr key={food._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#e21b70] flex-shrink-0 overflow-hidden">
                            {food.image ? (
                              <img src={food.image} alt={food.title} className="w-full h-full object-cover" />
                            ) : (
                              <FaUtensils size={16} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#3A0519] text-sm">{food.title}</h4>
                            <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs font-medium">
                              {food.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="bg-pink-50 text-[#e21b70] text-[11px] px-2.5 py-1 rounded-full border border-pink-100 font-bold">
                          {food.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-black text-[#3A0519] text-sm">
                        {formatPKR(food.price)}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleAvailability(food)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 cursor-pointer border transition-all ${
                            food.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {food.isAvailable ? (
                            <><FaCheckCircle /> In Stock</>
                          ) : (
                            <><FaTimesCircle /> Out of Stock</>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(food)}
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(food)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                            title="Delete"
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
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#3A0519] to-[#e21b70] p-6 text-white">
                <h2 className="text-lg font-black">
                  {editing ? "Edit Food Item" : "Add New Food Item"}
                </h2>
                <p className="text-xs text-pink-200 mt-1">
                  {editing ? "Update details for this menu item" : "Add a new dish to your kitchen menu"}
                </p>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Dish Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Classic Zinger Burger"
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="550"
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe the dish..."
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70] resize-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-3">
                    <input
                      id="isAvailable"
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                      className="w-4 h-4 accent-[#e21b70] cursor-pointer"
                    />
                    <label htmlFor="isAvailable" className="text-sm font-bold text-[#3A0519] cursor-pointer">
                      Mark as Available (In Stock)
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-extrabold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-[#e21b70] hover:bg-pink-600 text-white rounded-2xl text-sm font-extrabold transition shadow-lg shadow-[#e21b70]/30 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : null}
                    {saving ? "Saving..." : editing ? "Update Item" : "Add to Menu"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorMenu;
