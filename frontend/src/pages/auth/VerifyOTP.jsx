// src/pages/auth/VerifyOTP.jsx

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { verifyOtpApi, resendOtpApi, resetPasswordApi } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // For password-reset flow
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const refs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // email and mode ("signup" | "reset") passed via navigation state
  const email = location.state?.email || "";
  const mode = location.state?.mode || "signup"; // "signup" or "reset"

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please start over.");
      navigate(mode === "reset" ? "/forgot-password" : "/signup");
    }
  }, [email, mode, navigate]);

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

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  // ── Signup OTP verification ────────────────────────────
  const handleSignupVerify = async (code) => {
    setLoading(true);
    try {
      const data = await verifyOtpApi({ email, otp: code });

      // Save token from verification response
      if (data.token) localStorage.setItem("food_garden_token", data.token);

      toast.success("Email verified! Welcome to Food Garden 🎉");

      // Re-log through AuthContext so user state is set
      // (verifyOtp returns a token — use it via getMe or just redirect)
      if (data.user) {
        localStorage.setItem("food_garden_user", JSON.stringify(data.user));
      }

      navigate("/");
    } catch (err) {
      toast.error(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset password OTP verification ───────────────────
  const handleResetVerify = async (code) => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Please enter a new password (min 6 characters).");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordApi({ email, otp: code, newPassword });
      toast.success("Password reset! Please log in with your new password. 🔑");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    if (mode === "reset") {
      await handleResetVerify(code);
    } else {
      await handleSignupVerify(code);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtpApi(email);
      setTimer(120);
      setOtp(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
      toast.info("A new verification code has been sent to your email.");
    } catch (err) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const isReset = mode === "reset";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0009] via-[#3A0519] to-[#1a0009] flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#e21b70] rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#e21b70] rounded-full filter blur-[120px] opacity-20 -translate-x-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e21b70] shadow-lg shadow-[#e21b70]/30 mb-4 text-3xl"
            >
              {isReset ? "🔑" : "📧"}
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white">
              {isReset ? "Reset Password" : "Verify Your Email"}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter the 6-digit code sent to{" "}
              <span className="text-[#e21b70] font-bold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
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
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 bg-white/10 text-white transition-all focus:outline-none ${
                    digit
                      ? "border-[#e21b70] shadow-[0_0_12px_rgba(226,27,112,0.4)]"
                      : "border-white/20 focus:border-[#e21b70]"
                  }`}
                />
              ))}
            </div>

            {/* Password fields for reset mode */}
            {isReset && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <div className="border-t border-white/10 pt-4">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                    Set New Password
                  </p>
                  <input
                    id="reset-new-password"
                    type="password"
                    placeholder="New password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm mb-2"
                  />
                  <input
                    id="reset-confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full bg-white/10 border rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none transition text-sm ${
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-red-500"
                        : "border-white/20 focus:border-[#e21b70]"
                    }`}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-xs mt-1 font-bold">Passwords don't match</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Resend Timer */}
            <div className="text-center">
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
                  disabled={resending}
                  className="text-[#e21b70] font-semibold text-sm hover:text-pink-400 transition cursor-pointer flex items-center gap-2 mx-auto"
                >
                  {resending ? <FaSpinner className="animate-spin" /> : null}
                  {resending ? "Sending..." : "Resend OTP →"}
                </button>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/30 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <><FaSpinner className="animate-spin" /> {isReset ? "Resetting Password..." : "Verifying..."}</>
              ) : (
                isReset ? "Reset Password & Login →" : "Verify & Continue →"
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            <Link
              to={isReset ? "/forgot-password" : "/signup"}
              className="text-[#e21b70] hover:text-pink-400 font-semibold transition"
            >
              ← Go Back
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
