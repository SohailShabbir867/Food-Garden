import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaStore,
} from "react-icons/fa";

const CallModal = ({ vendor, isOpen, onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isOpen) {
      setSeconds(0);
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !vendor) return null;

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Call Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          className="relative w-full max-w-sm bg-gradient-to-b from-[#3A0519] via-[#20020d] to-slate-950 text-white rounded-3xl p-8 shadow-2xl border border-white/10 text-center z-10 select-none overflow-hidden"
        >
          {/* Ambient Glowing Orbs */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#e21b70]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#3A0519]/50 rounded-full blur-3xl" />

          {/* Vendor Details */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-6">
              {/* Pulsing ring animation */}
              <div className="absolute -inset-4 rounded-full bg-[#e21b70]/20 animate-ping opacity-75" />
              <div className="absolute -inset-2 rounded-full bg-[#e21b70]/40 animate-pulse" />
              <img
                src={vendor.avatar || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150"}
                alt={vendor.name}
                className="w-24 h-24 rounded-full object-cover relative z-10 ring-4 ring-white/20 shadow-2xl"
              />
            </div>

            <h3 className="font-extrabold text-xl tracking-tight mb-1">{vendor.name}</h3>
            <p className="text-xs text-emerald-400 font-semibold mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {seconds < 2 ? "Connecting..." : formatTimer(seconds)}
            </p>

            {/* Audio waveform simulator */}
            <div className="flex items-center gap-1.5 h-8 mb-8">
              {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7, 0.3].map((height, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.3, height, 0.3] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                  className="w-1 bg-[#e21b70] rounded-full h-6"
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              {/* Mute Button */}
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className={`p-4 rounded-full transition-all ${
                  isMuted
                    ? "bg-rose-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white/90"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <FaMicrophoneSlash size={18} /> : <FaMicrophone size={18} />}
              </button>

              {/* End Call Button */}
              <button
                onClick={onClose}
                className="p-5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/40 hover:scale-105 transition-all"
                title="End Call"
              >
                <FaPhoneSlash size={22} />
              </button>

              {/* Speaker Button */}
              <button
                onClick={() => setIsSpeaker((prev) => !prev)}
                className={`p-4 rounded-full transition-all ${
                  isSpeaker
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white/90"
                }`}
                title={isSpeaker ? "Mute Speaker" : "Enable Speaker"}
              >
                {isSpeaker ? <FaVolumeUp size={18} /> : <FaVolumeMute size={18} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CallModal;
