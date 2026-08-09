// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/auth/me`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  // ── Login (calls real backend) ────────────────────────────
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email?.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      const loggedUser = { ...data.user };
      setUser(loggedUser);

      return { success: true, role: loggedUser.role, user: loggedUser };
    } catch {
      return { success: false, message: "Network error. Is the server running?" };
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // Ignore network errors on logout
    }
    setUser(null);
  };

  // ── Update local profile state ─────────────────────────────
  const updateProfile = (updatedData) => {
    if (!user) return { success: false, message: "No user logged in." };
    const newUserState = { ...user, ...updatedData };
    setUser(newUserState);
    return { success: true, message: "Profile updated successfully." };
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";
  const isBuyer = user?.role === "buyer";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        setAuthenticatedUser: setUser,
        isAuthenticated,
        isAdmin,
        isVendor,
        isBuyer,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
