import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaStore,
  FaShoppingBag,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaFlag,
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const userGrowthData = [
  { month: "Feb", users: 40, vendors: 5 },
  { month: "Mar", users: 80, vendors: 9 },
  { month: "Apr", users: 130, vendors: 15 },
  { month: "May", users: 190, vendors: 22 },
  { month: "Jun", users: 260, vendors: 30 },
  { month: "Jul", users: 350, vendors: 41 },
  { month: "Aug", users: 420, vendors: 55 },
];

const revenueData = [
  { month: "Feb", revenue: 12000 },
  { month: "Mar", revenue: 28000 },
  { month: "Apr", revenue: 45000 },
  { month: "May", revenue: 38000 },
  { month: "Jun", revenue: 62000 },
  { month: "Jul", revenue: 78000 },
  { month: "Aug", revenue: 95000 },
];

const ordersData = [
  { day: "Mon", orders: 34 },
  { day: "Tue", orders: 52 },
  { day: "Wed", orders: 41 },
  { day: "Thu", orders: 67 },
  { day: "Fri", orders: 89 },
  { day: "Sat", orders: 112 },
  { day: "Sun", orders: 78 },
];

const recentActivity = [
  { id: 1, type: "user", message: "New user Ali Hassan registered", time: "2 min ago", status: "success" },
  { id: 2, type: "report", message: "Report #045 filed by a buyer", time: "15 min ago", status: "warning" },
  { id: 3, type: "vendor", message: "Vendor 'Spice Garden' approved", time: "1 hr ago", status: "success" },
  { id: 4, type: "order", message: "Order #1234 marked as delivered", time: "2 hr ago", status: "success" },
  { id: 5, type: "report", message: "Food item flagged for review", time: "3 hr ago", status: "error" },
  { id: 6, type: "user", message: "User Ahmed Khan was blocked", time: "5 hr ago", status: "error" },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, positive, icon: Icon, color, bg, delay }) => (
  <div data-aos="fade-up" data-aos-delay={delay} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}>
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
      <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${positive ? "text-emerald-500" : "text-red-400"}`}>
        {positive ? <FaArrowUp size={11} /> : <FaArrowDown size={11} />}
        {change} <span className="text-gray-400 font-normal ml-1">vs last month</span>
      </div>
    </div>
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
      <Icon size={22} />
    </div>
  </div>
);

// ─── Activity Icon ────────────────────────────────────────────────────────────
const ActivityIcon = ({ status }) => {
  if (status === "success") return <FaCheckCircle className="text-emerald-500" size={16} />;
  if (status === "error")   return <FaTimesCircle className="text-red-400" size={16} />;
  return <FaClock className="text-amber-400" size={16} />;
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl">
        <p className="font-bold mb-1 text-gray-300">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeChart, setActiveChart] = useState("users");

  const stats = [
    { title: "Total Users",   value: "1,420", change: "+18%", positive: true,  icon: FaUsers,       color: "text-[#3A0519]", bg: "bg-[#3A0519]"   },
    { title: "Total Vendors", value: "55",    change: "+12%", positive: true,  icon: FaStore,       color: "text-[#e21b70]", bg: "bg-[#e21b70]"   },
    { title: "Total Orders",  value: "3,781", change: "+24%", positive: true,  icon: FaShoppingBag, color: "text-[#A53860]", bg: "bg-[#A53860]"   },
    { title: "Revenue (PKR)", value: "95K",   change: "+9%",  positive: true,  icon: FaChartLine,   color: "text-emerald-600",bg: "bg-emerald-500"},
  ];

  return (
    <div className="space-y-6">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div data-aos="fade-up">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => <StatCard key={s.title} {...s} delay={i * 60} />)}
      </div>

      {/* ── Charts Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Growth Chart — spans 2 cols */}
        <div data-aos="fade-up" className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-black text-gray-900 text-lg">Platform Growth</h2>
              <p className="text-gray-400 text-sm">Users & Vendors over time</p>
            </div>
            <div className="flex gap-2">
              {["users", "revenue"].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveChart(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                    activeChart === c
                      ? "bg-[#3A0519] text-white shadow"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {c === "users" ? "Users" : "Revenue"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {activeChart === "users" ? (
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3A0519" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3A0519" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e21b70" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#e21b70" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Area type="monotone" dataKey="users"   name="Users"   stroke="#3A0519" strokeWidth={2.5} fill="url(#colorUsers)"   dot={false} activeDot={{ r: 5, fill: "#3A0519" }} />
                <Area type="monotone" dataKey="vendors" name="Vendors" stroke="#e21b70" strokeWidth={2.5} fill="url(#colorVendors)" dot={false} activeDot={{ r: 5, fill: "#e21b70" }} />
              </AreaChart>
            ) : (
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue (PKR)" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 5, fill: "#10b981" }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Weekly Orders Bar Chart */}
        <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="font-black text-gray-900 text-lg">Weekly Orders</h2>
            <p className="text-gray-400 text-sm">This week's order volume</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ordersData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Orders" fill="#e21b70" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div data-aos="fade-up" className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-black text-gray-900 text-lg mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="mt-0.5 flex-shrink-0">
                  <ActivityIcon status={item.status} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 font-medium leading-snug">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h2 className="font-black text-gray-900 text-lg">Quick Stats</h2>

          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <FaFlag size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Open Reports</span>
            </div>
            <span className="text-lg font-black text-amber-500">12</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#3A0519]/5 text-[#3A0519] rounded-xl flex items-center justify-center">
                <FaBell size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Notifications Sent</span>
            </div>
            <span className="text-lg font-black text-[#3A0519]">38</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                <FaTimesCircle size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Blocked Users</span>
            </div>
            <span className="text-lg font-black text-red-500">4</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                <FaCheckCircle size={14} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Resolved Reports</span>
            </div>
            <span className="text-lg font-black text-emerald-500">33</span>
          </div>

          {/* Completion bar */}
          <div className="mt-2 bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
              <span>Reports Resolved</span>
              <span>73%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#e21b70] to-[#3A0519] rounded-full" style={{ width: "73%" }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
