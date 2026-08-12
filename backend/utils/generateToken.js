// backend/utils/generateToken.js
// Signs a secure 7-day JWT for a user ID and sets an httpOnly session cookie.

const jwt = require("jsonwebtoken");

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const getCookieOptions = () => {
  const isHttps = process.env.USE_HTTPS === "true";
  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    maxAge: SEVEN_DAYS_MS,
    path: "/",
  };
};

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, getCookieOptions());

  return token;
};

generateToken.getCookieOptions = getCookieOptions;

module.exports = generateToken;
