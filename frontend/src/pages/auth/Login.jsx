import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStar, FaQuoteLeft
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import SliderImage from "../../assets/slider/loginslider.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    const result = login({ email, password });
    if (result.success) {
      toast.success("Welcome back!");
      if (result.role === "vendor") navigate("/vendor/dashboard");
      else if (result.role === "admin") navigate("/admin/dashboard");
      else navigate(from);
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a0009] flex pt-16">

      {/* ─────────────────────────────────── */}
      {/*  LEFT — Form Panel                  */}
      {/* ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-8">
            <p className="text-[#e21b70] font-semibold text-sm uppercase tracking-widest mb-2">
              Welcome Back 👋
            </p>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Sign in to your account
            </h1>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] focus:bg-white/8 transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] focus:bg-white/8 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-2 text-sm"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : "Sign In →"}
            </motion.button>
          </form>

          <div className="flex flex-col items-center gap-3 mt-6">
            <Link to="/forgot-password" className="text-sm text-[#e21b70] font-semibold hover:underline transition">
              Forgot Password?
            </Link>
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white font-semibold hover:text-[#e21b70] transition">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────── */}
      {/*  RIGHT — Image Panel                */}
      {/* ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative py-4 lg:py-8 lg:pl-4">
        <div className="relative w-full h-full rounded-l-[3.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border-y border-l border-white/5">
        {/* Static image */}
        <img
          src={SliderImage}
          alt="Food Garden"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Top-right tag */}
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Free Delivery Available
        </div>

        {/* Rating badge */}
        <div className="absolute top-6 left-6 bg-[#e21b70] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
          <FaStar className="text-yellow-300 text-sm" />
          <span className="text-white font-bold text-sm">4.9</span>
          <span className="text-pink-200 text-xs">/ 5.0</span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold text-white mb-2">
              Fresh Food, Fast Delivery
            </h2>
            <p className="text-gray-300 text-base">Order from the best local restaurants in Pakistan.</p>
          </motion.div>

          {/* Testimonial card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-start gap-3"
          >
            <FaQuoteLeft className="text-[#e21b70] text-lg shrink-0 mt-1" />
            <div>
              <p className="text-white text-sm leading-relaxed">
                "Best food delivery in Lahore. Always fresh, always on time!"
              </p>
              <p className="text-gray-400 text-xs mt-1.5">— Ayesha K., Loyal Customer</p>
            </div>
          </motion.div>
        </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
