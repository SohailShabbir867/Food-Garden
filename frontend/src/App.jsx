import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & User Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Payment from "./pages/Payments";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageVendors from "./pages/admin/ManageVendors";

// Vendor Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorMenu from "./pages/vendor/VendorMenu";
import VendorOrders from "./pages/vendor/VendorOrders";

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      
      <Routes>
        {/* ======================= */}
        {/* BUYER / PUBLIC PORTAL */}
        {/* ======================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* ======================= */}
        {/* VENDOR PORTAL */}
        {/* ======================= */}
        <Route path="/vendor" element={<VendorLayout />}>
          {/* Redirect /vendor to /vendor/dashboard */}
          <Route index element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="menu" element={<VendorMenu />} />
          <Route path="orders" element={<VendorOrders />} />
        </Route>

        {/* ======================= */}
        {/* ADMIN PORTAL */}
        {/* ======================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          {/* Reusing existing AdminDashboard for now */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="vendors" element={<ManageVendors />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
