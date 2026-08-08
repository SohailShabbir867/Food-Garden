import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaStore, FaSignOutAlt, FaHome, FaUtensils, FaClipboardList, FaUser, FaFlag, FaBars, FaEnvelope, FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/");
  };

  const navItems = [
    { name: "Back to Site",   path: "/",                icon: <FaHome size={18} /> },
    { name: "Dashboard",      path: "/admin/dashboard", icon: <FaTachometerAlt size={18} /> },
    { name: "Manage Users",   path: "/admin/users",     icon: <FaUsers size={18} /> },
    { name: "Manage Vendors", path: "/admin/vendors",   icon: <FaStore size={18} /> },
    { name: "Manage Foods",   path: "/admin/foods",     icon: <FaUtensils size={18} /> },
    { name: "Manage Orders",  path: "/admin/orders",    icon: <FaClipboardList size={18} /> },
    { name: "Reports",        path: "/admin/reports",   icon: <FaFlag size={18} /> },
    { name: "Messages",       path: "/admin/contacts",  icon: <FaEnvelope size={18} /> },
    { name: "Notifications",  path: "/admin/notifications", icon: <FaBell size={18} /> },
    { name: "Profile",        path: "/admin/profile",   icon: <FaUser size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        className="bg-gray-900 text-white flex-col hidden md:flex h-full shadow-2xl relative z-20"
      >
        <div className={`p-6 border-b border-white/10 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
          {!isSidebarCollapsed ? (
            <div>
              <h2 className="text-2xl font-black text-[#e21b70] tracking-tight truncate">Admin Portal</h2>
              <p className="text-gray-400 text-xs mt-1 font-medium tracking-wider uppercase truncate">Food Garden</p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#e21b70] text-white flex items-center justify-center font-black text-xl shadow-lg">
              A
            </div>
          )}
        </div>
        
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto mt-4 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && item.path !== "/" || (item.path === "/" && location.pathname === "/");
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isSidebarCollapsed ? item.name : ""}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-300 group ${
                  isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  isActive 
                    ? "bg-[#e21b70] text-white shadow-md shadow-[#e21b70]/40 font-bold" 
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`}>{item.icon}</span>
                {!isSidebarCollapsed && <span className="truncate whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 pb-6">
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Logout" : ""}
            className={`flex items-center gap-3 py-3 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-4 text-left font-semibold'
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
            <div className="md:hidden font-black text-gray-900 text-xl">Admin Portal</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-gray-800 text-sm">{user?.name || "Super Admin"}</p>
              <p className="text-xs text-gray-500 font-medium tracking-wide">Super Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-900 text-[#e21b70] flex items-center justify-center font-black uppercase shadow-md border-2 border-white ring-2 ring-gray-100">
              {user?.name?.[0] || "A"}
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
