import React, { useState, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  RiMessage3Line,
  RiCustomerService2Line,
  RiMenuLine,
} from "react-icons/ri";
import ChatList from "../components/chat/ChatList";
import ChatBox from "../components/chat/ChatBox";

const DK = "#3A0519";
const ACC = "#e21b70";
const CR = "#F7F4EF";

// ── Initial Mock Conversations Data (Matching Image 2) ──
const INITIAL_CONVERSATIONS = [
  {
    conversationId: "1",
    id: "m-radif-fiaz",
    otherUser: {
      _id: "u1",
      name: "M Radif Fiaz",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "User",
      isOnline: true,
    },
    unreadCount: 0,
    lastTime: "15 Jul",
    lastMessage: {
      text: "han admin",
      message: "han admin",
      from: "buyer",
      isOwn: true,
      createdAt: "2026-07-15T11:13:00.000Z",
    },
    messages: [
      {
        _id: 1,
        from: "vendor",
        isOwn: false,
        text: "Hy Admin",
        message: "Hy Admin",
        createdAt: "2026-07-15T11:50:00.000Z",
        read: true,
      },
      {
        _id: 2,
        from: "buyer",
        isOwn: true,
        text: "han admin",
        message: "han admin",
        createdAt: "2026-07-15T11:13:00.000Z",
        read: true,
      },
    ],
  },
  {
    conversationId: "2",
    id: "sohail-shabbir",
    otherUser: {
      _id: "u2",
      name: "Sohail Shabbir",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "User",
      isOnline: true,
    },
    unreadCount: 0,
    lastTime: "12 Jul",
    lastMessage: {
      text: "Image",
      message: "Image",
      from: "buyer",
      isOwn: true,
      createdAt: "2026-07-12T14:30:00.000Z",
    },
    messages: [
      {
        _id: 101,
        from: "vendor",
        isOwn: false,
        text: "Hello! I have a question regarding my order status.",
        message: "Hello! I have a question regarding my order status.",
        createdAt: "2026-07-12T14:25:00.000Z",
        read: true,
      },
      {
        _id: 102,
        from: "buyer",
        isOwn: true,
        text: "Sure! Let me check the details for you right now.",
        message: "Sure! Let me check the details for you right now.",
        createdAt: "2026-07-12T14:30:00.000Z",
        read: true,
      },
    ],
  },
  {
    conversationId: "3",
    id: "ali-hassan",
    otherUser: {
      _id: "u3",
      name: "Ali Hassan",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      role: "Vendor",
      isOnline: false,
    },
    unreadCount: 1,
    lastTime: "10 Jul",
    lastMessage: {
      text: "Is my vendor registration approved?",
      message: "Is my vendor registration approved?",
      from: "vendor",
      isOwn: false,
      createdAt: "2026-07-10T09:15:00.000Z",
    },
    messages: [
      {
        _id: 201,
        from: "vendor",
        isOwn: false,
        text: "Is my vendor registration approved?",
        message: "Is my vendor registration approved?",
        createdAt: "2026-07-10T09:15:00.000Z",
        read: false,
      },
    ],
  },
];

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialVendorName = searchParams.get("vendorName");

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState(() => {
    if (initialVendorName) {
      const match = INITIAL_CONVERSATIONS.find((c) =>
        c.otherUser.name.toLowerCase().includes(initialVendorName.toLowerCase())
      );
      if (match) return match;
    }
    // Default to first conversation on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      return INITIAL_CONVERSATIONS[0];
    }
    return null;
  });

  const [search, setSearch] = useState("");

  /* ── Filtered conversations ──────────────────────────── */
  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((conv) =>
      (conv.otherUser?.name || "").toLowerCase().includes(q)
    );
  }, [conversations, search]);

  /* ── Message sent handler ────────────────────────────── */
  const handleMessageSent = useCallback(
    (savedMessage) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (
            c.conversationId === activeConv?.conversationId ||
            c.id === activeConv?.id
          ) {
            return {
              ...c,
              lastMessage: savedMessage,
              messages: [...(c.messages || []), savedMessage],
            };
          }
          return c;
        })
      );
    },
    [activeConv]
  );

  /* ── Clear unread count ──────────────────────────────── */
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* ── Top Header Navbar (Matching Image 2) ─────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
          style={{ backgroundColor: DK }}
        >
          <RiMenuLine className="text-lg" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: DK }}>
            Messages
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Chat with users who contact support
          </p>
        </div>
      </div>

      {/* ── Main Frame Container (Matching Image 2) ──────── */}
      <div
        className="bg-white rounded-2xl border overflow-hidden shadow-xs"
        style={{ borderColor: "#E8E2D9", height: "76vh" }}
      >
        {conversations.length === 0 ? (
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
          /* Two-panel layout matching Image 2 */
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
