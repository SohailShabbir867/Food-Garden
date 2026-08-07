// src/pages/vendor/VendorChat.jsx — seller's chat page, talking to buyers.

import React from "react";
import { useChat } from "../../context/ChatContext";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";

const VendorChat = () => {
  const { chats, activeChat, openChat } = useChat();

  return (
    <div className="flex h-[80vh] border border-gray-200 rounded-xl overflow-hidden">
      <ChatSidebar chats={chats} activeChatId={activeChat?.id} onSelectChat={openChat} />
      <ChatWindow />
    </div>
  );
};

export default VendorChat;
