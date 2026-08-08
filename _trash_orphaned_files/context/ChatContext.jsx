// src/context/ChatContext.jsx
// Holds active chat threads and messages, and (later) the socket connection.
// Fill in the socket.io-client connection once the backend chat API is live.

import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]); // list of conversation threads
  const [activeChat, setActiveChat] = useState(null); // currently open thread
  const [messages, setMessages] = useState([]); // messages for activeChat

  const openChat = (chat) => {
    setActiveChat(chat);
    // TODO: fetch message history for this chat from the backend
  };

  const sendMessage = (text) => {
    if (!activeChat || !text.trim()) return;
    const newMessage = {
      id: Date.now(),
      chatId: activeChat.id,
      text,
      sender: "me", // replace with actual logged-in user id
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    // TODO: emit this message over the socket + persist via API
  };

  const value = {
    chats,
    setChats,
    activeChat,
    openChat,
    messages,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
