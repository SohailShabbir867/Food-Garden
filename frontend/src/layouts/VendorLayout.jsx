import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaSignOutAlt,
  FaHome,
  FaPlus,
  FaBars,
  FaUser,
  FaComments,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Burger from "../assets/hero/Burger.jpg";

const VendorLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, unreadChatCount, clearUnreadChatCount } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/");
  };

  const navItems = [
    { name: "Back to Site", path: "/", icon: <FaHome size={18} /> },
    { name: "Dashboard", path: "/vendor/dashboard", icon: <FaTachometerAlt size={18} /> },
    { name: "Manage Menu", path: "/vendor/menu", icon: <FaUtensils size={18} /> },
    { name: "Post Food Item", path: "/vendor/add-food", icon: <FaPlus size={18} /> },
    { name: "Orders", path: "/vendor/orders", icon: <FaClipboardList size={18} /> },
    { name: "Live Chat", path: "/chat", icon: <FaComments size={18} /> },
    { name: "Profile", path: "/vendor/profile", icon: <FaUser size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
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
                Vendor Portal
              </h2>
              <p className="text-pink-100/70 text-xs mt-0.5 font-bold tracking-widest uppercase truncate">
                Food Garden
              </p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e21b70] to-[#b8125a] text-white flex items-center justify-center font-black text-xl shadow-lg border border-white/20">
              V
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
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors hidden md:block focus:outline-none"
            >
              <FaBars size={20} />
            </button>
            <div className="md:hidden font-black text-[#3A0519] text-xl">
              Vendor Portal
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Chat Icon with Red Notification Badge */}
            <Link
              to="/chat"
              onClick={clearUnreadChatCount}
              className="relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 hover:text-[#e21b70]"
              title="Live Chat Messages"
            >
              <FaComments size={18} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-md border border-white">
                  {unreadChatCount}
                </span>
              )}
            </Link>

            <div className="text-right hidden sm:block">
              <p className="font-bold text-gray-800 text-sm">
                {user?.name || "Vendor"}
              </p>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Restaurant Vendor
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#e21b70] text-white flex items-center justify-center font-bold uppercase shadow-md border-2 border-white ring-2 ring-gray-100">
              {user?.name?.[0] || "V"}
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

export default VendorLayout;
