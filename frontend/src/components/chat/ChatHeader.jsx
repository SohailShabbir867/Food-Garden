import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaPhoneAlt,
  FaSearch,
  FaEllipsisV,
  FaShoppingBag,
  FaCircle,
  FaTimes,
  FaTrashAlt,
  FaBellSlash,
  FaInfoCircle,
  FaBars,
  FaStar,
} from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

const ChatHeader = ({
  activeVendor,
  onOpenSidebar,
  isSearchOpen,
  onToggleSearch,
  searchQuery,
  onSearchChange,
  onOpenOrderModal,
  onStartCall,
  onClearChat,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-[#3A0519] dark:bg-slate-950 text-white shadow-lg sticky top-0 z-30 border-b border-white/10 select-none">
      {/* ── Main Header Bar ── */}
      <div className="px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Back / Sidebar toggle & Vendor Details */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title="Open Conversations"
          >
            <FaBars className="text-sm sm:text-base" />
          </button>

          <button
            onClick={() => navigate(-1)}
            className="hidden lg:flex p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title="Go Back"
          >
            <FaArrowLeft className="text-sm" />
          </button>

          {/* Avatar with Status Pulse */}
          <div className="relative flex-shrink-0">
            <img
              src={activeVendor?.avatar || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150"}
              alt={activeVendor?.name}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
            />
            {activeVendor?.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 ring-2 ring-[#3A0519] rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
              </span>
            )}
          </div>

          {/* Vendor Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-base tracking-tight truncate text-white">
                {activeVendor?.name || "Vendor"}
              </h1>
              {activeVendor?.isVerified && (
                <HiCheckBadge className="text-[#e21b70] text-base flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-white/70">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <FaCircle className="text-[6px] animate-pulse" /> Active Now
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="hidden sm:inline text-white/70">Replies in &lt; 5 mins</span>
              {activeVendor?.rating && (
                <>
                  <span className="hidden sm:inline text-white/30">•</span>
                  <span className="hidden sm:flex items-center gap-0.5 text-amber-300">
                    <FaStar className="text-[10px]" /> {activeVendor.rating}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Active Order Button Pill */}
          {activeVendor?.activeOrderNumber && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenOrderModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-amber-300 transition-all shadow-xs"
            >
              <FaShoppingBag className="text-xs" />
              <span>Order #{activeVendor.activeOrderNumber}</span>
            </motion.button>
          )}

          {/* Search Toggle Button */}
          <button
            onClick={onToggleSearch}
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${
              isSearchOpen
                ? "bg-[#e21b70] text-white shadow-md"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            title="Search in Chat"
          >
            <FaSearch className="text-xs sm:text-sm" />
          </button>

          {/* Audio Call Button */}
          <button
            onClick={onStartCall}
            className="p-2 sm:p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-emerald-600/30 hover:border-emerald-500/30 border border-transparent transition-all"
            title="Start Audio Call"
          >
            <FaPhoneAlt className="text-xs sm:text-sm text-emerald-400" />
          </button>

          {/* Menu Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-2 sm:p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
              title="Chat Options"
            >
              <FaEllipsisV className="text-xs sm:text-sm" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-1.5 z-50 overflow-hidden text-xs"
                  >
                    {activeVendor?.activeOrderNumber && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onOpenOrderModal();
                        }}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-slate-700/60 text-gray-700 dark:text-gray-200"
                      >
                        <FaShoppingBag className="text-[#e21b70]" />
                        <span>View Order Details</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onClearChat();
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-slate-700/60 text-rose-600 dark:text-rose-400"
                    >
                      <FaTrashAlt />
                      <span>Clear Chat History</span>
                    </button>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-slate-700/60 text-gray-700 dark:text-gray-200"
                    >
                      <FaBellSlash className="text-gray-400" />
                      <span>Mute Notifications</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Expandable Search Bar ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2.5 bg-[#2A0312] border-t border-white/10 overflow-hidden"
          >
            <div className="relative max-w-xl mx-auto flex items-center">
              <FaSearch className="absolute left-3 text-white/50 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search messages in this conversation..."
                className="w-full pl-9 pr-8 py-2 bg-white/10 text-white placeholder-white/50 text-xs rounded-xl border border-white/15 focus:outline-none focus:border-[#e21b70]"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 p-1 text-white/50 hover:text-white text-xs"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHeader;
