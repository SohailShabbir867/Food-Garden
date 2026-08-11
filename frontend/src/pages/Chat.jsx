import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  RiMessage3Line,
  RiMenuLine,
  RiLoader4Line,
} from "react-icons/ri";
import ChatList from "../components/chat/ChatList";
import ChatBox from "../components/chat/ChatBox";
import { useAuth } from "../context/AuthContext";
import { fetchMyChats, createOrFindChat } from "../services/api";

const DK = "#3A0519";
const ACC = "#e21b70";
const CR = "#F7F4EF";

// Normalise a Chat document from the backend into the shape the UI expects
const normaliseChat = (chat, currentUserId) => {
  // The "other" person is whoever is NOT me
  const currentIdStr = String(currentUserId || "");
  const buyerIdStr = String(chat.buyer?._id || chat.buyer || "");
  const iAmBuyer = buyerIdStr === currentIdStr;
  const otherUser = iAmBuyer ? chat.seller : chat.buyer;
  const isVendor = otherUser?.role === "vendor";

  const displayName = isVendor
    ? (otherUser?.restaurantName || otherUser?.storeName || otherUser?.name || "Vendor")
    : (otherUser?.name || "User");

  return {
    conversationId: chat._id,
    id: chat._id,
    _id: chat._id,
    otherUser: {
      _id: otherUser?._id,
      name: displayName,
      personalName: otherUser?.name,
      restaurantName: otherUser?.restaurantName || otherUser?.storeName,
      avatar: otherUser?.avatar || null,
      role: otherUser?.role || "User",
    },
    lastMessage: {
      text: chat.lastMessage || "",
      message: chat.lastMessage || "",
      createdAt: chat.lastMessageAt || chat.updatedAt,
    },
    lastTime: chat.lastMessageAt || chat.updatedAt,
    unreadCount: chat.unreadCount || 0,
  };
};

