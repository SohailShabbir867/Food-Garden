import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));
    toast.success("OTP verified! Please set your new password.");
    navigate("/login");
    setLoading(false);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    toast.info("A new OTP has been sent to your email.");
    refs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0009] via-[#3A0519] to-[#1a0009] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#e21b70] rounded-full filter blur-3xl opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e21b70] shadow-lg shadow-[#e21b70]/30 mb-6 text-3xl"
          >
            🔐
          </motion.div>

          <h1 className="text-3xl font-extrabold text-white mb-2">Verify OTP</h1>
          <p className="text-gray-400 text-sm mb-8">
            Enter the 6-digit code we sent to your email.
          </p>

          <form onSubmit={handleSubmit}>
            {/* OTP Inputs */}
            <div className="flex gap-3 justify-center mb-8">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (refs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white/10 text-white transition-all focus:outline-none ${
                    digit
                      ? "border-[#e21b70] shadow-[0_0_12px_rgba(226,27,112,0.4)]"
                      : "border-white/20 focus:border-[#e21b70]"
                  }`}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="mb-6">
              {timer > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend code in{" "}
                  <span className="text-[#e21b70] font-bold">
                    {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[#e21b70] font-semibold text-sm hover:text-pink-400 transition"
                >
                  Resend OTP →
                </button>
              )}
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
              ) : "Verify & Continue"}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            <Link to="/forgot-password" className="text-[#e21b70] hover:text-pink-400 font-semibold transition">
              ← Go Back
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
