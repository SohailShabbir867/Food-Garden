import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUser, FaEnvelope, FaPaperPlane, FaStar, FaPhoneAlt, FaMapMarkerAlt
} from "react-icons/fa";

import ContactImage from "../assets/slider/signup.jpg";

const Contact = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Order Support",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock backend submission
    await new Promise((res) => setTimeout(res, 900));
    
    setStatus("Message sent successfully! We will get back to you soon.");
    setForm({ name: "", email: "", subject: "Order Support", message: "" });
    setLoading(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#1a0009] flex pt-16">

      {/* ─────────────────────────────────── */}
      {/*  LEFT — Form Panel                  */}
      {/* ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Heading */}
          <div className="mb-7">
            <p className="text-[#e21b70] font-semibold text-sm uppercase tracking-widest mb-2">
              We're Here For You 🎧
            </p>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Get in touch
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Ali Khan"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">How can we help?</label>
              <div className="relative">
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm appearance-none cursor-pointer"
                >
                  <option className="bg-[#1a0009]">Order Support</option>
                  <option className="bg-[#1a0009]">Vendor Inquiry</option>
                  <option className="bg-[#1a0009]">Partnership & Business</option>
                  <option className="bg-[#1a0009]">General Feedback</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1.5 block">Your Message</label>
              <textarea
                name="message"
                placeholder="Tell us everything..."
                value={form.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e21b70] transition text-sm resize-none"
              />
            </div>

            {/* Status Message */}
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-semibold text-center"
              >
                {status}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#e21b70] hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e21b70]/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-2 text-sm"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>
                  Send Message <FaPaperPlane className="text-xs" />
                </>
              )}
            </motion.button>
          </form>

          <div className="flex flex-col items-center gap-3 mt-5">
            <p className="text-gray-400 text-sm">
              Looking for answers?{" "}
              <Link to="/about" className="text-white font-semibold hover:text-[#e21b70] transition">
                Check our FAQ
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────── */}
      {/*  RIGHT — Image Panel                */}
      {/* ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative py-4 lg:py-8 lg:pl-4">
        <div className="relative w-full h-full rounded-l-[3.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border-y border-l border-white/5">
        {/* Static image */}
        <img
          src={ContactImage}
          alt="Food Garden Support"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0009]/40 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <div className="bg-[#e21b70] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
            <FaStar className="text-yellow-300 text-sm" />
            <span className="text-white font-bold text-sm">24/7</span>
            <span className="text-pink-200 text-xs">Support</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live Chat Available
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold text-white mb-2">We are here to help</h2>
            <p className="text-gray-300 text-base mb-6">Our support team is dedicated to providing you the best experience on Food Garden.</p>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FaPhoneAlt className="mx-auto text-[#e21b70] mb-1" size={18}/>, value: "+92 300 1234567", label: "Call Us" },
              { icon: <FaEnvelope className="mx-auto text-[#e21b70] mb-1" size={18}/>, value: "support@", label: "foodgarden.com" },
              { icon: <FaMapMarkerAlt className="mx-auto text-[#e21b70] mb-1" size={18}/>, value: "Karachi", label: "Pakistan" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center"
              >
                {stat.icon}
                <p className="text-white font-extrabold text-sm mt-1 truncate">{stat.value}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
