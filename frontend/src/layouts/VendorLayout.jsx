import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUtensils, FaClipboardList, FaSignOutAlt, FaHome } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const VendorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: <FaTachometerAlt /> },
    { name: "Manage Menu", path: "/vendor/menu", icon: <FaUtensils /> },
    { name: "Orders", path: "/vendor/orders", icon: <FaClipboardList /> },
    { name: "Back to Site", path: "/", icon: <FaHome /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3A0519] text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-[#e21b70]">Vendor Portal</h2>
          <p className="text-gray-300 text-sm mt-1">Food Garden</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-[#e21b70] text-white font-bold" : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/80 hover:text-white transition-colors w-full text-left"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar for Mobile (Optional, can be expanded later) */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between md:justify-end">
          <div className="md:hidden font-bold text-[#3A0519]">Vendor Portal</div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-gray-800 text-sm">{user?.name || "Vendor"}</p>
              <p className="text-xs text-gray-500">Restaurant Vendor</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#e21b70] text-white flex items-center justify-center font-bold uppercase shadow">
              {user?.name?.[0] || "V"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
