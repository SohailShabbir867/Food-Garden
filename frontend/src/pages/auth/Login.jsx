// src/pages/auth/Login.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaQuoteLeft,
  FaSpinner,
  FaShieldAlt,
  FaExclamationTriangle,
  FaBan,
  FaClock,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SliderImage from "../../assets/slider/loginslider.jpg";
import {
  getDeviceFingerprint,
  getClientDeviceInfo,
} from "../../utils/deviceFingerprint";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Security Lockout & Threat states
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [initialCooldown, setInitialCooldown] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [deviceMac, setDeviceMac] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // Generate device MAC on mount
    const mac = getDeviceFingerprint();
    setDeviceMac(mac);
  }, []);

  // Real-time countdown timer when locked out
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const redirect = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "vendor") navigate("/vendor/dashboard");
    else navigate(from);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Access is blocked on this device/IP. Please contact support.");
      return;
    }

    if (lockoutSeconds > 0) {
      toast.warn(`Please wait ${lockoutSeconds}s for the security lockout timer to expire.`);
      return;
    }

    setLoading(true);

    const deviceInfo = getClientDeviceInfo();

    const result = await login({
      email,
      password,
      deviceMac,
      deviceInfo,
    });

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}! 👋`);
      redirect(result.role);
    } else {
      if (result.isBlocked) {
        setIsBlocked(true);
        setBlockMessage(result.message);
        toast.error(result.message, { autoClose: 6000 });
      } else if (result.isLocked || result.remainingSeconds > 0) {
        setLockoutSeconds(result.remainingSeconds);
        setInitialCooldown(result.remainingSeconds);
        setAttemptCount(result.attempts || 3);
        toast.error(result.message, { autoClose: 5000 });
      } else if (result.message?.includes("verify")) {
        toast.warn("Please verify your email first.");
        navigate("/verify-otp", { state: { email } });
      } else {
        if (result.attempts) setAttemptCount(result.attempts);
        toast.error(result.message || "Invalid credentials. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a0009] flex pt-16">
      {/* ── Left Form Panel ───────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[#e21b70] font-semibold text-xs uppercase tracking-widest">
                Welcome Back 👋
              </p>
              {deviceMac && (
                <span className="text-[11px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <FaShieldAlt className="text-[#e21b70]" size={10} />
                  MAC: {deviceMac}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Sign in to your account
            </h1>
          </div>

          {/* ── Blocked Device Banner ──────────────────────────── */}
          <AnimatePresence>
            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 bg-red-950/80 border border-red-500/50 rounded-2xl p-4 text-red-200 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-600 text-white rounded-xl shrink-0 mt-0.5">
                    <FaBan size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-100 text-sm tracking-wide">
                      Device / IP Permanently Blocked
                    </h4>
                    <p className="text-xs text-red-300 mt-1 leading-relaxed">
                      {blockMessage ||
                        "Excessive unauthorized attempts detected. Your MAC address and IP have been logged and blocked. Contact the administrator to review this incident."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Security Lockout Active Banner ──────────────────── */}
          <AnimatePresence>
            {lockoutSeconds > 0 && !isBlocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 bg-amber-950/80 border border-amber-500/40 rounded-2xl p-4 text-amber-200 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-amber-100 text-sm">
                    <FaClock className="text-amber-400 animate-spin" size={15} />
                    <span>Security Cooldown Lockout</span>
                  </div>
                  <span className="font-mono font-black text-base bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                    {formatTime(lockoutSeconds)}
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 leading-relaxed">
                  Too many consecutive failed login attempts ({attemptCount}). For account protection, submission is locked for{" "}
                  <strong className="text-amber-100">{lockoutSeconds}s</strong>.
                </p>
                {/* Progress bar */}
                <div className="w-full bg-black/40 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{
                      width: `${initialCooldown > 0 ? (lockoutSeconds / initialCooldown) * 100 : 0}%`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Failed Attempt Warning (Before Lockout) ─────────── */}
          {attemptCount > 0 && attemptCount < 3 && lockoutSeconds === 0 && !isBlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 bg-orange-950/60 border border-orange-500/30 rounded-xl p-3 text-orange-200 text-xs flex items-center gap-2.5"
            >
              <FaExclamationTriangle className="text-orange-400 shrink-0" size={14} />
              <span>
                <strong>Warning:</strong> Attempt {attemptCount} of 3. After 3 failed attempts, a security lockout timer will trigger.
              </span>
            </motion.div>
          )}

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
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={lockoutSeconds > 0 || isBlocked}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex justify-between items-center">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#e21b70] hover:text-pink-400 font-semibold transition"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={lockoutSeconds > 0 || isBlocked}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading || lockoutSeconds > 0 || isBlocked}
              className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2 text-sm ${
                isBlocked
                  ? "bg-red-700 text-white cursor-not-allowed opacity-75"
                  : lockoutSeconds > 0
                  ? "bg-amber-600/60 text-amber-200 cursor-not-allowed border border-amber-500/40"
                  : "bg-[#e21b70] hover:bg-pink-600 text-white shadow-[#e21b70]/25 cursor-pointer disabled:opacity-60"
              }`}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : isBlocked ? (
                <span className="flex items-center gap-2">
                  <FaBan /> Access Blocked
                </span>
              ) : lockoutSeconds > 0 ? (
                <span className="flex items-center gap-2">
                  <FaClock /> Locked ({formatTime(lockoutSeconds)})
                </span>
              ) : (
                "Sign In →"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white font-semibold hover:text-[#e21b70] transition">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right Image Panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative py-4 lg:py-8 lg:pl-4">
        <div className="relative w-full h-full rounded-l-[3.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border-y border-l border-white/5">
          <img src={SliderImage} alt="Food Garden" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Active Threat Defense
          </div>

          <div className="absolute top-6 left-6 bg-[#e21b70] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
            <FaStar className="text-yellow-300 text-sm" />
            <span className="text-white font-bold text-sm">4.9</span>
            <span className="text-pink-200 text-xs">/ 5.0</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl font-extrabold text-white mb-2">Fresh Food, Fast Delivery</h2>
              <p className="text-gray-300 text-base">Order from the best local restaurants in Pakistan.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-start gap-3"
            >
              <FaQuoteLeft className="text-[#e21b70] text-lg shrink-0 mt-1" />
              <div>
                <p className="text-white text-sm leading-relaxed">
                  "Best multi-vendor food platform! Real accounts, real orders, real-time chat."
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
