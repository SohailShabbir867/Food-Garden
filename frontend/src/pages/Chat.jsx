import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaPaperPlane, FaStore, FaCircle } from "react-icons/fa";

// DUMMY MESSAGES — TO BE REPLACED BY SOCKET.IO BACKEND
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
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Simulate vendor auto-reply after 1.5s
    setTimeout(() => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <div className="bg-[#3A0519] text-white px-4 sm:px-8 py-4 flex items-center gap-4 shadow-lg sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="hover:text-[#e21b70] transition-colors"
        >
          <FaArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#e21b70] flex items-center justify-center shadow-md flex-shrink-0">
          <FaStore size={16} />
        </div>
        <div>
          <p className="font-bold text-base leading-tight">{vendorName}</p>
          <p className="text-xs text-green-300 flex items-center gap-1">
            <FaCircle size={7} className="animate-pulse" /> Online
          </p>
        </div>
        <div className="ml-auto text-xs text-pink-300 bg-pink-900/30 px-3 py-1 rounded-full border border-pink-800">
          🔌 Dummy — Socket.io coming soon
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-3xl w-full mx-auto space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.from === "buyer" ? "justify-end" : "justify-start"}`}
            >
              {msg.from === "vendor" && (
                <div className="w-8 h-8 rounded-full bg-[#3A0519] flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 self-end">
                  <FaStore size={12} />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                  msg.from === "buyer"
                    ? "bg-[#e21b70] text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.from === "buyer" ? "text-pink-200 text-right" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="bg-white border-t border-gray-100 px-4 sm:px-8 py-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e21b70] focus:border-transparent placeholder:text-gray-400 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-[#e21b70] disabled:bg-gray-200 text-white flex items-center justify-center shadow-lg shadow-[#e21b70]/30 transition-colors disabled:shadow-none"
          >
            <FaPaperPlane size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
