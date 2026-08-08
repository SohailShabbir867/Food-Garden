import React, { useState } from "react";
import { FaBell, FaPaperPlane, FaUsers, FaStore, FaGlobe } from "react-icons/fa";
import { toast } from "react-toastify";

const SendNotification = () => {
  const [targetAudience, setTargetAudience] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if(!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and message.");
      return;
    }

    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      let audienceText = "everyone";
      if (targetAudience === "buyers") audienceText = "all buyers";
      if (targetAudience === "vendors") audienceText = "all vendors";

      toast.success(`Notification sent successfully to ${audienceText}!`);
      setTitle("");
      setMessage("");
      setTargetAudience("all");
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <FaBell className="text-[#e21b70]" /> Broadcast Notification
        </h1>
        <p className="text-gray-500 text-sm mt-1">Send important updates, policy changes, or alerts to users and vendors.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSend} className="space-y-8">
          
          {/* Target Audience */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Target Audience</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                targetAudience === 'all' 
                  ? 'border-[#e21b70] bg-[#e21b70]/5 text-[#e21b70]' 
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
              }`}>
                <input type="radio" name="audience" className="hidden" checked={targetAudience === 'all'} onChange={() => setTargetAudience('all')} />
                <FaGlobe size={24} className={targetAudience === 'all' ? 'text-[#e21b70]' : 'text-gray-400'} />
                <span className="font-bold text-sm">Everyone</span>
              </label>

              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                targetAudience === 'buyers' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
              }`}>
                <input type="radio" name="audience" className="hidden" checked={targetAudience === 'buyers'} onChange={() => setTargetAudience('buyers')} />
                <FaUsers size={24} className={targetAudience === 'buyers' ? 'text-blue-500' : 'text-gray-400'} />
                <span className="font-bold text-sm">All Buyers</span>
              </label>

              <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                targetAudience === 'vendors' 
                  ? 'border-violet-500 bg-violet-50 text-violet-700' 
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
              }`}>
                <input type="radio" name="audience" className="hidden" checked={targetAudience === 'vendors'} onChange={() => setTargetAudience('vendors')} />
                <FaStore size={24} className={targetAudience === 'vendors' ? 'text-violet-500' : 'text-gray-400'} />
                <span className="font-bold text-sm">All Vendors</span>
              </label>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Message Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Notification Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Update to Platform Policies"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70] transition-all font-medium text-gray-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Notification Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the full details of the notification here..."
                rows={6}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e21b70]/30 focus:border-[#e21b70] transition-all font-medium text-gray-800 resize-none"
                required
              />
              <p className="text-xs text-gray-400 font-medium">This message will appear in the target users' notification bell dropdown and dashboard.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSending}
              className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {isSending ? (
                <>Sending...</>
              ) : (
                <><FaPaperPlane size={14} /> Broadcast Now</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SendNotification;
