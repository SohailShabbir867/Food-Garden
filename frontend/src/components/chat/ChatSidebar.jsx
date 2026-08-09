import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTimes,
  FaStore,
  FaHeadset,
  FaShoppingBag,
  FaCheckDouble,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";
import { HiCheckBadge } from "react-icons/hi2";

const ChatSidebar = ({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) => {
  const tabs = [
    { id: "all", label: "All", icon: null },
    { id: "vendors", label: "Vendors", icon: FaStore },
    { id: "orders", label: "Orders", icon: FaShoppingBag },
    { id: "support", label: "Support", icon: FaHeadset },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200/80 dark:border-slate-800/80 select-none">
      {/* ── Sidebar Header ── */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3A0519] to-[#e21b70] flex items-center justify-center text-white shadow-md shadow-[#e21b70]/20">
              <FaStore className="text-sm" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-tight tracking-tight font-sans">
                Messages
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                Connect with vendors & support
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              <FaTimes className="text-base" />
            </button>
          )}
        </div>

        {/* ── Search Input ── */}
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search messages or vendors..."
            className="w-full pl-9 pr-8 py-2.5 bg-gray-100/80 dark:bg-slate-800/90 border border-transparent focus:border-[#e21b70]/40 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 text-xs"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-1 mt-3 overflow-x-auto no-scrollbar pb-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#3A0519] text-white shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {Icon && <Icon className="text-[11px]" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Conversations List ── */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100/60 dark:divide-slate-800/40">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-slate-500">
            <p className="text-xs">No conversations found</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeId === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => {
                  onSelect(conv.id);
                  if (onClose) onClose();
                }}
                className={`group relative p-3.5 sm:p-4 cursor-pointer transition-all ${
                  isActive
                    ? "bg-rose-50/70 dark:bg-slate-800/80 border-l-4 border-[#e21b70]"
                    : "hover:bg-gray-50/80 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar with status indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-900 shadow-sm"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 ring-2 ring-white dark:ring-slate-900 rounded-full" />
                    )}
                  </div>

                  {/* Conv Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3
                          className={`font-semibold text-xs sm:text-sm truncate ${
                            isActive
                              ? "text-[#3A0519] dark:text-rose-400 font-bold"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {conv.name}
                        </h3>
                        {conv.isVerified && (
                          <HiCheckBadge className="text-[#e21b70] text-sm flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-1">
                        {conv.lastTime}
                      </span>
                    </div>

                    {/* Active Order Tag if available */}
                    {conv.activeOrderNumber && (
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-medium mb-1 border border-amber-200/50 dark:border-amber-800/50">
                        <FaShoppingBag className="text-[9px]" />
                        <span>Order #{conv.activeOrderNumber}</span>
                      </div>
                    )}

                    {/* Last Message preview */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate leading-tight">
                        {conv.typing ? (
                          <span className="text-[#e21b70] italic font-medium">
                            typing...
                          </span>
                        ) : (
                          conv.lastMessage
                        )}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#e21b70] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Footer Info ── */}
      <div className="p-3.5 bg-gray-50/80 dark:bg-slate-950/60 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <FaShieldAlt className="text-emerald-500" /> End-to-end encrypted
        </span>
        <span className="font-mono text-[10px]">FoodGarden v2.4</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 xl:w-88 h-full flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;
