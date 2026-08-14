// src/pages/admin/ManageSecurity.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldAlt,
  FaExclamationTriangle,
  FaBan,
  FaLock,
  FaUnlock,
  FaSearch,
  FaSync,
  FaGlobe,
  FaDesktop,
  FaCamera,
  FaTrash,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaClock,
  FaMapMarkerAlt,
  FaNetworkWired,
  FaUserSecret,
  FaHistory,
} from "react-icons/fa";
import { toast } from "react-toastify";

const BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api");

const ManageSecurity = () => {
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    lockedAccounts: 0,
    criticalThreats: 0,
    blockedEntities: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "critical", "locked", "blocked", "resolved"

  // Selected Alert for Deep Inspection Modal
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Manual Block Modal State
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    type: "ip",
    value: "",
    reason: "Suspicious brute-force attack detected",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${BASE}/admin/security/stats`, {
        credentials: "include",
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || {});
      }

      // 2. Fetch Alerts
      let url = `${BASE}/admin/security/alerts?`;
      if (activeTab !== "all" && activeTab !== "blocked") {
        url += `status=${activeTab}&`;
      }
      if (search) {
        url += `search=${encodeURIComponent(search)}&`;
      }
      const alertsRes = await fetch(url, { credentials: "include" });
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts || []);
      }

      // 3. Fetch Blocked List
      const blockedRes = await fetch(`${BASE}/admin/security/blocked`, {
        credentials: "include",
      });
      if (blockedRes.ok) {
        const blockedData = await blockedRes.json();
        setBlockedList(blockedData.blocked || []);
      }
    } catch (error) {
      toast.error("Failed to load security threat logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, search]);

  // Block an entity
  const handleBlock = async (type, value, reason = "Excessive failed login attempts") => {
    try {
      const res = await fetch(`${BASE}/admin/security/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, value, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Successfully blocked ${value}`);
        fetchData();
        if (selectedAlert) setSelectedAlert(null);
      } else {
        toast.error(data.message || "Failed to block entity");
      }
    } catch {
      toast.error("Network error while blocking entity.");
    }
  };

  // Unblock an entity
  const handleUnblock = async (type, value) => {
    try {
      const res = await fetch(`${BASE}/admin/security/unblock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, value }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Successfully unblocked ${value}`);
        fetchData();
        if (selectedAlert) setSelectedAlert(null);
      } else {
        toast.error(data.message || "Failed to unblock entity");
      }
    } catch {
      toast.error("Network error while unblocking entity.");
    }
  };

  // Resolve Alert
  const handleResolveAlert = async (id) => {
    try {
      const res = await fetch(`${BASE}/admin/security/alerts/${id}/resolve`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Alert marked as resolved.");
        fetchData();
        if (selectedAlert) setSelectedAlert(null);
      } else {
        toast.error(data.message || "Failed to resolve alert.");
      }
    } catch {
      toast.error("Network error while resolving alert.");
    }
  };

  // Delete Alert
  const handleDeleteAlert = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident log?")) return;
    try {
      const res = await fetch(`${BASE}/admin/security/alerts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Incident log deleted.");
        fetchData();
        if (selectedAlert) setSelectedAlert(null);
      } else {
        toast.error("Failed to delete log.");
      }
    } catch {
      toast.error("Network error while deleting log.");
    }
  };

  // Submit manual block modal
  const handleManualBlockSubmit = async (e) => {
    e.preventDefault();
    if (!blockForm.value.trim()) {
      toast.warn("Please enter an IP or Device MAC value.");
      return;
    }
    await handleBlock(blockForm.type, blockForm.value.trim(), blockForm.reason);
    setIsBlockModalOpen(false);
    setBlockForm({ type: "ip", value: "", reason: "Suspicious brute-force attack detected" });
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "critical":
        return <span className="bg-red-500/15 text-red-500 border border-red-500/30 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><FaBan size={10} /> Critical (10+)</span>;
      case "high":
        return <span className="bg-orange-500/15 text-orange-500 border border-orange-500/30 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><FaExclamationTriangle size={10} /> High (6+)</span>;
      case "medium":
        return <span className="bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><FaClock size={10} /> Medium (3+)</span>;
      default:
        return <span className="bg-blue-500/15 text-blue-500 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><FaShieldAlt size={10} /> Low</span>;
    }
  };

  const getStatusBadge = (status, lockoutUntil) => {
    const isLockedNow = lockoutUntil && new Date(lockoutUntil) > new Date();
    if (status === "blocked") {
      return <span className="bg-red-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md">BLOCKED</span>;
    }
    if (isLockedNow || status === "locked") {
      return <span className="bg-amber-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1"><FaLock size={9} /> LOCKED</span>;
    }
    if (status === "resolved") {
      return <span className="bg-emerald-500/20 text-emerald-600 font-bold text-[11px] px-2 py-0.5 rounded-md border border-emerald-500/30">RESOLVED</span>;
    }
    return <span className="bg-gray-100 text-gray-700 font-bold text-[11px] px-2 py-0.5 rounded-md">ACTIVE</span>;
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-[#2A0312] to-gray-900 p-6 rounded-3xl text-white shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[#e21b70] text-xs font-bold uppercase tracking-widest mb-1">
            <FaShieldAlt className="animate-pulse" /> Threat Intelligence & Defense Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Security Alerts & MAC/IP Blocker
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Live monitor for unauthorized login attempts, recursive cooldown lockouts, and hardware device bans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
          >
            <FaBan size={14} /> Manually Block IP / MAC
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition backdrop-blur-md cursor-pointer"
            title="Refresh logs"
          >
            <FaSync className={loading ? "animate-spin" : ""} size={14} />
          </button>
        </div>
      </div>

      {/* ── Metric Summary Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Threats Logged</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalAlerts || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-xs">
            <FaUserSecret />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Lockouts</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.lockedAccounts || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-xs">
            <FaClock />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Critical Threats (10+)</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{stats.criticalThreats || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl shadow-xs">
            <FaExclamationTriangle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Permanently Blocked</p>
            <h3 className="text-2xl font-black text-red-600 mt-1">{stats.blockedEntities || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shadow-xs">
            <FaBan />
          </div>
        </div>
      </div>

      {/* ── Filter Tabs & Search Controls ──────────────────────── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: "all", label: "All Threat Logs", count: stats.totalAlerts },
            { id: "critical", label: "Critical (10+ attempts)", count: stats.criticalThreats },
            { id: "locked", label: "Active Lockouts", count: stats.lockedAccounts },
            { id: "blocked", label: "Blocked Device / IP", count: stats.blockedEntities },
            { id: "resolved", label: "Resolved", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-[#e21b70] text-white shadow-md shadow-[#e21b70]/20"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search IP, MAC, Email, City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e21b70] transition"
          />
        </div>
      </div>

      {/* ── Main Data View ─────────────────────────────────────── */}
      {activeTab === "blocked" ? (
        /* Blocked Entities Table */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <FaBan className="text-red-500" /> Active Blocklist ({blockedList.length})
            </h3>
            <span className="text-xs text-gray-400 font-medium">Entities rejected by security middleware</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Type</th>
                  <th className="p-4">Blocked Target Value</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Blocked By</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {blockedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      No blocked entities found. All devices/IPs are clear.
                    </td>
                  </tr>
                ) : (
                  blockedList.map((item) => (
                    <tr key={item._id} className="hover:bg-red-50/40 transition">
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md font-bold text-[10px] uppercase ${
                            item.type === "deviceMac"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.type === "deviceMac" ? "Device MAC" : "IP Address"}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-gray-900">{item.value}</td>
                      <td className="p-4 text-gray-500 max-w-xs truncate">{item.reason}</td>
                      <td className="p-4 text-gray-600">{item.blockedBy}</td>
                      <td className="p-4 text-gray-400">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleUnblock(item.type, item.value)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ml-auto transition shadow-xs cursor-pointer"
                        >
                          <FaUnlock size={11} /> Unblock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Security Threat Logs Table */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <FaShieldAlt className="text-[#e21b70]" /> Suspicious Login Attempts & Threat Incidents
            </h3>
            <span className="text-xs text-gray-400 font-medium">Showing {alerts.length} incident records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Target Email</th>
                  <th className="p-4">Attacker IP & Geolocation</th>
                  <th className="p-4">Device / MAC Address</th>
                  <th className="p-4 text-center">Attempts</th>
                  <th className="p-4">Status / Cooldown</th>
                  <th className="p-4">Last Attempt</th>
                  <th className="p-4 text-right">Threat Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-gray-400">
                      {loading ? "Loading security telemetry logs..." : "No security alerts found matching your filter."}
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => {
                    const isLocked = alert.lockoutUntil && new Date(alert.lockoutUntil) > new Date();
                    return (
                      <tr
                        key={alert._id}
                        className={`hover:bg-gray-50 transition ${
                          alert.severity === "critical"
                            ? "bg-red-50/20"
                            : isLocked
                            ? "bg-amber-50/20"
                            : ""
                        }`}
                      >
                        {/* Severity */}
                        <td className="p-4">{getSeverityBadge(alert.severity)}</td>

                        {/* Target Account */}
                        <td className="p-4">
                          <span className="font-bold text-gray-900">{alert.email}</span>
                        </td>

                        {/* IP & Location */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                              {alert.ip}
                            </span>
                            <span className="text-gray-500 text-[11px] flex items-center gap-1">
                              <FaMapMarkerAlt className="text-red-400" size={10} />
                              {alert.location?.city || "Unknown"}, {alert.location?.country || "UN"}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{alert.location?.isp || ""}</p>
                        </td>

                        {/* Device / MAC */}
                        <td className="p-4">
                          <div className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded text-[11px] inline-block">
                            {alert.deviceMac || "Unknown Device"}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {alert.deviceInfo?.os || "Web"} • {alert.deviceInfo?.browser || ""}
                          </p>
                        </td>

                        {/* Attempts */}
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block font-black text-xs px-2.5 py-1 rounded-full ${
                              alert.attemptCount >= 10
                                ? "bg-red-600 text-white animate-pulse"
                                : alert.attemptCount >= 3
                                ? "bg-amber-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {alert.attemptCount}
                          </span>
                        </td>

                        {/* Status / Lockout */}
                        <td className="p-4">
                          <div className="flex flex-col items-start gap-1">
                            {getStatusBadge(alert.status, alert.lockoutUntil)}
                            {isLocked && (
                              <span className="text-[10px] text-amber-600 font-bold">
                                Until: {new Date(alert.lockoutUntil).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Last Attempt */}
                        <td className="p-4 text-gray-400 text-[11px]">
                          {new Date(alert.lastAttemptAt || alert.updatedAt).toLocaleTimeString()}
                          <div className="text-[10px] text-gray-400">
                            {new Date(alert.lastAttemptAt || alert.updatedAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect Deep Details */}
                            <button
                              onClick={() => setSelectedAlert(alert)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition cursor-pointer"
                              title="Inspect Incident & Geolocation"
                            >
                              <FaEye size={13} />
                            </button>

                            {/* Block Device */}
                            {alert.status !== "blocked" && (
                              <button
                                onClick={() => handleBlock("deviceMac", alert.deviceMac, `Blocked from incident on account ${alert.email}`)}
                                className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                                title="Block this Device MAC"
                              >
                                <FaBan size={10} /> Block MAC
                              </button>
                            )}

                            {/* Resolve */}
                            {alert.status !== "resolved" && (
                              <button
                                onClick={() => handleResolveAlert(alert._id)}
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer"
                                title="Mark Resolved"
                              >
                                <FaCheckCircle size={13} />
                              </button>
                            )}

                            {/* Delete Log */}
                            <button
                              onClick={() => handleDeleteAlert(alert._id)}
                              className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition cursor-pointer"
                              title="Delete Log"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Deep Inspection Incident Modal ────────────────────── */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8 relative text-gray-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAlert(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <FaTimes size={16} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl text-xl">
                  <FaUserSecret />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-gray-900">Incident Forensics & Threat Trace</h3>
                    {getSeverityBadge(selectedAlert.severity)}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Incident ID: <span className="font-mono">{selectedAlert._id}</span>
                  </p>
                </div>
              </div>

              {/* Snapshot Image if captured */}
              {selectedAlert.snapshotImage && (
                <div className="mb-6 bg-gray-900 rounded-2xl p-4 text-center border border-red-500/30">
                  <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-bold uppercase mb-2">
                    <FaCamera /> Security Camera Evidence Snapshot
                  </div>
                  <img
                    src={selectedAlert.snapshotImage}
                    alt="Security Evidence Snapshot"
                    className="max-h-48 mx-auto rounded-xl border border-white/20 shadow-md"
                  />
                  <p className="text-[11px] text-gray-400 mt-2">
                    Attacker photographic evidence captured during unauthorized authentication attempt.
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Target Account */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Target Account</p>
                  <p className="font-bold text-gray-900 mt-1 text-sm">{selectedAlert.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Failed Attempts: <strong className="text-red-600">{selectedAlert.attemptCount}</strong></p>
                </div>

                {/* Network IP & ISP */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Network Origin IP</p>
                  <p className="font-mono font-bold text-gray-900 mt-1 text-sm">{selectedAlert.ip}</p>
                  <p className="text-xs text-gray-500 mt-1">ISP: {selectedAlert.location?.isp || "Local Loopback"}</p>
                </div>

                {/* Hardware MAC Identifier */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Device Hardware MAC</p>
                  <p className="font-mono font-bold text-purple-700 mt-1 text-sm">{selectedAlert.deviceMac}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Screen: {selectedAlert.deviceInfo?.screenResolution || "Unknown"}
                  </p>
                </div>

                {/* Geolocation Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Physical Geolocation</p>
                  <p className="font-bold text-gray-900 mt-1 text-sm flex items-center gap-1.5">
                    <FaGlobe className="text-blue-500" />
                    {selectedAlert.location?.city || "Unknown City"},{" "}
                    {selectedAlert.location?.country || "Unknown Country"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lat/Lon: {selectedAlert.location?.lat || 0}, {selectedAlert.location?.lon || 0}
                  </p>
                </div>
              </div>

              {/* User-Agent */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Attacker Client Platform</p>
                <p className="font-mono text-xs text-gray-700 mt-1 break-all bg-white p-2.5 rounded-xl border border-gray-200">
                  {selectedAlert.userAgent}
                </p>
              </div>

              {/* Timeline Logs */}
              {selectedAlert.incidentLogs && selectedAlert.incidentLogs.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <FaHistory className="text-gray-400" /> Attack Timeline History
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedAlert.incidentLogs.map((log, idx) => (
                      <div key={idx} className="bg-gray-50 p-2.5 rounded-xl text-xs flex items-center justify-between border border-gray-100">
                        <span className="text-gray-700 font-medium">{log.reason}</span>
                        <span className="text-gray-400 font-mono text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBlock("deviceMac", selectedAlert.deviceMac, `Banned for unauthorized login brute-force on ${selectedAlert.email}`)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-red-600/20"
                  >
                    <FaBan size={12} /> Block Device MAC
                  </button>
                  <button
                    onClick={() => handleBlock("ip", selectedAlert.ip, `Banned IP for unauthorized login brute-force on ${selectedAlert.email}`)}
                    className="bg-red-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FaBan size={12} /> Block IP
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveAlert(selectedAlert._id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <FaCheckCircle size={12} /> Resolve Incident
                  </button>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Manual Block Entity Modal ──────────────────────────── */}
      <AnimatePresence>
        {isBlockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 p-6 relative text-gray-800"
            >
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <FaTimes size={15} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl text-lg">
                  <FaBan />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Manual Device / IP Block</h3>
                  <p className="text-xs text-gray-500">Ban any target from reaching the system.</p>
                </div>
              </div>

              <form onSubmit={handleManualBlockSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                    Block Target Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBlockForm({ ...blockForm, type: "ip" })}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        blockForm.type === "ip"
                          ? "bg-red-50 border-red-500 text-red-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      IP Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlockForm({ ...blockForm, type: "deviceMac" })}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        blockForm.type === "deviceMac"
                          ? "bg-purple-50 border-purple-500 text-purple-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Device MAC
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                    {blockForm.type === "ip" ? "IP Address (e.g. 192.168.1.1)" : "Device MAC (e.g. 5A:B2:3F:89:C1:0D)"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={blockForm.type === "ip" ? "e.g. 192.168.1.100" : "e.g. A4:83:E7:45:90:12"}
                    value={blockForm.value}
                    onChange={(e) => setBlockForm({ ...blockForm, value: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                    Reason for Block
                  </label>
                  <input
                    type="text"
                    required
                    value={blockForm.reason}
                    onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBlockModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-red-600/25 transition cursor-pointer"
                  >
                    Enforce Block
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageSecurity;
