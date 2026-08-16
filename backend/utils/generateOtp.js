const crypto = require("crypto");

// 6-digit numeric OTP, plus its expiry Date based on OTP_EXPIRY_MINUTES.

const generateOtp = () => {
  // crypto.randomInt uses a cryptographically secure source, unlike Math.random().
  const otp = crypto.randomInt(100000, 1000000).toString();
  const minutes = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
  const expiry = new Date(Date.now() + minutes * 60 * 1000);
  return { otp, expiry };
};

module.exports = generateOtp;
