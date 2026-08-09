// src/pages/vendor/VendorProfile.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStore, FaPhone, FaMapMarkerAlt, FaUtensils, FaSave, FaSpinner, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchVendorProfile, updateVendorProfile } from "../../services/vendorApi";

const InputField = ({ label, icon, ...props }) => (
  <div>
    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block mb-1.5">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{icon}</span>
      )}
      <input
        {...props}
        className={`w-full border border-gray-200 rounded-xl py-3 ${icon ? "pl-10" : "pl-4"} pr-4 text-sm font-bold text-[#3A0519] focus:outline-none focus:border-[#e21b70] bg-slate-50 focus:bg-white transition`}
      />
    </div>
  </div>
);

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    storeName: "",
    cuisine: "",
    phone: "",
    city: "",
    banner: "",
    logo: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchVendorProfile();
        const v = res.vendor;
        setVendor(v);
        setForm({
          storeName: v.storeName || "",
          cuisine: v.cuisine || "",
          phone: v.phone || "",
          city: v.city || "",
          banner: v.banner || "",
          logo: v.logo || "",
        });
      } catch (err) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateVendorProfile(form);
      setVendor(res.vendor);
      toast.success("Store profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <FaSpinner className="text-4xl text-[#e21b70] animate-spin" />
        <span className="ml-3 text-gray-500 font-bold">Loading store profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-1">
          Store Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#3A0519]">Vendor Profile</h1>
        <p className="text-gray-500 text-xs font-medium mt-1">
          Update your store information, contact details, and branding.
        </p>
      </div>

      {/* Store Status Card */}
      {vendor && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#3A0519] to-[#e21b70] text-white rounded-2xl p-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
              {vendor.logo ? (
                <img src={vendor.logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <FaStore className="text-2xl text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black">{vendor.storeName}</h2>
              <p className="text-pink-200 text-xs font-medium">{vendor.cuisine}</p>
              <p className="text-pink-200 text-xs mt-0.5">{vendor.city}</p>
            </div>
          </div>

          <div className="text-right space-y-1.5">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${
              vendor.status === "approved"
                ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                : vendor.status === "pending"
                ? "bg-amber-500/20 border-amber-400/30 text-amber-300"
                : "bg-red-500/20 border-red-400/30 text-red-300"
            }`}>
              {vendor.status?.toUpperCase()}
            </span>
            <div className="flex items-center justify-end gap-1 text-yellow-300 text-sm font-black">
              <FaStar size={11} />
              {vendor.rating?.toFixed(1)}
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-base font-black text-[#3A0519] mb-6 pb-4 border-b border-gray-100">
          Edit Store Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Store Name"
              icon={<FaStore />}
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              placeholder="e.g. Spice Garden"
              required
            />
            <InputField
              label="Cuisine Type"
              icon={<FaUtensils />}
              value={form.cuisine}
              onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
              placeholder="e.g. Pakistani BBQ & Karahi"
            />
            <InputField
              label="Phone Number"
              icon={<FaPhone />}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+92 321 0000000"
              type="tel"
            />
            <InputField
              label="City"
              icon={<FaMapMarkerAlt />}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Lahore"
            />
            <InputField
              label="Logo URL"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              placeholder="https://..."
              type="url"
            />
            <InputField
              label="Banner Image URL"
              value={form.banner}
              onChange={(e) => setForm({ ...form, banner: e.target.value })}
              placeholder="https://..."
              type="url"
            />
          </div>

          {/* Preview */}
          {(form.banner || form.logo) && (
            <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Preview</p>
              <div className="flex items-center gap-3">
                {form.logo && (
                  <img src={form.logo} alt="Logo preview" className="w-12 h-12 rounded-xl object-cover border border-gray-200" onError={(e) => (e.target.style.display = "none")} />
                )}
                {form.banner && (
                  <img src={form.banner} alt="Banner preview" className="h-12 flex-1 rounded-xl object-cover border border-gray-200" onError={(e) => (e.target.style.display = "none")} />
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#e21b70] hover:bg-pink-600 text-white font-extrabold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-[#e21b70]/30 flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProfile;
