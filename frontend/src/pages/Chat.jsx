import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaStore, FaPaperPlane } from "react-icons/fa";

// Subcomponents
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import OrderDetailsModal from "../components/chat/OrderDetailsModal";
import CallModal from "../components/chat/CallModal";

// ── Initial Conversations Data ──
const INITIAL_CONVERSATIONS = [
  {
    id: "burger-house",
    name: "Burger House",
    avatar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150",
    isOnline: true,
    isVerified: true,
    rating: 4.9,
    activeOrderNumber: "FG-8821",
    lastMessage: "We're preparing your Deluxe Cheeseburger now! 🍔",
    lastTime: "3:20 PM",
    unreadCount: 0,
    activeOrderDetails: {
      orderNumber: "FG-8821",
      vendorName: "Burger House",
      status: "In Preparation",
      estimatedDelivery: "15 - 20 Mins",
      itemName: "Deluxe Bacon Cheeseburger Combo",
      totalPrice: "18.50",
      items: [
        { name: "Deluxe Bacon Cheeseburger", qty: 1, price: "12.50" },
        { name: "Crispy French Fries (Large)", qty: 1, price: "4.00" },
        { name: "Cold Coca-Cola (500ml)", qty: 1, price: "2.00" },
      ],
      deliveryAddress: "124 Food Street, Block 4, Downtown",
    },
    messages: [
      {
        id: 1,
        from: "vendor",
        text: "Hello! Welcome to Burger House! We've received your order #FG-8821. How can we help you today? 😊",
        time: "3:20 PM",
        orderCard: {
          orderNumber: "FG-8821",
          itemName: "Deluxe Bacon Cheeseburger Combo",
          quantity: 1,
          totalPrice: "18.50",
          status: "In Preparation",
          itemImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150",
        },
        reactions: { "👍": 2 },
      },
      {
        id: 2,
        from: "vendor",
        text: "Feel free to let us know if you have any custom cooking preferences or special requests!",
        time: "3:20 PM",
        reactions: {},
      },
    ],
  },
  {
    id: "pizza-paradise",
    name: "Pizza Paradise",
    avatar: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150",
    isOnline: true,
    isVerified: true,
    rating: 4.8,
    activeOrderNumber: "FG-9012",
    lastMessage: "Your Wood-Fired Margherita is in the oven 🍕",
    lastTime: "2:45 PM",
    unreadCount: 1,
    activeOrderDetails: {
      orderNumber: "FG-9012",
      vendorName: "Pizza Paradise",
      status: "On the Way",
      estimatedDelivery: "10 Mins",
      itemName: "Large Margherita Pizza + Garlic Bread",
      totalPrice: "22.00",
      items: [
        { name: "Wood-Fired Margherita Pizza", qty: 1, price: "16.00" },
        { name: "Cheesy Garlic Breadsticks", qty: 1, price: "6.00" },
      ],
      deliveryAddress: "124 Food Street, Block 4, Downtown",
    },
    messages: [
      {
        id: 101,
        from: "vendor",
        text: "Hi there! Your Wood-Fired Margherita is currently baking in our stone oven 🍕. ETA is ~10 mins!",
        time: "2:45 PM",
        reactions: { "❤️": 1 },
      },
    ],
  },
  {
    id: "food-garden-support",
    name: "Food Garden Support",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    isOnline: true,
    isVerified: true,
    rating: 5.0,
    activeOrderNumber: null,
    lastMessage: "How can our support team assist you today?",
    lastTime: "11:30 AM",
    unreadCount: 0,
    messages: [
      {
        id: 201,
        from: "vendor",
        text: "Welcome to Food Garden 24/7 Help Center! 🌿 If you have issues with refunds, deliveries, or payments, we're here to help.",
        time: "11:30 AM",
        reactions: {},
      },
    ],
  },
  {
    id: "sushi-central",
    name: "Sushi Central",
    avatar: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150",
    isOnline: false,
    isVerified: true,
    rating: 4.7,
    activeOrderNumber: null,
    lastMessage: "Thanks for dining with us! Hope you enjoyed the Dragon Rolls.",
    lastTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: 301,
        from: "vendor",
        text: "Thanks for dining with us! Hope you enjoyed the Fresh Salmon Dragon Rolls 🍱",
        time: "Yesterday",
        reactions: { "😋": 3 },
      },
    ],
  },
];

const QUICK_REPLIES = [
  "🚀 Is my order ready?",
  "🌶️ Please make it less spicy",
  "🛵 What is the delivery ETA?",
  "🥤 Can I add an extra drink?",
];

