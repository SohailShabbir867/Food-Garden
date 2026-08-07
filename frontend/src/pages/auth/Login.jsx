import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaUtensils, FaShoppingBag, FaStar, FaQuoteLeft
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

// Food images for the right panel slideshow
import Burger from "../../assets/hero/Burger.jpg";
import Pizza from "../../assets/hero/Piza.jpg";
import Rolls from "../../assets/hero/Rools.jpg";

const slides = [
  {
    img: Burger,
    title: "Gourmet Burgers",
    subtitle: "Juicy, flame-grilled, delivered to your door.",
  },
  {
    img: Pizza,
    title: "Authentic Pizzas",
    subtitle: "Wood-fired perfection from local chefs.",
  },
  {
    img: Rolls,
    title: "Fresh Rolls",
    subtitle: "Crispy on the outside, flavourful inside.",
  },
];

const Login = () => {
  const [role, setRole] = useState("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    const result = login({ email, password, role });
    if (result.success) {
      toast.success(`Welcome back! Logged in as ${role}.`);
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
            <p className="text-gray-500 mt-2 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#e21b70] font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-7">
            {[
              { id: "buyer", label: "Buyer", icon: <FaShoppingBag size={13} /> },
              { id: "vendor", label: "Vendor", icon: <FaUtensils size={13} /> },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  role === r.id
                    ? "bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {r.icon} {r.label}
              </button>
            ))}
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#e21b70] hover:underline">
                  Forgot Password?
                </Link>
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

          {/* Admin shortcut */}
          <p className="text-center text-gray-700 text-xs mt-6">
            Platform admin?{" "}
            <Link to="/admin/dashboard" className="text-gray-500 hover:text-gray-300 underline transition">
              Admin Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ─────────────────────────────────── */}
      {/*  RIGHT — Image Panel (hidden mobile) */}
      {/* ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Slideshow */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].img}
            alt={slides[currentSlide].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

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

        {/* Slide Content */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          {/* Slide dots */}
          <div className="flex gap-2 mb-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-[#e21b70] w-8" : "bg-white/30 w-3"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-extrabold text-white mb-2">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-300 text-base">{slides[currentSlide].subtitle}</p>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
  );
};

export default Login;
