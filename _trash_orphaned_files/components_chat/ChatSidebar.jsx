import React from "react";

// One row in the conversation list (left panel of the Chat page).
const ChatSidebar = ({ chats = [], activeChatId, onSelectChat }) => {
  return (
    <div className="w-full sm:w-72 border-r border-gray-200 bg-white h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold text-[#3A0519] text-lg">Messages</h2>
      </div>

      {chats.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">No conversations yet.</p>
      ) : (
        chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
              activeChatId === chat.id ? "bg-gray-100" : ""
            }`}
          >
            <p className="font-semibold text-[#3A0519]">{chat.name}</p>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
          </button>
        ))
      )}
    </div>
  );
};

export default ChatSidebar;
