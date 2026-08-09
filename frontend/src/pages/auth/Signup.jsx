// src/pages/auth/Signup.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaStore, FaEye, FaEyeSlash, FaStar, FaSpinner,
  FaUserCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { registerUser } from "../../services/authApi";
import SliderImage from "../../assets/slider/signup.jpg";

const ROLES = [
  { value: "buyer",  label: "Buyer",  desc: "Order food online",   icon: <FaUserCheck />, color: "#e21b70" },
  { value: "vendor", label: "Vendor", desc: "Sell your recipes",   icon: <FaStore />,     color: "#f59e0b" },
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("buyer");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    restaurantName: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (selectedRole === "vendor" && !form.restaurantName.trim()) {
      toast.error("Restaurant / store name is required for vendors.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: selectedRole,
        ...(selectedRole === "vendor" && { restaurantName: form.restaurantName.trim() }),
      };

      const data = await registerUser(payload);
      toast.success("Account created! Check your email for the verification code. 📧");
      navigate("/verify-otp", { state: { email: form.email.trim().toLowerCase(), mode: "signup" } });
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0009] flex pt-16">

      {/* ── Left Form Panel ───────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-6">
            <p className="text-[#e21b70] font-semibold text-sm uppercase tracking-widest mb-2">
              Join Food Garden 🍔
            </p>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              A verification code will be sent to your email.
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelectedRole(r.value)}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition cursor-pointer ${
                  selectedRole === r.value
                    ? "border-[#e21b70] bg-[#e21b70]/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <span style={{ color: selectedRole === r.value ? r.color : "#6b7280" }} className="text-lg">
                  {r.icon}
                </span>
                <div className="text-left">
                  <p className={`text-sm font-extrabold ${selectedRole === r.value ? "text-white" : "text-gray-400"}`}>
                    {r.label}
                  </p>
                  <p className="text-[10px] text-gray-500">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="signup-name"
                  type="text" name="name"
                  placeholder="e.g. Ali Khan"
                  value={form.name} onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="signup-email"
                  type="email" name="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="signup-phone"
                  type="tel" name="phone"
                  placeholder="0300-1234567"
                  value={form.phone} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Restaurant Name (vendor only) */}
            {selectedRole === "vendor" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5 block">
                  Restaurant / Store Name *
                </label>
                <div className="relative">
                  <FaStore className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-sm" />
                  <input
                    id="signup-restaurantName"
                    type="text" name="restaurantName"
                    placeholder="e.g. Spice Garden Kitchen"
                    value={form.restaurantName} onChange={handleChange}
                    required={selectedRole === "vendor"}
                    className="w-full bg-amber-500/5 border border-amber-500/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 transition text-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Password Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="min 6 chars"
                    value={form.password} onChange={handleChange}
                    required minLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-9 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                  Confirm
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    id="signup-confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword} onChange={handleChange}
                    required
                    className={`w-full bg-white/5 border rounded-xl py-3 pl-9 pr-4 text-white placeholder-gray-600 focus:outline-none transition text-sm ${
                      form.confirmPassword && form.password !== form.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-white/10 focus:border-[#e21b70]"
                    }`}
                  />
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-400 text-[10px] mt-1 font-bold">Passwords don't match</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-1 text-sm cursor-pointer"
            >
              {loading ? <><FaSpinner className="animate-spin" /> Creating Account...</> : "Create Account & Verify Email →"}
            </motion.button>
          </form>

          <div className="flex flex-col items-center gap-3 mt-5">
            <p className="text-gray-400 text-sm">
              Already registered?{" "}
              <Link to="/login" className="text-white font-semibold hover:text-[#e21b70] transition">
                Sign In
              </Link>
            </p>
            <p className="text-gray-700 text-xs text-center">
              By signing up, you agree to our{" "}
              <a href="#" className="text-gray-500 hover:text-[#e21b70] transition underline">
                Terms of Service
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right Image Panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative py-4 lg:py-8 lg:pl-4">
        <div className="relative w-full h-full rounded-l-[3.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border-y border-l border-white/5">
          <img src={SliderImage} alt="Food Garden" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0009]/40 to-transparent" />

          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <div className="bg-[#e21b70] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
              <FaStar className="text-yellow-300 text-sm" />
              <span className="text-white font-bold text-sm">4.9</span>
              <span className="text-pink-200 text-xs">Rating</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              500+ Restaurants
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl font-extrabold text-white mb-2">Start Selling Today</h2>
              <p className="text-gray-300 text-base mb-6">Join hundreds of vendors earning on Food Garden.</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "500+", label: "Restaurants" },
                { value: "10K+", label: "Happy Buyers" },
                { value: "30 min", label: "Avg. Delivery" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
                  <p className="text-white font-extrabold text-lg">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
