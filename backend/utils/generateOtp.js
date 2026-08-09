// backend/utils/generateOtp.js
// 6-digit numeric OTP, plus its expiry Date based on OTP_EXPIRY_MINUTES.

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // always 6 digits
  const minutes = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
  const expiry = new Date(Date.now() + minutes * 60 * 1000);
  return { otp, expiry };
};

module.exports = generateOtp;
