import React, { useState } from "react";
import {
  RiMailLine,
  RiSearchLine,
  RiCheckDoubleLine,
  RiReplyLine,
  RiSendPlaneLine,
  RiUser3Line,
  RiMenuLine,
  RiRefreshLine,
  RiCheckLine,
} from "react-icons/ri";
import { toast } from "react-toastify";

const DK = "#3A0519";
const ACC = "#e21b70";
const CR = "#F7F4EF";

const MOCK_MESSAGES = [
  {
    id: "M-001",
    name: "Sohail Shabbir",
    email: "sohail@example.com",
    subject: "Issue with my recent order",
    message: "Hello, I haven't received my order yet. Can you please check?",
    status: "unread",
    date: "2026-08-08 10:30 AM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    replies: [],
  },
  {
    id: "M-002",
    name: "Ali Hassan",
    email: "ali@example.com",
    subject: "Vendor Registration query",
    message: "I want to become a vendor but the form is throwing an error.",
    status: "read",
    date: "2026-08-07 02:15 PM",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    replies: [],
  },
  {
    id: "M-003",
    name: "Spice Garden",
    email: "spice@vendor.com",
    subject: "Menu update pending",
    message: "I updated my menu items but they are not reflecting on the public page.",
    status: "replied",
    date: "2026-08-06 09:00 AM",
    avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150",
    replies: [
      {
        id: "r1",
        text: "Thanks for bringing this to our attention. We have refreshed your vendor menu on the public page!",
        date: "2026-08-06 09:15 AM",
      },
    ],
  },
];

