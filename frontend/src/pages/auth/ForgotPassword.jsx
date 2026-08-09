// src/pages/auth/ForgotPassword.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowRight, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { forgotPasswordApi } from "../../services/authApi";
import BgImage from "../../assets/hero/Burger.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email.trim().toLowerCase());
      setSent(true);
      toast.success("Reset code sent! Check your email. 📧");
    } catch (err) {
      // API intentionally returns success even if email not found for security
      // But show a generic message if there's a real network error
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToVerify = () => {
    navigate("/verify-otp", {
      state: { email: email.trim().toLowerCase(), mode: "reset" },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 relative overflow-hidden bg-[#1a0009]">
      {/* Background Image & Overlay */}
      <img
        src={BgImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0009]/95 via-[#1a0009]/80 to-black/90" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#e21b70] rounded-full filter blur-[100px] opacity-30 -translate-x-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e21b70] shadow-lg shadow-[#e21b70]/30 mb-6"
          >
            <FaEnvelope className="text-white text-2xl" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-white mb-2">Forgot Password?</h1>
          <p className="text-gray-400 text-sm mb-8">
            No worries! Enter your registered email and we'll send you a 6-digit reset code.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e21b70] focus:ring-1 focus:ring-[#e21b70] transition"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/30 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <><FaSpinner className="animate-spin" /> Sending...</>
                ) : (
                  <><FaArrowRight /> Send Reset Code</>
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Success state */}
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <span className="text-3xl">✉️</span>
              </div>

              <div>
                <p className="text-green-400 font-semibold text-sm">
                  Reset code sent to
                </p>
                <p className="text-white font-extrabold text-base mt-1">{email}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Didn't receive it? Check your spam folder or wait a minute.
                </p>
              </div>

              <button
                onClick={goToVerify}
                className="w-full bg-[#e21b70] text-white font-bold py-3.5 rounded-xl hover:bg-pink-600 transition shadow-lg cursor-pointer"
              >
                Enter OTP & Set New Password →
              </button>

              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full text-gray-400 text-sm hover:text-white transition cursor-pointer"
              >
                Try a different email
              </button>
            </motion.div>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Remember it?{" "}
            <Link to="/login" className="text-[#e21b70] hover:text-pink-400 font-semibold transition">
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
