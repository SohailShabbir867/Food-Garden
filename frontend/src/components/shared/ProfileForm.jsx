import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaSave, FaInfoCircle } from "react-icons/fa";

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    currentPassword: "",
    description: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        password: "",
        currentPassword: "",
        description: user.description || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && !formData.currentPassword) {
      toast.error("Please enter your current password to set a new password.");
      return;
    }
    setIsLoading(true);
    
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success(res.message);
      setFormData((prev) => ({ ...prev, password: "", currentPassword: "" }));
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden mt-2 mb-12">
      {/* Cover Photo Area */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-primary via-[#c2155d] to-accent relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-black blur-3xl"></div>
        </div>
      </div>
      
      {/* Profile Header (Avatar overlapping) */}
      <div className="px-8 sm:px-12 relative pb-8 border-b border-gray-100 bg-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="relative group">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[6px] border-white shadow-xl bg-white relative">
                <img 
                  src={formData.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1a0009&color=fff`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                  <FaCamera size={28} className="mb-2" />
                  <span className="text-sm font-semibold tracking-wide">Upload Photo</span>
                </label>
              </div>
              
              {/* Permanent Camera Icon Badge */}
              <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 sm:bottom-3 sm:right-3 w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg border-[3px] border-white cursor-pointer hover:bg-black transition-colors z-20 group-hover:scale-110">
                <FaCamera size={16} className="sm:text-lg" />
              </label>
            </div>

            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>
          <div className="text-center sm:text-left mt-2 sm:mt-0 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{user.name}</h2>
            <div className="inline-block mt-3 px-5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 shadow-sm">
              {user.role} Account
            </div>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          
          {/* Name */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FaUser className="text-primary/70" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-semibold text-gray-800"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email (Disabled) */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FaEnvelope className="text-primary/70" /> Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-100 text-gray-500 cursor-not-allowed font-semibold shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-wider text-gray-500 bg-gray-200/80 px-2.5 py-1 rounded-md uppercase">Locked</div>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FaPhone className="text-primary/70" /> Mobile Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-semibold text-gray-800"
              placeholder="0300-1234567"
            />
          </div>

          {/* Current Password */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FaLock className="text-primary/70" /> Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-semibold text-gray-800"
              placeholder="Required only if changing password"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FaLock className="text-primary/70" /> New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-semibold text-gray-800"
              placeholder="•••••••• (Min 8 chars)"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2.5 pt-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FaInfoCircle className="text-primary/70" /> Bio / Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={150}
            rows={3}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-semibold text-gray-800 resize-none"
            placeholder="Tell us a little bit about yourself (Max 150 chars)"
          />
        </div>

        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave size={18} className="group-hover:scale-110 transition-transform" />
            )}
            {isLoading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
