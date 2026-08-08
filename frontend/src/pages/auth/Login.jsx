// src/pages/auth/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaQuoteLeft,
  FaUserShield,
  FaStore,
  FaUserCheck,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import SliderImage from "../../assets/slider/loginslider.jpg";

const Login = () => {
  const { login, loginAsDemoRole, DEMO_CREDENTIALS } = useAuth();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.buyer.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.buyer.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleQuickDemo = (roleKey) => {
    const cred = DEMO_CREDENTIALS[roleKey];
    setEmail(cred.email);
    setPassword(cred.password);

    const result = loginAsDemoRole(roleKey);
    toast.success(`🔑 Logged in as ${cred.name} (${cred.role.toUpperCase()})`);

    if (result.role === "admin") navigate("/admin/dashboard");
    else if (result.role === "vendor") navigate("/vendor/dashboard");
    else navigate(from);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const result = login({ email, password });
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}!`);
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
          <div className="mb-6">
            <p className="text-[#e21b70] font-semibold text-xs uppercase tracking-widest mb-1.5">
              Welcome Back 👋
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Sign in to your account
            </h1>
          </div>

          {/* QUICK DEMO ACCOUNTS SELECTOR */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-6">
            <p className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              ⚡ 1-Click Demo Accounts (.env Data)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("buyer")}
                className="bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/30 text-white p-2.5 rounded-xl transition text-center cursor-pointer"
              >
                <FaUserCheck className="text-[#e21b70] mx-auto text-sm mb-1" />
                <span className="text-[11px] font-extrabold block">Buyer</span>
                <span className="text-[9px] text-gray-400 block font-mono">buyer@</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("vendor")}
                className="bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/30 text-white p-2.5 rounded-xl transition text-center cursor-pointer"
              >
                <FaStore className="text-amber-400 mx-auto text-sm mb-1" />
                <span className="text-[11px] font-extrabold block">Vendor</span>
                <span className="text-[9px] text-gray-400 block font-mono">vendor@</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-white p-2.5 rounded-xl transition text-center cursor-pointer"
              >
                <FaUserShield className="text-purple-400 mx-auto text-sm mb-1" />
                <span className="text-[11px] font-extrabold block">Admin</span>
                <span className="text-[9px] text-gray-400 block font-mono">admin@</span>
              </button>
            </div>
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] focus:bg-white/8 transition text-sm font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex justify-between items-center">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] focus:bg-white/8 transition text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer"
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
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-2 text-sm cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                "Sign In →"
              )}
            </motion.button>
          </form>

          <div className="flex flex-col items-center gap-3 mt-6">
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
          <img
            src={SliderImage}
            alt="Food Garden"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Top-right tag */}
          <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Demo LocalStorage Active
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
                  "Best multi-vendor food portal! Test credentials preloaded via .env environment file."
                </p>
                <p className="text-gray-400 text-xs mt-1.5">— Food Garden Team</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
