import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUtensils, FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-pink-50/20 to-gray-50 flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#e21b70] opacity-10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#3A0519] opacity-10 rounded-full blur-2xl pointer-events-none" />

          {/* 404 Badge & Icon */}
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-pink-50 border-2 border-pink-100 flex items-center justify-center mx-auto mb-6 shadow-inner text-[#e21b70]">
              <FaExclamationTriangle className="text-3xl" />
            </div>

            <h1 className="text-6xl sm:text-7xl font-black text-[#3A0519] tracking-tight mb-2">
              404
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              Page Not Found
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
              Oops! The page you are looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#3A0519] text-xs font-bold transition-all cursor-pointer border border-gray-200"
              >
                <FaArrowLeft size={12} /> Go Back
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#e21b70] hover:bg-pink-600 text-white text-xs font-bold shadow-md shadow-[#e21b70]/25 transition-all cursor-pointer"
              >
                <FaHome size={12} /> Home Page
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#e21b70] hover:underline"
              >
                <FaUtensils size={11} /> Browse Food Menu
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
