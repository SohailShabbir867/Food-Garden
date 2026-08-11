import React, { useEffect, useState, useRef, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ImageLightbox from "./ImageLightbox";
import { toast } from "react-toastify";
import {
  RiLoader4Line,
  RiUser3Line,
  RiArrowLeftLine,
} from "react-icons/ri";
import socket from "../../socket";
import { fetchChatMessages, sendChatMessage, markChatRead } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DK = "#3A0519";
const ACC = "#e21b70";
const CR = "#F7F4EF";

// Normalise a Message document from the backend
const normaliseMessage = (msg, currentUserId) => {
  const senderId = msg.sender?._id || msg.sender;
  const isMine = senderId === currentUserId || senderId?.toString() === currentUserId?.toString();
  return {
    _id: msg._id,
    from: isMine ? "buyer" : "vendor",
    isOwn: isMine,
    text: msg.text || msg.message || "",
    message: msg.text || msg.message || "",
    imageAttachment: msg.image?.url || msg.imageAttachment || null,
    createdAt: msg.createdAt,
    read: Boolean(msg.read),
    sender: msg.sender,
  };
};

const ChatBox = ({
  conversation,
  onMessageSent,
  onUnreadCleared,
  onIncomingMessage,
  onBack,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const convId = conversation?._id || conversation?.conversationId || conversation?.id;
  const otherUser = conversation?.otherUser || {
    name: conversation?.name || "User",
    avatar: conversation?.avatar,
    role: conversation?.role || "User",
  };

  /* ── Scroll to bottom ──────────────────────────────────── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ── Load messages from the real backend ───────────────── */
  useEffect(() => {
    if (!convId || !user?._id) return;

    // Only hit the real API for real MongoDB IDs (24-char hex)
    const isRealId = /^[a-f\d]{24}$/i.test(String(convId));
    if (!isRealId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setMessages([]);

    fetchChatMessages(convId)
      .then((msgs) => {
        if (cancelled) return;
        const normalised = (msgs || []).map((m) => normaliseMessage(m, user._id));
        setMessages(normalised);
      })
      .catch((err) => {
        if (cancelled) return;
        // Non-fatal: still show the chat box even if messages fail to load
        console.error("[ChatBox] fetchChatMessages error:", err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [convId, user?._id]);

  /* ── Socket: join room + listeners ─────────────────────── */
  useEffect(() => {
    if (!convId) return;

    // Join the socket room for this conversation
    socket.emit("joinChat", convId);

    // Emit markRead immediately so unread messages flip to green ticks
    socket.emit("markRead", { chatId: convId });

    // HTTP fallback — ensures read status is persisted even on page load
    const isRealId = /^[a-f\d]{24}$/i.test(String(convId));
    if (isRealId) {
      markChatRead(convId).catch(() => {});
    }

    if (onUnreadCleared) onUnreadCleared(convId);

    // ── Incoming new message from the other party ───────────
    const handleIncomingMessage = (msg) => {
      const normalised = normaliseMessage(msg, user?._id);
      setMessages((prev) => {
        if (prev.some((m) => m._id === normalised._id)) return prev;
        return [...prev, normalised];
      });
      scrollToBottom();

      // I am actively viewing this chat — mark it read immediately
      socket.emit("markRead", { chatId: convId });

      // Update the sidebar preview
      if (onIncomingMessage) onIncomingMessage(convId, normalised);
    };

    // ── Sender sees their ticks turn green ──────────────────
    const handleMessagesRead = ({ chatId }) => {
      if (chatId !== convId) return;
      setMessages((prev) =>
        prev.map((m) =>
          (m.isOwn || m.from === "buyer") && !m.read ? { ...m, read: true } : m
        )
      );
    };

    // ── Typing indicator ────────────────────────────────────
    const handleUserTyping = ({ isTyping }) => {
      setOtherIsTyping(Boolean(isTyping));
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("userTyping", handleUserTyping);
      socket.emit("leaveChat", convId);
    };
  }, [convId, user?._id, scrollToBottom, onUnreadCleared, onIncomingMessage]);

  /* ── Auto-scroll when messages change ───────────────────── */
  useEffect(() => {
    scrollToBottom();
  }, [messages, otherIsTyping, scrollToBottom]);

  /* ── Typing signal ──────────────────────────────────────── */
  const handleInputChange = (val) => {
    setText(val);
    if (convId) {
      socket.emit("typing", { chatId: convId, isTyping: val.length > 0 });
    }
  };

  /* ── Send message ─────────────────────────────────────────*/
  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !selectedImage) return;

    // Stop typing indicator
    if (convId) socket.emit("typing", { chatId: convId, isTyping: false });

    // Optimistic message (shown immediately)
    const optimisticId = `opt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const optimisticMsg = {
      _id: optimisticId,
      from: "buyer",
      isOwn: true,
      text: trimmed,
      message: trimmed,
      imageAttachment: null,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");
    setSelectedImage(null);

    const isRealId = /^[a-f\d]{24}$/i.test(String(convId));

    try {
      setSending(true);

      let savedMessage = optimisticMsg;

      if (isRealId) {
        // Persist to the backend
        const saved = await sendChatMessage(convId, trimmed);
        savedMessage = normaliseMessage(saved, user?._id);

        // Replace the optimistic message with the real saved one
        setMessages((prev) =>
          prev.map((m) => (m._id === optimisticId ? savedMessage : m))
        );

        // Broadcast the real saved message via socket so the other party sees it
        socket.emit("sendMessage", { chatId: convId, message: savedMessage });
      } else {
        // Not a real chat thread yet — socket relay only (no DB persistence)
        socket.emit("sendMessage", { chatId: convId, message: optimisticMsg });
      }

      if (onMessageSent) onMessageSent(savedMessage);
    } catch (err) {
      // Rollback: remove the optimistic message
      setMessages((prev) => prev.filter((m) => m._id !== optimisticId));
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const isFirstInGroup = (idx) => {
    if (idx === 0) return true;
    const cur = messages[idx].from || (messages[idx].isOwn ? "buyer" : "vendor");
    const prev = messages[idx - 1].from || (messages[idx - 1].isOwn ? "buyer" : "vendor");
    return cur !== prev;
  };

  /* ── Avatar helper ─────────────────────────────────────── */
  const OtherAvatar = ({ size = "sm" }) => {
    const sz = size === "sm" ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-sm";
    return otherUser?.avatar || otherUser?.profilePhoto?.url ? (
      <img
        src={otherUser.avatar || otherUser.profilePhoto?.url}
        alt={otherUser.name}
        className={`${sz} rounded-full object-cover shrink-0 ring-1 ring-white/20`}
      />
    ) : (
      <div
        className={`${sz} rounded-full flex items-center justify-center font-bold shrink-0 text-white`}
        style={{ backgroundColor: DK }}
      >
        {(otherUser?.name || "?")[0].toUpperCase()}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: CR }}>
      {/* ── Chat Header ────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 border-b shrink-0 shadow-xs"
        style={{ backgroundColor: DK, borderColor: "rgba(255,255,255,0.08)" }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden text-white/80 hover:text-white p-1 -ml-1 rounded-full transition-all active:scale-95 cursor-pointer"
            aria-label="Back to conversations"
          >
            <RiArrowLeftLine className="text-xl" />
          </button>
        )}

        <OtherAvatar size="md" />

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">
            {otherUser?.name || "User"}
          </p>
          <p
            className="text-xs mt-0.5 font-medium capitalize truncate"
            style={{ color: otherIsTyping ? ACC : "rgba(255,255,255,0.5)" }}
          >
            {otherIsTyping ? "typing…" : otherUser?.role || "User"}
          </p>
        </div>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 shadow-xs"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <RiUser3Line className="text-base" />
        </div>
      </div>

      {/* ── Messages Scroll Area ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <RiLoader4Line className="animate-spin text-3xl" style={{ color: DK }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${DK}12` }}
            >
              <RiUser3Line className="text-2xl" style={{ color: DK }} />
            </div>
            <p className="font-bold text-sm" style={{ color: DK }}>
              Start a conversation
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Say hello to {otherUser?.name || "them"} 👋
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage
              key={msg._id || `msg-${idx}`}
              message={msg}
              otherUser={otherUser}
              showAvatar={isFirstInGroup(idx)}
              onImageClick={(url) => setLightboxImageUrl(url)}
            />
          ))
        )}

        {/* Typing indicator bubbles */}
        {otherIsTyping && (
          <div className="flex items-end gap-2 mt-1">
            <div className="w-7 h-7 shrink-0">
              {otherUser?.avatar || otherUser?.profilePhoto?.url ? (
                <img
                  src={otherUser.avatar || otherUser.profilePhoto?.url}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                  style={{ backgroundColor: DK }}
                >
                  {(otherUser?.name || "?")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div
              className="flex gap-1 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-xs"
              style={{ backgroundColor: "#FFF", border: "1px solid #E8E2D9" }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ backgroundColor: DK, animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ─────────────────────────────────────── */}
      <ChatInput
        value={text}
        onChange={handleInputChange}
        onSend={handleSend}
        selectedImage={selectedImage}
        onImageSelect={setSelectedImage}
        onImageClear={() => setSelectedImage(null)}
        sending={sending}
        disabled={loading}
        placeholder={`Message ${otherUser?.name || ""}…`}
      />

      <ImageLightbox
        isOpen={Boolean(lightboxImageUrl)}
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxImageUrl("")}
      />
    </div>
  );
};

export default ChatBox;
