import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUtensils, FaShoppingBag } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [role, setRole] = useState("buyer"); // "buyer" | "vendor"
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

    // Simulate API delay
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a0009] via-[#3A0519] to-[#1a0009] flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#e21b70] rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#e21b70] rounded-full filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e21b70] shadow-lg shadow-[#e21b70]/30 mb-4"
            >
              <FaUtensils className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-1 text-sm">Sign in to your Food Garden account</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
            {[
              { id: "buyer", label: "I'm a Buyer", icon: <FaShoppingBag /> },
              { id: "vendor", label: "I'm a Vendor", icon: <FaUtensils /> },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  role === r.id
                    ? "bg-[#e21b70] text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-[#e21b70] hover:text-pink-400 transition">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : "Sign In"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#e21b70] font-semibold hover:text-pink-400 transition">
              Create Account
            </Link>
          </p>

          {/* Admin Link */}
          <p className="text-center text-gray-600 text-xs mt-4">
            <Link to="/admin/dashboard" className="hover:text-gray-400 transition underline">
              Login as Admin →
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          <Link to="/" className="hover:text-white transition">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
