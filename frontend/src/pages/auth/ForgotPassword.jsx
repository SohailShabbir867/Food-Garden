import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import BgImage from "../../assets/hero/Burger.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));
    setSent(true);
    toast.success("OTP sent! Check your email.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 relative overflow-hidden bg-[#1a0009]">
      {/* Background Image & Overlay */}
      <img src={BgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
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
            No worries! Enter your email and we'll send you a reset code.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
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
                className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/30 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
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
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <span className="text-3xl">✉️</span>
              </div>
              <p className="text-green-400 font-semibold">Reset code sent to <br /><span className="text-white">{email}</span></p>
              <Link
                to="/verify-otp"
                className="inline-block w-full bg-[#e21b70] text-white font-bold py-3.5 rounded-xl hover:bg-pink-600 transition shadow-lg"
              >
                Enter OTP Code →
              </Link>
            </motion.div>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Remember it?{" "}
            <Link to="/login" className="text-[#e21b70] hover:text-pink-400 font-semibold transition">Back to Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
