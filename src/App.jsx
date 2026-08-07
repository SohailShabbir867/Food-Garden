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
import AdminPage from "./pages/AdminPage";

// (Placeholders for upcoming Vendor pages)
const VendorDashboardPlaceholder = () => <div className="p-8"><h1 className="text-3xl font-bold">Vendor Dashboard</h1><p className="mt-4">Welcome to your dashboard. Statistics will appear here.</p></div>;
const VendorMenuPlaceholder = () => <div className="p-8"><h1 className="text-3xl font-bold">Manage Menu</h1><p className="mt-4">Add, edit, or remove your food items.</p></div>;
const VendorOrdersPlaceholder = () => <div className="p-8"><h1 className="text-3xl font-bold">Orders</h1><p className="mt-4">View and accept incoming orders.</p></div>;

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
          <Route path="dashboard" element={<VendorDashboardPlaceholder />} />
          <Route path="menu" element={<VendorMenuPlaceholder />} />
          <Route path="orders" element={<VendorOrdersPlaceholder />} />
        </Route>

        {/* ======================= */}
        {/* ADMIN PORTAL */}
        {/* ======================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          {/* Reusing existing AdminPage as dashboard for now */}
          <Route path="dashboard" element={<AdminPage />} />
          <Route path="users" element={<div className="p-8"><h1 className="text-3xl font-bold">Manage Users</h1></div>} />
          <Route path="vendors" element={<div className="p-8"><h1 className="text-3xl font-bold">Manage Vendors</h1></div>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
