import React from "react";
import { RiSearchLine, RiMessage3Line, RiLoader4Line } from "react-icons/ri";

const DK = "#3A0519";
const ACC = "#e21b70";
const CR = "#F7F4EF";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const ConvAvatar = ({ user }) =>
  user?.avatar || user?.profilePhoto?.url ? (
    <img
      src={user.avatar || user.profilePhoto?.url}
      alt={user.name}
      className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
    />
  ) : (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs"
      style={{ backgroundColor: DK }}
    >
      {(user?.name || "?")[0].toUpperCase()}
    </div>
  );

const ChatList = ({
  conversations = [],
  activeConvId,
  onSelect,
  loading = false,
  search = "",
  onSearch,
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search bar */}
      {onSearch && (
        <div className="p-3 border-b border-[#E8E2D9]">
          <div className="relative">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all"
              style={{
                backgroundColor: CR,
                border: "1px solid #E8E2D9",
                color: DK,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = DK;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E8E2D9";
              }}
            />
          </div>
        </div>
      )}

      {/* List body */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <RiLoader4Line className="animate-spin text-2xl" style={{ color: DK }} />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
            <RiMessage3Line className="text-4xl text-gray-300 mb-3" />
            <p className="text-xs sm:text-sm text-gray-400">
              {search ? "No conversations match your search." : "No conversations yet."}
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive =
              conv.conversationId === activeConvId || conv.id === activeConvId;
            const isOwn =
              conv.lastMessage?.from === "buyer" || conv.lastMessage?.isOwn;
            const unread = conv.unreadCount || 0;

            return (
              <button
                key={conv.conversationId || conv.id}
                onClick={() => onSelect(conv)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-gray-100"
                style={{
                  backgroundColor: isActive ? `${DK}0A` : "transparent",
                  borderLeft: isActive ? `4px solid ${DK}` : "4px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = `${DK}05`;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="relative shrink-0">
                  <ConvAvatar user={conv.otherUser} />
                  {unread > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-black rounded-full text-white shadow-xs"
                      style={{ backgroundColor: ACC }}
                    >
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs sm:text-sm font-bold truncate" style={{ color: DK }}>
                      {conv.otherUser?.name || "User"}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2 font-normal">
                      {formatTime(conv.lastMessage?.createdAt || conv.lastTime)}
                    </span>
                  </div>

                  <p
                    className={`text-xs truncate max-w-[170px] ${
                      unread > 0 ? "font-semibold text-gray-900" : "text-gray-400 font-normal"
                    }`}
                  >
                    {isOwn ? "You: " : ""}
                    {conv.lastMessage?.message || conv.lastMessage?.text || "Start a conversation"}
                  </p>

                  {(conv.listingTitle || conv.activeOrderNumber) && (
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 font-normal">
                      re: {conv.listingTitle || `Order #${conv.activeOrderNumber}`}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
