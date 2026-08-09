import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStore,
  FaCheckDouble,
  FaCopy,
  FaSmile,
  FaShoppingBag,
  FaChevronRight,
  FaCheck,
} from "react-icons/fa";

const EMOJI_OPTIONS = ["👍", "❤️", "😋", "🔥", "👏"];

const ChatMessage = ({
  msg,
  vendorAvatar,
  vendorName,
  onReact,
  onCopy,
  onOpenOrderModal,
}) => {
  const isBuyer = msg.from === "buyer";
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopy(msg.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex ${isBuyer ? "justify-end" : "justify-start"} items-end gap-2 group relative`}
    >
      {/* Vendor Avatar for Vendor Messages */}
      {!isBuyer && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-sm self-end mb-1">
          <img
            src={vendorAvatar || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150"}
            alt={vendorName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Message Bubble Wrapper */}
      <div className="flex flex-col max-w-[85%] sm:max-w-[72%] relative">
        {/* Message Bubble Container */}
        <div
          className={`relative px-4 py-3 shadow-sm transition-all group-hover:shadow-md ${
            isBuyer
              ? "bg-gradient-to-br from-[#e21b70] via-[#d01865] to-[#b8125a] text-white rounded-2xl rounded-br-xs"
              : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-xs border border-gray-100 dark:border-slate-700/80"
          }`}
        >
          {/* Sender Label for Vendor */}
          {!isBuyer && (
            <div className="text-[11px] font-bold text-[#e21b70] dark:text-rose-400 mb-1 flex items-center gap-1">
              <span>{vendorName}</span>
            </div>
          )}

          {/* Attached Image if present */}
          {msg.imageAttachment && (
            <div className="mb-2 rounded-xl overflow-hidden max-h-56 shadow-sm border border-white/20">
              <img
                src={msg.imageAttachment}
                alt="Attachment"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          )}

          {/* Attached Order Card if present */}
          {msg.orderCard && (
            <div
              onClick={onOpenOrderModal}
              className={`mb-2.5 p-3 rounded-xl cursor-pointer transition-all border ${
                isBuyer
                  ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  : "bg-rose-50/70 hover:bg-rose-100/70 dark:bg-slate-700/50 dark:hover:bg-slate-700 border-rose-100 dark:border-slate-600 text-gray-900 dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <FaShoppingBag className={isBuyer ? "text-amber-300" : "text-[#e21b70]"} />
                  Order Summary #{msg.orderCard.orderNumber}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 dark:text-emerald-400 border border-emerald-500/30">
                  {msg.orderCard.status || "In Preparation"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={msg.orderCard.itemImage || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150"}
                  alt={msg.orderCard.itemName}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 ring-1 ring-black/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold truncate">{msg.orderCard.itemName}</h4>
                  <p className={`text-[11px] ${isBuyer ? "text-pink-100" : "text-gray-500 dark:text-gray-400"}`}>
                    {msg.orderCard.quantity || 1}x • ${msg.orderCard.totalPrice}
                  </p>
                </div>
                <FaChevronRight className={`text-xs ${isBuyer ? "text-pink-200" : "text-gray-400"}`} />
              </div>
            </div>
          )}

          {/* Text Content */}
          {msg.text && (
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.text}
            </p>
          )}

          {/* Timestamp & Read Receipts */}
          <div
            className={`flex items-center gap-1.5 mt-1.5 justify-end text-[10px] font-medium ${
              isBuyer ? "text-pink-200" : "text-gray-400 dark:text-slate-500"
            }`}
          >
            <span>{msg.time}</span>
            {isBuyer && <FaCheckDouble className="text-pink-200 text-[10px]" />}
          </div>
        </div>

        {/* ── Active Reaction Badges ── */}
        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
          <div
            className={`flex items-center gap-1 mt-1 ${
              isBuyer ? "justify-end" : "justify-start"
            }`}
          >
            {Object.entries(msg.reactions).map(([emoji, count]) => {
              if (count <= 0) return null;
              return (
                <button
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs shadow-xs hover:scale-110 transition-transform flex items-center gap-1 text-gray-700 dark:text-gray-200"
                >
                  <span>{emoji}</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Hover Action Bar (Copy & Reaction Trigger) ── */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${
            isBuyer ? "-left-16" : "-right-16"
          }`}
        >
          {/* Reaction Button */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-1.5 rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-[#e21b70] shadow-md border border-gray-100 dark:border-slate-700 transition-transform hover:scale-110"
            title="React"
          >
            <FaSmile className="text-xs" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full bg-white dark:bg-slate-800 text-gray-400 hover:text-[#e21b70] shadow-md border border-gray-100 dark:border-slate-700 transition-transform hover:scale-110"
            title="Copy Text"
          >
            {isCopied ? (
              <FaCheck className="text-xs text-emerald-500" />
            ) : (
              <FaCopy className="text-xs" />
            )}
          </button>
        </div>

        {/* ── Emoji Picker Popover ── */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className={`absolute z-30 -top-10 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full px-2 py-1 shadow-xl flex items-center gap-1.5 ${
                isBuyer ? "right-0" : "left-0"
              }`}
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(msg.id, emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="hover:scale-125 transition-transform text-sm p-1"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
