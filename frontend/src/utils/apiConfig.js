// frontend/src/utils/apiConfig.js

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();
