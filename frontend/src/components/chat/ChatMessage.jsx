import React from "react";
import { RiCheckDoubleLine, RiCheckLine } from "react-icons/ri";

const DK = "#3A0519";

// Tick colours ─────────────────────────────────────────────────────────────
// • Not yet read  → single grey tick  (RiCheckLine,       #9CA3AF)
// • Read          → double green tick (RiCheckDoubleLine, #22C55E)
const TICK_UNSEEN = "#9CA3AF"; // grey-400
const TICK_SEEN   = "#22C55E"; // green-500

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatMessage = ({ message, otherUser, showAvatar = true, onImageClick }) => {
  const isMine = message.from === "buyer" || message.isOwn;
  const hasImage = Boolean(message.imageAttachment || message.image?.url);
  const imageUrl = message.imageAttachment || message.image?.url;
  const textContent = message.text || message.message;
  const hasCaption = textContent && textContent !== "Image";

  // Read-receipt tick logic:
  //   isMine && read    → double green tick  (seen by recipient)
  //   isMine && !read   → single grey tick   (sent, not yet seen)
  //   !isMine           → no tick shown (only sender sees ticks)
  const tickIcon =
    isMine ? (
      message.read ? (
        // Double green tick — recipient has opened the chat
        <RiCheckDoubleLine
          style={{ color: TICK_SEEN, fontSize: "13px", flexShrink: 0 }}
          title="Seen"
        />
      ) : (
        // Single grey tick — sent but not yet seen
        <RiCheckLine
          style={{ color: TICK_UNSEEN, fontSize: "13px", flexShrink: 0 }}
          title="Sent"
        />
      )
    ) : null;

  return (
    <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} mb-3`}>
      <div className={`flex items-end gap-2.5 max-w-[80%] sm:max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>

        {/* Avatar — only shown for the other person's messages */}
        {!isMine && (
          <div className="w-8 h-8 shrink-0 mb-0.5">
            {showAvatar ? (
              otherUser?.avatar || otherUser?.profilePhoto?.url ? (
                <img
                  src={otherUser.avatar || otherUser.profilePhoto?.url}
                  alt={otherUser.name}
                  className="w-8 h-8 rounded-full object-cover shadow-xs"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] text-white shadow-xs"
                  style={{ backgroundColor: DK }}
                >
                  {(otherUser?.name || "?")[0].toUpperCase()}
                </div>
              )
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-xs font-normal"
          style={
            isMine
              ? { backgroundColor: DK, color: "#FFFFFF", borderBottomRightRadius: "2px" }
              : { backgroundColor: "#FFFFFF", color: DK, border: "1px solid #E8E2D9", borderBottomLeftRadius: "2px" }
          }
        >
          {hasImage && (
            <button
              type="button"
              onClick={() => onImageClick?.(imageUrl)}
              className="block w-full overflow-hidden rounded-xl mb-1 focus:outline-none"
            >
              <img
                src={imageUrl}
                alt="Shared in chat"
                className="rounded-xl max-h-72 w-full object-cover cursor-zoom-in hover:scale-102 transition-transform duration-200"
              />
            </button>
          )}
          {hasCaption && <p className={hasImage ? "mt-1.5" : ""}>{textContent}</p>}
          {!hasImage && !hasCaption && <p>{textContent}</p>}
        </div>
      </div>

      {/* Timestamp + read-receipt tick row */}
      <div
        className={`flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-medium ${
          isMine ? "mr-1 flex-row-reverse" : "ml-10"
        }`}
      >
        <span>{formatTime(message.createdAt || message.time)}</span>
        {tickIcon}
      </div>
    </div>
  );
};

export default ChatMessage;
