// src/services/authApi.js
// Centralised API calls for Authentication (register, verify OTP, login, forgot/reset password)

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const handleRes = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// POST /api/auth/register
export const registerUser = (body) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handleRes);

// POST /api/auth/verify-otp
export const verifyOtpApi = (body) =>
  fetch(`${BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  }).then(handleRes);

// POST /api/auth/resend-otp
export const resendOtpApi = (email) =>
  fetch(`${BASE}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(handleRes);

// POST /api/auth/forgot-password
export const forgotPasswordApi = (email) =>
  fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(handleRes);

// POST /api/auth/reset-password
export const resetPasswordApi = (body) =>
  fetch(`${BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handleRes);
