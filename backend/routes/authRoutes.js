// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  otpVerificationLimiter,
  otpResendLimiter,
  forgotPasswordLimiter,
  passwordResetLimiter,
} = require("../middleware/rateLimitMiddleware");

// ── Signup + email verification ──────────────────────────
router.post("/register", register);
router.post("/verify-otp", otpVerificationLimiter, verifyOtp);
router.post("/resend-otp", otpResendLimiter, resendOtp);

// ── Login / logout ────────────────────────────────────────
router.post("/login", login);
router.post("/logout", logout);

// ── Password reset ───────────────────────────────────────
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);

// ── Current user (protected) ─────────────────────────────
router.get("/me", getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
