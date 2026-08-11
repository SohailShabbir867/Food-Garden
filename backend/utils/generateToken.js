// backend/utils/generateToken.js
// Signs a secure 7-day JWT for a user ID and sets an httpOnly session cookie.

const jwt = require("jsonwebtoken");

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => ({
  httpOnly: true, // Prevents XSS access to cookie token
  secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Protects against CSRF attacks
  maxAge: SEVEN_DAYS_MS, // Session lasts 7 days (604,800,000 ms)
  path: "/",
});

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, getCookieOptions());

  return token;
};

generateToken.getCookieOptions = getCookieOptions;

module.exports = generateToken;
