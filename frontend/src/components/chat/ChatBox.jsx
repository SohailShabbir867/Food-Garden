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

const DK = "#3A0519";
const ACC = "#e21b70";
const CR = "#F7F4EF";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ChatBox = ({ conversation, onMessageSent, onUnreadCleared, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const convId = conversation?.conversationId || conversation?.id || conversation?._id;
  const otherUser = conversation?.otherUser || {
    name: conversation?.name || "User",
    avatar: conversation?.avatar,
    role: conversation?.role || "User",
  };

  /* ── Scroll to bottom ─────────────────────────────────── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ── Mark messages as read via HTTP (page-load fallback) ─
   *
   * Called once when the user opens a conversation.  The primary path
   * (Socket.IO `markRead` event) is also emitted below, but this HTTP
   * call guarantees persistence even when the socket hasn't handshaked
   * yet (e.g. slow network, first render).
   */
  const httpMarkRead = useCallback(async (chatId) => {
    if (!chatId) return;
    try {
      await fetch(`${BASE}/chats/${chatId}/read`, {
        method: "PUT",
        credentials: "include",
      });
    } catch {
      // Silently ignore — the socket path will cover it
    }
  }, []);

  /* ── Socket: join room + listeners ─────────────────────── */
  useEffect(() => {
    if (!convId) return;

    // 1. Join this conversation's socket room
    socket.emit("joinChat", convId);

    // 2. Emit markRead immediately so any unread messages are marked
    //    on the backend and the sender's screen flips to green ticks.
    socket.emit("markRead", { chatId: convId });

    // 3. Also fire HTTP fallback (handles page-load before socket connects)
    httpMarkRead(convId);

    // ── Incoming new message from the other party ──────────
    const handleIncomingMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();

      // When I receive a new message, immediately mark it as read
      // (because I am looking at this chat right now).
      socket.emit("markRead", { chatId: convId });
    };

    // ── Sent messages turning green (other party read them) ─
    //
    // `messagesRead` is broadcast to the whole room when the OTHER person
    // opens the chat.  We flip ALL of our own sent messages to read:true
    // so the ticks instantly turn green.
    //
    const handleMessagesRead = ({ chatId }) => {
      if (chatId !== convId) return;
      setMessages((prev) =>
        prev.map((m) =>
          // Only update messages that are "mine" (isOwn / from=buyer) and unread
          (m.isOwn || m.from === "buyer") && !m.read
            ? { ...m, read: true }
            : m
        )
      );
    };

    // ── Typing indicator ───────────────────────────────────
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
  }, [convId, scrollToBottom, httpMarkRead]);

  /* ── Load conversation messages ───────────────────────── */
  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    } else {
      setMessages([]);
    }
    if (onUnreadCleared && convId) {
      onUnreadCleared(convId);
    }
  }, [convId, conversation, onUnreadCleared]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherIsTyping, scrollToBottom]);

  /* ── Handle Typing Status Signal ────────────────────── */
  const handleInputChange = (val) => {
    setText(val);
    if (convId) {
      socket.emit("typing", { chatId: convId, isTyping: val.length > 0 });
    }
  };

  /* ── Send message ─────────────────────────────────────── */
  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !selectedImage) return;

    try {
      setSending(true);

      let imageAttachmentUrl = null;
      if (selectedImage) {
        if (typeof selectedImage === "string") {
          imageAttachmentUrl = selectedImage;
        } else {
          imageAttachmentUrl = URL.createObjectURL(selectedImage);
        }
      }

      const newMsg = {
        _id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        from: "buyer",
        isOwn: true,
        text: trimmed,
        message: trimmed,
        imageAttachment: imageAttachmentUrl,
        createdAt: new Date().toISOString(),
        read: false, // starts as unread (grey tick)
      };

      // 1. Update local state immediately (optimistic)
      setMessages((prev) => [...prev, newMsg]);
      setText("");
      setSelectedImage(null);

      // 2. Stop typing indicator
      if (convId) {
        socket.emit("typing", { chatId: convId, isTyping: false });
      }

      // 3. Broadcast to the other party via socket
      if (convId) {
        socket.emit("sendMessage", { chatId: convId, message: newMsg });
      }

      if (onMessageSent) {
        onMessageSent(newMsg);
      }
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const isFirstInGroup = (idx) => {
    if (idx === 0) return true;
    const curSender = messages[idx].from || (messages[idx].isOwn ? "buyer" : "vendor");
    const prevSender =
      messages[idx - 1].from || (messages[idx - 1].isOwn ? "buyer" : "vendor");
    return curSender !== prevSender;
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
