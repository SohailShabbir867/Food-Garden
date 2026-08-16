// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { connectSocket, disconnectSocket, socket } from "../socket";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/auth/me`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ── Connect / disconnect socket based on auth state ─────
  useEffect(() => {
    if (user?._id) {
      connectSocket();
      socket.emit("joinUser", user._id);
    } else {
      disconnectSocket();
    }
  }, [user]);

  // ── Login (calls real backend) ────────────────────────────
  const login = async ({ email, password, deviceMac, deviceInfo }) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-mac": deviceMac || "",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email?.trim().toLowerCase(),
          password,
          deviceMac,
          deviceInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          status: res.status,
          message: data.message || "Login failed",
          isLocked: data.isLocked || false,
          isBlocked: data.isBlocked || false,
          remainingSeconds: data.remainingSeconds || 0,
          lockoutUntil: data.lockoutUntil || null,
          attempts: data.attempts || 0,
        };
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
    disconnectSocket();
  };

  // ── Update local profile state ─────────────────────────────
  const updateProfile = async (updatedData) => {
    if (!user) return { success: false, message: "No user logged in." };
    try {
      const res = await fetch(`${BASE}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return { success: true, message: data.message || "Profile updated successfully." };
      } else {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Failed to update profile." };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const clearUnreadChatCount = () => setUnreadChatCount(0);

  // ── Global real-time chat notification listener ──
  useEffect(() => {
    const handleNewMessage = (msg) => {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/chat")) {
        setUnreadChatCount((prev) => prev + 1);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, []);

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
        unreadChatCount,
        setUnreadChatCount,
        clearUnreadChatCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
