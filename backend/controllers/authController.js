const User = require("../models/User");
const SecurityAlert = require("../models/SecurityAlert");
const BlockedEntity = require("../models/BlockedEntity");
const { getClientIp, lookupGeoLocation } = require("../utils/geoIpHelper");
const crypto = require("crypto");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");
const { sendSignupOtpEmail, sendPasswordResetOtpEmail } = require("../utils/sendEmail");

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");
const normaliseEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");

// Calculate recursive cooldown time, capped at 300 seconds (5 min) max
const calculateCooldownSeconds = (attempts) => {
  if (attempts < 3) return 0;
  if (attempts === 3) return 30; // 30s
  if (attempts === 4) return 60; // 1m
  if (attempts === 5) return 120; // 2m
  const recursiveTime = 120 + (attempts - 5) * 60;
  return Math.min(recursiveTime, 300); // capped at 300s max
};

// Shape a user for API responses — never send back password/otp fields.
const publicUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  city: user.city,
  avatar: user.avatar,
  status: user.status,
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
    const { password, deviceMac, deviceInfo } = req.body;
    const ip = getClientIp(req);
    const currentDeviceMac = deviceMac || req.headers["x-device-mac"] || "Unknown Device";
    const userAgent = req.headers["user-agent"] || "Unknown";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Check if IP or Device MAC is permanently blocked
    const blockQuery = [{ type: "ip", value: ip, isActive: true }];
    if (currentDeviceMac && currentDeviceMac !== "Unknown Device") {
      blockQuery.push({ type: "deviceMac", value: currentDeviceMac, isActive: true });
    }
    const isBlocked = await BlockedEntity.findOne({ $or: blockQuery });
    if (isBlocked) {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: `ACCESS BLOCKED: This ${isBlocked.type === "deviceMac" ? "Device (" + isBlocked.value + ")" : "IP (" + isBlocked.value + ")"} has been blocked due to multiple unauthorized login attempts.`,
      });
    }

    // 2. Check for active temporary lockout
    const alertQuery = {
      $or: [
        { email, status: "locked" },
        { ip, status: "locked" },
        ...(currentDeviceMac !== "Unknown Device" ? [{ deviceMac: currentDeviceMac, status: "locked" }] : []),
      ],
      lockoutUntil: { $gt: new Date() },
    };

    const activeLockout = await SecurityAlert.findOne(alertQuery).sort({ lockoutUntil: -1 });
    if (activeLockout && activeLockout.lockoutUntil) {
      const remainingSeconds = Math.max(1, Math.ceil((new Date(activeLockout.lockoutUntil).getTime() - Date.now()) / 1000));
      return res.status(429).json({
        success: false,
        isLocked: true,
        remainingSeconds,
        lockoutUntil: activeLockout.lockoutUntil,
        attempts: activeLockout.attemptCount,
        message: `Security Lockout Active: Too many failed login attempts. Please wait ${remainingSeconds} second(s) before trying again.`,
      });
    }

    // 3. Attempt Authentication
    const user = await User.findOne({ email }).select("+password");
    const isPasswordMatch = user && (await user.matchPassword(password));

    if (!user || !isPasswordMatch) {
      // Find existing alert record or create new one
      let existingAlert = await SecurityAlert.findOne({
        $or: [
          { email, status: { $in: ["active", "locked"] } },
          { ip, status: { $in: ["active", "locked"] } },
          ...(currentDeviceMac !== "Unknown Device" ? [{ deviceMac: currentDeviceMac, status: { $in: ["active", "locked"] } }] : []),
        ],
      }).sort({ updatedAt: -1 });

      const newAttemptCount = (existingAlert ? existingAlert.attemptCount : 0) + 1;
      const cooldownSeconds = calculateCooldownSeconds(newAttemptCount);
      const lockoutUntil = cooldownSeconds > 0 ? new Date(Date.now() + cooldownSeconds * 1000) : null;

      // Determine threat severity & status
      let severity = "low";
      let status = cooldownSeconds > 0 ? "locked" : "active";

      if (newAttemptCount >= 10) {
        severity = "critical";
        status = "blocked";
      } else if (newAttemptCount >= 6) {
        severity = "high";
      } else if (newAttemptCount >= 3) {
        severity = "medium";
      }

      // Resolve Geolocation for threat intelligence
      const location = await lookupGeoLocation(ip);

      const incidentLog = {
        timestamp: new Date(),
        reason: `Failed login attempt #${newAttemptCount} with invalid credentials.`,
        ip,
        deviceMac: currentDeviceMac,
      };

      if (existingAlert) {
        existingAlert.email = email;
        existingAlert.ip = ip;
        existingAlert.deviceMac = currentDeviceMac;
        existingAlert.attemptCount = newAttemptCount;
        existingAlert.severity = severity;
        existingAlert.status = status;
        existingAlert.lockoutUntil = lockoutUntil;
        existingAlert.lastAttemptAt = new Date();
        existingAlert.location = location;
        existingAlert.userAgent = userAgent;
        if (deviceInfo) existingAlert.deviceInfo = deviceInfo;
        existingAlert.incidentLogs.push(incidentLog);
        await existingAlert.save();
      } else {
        existingAlert = await SecurityAlert.create({
          email,
          ip,
          deviceMac: currentDeviceMac,
          attemptCount: newAttemptCount,
          severity,
          status,
          lockoutUntil,
          lastAttemptAt: new Date(),
          location,
          userAgent,
          deviceInfo: deviceInfo || {},
          incidentLogs: [incidentLog],
        });
      }

      // Auto-block device & IP if 10 or more attempts
      if (newAttemptCount >= 10) {
        await BlockedEntity.findOneAndUpdate(
          { type: "ip", value: ip },
          { type: "ip", value: ip, reason: "Exceeded 10 failed login attempts", blockedBy: "Automated Threat Defense", isActive: true },
          { upsert: true }
        );
        if (currentDeviceMac && currentDeviceMac !== "Unknown Device") {
          await BlockedEntity.findOneAndUpdate(
            { type: "deviceMac", value: currentDeviceMac },
            { type: "deviceMac", value: currentDeviceMac, reason: "Exceeded 10 failed login attempts", blockedBy: "Automated Threat Defense", isActive: true },
            { upsert: true }
          );
        }

        return res.status(403).json({
          success: false,
          isBlocked: true,
          attempts: newAttemptCount,
          message: "CRITICAL THREAT DETECTED: You have exceeded the maximum allowed login attempts (10+). Your Device and IP address have been permanently blocked.",
        });
      }

      if (cooldownSeconds > 0) {
        return res.status(429).json({
          success: false,
          isLocked: true,
          remainingSeconds: cooldownSeconds,
          lockoutUntil,
          attempts: newAttemptCount,
          message: `Too many failed attempts (${newAttemptCount}). Security lockout triggered: Please wait ${cooldownSeconds} seconds before trying again.`,
        });
      }

      const remainingBeforeLockout = 3 - newAttemptCount;
      return res.status(401).json({
        success: false,
        attempts: newAttemptCount,
        message: `Invalid email or password. You have ${remainingBeforeLockout} attempt(s) remaining before a temporary security lockout.`,
      });
    }

    // 4. Successful login -> Clear any active lockout alerts for this email/IP
    await SecurityAlert.updateMany(
      {
        $or: [{ email }, { ip }, ...(currentDeviceMac !== "Unknown Device" ? [{ deviceMac: currentDeviceMac }] : [])],
        status: { $in: ["active", "locked"] },
      },
      { status: "resolved", lockoutUntil: null, attemptCount: 0 }
    );

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
    // hasn't caught up, fix it now.
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
  const cookieOptions = generateToken.getCookieOptions
    ? generateToken.getCookieOptions()
    : {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      };

  delete cookieOptions.maxAge;

  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out successfully" });
};

// ─────────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected manually)
// ─────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const jwt = require("jsonwebtoken");
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.json({ user: null }); // Returns 200 OK instead of 401
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.status === "blocked" || !user.isVerified) {
      return res.json({ user: null });
    }

    res.json({ user: publicUser(user) });
  } catch (error) {
    return res.json({ user: null });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, password, description, avatar } = req.body;
    const user = await User.findById(req.user.id || req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (description) user.description = description;
    if (avatar) user.avatar = avatar;
    
    if (password && password.trim() !== "") {
      user.password = password; // pre-save hook in User model will hash it
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
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
  updateProfile: exports.updateProfile,
};
