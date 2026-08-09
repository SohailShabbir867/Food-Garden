import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — wraps routes that require authentication or a specific role.
 * Usage: <ProtectedRoute requiredRole="vendor"> <VendorDashboard /> </ProtectedRoute>
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e21b70]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in — redirect to login, remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Logged in but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
