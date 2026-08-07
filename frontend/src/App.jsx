import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ─── Providers ───────────────────────────────────────────────
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// ─── Layouts ─────────────────────────────────────────────────
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';

// ─── Route Guard ─────────────────────────────────────────────
import ProtectedRoute from './routes/ProtectedRoute';

// ─── Auth Pages ──────────────────────────────────────────────
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOTP from './pages/auth/VerifyOTP';

// ─── Public / Buyer Pages ────────────────────────────────────
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Payment from './pages/Payments';

// ─── Admin Pages ─────────────────────────────────────────────
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageVendors from './pages/admin/ManageVendors';
import ManageFoods from './pages/admin/ManageFoods';
import ManageOrders from './pages/admin/ManageOrders';

// ─── Vendor Pages ────────────────────────────────────────────
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMenu from './pages/vendor/VendorMenu';
import VendorOrders from './pages/vendor/VendorOrders';

// ─── User Pages ──────────────────────────────────────────────
import UserProfile from './pages/user/Profile';
import UserDashboard from './pages/user/Dashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="colored"
            toastStyle={{ borderRadius: "12px" }}
          />

          <Routes>

            {/* ══════════════════════════════════════════════ */}
            {/*   AUTH PAGES  (Navbar shown, no Footer)        */}
            {/* ══════════════════════════════════════════════ */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
            </Route>

            {/* ══════════════════════════════════════════════ */}
            {/*   BUYER / PUBLIC PORTAL  (Navbar + Footer)    */}
            {/* ══════════════════════════════════════════════ */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />

              {/* Protected buyer routes */}
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ══════════════════════════════════════════════ */}
            {/*   VENDOR PORTAL  (Sidebar Layout)             */}
            {/* ══════════════════════════════════════════════ */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/vendor/dashboard" replace />} />
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="menu" element={<VendorMenu />} />
              <Route path="orders" element={<VendorOrders />} />
            </Route>

            {/* ══════════════════════════════════════════════ */}
            {/*   ADMIN PORTAL  (Sidebar Layout)              */}
            {/* ══════════════════════════════════════════════ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="vendors" element={<ManageVendors />} />
              <Route path="foods" element={<ManageFoods />} />
              <Route path="orders" element={<ManageOrders />} />
            </Route>

            {/* ══════════════════════════════════════════════ */}
            {/*   404 — Catch-all                             */}
            {/* ══════════════════════════════════════════════ */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
