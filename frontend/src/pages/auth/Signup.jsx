import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaEye, FaEyeSlash, FaStar
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import SliderImage from "../../assets/slider/signup.jpg";


const Signup = () => {
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
    const result = login({ email: form.email, password: form.password });
    if (result.success) {
      toast.success("Account created! Welcome to Food Garden 🎉");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a0009] flex pt-16">

      {/* ─────────────────────────────────── */}
      {/*  LEFT — Form Panel                  */}
      {/* ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-7">
            <p className="text-[#e21b70] font-semibold text-sm uppercase tracking-widest mb-2">
              Join Food Garden 🍔
            </p>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Create your account
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Already registered?{" "}
              <Link to="/login" className="text-[#e21b70] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Ali Khan"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">Phone</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="0300-1234567"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-9 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                  >
                    {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">Confirm</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-1 text-sm"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : "Create Account →"}
            </motion.button>
          </form>

          <p className="text-gray-700 text-xs text-center mt-5">
            By signing up, you agree to our{" "}
            <a href="#" className="text-gray-500 hover:text-[#e21b70] transition underline">Terms of Service</a>
          </p>
        </motion.div>
      </div>

      {/* ─────────────────────────────────── */}
      {/*  RIGHT — Image Panel                */}
      {/* ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Static image */}
        <img
          src={SliderImage}
          alt="Food Garden"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0009]/40 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <div className="bg-[#e21b70] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
            <FaStar className="text-yellow-300 text-sm" />
            <span className="text-white font-bold text-sm">4.9</span>
            <span className="text-pink-200 text-xs">Rating</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            500+ Restaurants
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold text-white mb-2">Start Selling Today</h2>
            <p className="text-gray-300 text-base mb-6">Join hundreds of vendors earning on Food Garden.</p>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "500+", label: "Restaurants" },
              { value: "10K+", label: "Happy Buyers" },
              { value: "30 min", label: "Avg. Delivery" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center"
              >
                <p className="text-white font-extrabold text-lg">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;
