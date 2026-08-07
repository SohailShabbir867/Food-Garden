import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Mock user data for testing before backend is ready
const MOCK_USERS = {
  buyer: { id: 1, name: "Ali Khan", email: "buyer@test.com", role: "buyer", phone: "0300-1234567" },
  vendor: { id: 2, name: "Royal Burgers", email: "vendor@test.com", role: "vendor", phone: "0301-9876543" },
  admin: { id: 3, name: "Super Admin", email: "admin@test.com", role: "admin", phone: "0333-0000000" },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in

  // Mocked login — will be replaced with API call later
  const login = ({ email, password, role }) => {
    const mockUser = MOCK_USERS[role] || MOCK_USERS.buyer;
    setUser({ ...mockUser, email });
    return { success: true, role: mockUser.role };
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";
  const isBuyer = user?.role === "buyer";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isVendor, isBuyer }}>
      {children}
    </AuthContext.Provider>
  );
};
