// src/pages/vendor/AddFood.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaImage,
  FaArrowLeft,
  FaCheckCircle,
  FaUtensils,
  FaPepperHot,
  FaTags,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { allFoods, categories } from "../../data/foodData";

const AddFood = () => {
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
    name: "",
    category: "Fast Food",
    basePrice: "",
    description: "",
    vendorName: "Burger Hub (My Kitchen)",
    tags: ["Halal", "Fresh"],
  });

  // Images state (URLs or preview paths)
  const [imageUrls, setImageUrls] = useState([
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
  ]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Spice Levels State
  const [spiceLevels, setSpiceLevels] = useState([
    { label: "Mild / Regular", priceExtra: 0 },
    { label: "Spicy", priceExtra: 0 },
    { label: "Extra Spicy 🌶️", priceExtra: 30 },
  ]);

  // Add-ons State
  const [addOns, setAddOns] = useState([
    { label: "Extra Cheese Slice", price: 60 },
    { label: "Double Patty", price: 180 },
  ]);

  const [newAddOnLabel, setNewAddOnLabel] = useState("");
  const [newAddOnPrice, setNewAddOnPrice] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add image URL
  const handleAddImageUrl = () => {
    if (customImageUrl.trim()) {
      setImageUrls([...imageUrls, customImageUrl.trim()]);
      setCustomImageUrl("");
      toast.success("Image added to food gallery!");
    }
  };

  // Remove Image
  const handleRemoveImage = (index) => {
    if (imageUrls.length <= 1) {
      toast.error("Food item must have at least 1 image!");
      return;
    }
    setImageUrls(imageUrls.filter((_, idx) => idx !== index));
  };

  // Spice level handlers
  const handleAddSpice = () => {
    setSpiceLevels([...spiceLevels, { label: "New Spice Level", priceExtra: 0 }]);
  };

  const handleSpiceChange = (index, field, value) => {
    const updated = [...spiceLevels];
    updated[index][field] = value;
    setSpiceLevels(updated);
  };

  const handleRemoveSpice = (index) => {
    setSpiceLevels(spiceLevels.filter((_, idx) => idx !== index));
  };

  // Add-ons handlers
  const handleAddAddOn = () => {
    if (newAddOnLabel.trim() && newAddOnPrice) {
      setAddOns([
        ...addOns,
        { label: newAddOnLabel.trim(), price: Number(newAddOnPrice) },
      ]);
      setNewAddOnLabel("");
      setNewAddOnPrice("");
      toast.success("Add-on created!");
    } else {
      toast.error("Please enter both Add-on name and price!");
    }
  };

  const handleRemoveAddOn = (index) => {
    setAddOns(addOns.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.basePrice || !form.description.trim()) {
      toast.error("Please fill in all required fields (Name, Price, Description)!");
      return;
    }

    const newFoodItem = {
      id: Date.now(),
      name: form.name,
      basePrice: Number(form.basePrice),
      category: form.category,
      vendorId: "vendor_1",
      vendorName: form.vendorName,
      vendorAvatar: "https://ui-avatars.com/api/?name=Burger+Hub&background=3A0519&color=fff",
      rating: 5.0,
      reviews: 1,
      description: form.description,
      images: imageUrls,
      spiceLevels: spiceLevels,
      addOns: addOns,
      tags: form.tags,
    };

    // Prepend to allFoods array in data memory
    allFoods.unshift(newFoodItem);

    // Also persist to localStorage for local testing
    try {
      const vendorFoods = JSON.parse(localStorage.getItem("food_garden_vendor_foods") || "[]");
      localStorage.setItem("food_garden_vendor_foods", JSON.stringify([newFoodItem, ...vendorFoods]));
    } catch (err) {
      console.error(err);
    }

    toast.success(`🎉 "${form.name}" has been posted to the Food Marketplace!`);
    setTimeout(() => {
      navigate("/vendor/menu");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Breadcrumb & Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            to="/vendor/menu"
            className="text-xs font-extrabold text-[#e21b70] hover:underline flex items-center gap-1.5 mb-2"
          >
            <FaArrowLeft size={10} /> Back to Vendor Menu
          </Link>
          <h1 className="text-3xl font-black text-[#3A0519]">Post New Food Item</h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Fill in the details below to add a new dish to your restaurant menu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/vendor/menu")}
          className="bg-gray-100 hover:bg-gray-200 text-[#3A0519] font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: BASIC INFORMATION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#e21b70] flex items-center justify-center font-bold">
              <FaUtensils />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#3A0519]">Basic Information</h2>
              <p className="text-xs text-gray-500 font-medium">Food title, category, and base price</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Food Title */}
            <div className="sm:col-span-2">
              <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                Food Title / Dish Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Double Beef Smash Burger with Secret Sauce"
                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70] cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Price */}
            <div>
              <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                Base Price (PKR) *
              </label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                placeholder="e.g. 599"
                className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm font-extrabold text-[#3A0519] focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15"
                required
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
                Dish Description *
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe ingredients, cooking style, taste profile, sides included..."
                className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-[#3A0519] focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/15"
                required
              ></textarea>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: FOOD IMAGES GALLERY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#e21b70] flex items-center justify-center font-bold">
                <FaImage />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#3A0519]">Food Photos Gallery</h2>
                <p className="text-xs text-gray-500 font-medium">Add high-resolution dish pictures</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#e21b70] bg-pink-50 px-3 py-1 rounded-full">
              {imageUrls.length} Photos Added
            </span>
          </div>

          {/* Existing Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden h-32 border border-gray-200 bg-gray-100">
                <img src={url} alt={`Food Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full text-xs opacity-90 group-hover:opacity-100 transition shadow cursor-pointer"
                  title="Remove Image"
                >
                  <FaTrash size={10} />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-2 left-2 bg-[#3A0519] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    Cover Photo
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add Image URL Row */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-extrabold text-[#3A0519] uppercase tracking-wider block mb-2">
              Add Photo URL or Asset Path
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://images.unsplash.com/... or image URL"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="flex-1 bg-slate-50 border border-gray-200 rounded-2xl py-3 px-4 text-xs font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-[#3A0519] hover:bg-[#520723] text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5"
              >
                <FaPlus size={10} /> Add Photo
              </button>
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: SPICE LEVELS & CUSTOMIZATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FaPepperHot />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#3A0519]">Spice Level Selectors</h2>
                <p className="text-xs text-gray-500 font-medium">Let buyers choose their preferred spice level</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddSpice}
              className="text-xs font-extrabold text-[#e21b70] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FaPlus size={10} /> Add Spice Option
            </button>
          </div>

          <div className="space-y-3">
            {spiceLevels.map((spice, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-gray-100">
                <input
                  type="text"
                  value={spice.label}
                  onChange={(e) => handleSpiceChange(idx, "label", e.target.value)}
                  placeholder="e.g. Extra Spicy 🌶️"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400 font-bold">+PKR</span>
                  <input
                    type="number"
                    value={spice.priceExtra}
                    onChange={(e) => handleSpiceChange(idx, "priceExtra", Number(e.target.value))}
                    placeholder="0"
                    className="w-20 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpice(idx)}
                  className="text-gray-400 hover:text-red-600 p-2 transition cursor-pointer"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 4: GOURMET ADD-ONS BUILDER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaTags />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#3A0519]">Extra Add-ons & Toppings</h2>
              <p className="text-xs text-gray-500 font-medium">Extra cheese, patty, sauces, sides</p>
            </div>
          </div>

          {/* List of Add-ons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addOns.map((addon, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#3A0519] text-xs block">{addon.label}</span>
                  <span className="text-[10px] font-bold text-[#e21b70]">+PKR {addon.price}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAddOn(idx)}
                  className="text-gray-400 hover:text-red-600 p-1.5 transition cursor-pointer"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Add-on Inputs */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <input
              type="text"
              placeholder="Add-on Name e.g. Extra Crispy Bacon"
              value={newAddOnLabel}
              onChange={(e) => setNewAddOnLabel(e.target.value)}
              className="sm:col-span-7 bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
            />
            <input
              type="number"
              placeholder="Price (+PKR)"
              value={newAddOnPrice}
              onChange={(e) => setNewAddOnPrice(e.target.value)}
              className="sm:col-span-3 bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-extrabold text-[#3A0519] focus:outline-none focus:border-[#e21b70]"
            />
            <button
              type="button"
              onClick={handleAddAddOn}
              className="sm:col-span-2 bg-[#e21b70] hover:bg-pink-600 text-white font-extrabold text-xs px-4 py-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm"
            >
              <FaPlus size={10} /> Add
            </button>
          </div>
        </motion.div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-black text-base py-4 rounded-2xl transition-all shadow-xl shadow-[#e21b70]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <FaCheckCircle size={18} /> Post Food Item To Marketplace
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFood;
