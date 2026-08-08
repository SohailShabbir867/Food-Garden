import React, { useState } from "react";
import { FaEnvelope, FaSearch, FaCheckCircle, FaReply, FaEnvelopeOpenText } from "react-icons/fa";
import { toast } from "react-toastify";

const MOCK_MESSAGES = [
  { id: "M-001", name: "Sohail Shabbir", email: "sohail@example.com", subject: "Issue with my recent order", message: "Hello, I haven't received my order yet. Can you please check?", status: "unread", date: "2026-08-08 10:30 AM" },
  { id: "M-002", name: "Ali Hassan",     email: "ali@example.com",    subject: "Vendor Registration query",  message: "I want to become a vendor but the form is throwing an error.", status: "read", date: "2026-08-07 02:15 PM" },
  { id: "M-003", name: "Spice Garden",   email: "spice@vendor.com",   subject: "Menu update pending",        message: "I updated my menu items but they are not reflecting on the public page.", status: "replied", date: "2026-08-06 09:00 AM" },
];

const ManageContacts = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleMarkAsRead = (id) => {
    setMessages(messages.map(m => m.id === id && m.status === 'unread' ? { ...m, status: 'read' } : m));
  };

  const handleReply = (e) => {
    e.preventDefault();
    if(!replyText.trim()) return;

    setMessages(messages.map(m => m.id === selectedMessage.id ? { ...m, status: 'replied' } : m));
    toast.success("Reply sent successfully via email!");
    setReplyText("");
    setSelectedMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div data-aos="fade-up">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <FaEnvelope className="text-[#e21b70]" /> Contact Messages
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage and respond to support queries from users and vendors.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Inbox List */}
        <div data-aos="fade-right" data-aos-delay="100" className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70] transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-medium text-sm">No messages found.</div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    handleMarkAsRead(msg.id);
                  }}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${
                    selectedMessage?.id === msg.id 
                      ? 'bg-[#e21b70]/5 border-l-4 border-l-[#e21b70]' 
                      : msg.status === 'unread' ? 'bg-white border-l-4 border-l-transparent hover:bg-gray-50' : 'bg-gray-50/30 border-l-4 border-l-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm truncate pr-2 ${msg.status === 'unread' ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{msg.name}</h3>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{msg.date.split(" ")[0]}</span>
                  </div>
                  <p className={`text-xs truncate mb-2 ${msg.status === 'unread' ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{msg.subject}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {msg.status === 'unread' && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary">New</span>}
                    {msg.status === 'replied' && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 flex items-center gap-1"><FaReply size={8}/> Replied</span>}
                    {msg.status === 'read' && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-500">Read</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail & Reply */}
        <div data-aos="fade-left" data-aos-delay="150" className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col overflow-hidden">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                <h2 className="text-xl font-black text-gray-900 mb-4">{selectedMessage.subject}</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-black">
                      {selectedMessage.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{selectedMessage.name}</p>
                      <p className="text-xs text-gray-500">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                    {selectedMessage.date}
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed border border-gray-100">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-6 border-t border-gray-100 bg-white">
                {selectedMessage.status === 'replied' ? (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                    <FaCheckCircle className="text-emerald-500" size={20} />
                    <div>
                      <p className="font-bold text-sm">Reply Sent</p>
                      <p className="text-xs mt-0.5 opacity-80">You have already responded to this message.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReply}>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Reply via Email</label>
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      placeholder="Write your reply here... (Will be sent to user's email)"
                      className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70] transition-all resize-none mb-3"
                    ></textarea>
                    <div className="flex justify-end">
                      <button type="submit" className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center gap-2">
                        <FaReply size={12} /> Send Reply
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <FaEnvelopeOpenText size={48} className="text-gray-200 mb-4" />
              <p className="font-bold text-gray-600">No message selected</p>
              <p className="text-sm mt-1">Select a message from the inbox to read and reply.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageContacts;