const AUTO_RESPONSES = [
  "Thanks for your message! Our chef is taking care of your order with extra attention. 🍽️",
  "Got it! We've updated your preferences with our kitchen team. 👌",
  "Your delivery rider is already on their way! You can track them live on the map. 🛵💨",
  "No problem at all! Feel free to ask if you need anything else! 😊",
];

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialVendorName = searchParams.get("vendorName");

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(
    initialVendorName
      ? INITIAL_CONVERSATIONS.find((c) =>
          c.name.toLowerCase().includes(initialVendorName.toLowerCase())
        )?.id || INITIAL_CONVERSATIONS[0].id
      : INITIAL_CONVERSATIONS[0].id
  );

  const [input, setInput] = useState("");
  const [sidebarTab, setSidebarTab] = useState("all");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // Active conversation object
  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, activeConv?.typing]);

  // Filtered sidebar conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(sidebarSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (sidebarTab === "vendors") return c.id !== "food-garden-support";
    if (sidebarTab === "orders") return !!c.activeOrderNumber;
    if (sidebarTab === "support") return c.id === "food-garden-support";

    return true;
  });

  // Filtered messages inside active chat
  const filteredMessages = (activeConv?.messages || []).filter((m) =>
    chatSearch ? m.text?.toLowerCase().includes(chatSearch.toLowerCase()) : true
  );

  // Handle message sending
  const sendMessage = (imageAttachment = null) => {
    const trimmed = input.trim();
    if (!trimmed && !imageAttachment) return;

    const newMsg = {
      id: Date.now(),
      from: "buyer",
      text: trimmed,
      imageAttachment: imageAttachment,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reactions: {},
    };

    // Update conversation
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            lastMessage: trimmed || "Sent an image attachment 📷",
            lastTime: newMsg.time,
            messages: [...c.messages, newMsg],
            typing: true,
          };
        }
        return c;
      })
    );

    setInput("");

    // Simulate vendor response after 1.5 seconds
    setTimeout(() => {
      const randomReply =
        AUTO_RESPONSES[Math.floor(Math.random() * AUTO_RESPONSES.length)];

      const vendorMsg = {
        id: Date.now() + 1,
        from: "vendor",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reactions: {},
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return {
              ...c,
              lastMessage: randomReply,
              lastTime: vendorMsg.time,
              messages: [...c.messages, vendorMsg],
              typing: false,
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  // Reaction Handler
  const handleReact = (msgId, emoji) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          const updatedMessages = c.messages.map((m) => {
            if (m.id === msgId) {
              const currentReactions = { ...(m.reactions || {}) };
              const currentCount = currentReactions[emoji] || 0;
              currentReactions[emoji] = currentCount + 1;
              return { ...m, reactions: currentReactions };
            }
            return m;
          });
          return { ...c, messages: updatedMessages };
        }
        return c;
      })
    );
  };

  // Copy handler
  const handleCopyText = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success("Message copied to clipboard!", { autoClose: 1500 });
    }
  };

  // Clear chat handler
  const handleClearChat = () => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [] } : c))
    );
    toast.info("Chat history cleared.", { autoClose: 1500 });
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 flex overflow-hidden font-sans relative">
      {/* ── Sidebar Component ── */}
      <ChatSidebar
        conversations={filteredConversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          // Clear unread count on selection
          setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
          );
        }}
        searchQuery={sidebarSearch}
        onSearchChange={setSidebarSearch}
        activeTab={sidebarTab}
        onTabChange={setSidebarTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ── Main Active Chat Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#f8f9fa] dark:bg-slate-950 relative" style={{ backgroundImage: "radial-gradient(rgba(226, 27, 112, 0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        {/* Header */}
        <ChatHeader
          activeVendor={activeConv}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isSearchOpen={isSearchOpen}
          onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
          searchQuery={chatSearch}
          onSearchChange={setChatSearch}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
          onStartCall={() => setIsCallModalOpen(true)}
          onClearChat={handleClearChat}
        />

        {/* ── Messages Feed Area ── */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-8 py-5 max-w-4xl w-full mx-auto flex flex-col gap-4">
          {/* Date Divider */}
          <div className="flex items-center justify-center my-1">
            <span className="px-3 py-1 rounded-full bg-gray-200/70 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
              Today
            </span>
          </div>

          <AnimatePresence initial={false}>
            {filteredMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-slate-600">
                <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-slate-900 flex items-center justify-center text-[#e21b70] mb-3">
                  <FaStore className="text-2xl" />
                </div>
                <p className="text-xs font-semibold">No messages in this chat yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Say hi to start the conversation!</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  vendorAvatar={activeConv?.avatar}
                  vendorName={activeConv?.name}
                  onReact={handleReact}
                  onCopy={handleCopyText}
                  onOpenOrderModal={() => setIsOrderModalOpen(true)}
                />
              ))
            )}

            {/* Vendor Typing Indicator */}
            {activeConv?.typing && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex justify-start items-end gap-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-slate-800 shadow-sm">
                  <img
                    src={activeConv?.avatar}
                    alt={activeConv?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-xs border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-[#e21b70] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-[#e21b70] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-[#e21b70] rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* ── Input Component ── */}
        <ChatInput
          input={input}
          onChange={setInput}
          onSend={sendMessage}
          quickReplies={QUICK_REPLIES}
          onSelectQuickReply={(replyText) => {
            setInput(replyText);
          }}
        />
      </div>

      {/* ── Interactive Modals ── */}
      <OrderDetailsModal
        order={activeConv?.activeOrderDetails}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      <CallModal
        vendor={activeConv}
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </div>
  );
};

export default Chat;
