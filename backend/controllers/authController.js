// backend/controllers/authController.js

const User = require("../models/User");
const crypto = require("crypto");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");
const { sendSignupOtpEmail, sendPasswordResetOtpEmail } = require("../utils/sendEmail");

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");
const normaliseEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");

// Shape a user for API responses — never send back password/otp fields.
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  restaurantName: user.restaurantName,
});

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates an unverified user and emails them a 6-digit OTP.
// ─────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, password, role, restaurantName } = req.body;
    const email = normaliseEmail(req.body.email);

    if (!name?.trim() || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email });

    // If the email exists but was never verified, let them re-register
    // (overwrite with a fresh OTP) instead of getting stuck forever.
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // Whoever signs up with the ADMIN_EMAIL (set in backend/.env) is always
    // made an admin, no matter what role they picked on the signup form.
    const isAdminEmail =
      process.env.ADMIN_EMAIL &&
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    const resolvedRole = isAdminEmail ? "admin" : role === "vendor" ? "vendor" : "buyer";

    const { otp, expiry } = generateOtp();

    let user;
    if (existing && !existing.isVerified) {
      existing.name = name;
      existing.password = password; // pre-save hook re-hashes it
      existing.role = resolvedRole;
      existing.restaurantName = restaurantName;
      existing.otp = hashOtp(otp);
      existing.otpExpiry = expiry;
      user = await existing.save();
    } else {
      user = await User.create({
        name,
        email,
        password,
        role: resolvedRole,
        restaurantName,
        otp: hashOtp(otp),
        otpExpiry: expiry,
      });
    }

    await sendSignupOtpEmail(user.email, user.name, otp);

    res.status(201).json({
      message: "Account created. Check your email for the verification code.",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Confirms the signup OTP, marks the user verified, and logs them in.
// ─────────────────────────────────────────────────────────────────
const verifyOtp = async (req, res, next) => {
  try {
    const email = normaliseEmail(req.body.email);
    const { otp } = req.body;

    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified" });
    }

    if (!user.otp || !otp || user.otp !== hashOtp(otp)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Verification code has expired. Request a new one." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    generateToken(res, user._id);

    res.json({
      message: "Email verified successfully",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/resend-otp
// Re-sends a fresh signup OTP (e.g. the old one expired).
// ─────────────────────────────────────────────────────────────────
const resendOtp = async (req, res, next) => {
  try {
    const email = normaliseEmail(req.body.email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified" });
    }

    const { otp, expiry } = generateOtp();
    user.otp = hashOtp(otp);
    user.otpExpiry = expiry;
    await user.save();

    await sendSignupOtpEmail(user.email, user.name, otp);

    res.json({ message: "A new verification code has been sent to your email." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const email = normaliseEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        email: user.email,
        needsVerification: true,
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "This account has been blocked. Please contact support." });
    }

    // Safety net: if this is the designated admin email but the stored role
    // hasn't caught up (e.g. account existed before ADMIN_EMAIL was set), fix it now.
    const isAdminEmail =
      process.env.ADMIN_EMAIL &&
      user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    if (isAdminEmail && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    generateToken(res, user._id);

    res.json({
      message: "Logged in successfully",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// Sends a reset OTP if the email exists (doesn't reveal if it doesn't,
// to avoid leaking which emails are registered).
// ─────────────────────────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const email = normaliseEmail(req.body.email);
    const user = await User.findOne({ email });

    if (user) {
      const { otp, expiry } = generateOtp();
      user.resetOtp = hashOtp(otp);
      user.resetOtpExpiry = expiry;
      await user.save();
      await sendPasswordResetOtpEmail(user.email, user.name, otp);
    }

    // Same response whether or not the email exists.
    res.json({ message: "If that email is registered, a reset code has been sent." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// Verifies the reset OTP and sets a new password.
// ─────────────────────────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const email = normaliseEmail(req.body.email);
    const { otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, code and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findOne({ email }).select("+resetOtp +resetOtpExpiry");
    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }

    if (!user.resetOtp || user.resetOtp !== hashOtp(otp)) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ message: "Reset code has expired. Request a new one." });
    }

    user.password = newPassword; // pre-save hook re-hashes it
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// ─────────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// ─────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
};
