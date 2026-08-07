import React from "react";

// A single message bubble, styled differently depending on who sent it.
const ChatBubble = ({ text, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
          isOwn
            ? "bg-[#e21b70] text-white rounded-br-sm"
            : "bg-gray-100 text-[#3A0519] rounded-bl-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
