import React, { useState, useEffect } from "react";
import { FaUtensils, FaSearch, FaTrash, FaCheckCircle, FaStore, FaEyeSlash, FaEye, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api");

const StatusBadge = ({ isAvailable }) => {
  return isAvailable ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
      <FaEye size={10} /> Visible
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
      <FaEyeSlash size={10} /> Hidden (Blocked)
    </span>
  );
};

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/admin/foods`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch foods");
      const data = await res.json();
      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleToggleBlock = async (id, currentIsAvailable) => {
    try {
      const res = await fetch(`${BASE}/admin/foods/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update food status");
      
      setFoods(foods.map(f => f._id === id ? { ...f, isAvailable: !currentIsAvailable } : f));
      if(currentIsAvailable) {
        toast.warn("Food item hidden from public menu.");
      } else {
        toast.success("Food item is now visible.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this food item?")) {
      try {
        const res = await fetch(`${BASE}/admin/foods/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete food item");
        
        setFoods(foods.filter(f => f._id !== id));
        toast.error("Food item deleted.");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const filteredFoods = foods.filter((f) => {
    const foodName = f.title || f.name || "";
    const vendorName = f.vendor?.storeName || f.vendorName || "Unknown Vendor";
    const matchesSearch = foodName.toLowerCase().includes((search || "").toLowerCase()) || vendorName.toLowerCase().includes((search || "").toLowerCase());
    const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? f.isAvailable : !f.isAvailable);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <FaUtensils className="text-[#e21b70]" /> Food Listings Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage all food items posted by vendors. Hide inappropriate listings.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods or vendor name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70] transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {['all', 'active', 'blocked'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold capitalize rounded-xl transition-all ${
                filterStatus === status ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {status === 'active' ? 'Visible' : status === 'blocked' ? 'Hidden' : 'All Foods'}
            </button>
          ))}
        </div>
      </div>

      {/* Foods Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-black tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Food Item</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4 hidden sm:table-cell">Category</th>
                <th className="px-6 py-4 font-bold text-gray-900">Price</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 font-medium">
                    <FaSpinner className="animate-spin inline mr-2" /> Loading foods...
                  </td>
                </tr>
              ) : filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 font-medium">No food items found.</td>
                </tr>
              ) : (
                filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={food.image || (food.images && food.images[0]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                          alt={food.title || food.name || "Food"} 
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-base">{food.title || food.name || "Unnamed Food"}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{food._id ? food._id.slice(-6).toUpperCase() : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        <FaStore size={10} /> {food.vendor?.storeName || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium hidden sm:table-cell">
                      {food.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-900">Rs. {food.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isAvailable={food.isAvailable} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleBlock(food._id, food.isAvailable)}
                          title={food.isAvailable ? "Hide Item" : "Show Item"}
                          className={`p-2 rounded-lg font-bold transition-colors ${
                            food.isAvailable
                              ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                              : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          }`}
                        >
                          {food.isAvailable ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          title="Delete Item"
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

export default ManageFoods;
