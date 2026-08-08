// src/pages/user/Chat.jsx — buyer's chat page, talking to sellers.

import React from "react";
import { useChat } from "../../context/ChatContext";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";

const Chat = () => {
  const { chats, activeChat, openChat } = useChat();

  return (
    <div className="flex h-[80vh] mt-4 border border-gray-200 rounded-xl overflow-hidden">
      <ChatSidebar chats={chats} activeChatId={activeChat?.id} onSelectChat={openChat} />
      <ChatWindow />
    </div>
  );
};

export default Chat;
