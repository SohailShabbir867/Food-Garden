import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaPaperPlane, FaStore, FaCircle } from "react-icons/fa";

// DUMMY MESSAGES
const dummyMessages = [
  {
    id: 1,
    from: "vendor",
    text: "Hello! Welcome to our store. How can I help you today? 😊",
    time: "3:20 PM",
  },
  {
    id: 2,
    from: "vendor",
    text: "Feel free to ask about any special requests, cooking preferences, or customizations!",
    time: "3:20 PM",
  },
];

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorName = searchParams.get("vendorName") || "Vendor";

  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; // max-height 120px
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMsg = {
      id: Date.now(),
      from: "buyer",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsTyping(true);

    // Simulate vendor auto-reply after 1.5s
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "vendor",
          text: "Thanks for your message! We'll prepare your order exactly how you like it. 🍽️",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative" style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
      {/* ── Header ── */}
      <div className="bg-[#3A0519] text-white px-4 sm:px-8 py-3.5 flex items-center gap-4 shadow-lg sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="hover:text-[#e21b70] transition-colors p-2 -ml-2 rounded-full hover:bg-white/10">
          <FaArrowLeft size={16} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e21b70] to-[#b8125a] flex items-center justify-center shadow-md flex-shrink-0 border border-white/20">
          <FaStore size={15} />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-base leading-tight tracking-wide">{vendorName}</h1>
          <p className="text-[11px] font-medium text-green-400 flex items-center gap-1.5 mt-0.5">
            <FaCircle size={6} className="animate-pulse" /> Online
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-4xl w-full mx-auto flex flex-col gap-5">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isBuyer = msg.from === "buyer";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isBuyer ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {!isBuyer && (
                  <div className="w-7 h-7 rounded-full bg-[#3A0519] flex items-center justify-center text-white text-[10px] flex-shrink-0 shadow-sm">
                    <FaStore size={10} />
                  </div>
                )}
                
                <div
                  className={`relative max-w-[80%] sm:max-w-[70%] px-4 py-2.5 shadow-sm group ${
                    isBuyer
                      ? "bg-gradient-to-br from-[#e21b70] to-[#c81661] text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  
                  <div className={`flex items-center gap-1 mt-1 justify-end ${isBuyer ? "text-pink-200" : "text-gray-400"}`}>
                    <span className="text-[10px] font-medium">{msg.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start items-end gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-[#3A0519] flex items-center justify-center text-white text-[10px] flex-shrink-0 shadow-sm">
                <FaStore size={10} />
              </div>
              <div className="bg-white px-4 py-3.5 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-1.5">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* ── Input Bar ── */}
      <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 sm:p-5 sticky bottom-0 z-30 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative bg-gray-100 border border-gray-200 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#e21b70]/20 focus-within:border-[#e21b70] shadow-inner">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              className="w-full bg-transparent px-4 py-3.5 text-[15px] text-gray-800 focus:outline-none placeholder:text-gray-400 resize-none max-h-[120px] overflow-y-auto"
              style={{ minHeight: "48px" }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-[50px] h-[50px] rounded-full bg-[#e21b70] disabled:bg-gray-300 text-white flex items-center justify-center shadow-lg shadow-[#e21b70]/20 transition-all disabled:shadow-none flex-shrink-0"
          >
            <FaPaperPlane size={16} className="ml-1 mb-0.5" />
          </motion.button>
        </div>
        <div className="max-w-4xl mx-auto text-center mt-2">
          <p className="text-[10px] text-gray-400">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