const ManageContacts = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(MOCK_MESSAGES[0].id);
  const [replyText, setReplyText] = useState("");

  const selectedMessage = messages.find((m) => m.id === selectedId);

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleMarkAsRead = (id) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id && m.status === "unread" ? { ...m, status: "read" } : m
      )
    );
  };

  const toggleStatus = (id) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus =
            m.status === "replied"
              ? "read"
              : m.status === "read"
              ? "unread"
              : "replied";
          toast.info(`Status updated to ${nextStatus.toUpperCase()}`, {
            autoClose: 1200,
          });
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleReply = (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed || !selectedMessage) return;

    const newReply = {
      id: Date.now().toString(),
      text: trimmed,
      date: new Date().toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === selectedMessage.id) {
          return {
            ...m,
            status: "replied",
            replies: [...(m.replies || []), newReply],
          };
        }
        return m;
      })
    );

    toast.success("Reply sent successfully via email!", { autoClose: 2000 });
    setReplyText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* ── Top Header Bar (Matching Image 2) ───────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
          style={{ backgroundColor: DK }}
        >
          <RiMailLine className="text-lg" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: DK }}>
            Contact Messages
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Manage and respond to support queries from users and vendors
          </p>
        </div>
      </div>

      {/* ── Main Frame Container (Matching Image 2) ──────── */}
      <div
        className="bg-white rounded-2xl border overflow-hidden shadow-xs"
        style={{ borderColor: "#E8E2D9", height: "76vh" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* ── Sidebar Inbox List ───────────────────────── */}
          <div
            className={`lg:col-span-4 border-r h-full flex flex-col bg-white ${
              selectedMessage ? "hidden lg:flex" : "flex"
            }`}
            style={{ borderColor: "#E8E2D9" }}
          >
            {/* Search Bar */}
            <div className="p-3 border-b border-[#E8E2D9]">
              <div className="relative">
                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages…"
                  className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all"
                  style={{
                    backgroundColor: CR,
                    border: "1px solid #E8E2D9",
                    color: DK,
                  }}
                />
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs sm:text-sm font-medium">
                  No messages found.
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isActive = selectedMessage?.id === msg.id;
                  const lastReply =
                    msg.replies && msg.replies.length > 0
                      ? msg.replies[msg.replies.length - 1]
                      : null;

                  return (
                    <button
                      key={msg.id}
                      onClick={() => {
                        setSelectedId(msg.id);
                        handleMarkAsRead(msg.id);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-gray-100"
                      style={{
                        backgroundColor: isActive ? `${DK}0A` : "transparent",
                        borderLeft: isActive
                          ? `4px solid ${DK}`
                          : "4px solid transparent",
                      }}
                    >
                      <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-200">
                        <img
                          src={msg.avatar}
                          alt={msg.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p
                            className="text-xs sm:text-sm font-bold truncate"
                            style={{ color: DK }}
                          >
                            {msg.name}
                          </p>
                          <span className="text-[10px] text-gray-400 shrink-0 ml-2 font-normal">
                            {msg.date.split(" ")[0]}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 truncate mb-1">
                          {msg.subject}
                        </p>

                        <p className="text-[11px] text-gray-400 truncate mb-1 font-normal">
                          {lastReply ? `You: ${lastReply.text}` : msg.message}
                        </p>

                        <div className="flex items-center gap-2">
                          {msg.status === "unread" && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-2xs"
                              style={{ backgroundColor: ACC }}
                            >
                              NEW
                            </span>
                          )}
                          {msg.status === "replied" && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                              <RiReplyLine size={9} /> REPLIED ({msg.replies.length})
                            </span>
                          )}
                          {msg.status === "read" && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-500">
                              READ
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Message Detail & Ongoing Reply Thread ─────── */}
          <div
            className={`lg:col-span-8 h-full min-h-0 flex flex-col ${
              !selectedMessage ? "hidden lg:flex" : "flex"
            }`}
            style={{ backgroundColor: CR }}
          >
            {selectedMessage ? (
              <>
                {/* Header Navbar */}
                <div
                  className="flex items-center justify-between px-4 py-3.5 border-b shrink-0 shadow-xs text-white"
                  style={{ backgroundColor: DK, borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setSelectedId(null)}
                      className="lg:hidden text-white/80 hover:text-white p-1 -ml-1 rounded-full"
                    >
                      <RiMenuLine className="text-xl" />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                      <img
                        src={selectedMessage.avatar}
                        alt={selectedMessage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight truncate">
                        {selectedMessage.name}
                      </p>
                      <p className="text-xs text-white/60 truncate font-medium">
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Toggle Button */}
                    <button
                      onClick={() => toggleStatus(selectedMessage.id)}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Click to toggle message status"
                    >
                      <RiRefreshLine className="text-xs text-[#e21b70]" />
                      <span className="capitalize">{selectedMessage.status}</span>
                    </button>

                    <span className="hidden sm:inline-block text-[11px] text-white/70 font-medium px-3 py-1 rounded-full bg-white/10 border border-white/15">
                      {selectedMessage.date}
                    </span>
                  </div>
                </div>

                {/* Message Body & Sent Replies Thread */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {/* Original User Inquiry Bubble */}
                  <div className="flex flex-col items-start mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#3A0519]">
                        {selectedMessage.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {selectedMessage.date}
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-xs p-4 border border-[#E8E2D9] shadow-2xs max-w-[85%]">
                      <h3 className="font-bold text-sm text-[#3A0519] mb-1.5">
                        {selectedMessage.subject}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Replied Banner helper */}
                  {selectedMessage.status === "replied" && (
                    <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs font-medium shadow-2xs my-2">
                      <div className="flex items-center gap-2.5">
                        <RiCheckDoubleLine className="text-emerald-600 text-lg shrink-0" />
                        <div>
                          <p className="font-bold">Reply Status: Active</p>
                          <p className="text-[11px] text-emerald-600">
                            {selectedMessage.replies.length} response(s) sent. You can send further messages below.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleStatus(selectedMessage.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold transition-all"
                      >
                        Reset Status
                      </button>
                    </div>
                  )}

                  {/* Sent Replies Feed */}
                  {selectedMessage.replies &&
                    selectedMessage.replies.map((reply) => (
                      <div key={reply.id} className="flex flex-col items-end my-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {reply.date}
                          </span>
                          <span className="text-xs font-bold text-[#e21b70]">
                            Support Admin (You)
                          </span>
                        </div>
                        <div
                          className="px-4 py-3 rounded-2xl rounded-br-xs text-xs sm:text-sm text-white shadow-2xs max-w-[80%] leading-relaxed whitespace-pre-wrap"
                          style={{ backgroundColor: DK }}
                        >
                          <p>{reply.text}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-600 font-medium">
                          <span>Sent via Email & Chat</span>
                          <RiCheckLine className="text-xs" />
                        </div>
                      </div>
                    ))}
                </div>

                {/* ── Always-Active Reply Input Bar ───────────── */}
                <form
                  onSubmit={handleReply}
                  className="p-3 border-t border-[#E8E2D9] bg-white flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedMessage.name} (send another message)…`}
                    required
                    className="flex-1 bg-[#F7F4EF] border border-[#E8E2D9] focus:border-[#3A0519] focus:ring-1 focus:ring-[#3A0519] rounded-full px-5 py-2.5 text-xs sm:text-sm text-[#3A0519] placeholder-gray-400 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-all hover:opacity-90 shadow-sm shrink-0 cursor-pointer"
                    style={{ backgroundColor: DK }}
                    title="Send Reply"
                  >
                    <RiSendPlaneLine className="text-base ml-0.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-6">
                <div className="text-gray-400">
                  <RiMailLine className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p className="font-bold text-sm text-[#3A0519]">No message selected</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Select a message from the list to view and reply.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContacts;