const Chat = () => {
  const [searchParams] = useSearchParams();
  const { user, clearUnreadChatCount } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  // ── Clear the navbar unread badge when this page is open ─────────────────
  useEffect(() => {
    if (clearUnreadChatCount) clearUnreadChatCount();
  }, [clearUnreadChatCount]);

  // ── Load all conversation threads from the backend ────────────────────────
  useEffect(() => {
    if (!user?._id) return;

    let cancelled = false;
    setLoading(true);
    setInitError(null);

    fetchMyChats()
      .then((chats) => {
        if (cancelled) return;
        const normalised = (chats || []).map((c) => normaliseChat(c, user._id));
        setConversations(normalised);

        // Auto-select the first chat on desktop if nothing is pre-selected
        if (
          typeof window !== "undefined" &&
          window.innerWidth >= 1024 &&
          normalised.length > 0 &&
          !searchParams.get("vendorId") &&
          !searchParams.get("vendorName")
        ) {
          setActiveConv(normalised[0]);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setInitError("Could not load conversations. Is the server running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle query params: ?vendorId=<userId>&orderId=<orderNum> or ?vendorName=<name> ──
  useEffect(() => {
    if (!user?._id || loading) return;

    const vendorId = searchParams.get("vendorId");
    const vendorName = searchParams.get("vendorName");
    const orderId = searchParams.get("orderId");

    if (!vendorId && !vendorName) return;

    // If we have a vendorId, create/find the real chat thread
    if (vendorId) {
      createOrFindChat(vendorId, orderId)
        .then((chat) => {
          const norm = normaliseChat(chat, user._id);
          setConversations((prev) => {
            const exists = prev.find((c) => c.conversationId === norm.conversationId);
            if (exists) return prev;
            return [norm, ...prev];
          });
          setActiveConv(norm);
        })
        .catch((err) => {
          console.error("[Chat] createOrFindChat error:", err);
        });
      return;
    }

    // Fallback: vendorName only — try to match an existing conversation by name
    if (vendorName) {
      const match = conversations.find((c) =>
        (c.otherUser?.name || "").toLowerCase().includes(vendorName.toLowerCase())
      );
      if (match) {
        setActiveConv(match);
      }
      // If no match found, we can't create without a real userId — show a notice
    }
  }, [searchParams, user?._id, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Filtered conversations ──────────────────────────── */
  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((conv) =>
      (conv.otherUser?.name || "").toLowerCase().includes(q)
    );
  }, [conversations, search]);

  /* ── Message sent callback: update sidebar last message ─ */
  const handleMessageSent = useCallback(
    (savedMessage) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.conversationId === activeConv?.conversationId) {
            return {
              ...c,
              lastMessage: {
                text: savedMessage.text || savedMessage.message || "",
                message: savedMessage.text || savedMessage.message || "",
                createdAt: savedMessage.createdAt,
              },
              lastTime: savedMessage.createdAt,
            };
          }
          return c;
        })
      );
    },
    [activeConv]
  );

  /* ── Clear unread count for the active conversation ─────── */
  const handleUnreadCleared = useCallback((convId) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.conversationId === convId || c.id === convId) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );
  }, []);

  /* ── Incoming real-time message updates the sidebar preview ─ */
  const handleIncomingMessage = useCallback((convId, msg) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.conversationId !== convId) return c;
        return {
          ...c,
          lastMessage: {
            text: msg.text || msg.message || "",
            message: msg.text || msg.message || "",
            createdAt: msg.createdAt,
          },
          lastTime: msg.createdAt,
          // Don't bump unreadCount here — ChatBox handles that
        };
      })
    );
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8 min-h-screen">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ backgroundColor: DK }}
          >
            <RiMessage3Line className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight" style={{ color: DK }}>
              Messages
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Connect directly with vendors and restaurant owners in real-time
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Container ────────────────────────────────────── */}
      <div
        className="bg-white rounded-3xl border overflow-hidden shadow-xl"
        style={{ borderColor: "#E8E2D9", height: "calc(100vh - 210px)", minHeight: "560px" }}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <RiLoader4Line className="animate-spin text-4xl" style={{ color: DK }} />
          </div>
        ) : initError ? (
          <div className="h-full flex items-center justify-center text-center px-6">
            <div>
              <RiMessage3Line className="text-4xl mb-3 mx-auto" style={{ color: DK }} />
              <p className="font-bold text-base mb-1" style={{ color: DK }}>
                Connection Error
              </p>
              <p className="text-sm text-gray-400">{initError}</p>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          /* Empty State */
          <div className="h-full flex items-center justify-center text-center px-6">
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: `${DK}0D` }}
              >
                <RiMessage3Line className="text-3xl" style={{ color: DK }} />
              </div>
              <p className="font-bold text-base" style={{ color: DK }}>
                No messages yet
              </p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                Message a food vendor from the menu to start chatting.
              </p>
              <div className="flex justify-center mt-5">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-sm"
                  style={{ backgroundColor: DK }}
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Two-panel layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            {/* Sidebar */}
            <div
              className={`lg:col-span-4 border-r h-full ${
                activeConv ? "hidden lg:block" : "block"
              }`}
              style={{ borderColor: "#E8E2D9" }}
            >
              <ChatList
                conversations={filteredConversations}
                activeConvId={activeConv?.conversationId || activeConv?.id}
                onSelect={(conv) => setActiveConv(conv)}
                search={search}
                onSearch={setSearch}
              />
            </div>

            {/* Chat area */}
            <div
              className={`lg:col-span-8 h-full min-h-0 flex flex-col ${
                !activeConv ? "hidden lg:block" : "block"
              }`}
            >
              {activeConv ? (
                <ChatBox
                  conversation={activeConv}
                  onMessageSent={handleMessageSent}
                  onUnreadCleared={handleUnreadCleared}
                  onIncomingMessage={handleIncomingMessage}
                  onBack={() => setActiveConv(null)}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center px-6 bg-[#F7F4EF]">
                  <div>
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                      style={{ backgroundColor: `${DK}0D` }}
                    >
                      <RiMessage3Line className="text-3xl" style={{ color: DK }} />
                    </div>
                    <p className="font-bold text-base" style={{ color: DK }}>
                      Select a conversation
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Pick a chat from the left panel to start messaging.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
