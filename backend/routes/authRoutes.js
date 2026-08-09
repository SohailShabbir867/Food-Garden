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
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ── Signup + email verification ──────────────────────────
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// ── Login / logout ────────────────────────────────────────
router.post("/login", login);
router.post("/logout", logout);

// ── Password reset ───────────────────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ── Current user (protected) ─────────────────────────────
router.get("/me", getMe);

module.exports = router;
