// src/services/vendorApi.js
// Centralised API calls for the Vendor portal.
// All requests include the JWT token stored by AuthContext.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  try {
    // Token stored in cookie by the backend (httpOnly), but we also
    // support an Authorization header fallback for dev/testing.
    return localStorage.getItem("food_garden_token") || null;
  } catch {
    return null;
  }
};

const headers = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleRes = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// ── Dashboard ────────────────────────────────────────────────
export const fetchVendorStats = () =>
  fetch(`${BASE}/vendor/dashboard/stats`, { headers: headers(), credentials: "include" }).then(handleRes);

// ── Analytics ────────────────────────────────────────────────
export const fetchWeeklyAnalytics = () =>
  fetch(`${BASE}/vendor/analytics/weekly`, { headers: headers(), credentials: "include" }).then(handleRes);

export const fetchTopFoods = () =>
  fetch(`${BASE}/vendor/analytics/top-foods`, { headers: headers(), credentials: "include" }).then(handleRes);

// ── Menu ─────────────────────────────────────────────────────
export const fetchVendorMenu = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE}/vendor/menu${qs ? `?${qs}` : ""}`, {
    headers: headers(),
    credentials: "include",
  }).then(handleRes);
};

export const addFoodItem = (body) =>
  fetch(`${BASE}/vendor/menu`, {
    method: "POST",
    headers: headers(),
    credentials: "include",
    body: JSON.stringify(body),
  }).then(handleRes);

export const updateFoodItem = (id, body) =>
  fetch(`${BASE}/vendor/menu/${id}`, {
    method: "PUT",
    headers: headers(),
    credentials: "include",
    body: JSON.stringify(body),
  }).then(handleRes);

export const deleteFoodItem = (id) =>
  fetch(`${BASE}/vendor/menu/${id}`, {
    method: "DELETE",
    headers: headers(),
    credentials: "include",
  }).then(handleRes);

// ── Orders ───────────────────────────────────────────────────
export const fetchVendorOrders = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE}/vendor/orders${qs ? `?${qs}` : ""}`, {
    headers: headers(),
    credentials: "include",
  }).then(handleRes);
};

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE}/vendor/orders/${id}/status`, {
    method: "PUT",
    headers: headers(),
    credentials: "include",
    body: JSON.stringify({ status }),
  }).then(handleRes);

// ── Profile ──────────────────────────────────────────────────
export const fetchVendorProfile = () =>
  fetch(`${BASE}/vendor/profile`, { headers: headers(), credentials: "include" }).then(handleRes);

export const updateVendorProfile = (body) =>
  fetch(`${BASE}/vendor/profile`, {
    method: "PUT",
    headers: headers(),
    credentials: "include",
    body: JSON.stringify(body),
  }).then(handleRes);
