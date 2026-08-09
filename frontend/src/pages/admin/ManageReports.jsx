import React, { useState } from "react";
import {
  FaFlag,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
} from "react-icons/fa";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    open:     "bg-red-100 text-red-600 border-red-200",
    investigating:  "bg-amber-100 text-amber-600 border-amber-200",
    resolved: "bg-emerald-100 text-emerald-600 border-emerald-200",
  };
  const icons = {
    open:     <FaTimesCircle size={10} />,
    investigating:  <FaClock size={10} />,
    resolved: <FaCheckCircle size={10} />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${styles[status] || styles.investigating}`}>
      {icons[status]}
      {status}
    </span>
  );
};

// ─── Type Badge ───────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const colors = {
    "food": "bg-orange-100 text-orange-600",
    "user":      "bg-violet-100 text-violet-600",
    "vendor":    "bg-blue-100 text-blue-600",
    "order":    "bg-cyan-100 text-cyan-600",
  };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${colors[type] || "bg-gray-100 text-gray-600"}`}>
      {type}
    </span>
  );
};

// ─── Report Detail Modal ──────────────────────────────────────────────────────
const ReportModal = ({ report, onClose, onResolve, onDelete }) => {
  if (!report) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{report.id}</p>
            <h2 className="text-lg font-black text-gray-900">{report.subject}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors text-xl font-bold">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Type</p>
              <TypeBadge type={report.targetType} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Status</p>
              <StatusBadge status={report.status} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Reported By</p>
              <p className="font-semibold text-gray-800">{report.reporterName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Against</p>
              <p className="font-semibold text-gray-800">{report.targetName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Date Filed</p>
              <p className="font-semibold text-gray-800">{new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Description</p>
            <p className="text-gray-700 text-sm leading-relaxed">{report.description}</p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={() => onDelete(report.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <FaTrash size={12} /> Dismiss
          </button>
          {report.status !== "resolved" && (
            <button
              onClick={() => onResolve(report.id)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors"
            >
              <FaCheckCircle size={12} /> Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

// ─── Main Component ───────────────────────────────────────────────────────────
const ManageReports = () => {
  const [reports, setReports]         = useState([]);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${BASE}/admin/reports`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (error) {
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.reporterName?.toLowerCase().includes(search.toLowerCase()) ||
      r.targetName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleResolve = async (id) => {
    try {
      const res = await fetch(`${BASE}/admin/reports/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "resolved" }),
      });
      if (res.ok) {
        setReports((prev) => prev.map((r) => r._id === id ? { ...r, status: "resolved" } : r));
        setSelectedReport(null);
        toast.success("Report resolved");
      }
    } catch (error) {
      toast.error("Failed to resolve report");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently dismiss this report?")) {
      try {
        const res = await fetch(`${BASE}/admin/reports/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setReports((prev) => prev.filter((r) => r._id !== id));
          setSelectedReport(null);
          toast.error("Report dismissed");
        }
      } catch (error) {
        toast.error("Failed to dismiss report");
      }
    }
  };

  const counts = {
    all:      reports.length,
    open:     reports.filter((r) => r.status === "open").length,
    investigating:  reports.filter((r) => r.status === "investigating").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <FaFlag className="text-[#e21b70]" /> Report Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">Review and manage all platform reports filed by users and vendors.</p>
      </div>

      {/* Stat Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "All Reports", value: "all", count: counts.all, color: "border-gray-300 text-gray-700", active: "border-gray-900 bg-gray-900 text-white" },
          { label: "Open",        value: "open",     count: counts.open,     color: "border-red-200 text-red-600",     active: "border-red-500 bg-red-50 text-red-600" },
          { label: "Investigating",     value: "investigating",  count: counts.investigating,  color: "border-amber-200 text-amber-600", active: "border-amber-500 bg-amber-50 text-amber-600" },
          { label: "Resolved",    value: "resolved", count: counts.resolved, color: "border-emerald-200 text-emerald-600", active: "border-emerald-500 bg-emerald-50 text-emerald-600" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`rounded-2xl p-4 text-left border-2 transition-all font-semibold ${filterStatus === tab.value ? tab.active : "bg-white " + tab.color} hover:shadow-sm`}
          >
            <p className="text-2xl font-black">{tab.count}</p>
            <p className="text-xs mt-0.5 opacity-80">{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by subject, user, or vendor..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70]"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaFilter size={12} />
            <span className="font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">Report ID</th>
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Reported By</th>
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Against</th>
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400 font-medium">
                    <FaSpinner className="animate-spin inline mr-2" /> Loading reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400 font-medium">
                    No reports found.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-gray-400">{report.reportNumber}</td>
                    <td className="px-5 py-4"><TypeBadge type={report.targetType} /></td>
                    <td className="px-5 py-4 font-semibold text-gray-800 max-w-[180px] truncate">{report.subject}</td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell">{report.reporterName}</td>
                    <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">{report.targetName}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs hidden sm:table-cell">{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={report.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          title="View Details"
                          className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FaEye size={13} />
                        </button>
                        {report.status !== "resolved" && (
                          <button
                            onClick={() => handleResolve(report._id)}
                            title="Mark Resolved"
                            className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-200 transition-colors"
                          >
                            <FaCheckCircle size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(report._id)}
                          title="Dismiss Report"
                          className="w-8 h-8 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <FaTrash size={13} />
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

      {/* Detail Modal */}
      <ReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onResolve={handleResolve}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageReports;
