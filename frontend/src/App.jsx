import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
import FoodDetail from './pages/FoodDetail';
import Chat from './pages/Chat';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import NotFound from './pages/NotFound';

// ─── Admin Pages ─────────────────────────────────────────────
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageVendors from './pages/admin/ManageVendors';
import ManageFoods from './pages/admin/ManageFoods';
import ManageOrders from './pages/admin/ManageOrders';
import AdminProfile from './pages/admin/AdminProfile';
import ManageReports from './pages/admin/ManageReports';
import ManageContacts from './pages/admin/ManageContacts';
import SendNotification from './pages/admin/SendNotification';

// ─── Vendor Pages ────────────────────────────────────────────
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMenu from './pages/vendor/VendorMenu';
import VendorOrders from './pages/vendor/VendorOrders';
import AddFood from './pages/vendor/AddFood';
import VendorProfile from './pages/vendor/VendorProfile';

// ─── User Pages ──────────────────────────────────────────────
import UserProfile from './pages/user/Profile';

function App() {
  // Initialize AOS (scroll-reveal animations) once, app-wide
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 60,
      easing: "ease-out-cubic",
    });
  }, []);

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
              <Route path="/food/:id" element={<FoodDetail />} />

              {/* Protected buyer routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <TrackOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/track-order"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <TrackOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* 404 — Catch-all for MainLayout */}
              <Route path="*" element={<NotFound />} />
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
              <Route path="add-food" element={<AddFood />} />
              <Route path="orders" element={<VendorOrders />} />
              <Route path="profile" element={<VendorProfile />} />
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
              <Route path="reports" element={<ManageReports />} />
              <Route path="contacts" element={<ManageContacts />} />
              <Route path="notifications" element={<SendNotification />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* ══════════════════════════════════════════════ */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
