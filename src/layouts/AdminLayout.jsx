import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaStore, FaSignOutAlt } from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Manage Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Manage Vendors", path: "/admin/vendors", icon: <FaStore /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-[#e21b70]">Admin Portal</h2>
          <p className="text-gray-400 text-sm mt-1">Food Garden</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-[#e21b70] text-white font-bold" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between md:justify-end">
          <div className="md:hidden font-bold text-gray-900">Admin Portal</div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-gray-900 text-[#e21b70] border border-[#e21b70] flex items-center justify-center font-bold">A</div>
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

export default AdminLayout;
