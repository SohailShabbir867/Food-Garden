import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaEye, FaEyeSlash, FaUtensils, FaShoppingBag, FaStore
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Signup = () => {
  const [role, setRole] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));

    // Mock registration — auto log in after
    const result = login({ email: form.email, password: form.password, role });
    if (result.success) {
      toast.success(`Account created! Welcome to Food Garden 🎉`);
      if (role === "vendor") navigate("/vendor/dashboard");
      else navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0009] via-[#3A0519] to-[#1a0009] flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#e21b70] rounded-full filter blur-3xl opacity-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-700 rounded-full filter blur-3xl opacity-10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e21b70] shadow-lg shadow-[#e21b70]/30 mb-4"
            >
              <FaStore className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
            <p className="text-gray-400 mt-1 text-sm">Join Food Garden today</p>
          </div>

          {/* Role Selection */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
            {[
              { id: "buyer", label: "Buyer", icon: <FaShoppingBag />, desc: "Order food" },
              { id: "vendor", label: "Vendor", icon: <FaUtensils />, desc: "Sell food" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-300 ${
                  role === r.id
                    ? "bg-[#e21b70] text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5 font-semibold">{r.icon} {r.label}</span>
                <span className="text-xs opacity-75 mt-0.5">{r.desc}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder={role === "vendor" ? "Restaurant / Business Name" : "Full Name"}
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone (e.g. 0300-1234567)"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition"
              />
            </div>

            {/* Vendor extra note */}
            {role === "vendor" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-[#e21b70]/10 border border-[#e21b70]/30 rounded-xl p-3 text-sm text-pink-300"
              >
                🍽️ As a Vendor, your account will be reviewed by our admin before going live.
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : `Create ${role === "vendor" ? "Vendor" : ""} Account`}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#e21b70] font-semibold hover:text-pink-400 transition">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          <Link to="/" className="hover:text-white transition">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
