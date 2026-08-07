import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Order Support",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    // Mock backend submission
    setTimeout(() => {
      setStatus("Message sent successfully! We will get back to you soon.");
      setForm({ name: "", email: "", subject: "Order Support", message: "" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus(""), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-[#3A0519] mb-4"
          >
            Get in <span className="text-[#e21b70]">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Whether you have a question about your order, want to partner with us, or just want to say hi, our team is ready to help!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e21b70] group-hover:scale-110 transition-transform">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A0519] mb-1">Email Us</h3>
                <p className="text-gray-500 text-sm">We're here to help 24/7.</p>
                <a href="mailto:support@foodgarden.com" className="text-[#e21b70] font-semibold mt-2 inline-block hover:underline">
                  support@foodgarden.com
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e21b70] group-hover:scale-110 transition-transform">
                <FaPhone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A0519] mb-1">Call Us</h3>
                <p className="text-gray-500 text-sm">Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+923001234567" className="text-[#e21b70] font-semibold mt-2 inline-block hover:underline">
                  +92 300 1234567
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4 group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e21b70] group-hover:scale-110 transition-transform">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A0519] mb-1">Our HQ</h3>
                <p className="text-gray-500 text-sm">Come say hello at our office.</p>
                <p className="text-[#e21b70] font-semibold mt-2">
                  123 Food Street, Karachi, Pakistan
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-[#e21b70]/5 border border-gray-100 p-8 sm:p-12 relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
            
            <h2 className="text-3xl font-bold text-[#3A0519] mb-8 relative z-10">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e21b70]/50 focus:border-[#e21b70] transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e21b70]/50 focus:border-[#e21b70] transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">How can we help?</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e21b70]/50 focus:border-[#e21b70] transition-all text-gray-700 cursor-pointer"
                >
                  <option>Order Support</option>
                  <option>Vendor Inquiry</option>
                  <option>Partnership & Business</option>
                  <option>General Feedback</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Your Message</label>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e21b70]/50 focus:border-[#e21b70] transition-all resize-none"
                  placeholder="Tell us everything..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === "Sending..."}
                className="w-full sm:w-auto px-8 py-4 bg-[#e21b70] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#e21b70]/30 hover:bg-[#c01560] transition-colors disabled:opacity-70"
              >
                {status === "Sending..." ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    Send Message <FaPaperPlane className="text-sm" />
                  </>
                )}
              </motion.button>

              {/* Status Message */}
              {status && status !== "Sending..." && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold"
                >
                  {status}
                </motion.div>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
