import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaTimes,
  FaImage,
  FaShoppingBag,
} from "react-icons/fa";

const QUICK_EMOJIS = ["😊", "😋", "🍕", "🍔", "❤️", "👍", "🛵", "🌶️", "⭐️"];

const ChatInput = ({
  input,
  onChange,
  onSend,
  onKeyDown,
  quickReplies = [],
  onSelectQuickReply,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    onChange(e.target.value);
    // Auto resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    onSend(selectedImage);
    setSelectedImage(null);
    setShowEmojiBar(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const appendEmoji = (emoji) => {
    onChange(input + emoji);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-200/80 dark:border-slate-800 p-3 sm:p-4 sticky bottom-0 z-30 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.08)]">
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
        {/* ── Quick Reply Suggestion Chips ── */}
        {quickReplies.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500 whitespace-nowrap">
              Quick:
            </span>
            {quickReplies.map((reply, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectQuickReply(reply)}
                className="px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-rose-200/60 dark:border-slate-700 text-xs text-[#3A0519] dark:text-rose-300 font-semibold whitespace-nowrap transition-all shadow-2xs"
              >
                {reply}
              </motion.button>
            ))}
          </div>
        )}

        {/* ── Image Attachment Preview Box ── */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative inline-block max-w-xs overflow-hidden"
            >
              <div className="relative rounded-2xl overflow-hidden border border-rose-200 dark:border-slate-700 shadow-sm group">
                <img
                  src={selectedImage}
                  alt="Attachment Preview"
                  className="w-24 h-24 object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Quick Emoji Bar Overlay ── */}
        <AnimatePresence>
          {showEmojiBar && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-x-auto no-scrollbar"
            >
              {QUICK_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => appendEmoji(emoji)}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-base transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Input Box & Control Buttons ── */}
        <div className="flex items-end gap-2 sm:gap-3">
          {/* File attachment hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <div className="flex-1 relative bg-gray-100/90 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 rounded-2xl transition-all focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-[#e21b70]/20 focus-within:border-[#e21b70] shadow-inner flex items-end">
            {/* Attachment Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-[#e21b70] dark:hover:text-rose-400 transition-colors flex-shrink-0"
              title="Attach Image"
            >
              <FaImage className="text-base" />
            </button>

            {/* Emoji Bar Toggle Button */}
            <button
              onClick={() => setShowEmojiBar((prev) => !prev)}
              className={`p-3 transition-colors flex-shrink-0 ${
                showEmojiBar
                  ? "text-[#e21b70]"
                  : "text-gray-400 hover:text-[#e21b70] dark:hover:text-rose-400"
              }`}
              title="Insert Emoji"
            >
              <FaSmile className="text-base" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-transparent py-3 pr-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-none placeholder-gray-400 dark:placeholder-slate-500 resize-none max-h-[120px] overflow-y-auto leading-relaxed"
              style={{ minHeight: "44px" }}
            />
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() && !selectedImage}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#e21b70] to-[#b8125a] disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 text-white flex items-center justify-center shadow-lg shadow-[#e21b70]/25 disabled:shadow-none transition-all flex-shrink-0"
          >
            <FaPaperPlane className="text-sm ml-0.5" />
          </motion.button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-center">
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
            Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded font-mono text-[9px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded font-mono text-[9px]">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
