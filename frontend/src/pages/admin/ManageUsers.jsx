import React, { useState } from "react";
import { FaUser, FaSearch, FaFilter, FaBan, FaTrash, FaCheckCircle, FaUserShield, FaStore, FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";

const MOCK_USERS = [
  { id: "U-1001", name: "Sohail Shabbir", email: "sohail@example.com", role: "buyer",  status: "active",  joined: "2026-01-15", avatar: null },
  { id: "U-1002", name: "Ali Hassan",     email: "ali@example.com",    role: "buyer",  status: "active",  joined: "2026-02-20", avatar: null },
  { id: "V-2001", name: "Spice Garden",   email: "spice@vendor.com",   role: "vendor", status: "active",  joined: "2026-03-05", avatar: null },
  { id: "V-2002", name: "Lahori Bites",   email: "lahori@vendor.com",  role: "vendor", status: "blocked", joined: "2026-04-12", avatar: null },
  { id: "U-1003", name: "Sara Khan",      email: "sara@example.com",   role: "buyer",  status: "active",  joined: "2026-05-30", avatar: null },
  { id: "V-2003", name: "Desi Dhaba",     email: "desi@vendor.com",    role: "vendor", status: "active",  joined: "2026-06-18", avatar: null },
];

const RoleBadge = ({ role }) => {
  return role === "vendor" ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-violet-100 text-violet-700 border border-violet-200">
      <FaStore size={10} /> Vendor
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
      <FaUser size={10} /> Buyer
    </span>
  );
};

const StatusBadge = ({ status }) => {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
      <FaCheckCircle size={10} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
      <FaBan size={10} /> Blocked
    </span>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const handleToggleBlock = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    toast.success(`User has been ${newStatus}.`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
      toast.error("User deleted permanently.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div data-aos="fade-up">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <FaUserShield className="text-[#e21b70]" /> User Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage buyers and vendors across the platform.</p>
      </div>

      {/* Toolbar */}
      <div data-aos="fade-up" data-aos-delay="100" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70] transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {['all', 'buyer', 'vendor'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold capitalize rounded-xl transition-all ${
                filterRole === role ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div data-aos="fade-up" data-aos-delay="150" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-black tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 hidden md:table-cell">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400 font-medium">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1a0009&color=fff&rounded=true`} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium hidden md:table-cell">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleBlock(user.id, user.status)}
                          title={user.status === 'active' ? "Block User" : "Unblock User"}
                          className={`p-2 rounded-lg font-bold transition-colors ${
                            user.status === 'active' 
                              ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                              : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          }`}
                        >
                          {user.status === 'active' ? <FaBan size={14} /> : <FaCheckCircle size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
                          className="p-2 rounded-lg font-bold bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
