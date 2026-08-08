import React, { useState } from "react";
import ChatBubble from "./ChatBubble";
import { useChat } from "../../context/ChatContext";

// The open conversation panel — message history + input box.
// No call/video button here on purpose — text chat only for now.
const ChatWindow = () => {
  const { activeChat, messages, sendMessage } = useChat();
  const [text, setText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(text);
    setText("");
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-white">
        <h3 className="font-bold text-[#3A0519]">{activeChat.name}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} text={msg.text} isOwn={msg.sender === "me"} />
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#e21b70]"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-[#e21b70] hover:bg-[#670D2F] text-white rounded-full font-medium transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
