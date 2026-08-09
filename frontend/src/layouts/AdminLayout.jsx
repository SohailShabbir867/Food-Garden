import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaSignOutAlt,
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaUser,
  FaFlag,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Burger from "../assets/hero/Burger.jpg";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/");
  };

  const navItems = [
    { name: "Back to Site", path: "/", icon: <FaHome size={18} /> },
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt size={18} /> },
    { name: "Manage Users", path: "/admin/users", icon: <FaUsers size={18} /> },
    { name: "Manage Foods", path: "/admin/foods", icon: <FaUtensils size={18} /> },
    { name: "Reports", path: "/admin/reports", icon: <FaFlag size={18} /> },
    { name: "Messages", path: "/admin/contacts", icon: <FaEnvelope size={18} /> },
    { name: "Notifications", path: "/admin/notifications", icon: <FaBell size={18} /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUser size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-[#3A0519] via-[#2A0312] to-[#1A0009] text-white shadow-2xl z-10 p-4">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div>
                <h2 className="text-xl font-black text-[#e21b70]">Admin Portal</h2>
                <p className="text-pink-100/70 text-xs font-bold uppercase tracking-widest">Food Garden</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-1.5 overflow-y-auto mt-4">
              {navItems.map((item) => {
                const isActive =
                  (location.pathname.startsWith(item.path) && item.path !== "/") ||
                  (item.path === "/" && location.pathname === "/");
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#e21b70] text-white font-bold shadow-md shadow-[#e21b70]/30"
                        : "text-pink-100/80 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-pink-200/80 hover:bg-rose-600/30 hover:text-white transition-colors w-full font-semibold text-sm"
              >
                <FaSignOutAlt size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar with Hero Food Background Image from Assets */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        className="bg-gradient-to-b from-[#3A0519] via-[#2A0312] to-[#1A0009] text-white flex-col hidden md:flex h-full shadow-2xl relative z-20 border-r border-white/10 overflow-hidden select-none"
      >
        {/* Background Asset Image */}
        <img
          src={Burger}
          alt="Sidebar Food Background"
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none mix-blend-overlay"
        />

        {/* Dark Maroon Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3A0519]/80 via-[#2A0312]/85 to-[#1A0009]/95 pointer-events-none" />

        {/* Ambient Glow Effects */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#e21b70]/25 rounded-full blur-2xl pointer-events-none" />

        {/* Sidebar Header */}
        <div
          className={`p-6 border-b border-white/10 flex items-center relative z-10 ${
            isSidebarCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          {!isSidebarCollapsed ? (
            <div>
              <h2 className="text-2xl font-black text-[#e21b70] tracking-tight truncate drop-shadow-xs">
                Admin Portal
              </h2>
              <p className="text-pink-100/70 text-xs mt-0.5 font-bold tracking-widest uppercase truncate">
                Food Garden
              </p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e21b70] to-[#b8125a] text-white flex items-center justify-center font-black text-xl shadow-lg border border-white/20">
              A
            </div>
          )}
        </div>

        {/* Navigation Link Section */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto mt-2 custom-scrollbar relative z-10">
          {navItems.map((item) => {
            const isActive =
              (location.pathname.startsWith(item.path) && item.path !== "/") ||
              (item.path === "/" && location.pathname === "/");
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isSidebarCollapsed ? item.name : ""}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-300 group ${
                  isSidebarCollapsed ? "justify-center px-0" : "px-4"
                } ${
                  isActive
                    ? "bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30 font-bold border border-white/20"
                    : "text-pink-100/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <span
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-pink-200/70 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </span>
                {!isSidebarCollapsed && (
                  <span className="truncate whitespace-nowrap text-sm font-semibold">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-white/10 pb-6 relative z-10">
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Logout" : ""}
            className={`flex items-center gap-3 py-3 rounded-xl text-pink-200/80 hover:bg-rose-600/30 hover:text-white transition-colors w-full border border-transparent hover:border-rose-500/30 ${
              isSidebarCollapsed
                ? "justify-center px-0"
                : "px-4 text-left font-semibold text-sm"
            }`}
          >
            <FaSignOutAlt size={18} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-100 h-16 flex items-center px-4 md:px-8 justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors hidden md:block focus:outline-none"
              title="Toggle sidebar size"
            >
              <FaBars size={20} />
            </button>
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors md:hidden focus:outline-none"
              title="Open Navigation Menu"
            >
              <FaBars size={20} />
            </button>
            <div className="font-black text-[#3A0519] text-xl">
              Admin Portal
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-gray-800 text-sm">
                {user?.name || "Super Admin"}
              </p>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Super Administrator
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#3A0519] text-[#e21b70] flex items-center justify-center font-black uppercase shadow-md border-2 border-white ring-2 ring-gray-100">
              {user?.name?.[0] || "S"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
