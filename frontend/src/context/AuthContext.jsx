// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Read Environment Dummy Credentials
export const DEMO_CREDENTIALS = {
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL || "admin@foodgarden.com",
    password: import.meta.env.VITE_ADMIN_PASSWORD || "admin123",
    name: "Super Admin",
    role: "admin",
    phone: "0333-0000000",
    avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=1a0009&color=fff",
  },
  vendor: {
    email: import.meta.env.VITE_VENDOR_EMAIL || "vendor@foodgarden.com",
    password: import.meta.env.VITE_VENDOR_PASSWORD || "vendor123",
    name: "Burger Hub Kitchen",
    role: "vendor",
    phone: "0301-9876543",
    avatar: "https://ui-avatars.com/api/?name=Burger+Hub&background=3A0519&color=fff",
  },
  buyer: {
    email: import.meta.env.VITE_BUYER_EMAIL || "buyer@foodgarden.com",
    password: import.meta.env.VITE_BUYER_PASSWORD || "buyer123",
    name: "Sohail Shabbir",
    role: "buyer",
    phone: "0300-1234567",
    avatar: "https://ui-avatars.com/api/?name=Sohail+Shabbir&background=e21b70&color=fff",
  },
};

export const AuthProvider = ({ children }) => {
  // Load saved user session from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("food_garden_user");
      return savedUser ? JSON.parse(savedUser) : DEMO_CREDENTIALS.buyer; // Default logged in as buyer for smooth UX
    } catch (e) {
      return DEMO_CREDENTIALS.buyer;
    }
  });

  // Sync session changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("food_garden_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("food_garden_user");
    }
  }, [user]);

  // Login handler with .env & localStorage credentials check
  const login = ({ email, password, role }) => {
    const inputEmail = email?.trim().toLowerCase();

    // 1. Check against .env Demo credentials
    if (inputEmail === DEMO_CREDENTIALS.admin.email.toLowerCase()) {
      const loggedUser = { ...DEMO_CREDENTIALS.admin };
      setUser(loggedUser);
      return { success: true, role: "admin", user: loggedUser };
    }

    if (inputEmail === DEMO_CREDENTIALS.vendor.email.toLowerCase()) {
      const loggedUser = { ...DEMO_CREDENTIALS.vendor };
      setUser(loggedUser);
      return { success: true, role: "vendor", user: loggedUser };
    }

    if (inputEmail === DEMO_CREDENTIALS.buyer.email.toLowerCase()) {
      const loggedUser = { ...DEMO_CREDENTIALS.buyer };
      setUser(loggedUser);
      return { success: true, role: "buyer", user: loggedUser };
    }

    // 2. Check saved registered users in localStorage
    try {
      const registeredUsers = JSON.parse(localStorage.getItem("food_garden_registered_users") || "[]");
      const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === inputEmail);
      if (foundUser) {
        setUser(foundUser);
        return { success: true, role: foundUser.role, user: foundUser };
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Fallback: determine role by user input or email keywords
    let userRole = role || "buyer";
    if (inputEmail?.includes("admin")) userRole = "admin";
    else if (inputEmail?.includes("vendor")) userRole = "vendor";

    const customUser = {
      id: Date.now(),
      name: inputEmail.split("@")[0] || "User",
      email: inputEmail,
      role: userRole,
      phone: "0300-0000000",
      avatar: `https://ui-avatars.com/api/?name=${inputEmail}&background=e21b70&color=fff`,
    };

    setUser(customUser);
    return { success: true, role: userRole, user: customUser };
  };

  // One-click quick login for demo roles
  const loginAsDemoRole = (roleKey) => {
    const demoUser = DEMO_CREDENTIALS[roleKey] || DEMO_CREDENTIALS.buyer;
    setUser(demoUser);
    return { success: true, role: demoUser.role, user: demoUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("food_garden_user");
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
        loginAsDemoRole,
        logout,
        isAuthenticated,
        isAdmin,
        isVendor,
        isBuyer,
        DEMO_CREDENTIALS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
