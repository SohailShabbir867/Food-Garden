// src/pages/About.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaRocket,
  FaShieldAlt,
  FaComments,
  FaCreditCard,
  FaHeart,
  FaStore,
  FaAward,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import menuHeroImg from "../assets/hero/menuePage.jpg";
import Cart1 from "../assets/cart/Cart1.jpg";
import Cart3 from "../assets/cart/Cart3.jpg";
import Cart4 from "../assets/cart/Cart4.jpg";

const stats = [
  { label: "Happy Meals Delivered", value: "50,000+", icon: "🍔" },
  { label: "Verified Vendor Partners", value: "150+", icon: "👨‍🍳" },
  { label: "Average Delivery Time", value: "25 Mins", icon: "⚡" },
  { label: "Buyer Satisfaction Rating", value: "4.9 / 5.0", icon: "⭐" },
];

const features = [
  {
    icon: <FaShieldAlt className="text-2xl text-[#e21b70]" />,
    title: "100% Halal & Verified Hygiene",
    description: "Every restaurant and home chef on Food Garden undergoes strict quality checks and hygiene audits.",
  },
  {
    icon: <FaRocket className="text-2xl text-[#e21b70]" />,
    title: "Lightning-Fast Hot Delivery",
    description: "Our dedicated riders use thermal insulated bags ensuring your food arrives piping hot and fresh.",
  },
  {
    icon: <FaComments className="text-2xl text-[#e21b70]" />,
    title: "Direct Buyer-to-Vendor Chat",
    description: "Have special instructions or dietary needs? Chat directly with the vendor kitchen in real time.",
  },
  {
    icon: <FaCreditCard className="text-2xl text-[#e21b70]" />,
    title: "Seamless Local Payments",
    description: "Pay effortlessly using JazzCash, EasyPaisa, Direct Bank Transfer, Cards, or Cash on Delivery.",
  },
];

const teamMembers = [
  {
    name: "Sohail Shabbir",
    role: "Founder & Chief Executive",
    bio: "Passionate about empowering local Pakistani food vendors through modern technology.",
    avatar: "https://ui-avatars.com/api/?name=Sohail+Shabbir&background=3A0519&color=fff&size=150",
  },
  {
    name: "Ayesha Malik",
    role: "Head of Vendor Relations",
    bio: "Connecting authentic home chefs and legendary eateries with thousands of hungry buyers daily.",
    avatar: "https://ui-avatars.com/api/?name=Ayesha+Malik&background=e21b70&color=fff&size=150",
  },
  {
    name: "Zubair Khan",
    role: "Chief Technology Officer",
    bio: "Building real-time order tracking, subsecond search, and seamless buyer experiences.",
    avatar: "https://ui-avatars.com/api/?name=Zubair+Khan&background=1a0009&color=fff&size=150",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ────────────────────────────────────────────────────────── */}
      {/* HERO HEADER SECTION WITH DARK IMAGE BACKGROUND              */}
      {/* ────────────────────────────────────────────────────────── */}
      <div
        className="relative text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center shadow-2xl"
        style={{ backgroundImage: `url(${menuHeroImg})` }}
      >
        {/* Dark theme overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0009]/95 via-[#3A0519]/90 to-[#1a0009]/95 backdrop-blur-[2px]"></div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e21b70] opacity-25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900 opacity-25 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest bg-pink-950/60 border border-pink-500/20 px-4 py-1.5 rounded-full inline-block mb-4"
          >
            About Food Garden 🌿🍕
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
          >
            Bringing Pakistan's Finest Flavors To Your <span className="text-[#e21b70]">Doorstep</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8"
          >
            Food Garden is Pakistan's premier multi-vendor culinary marketplace connecting food lovers with top local restaurants, home chefs, and legendary food creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/menu"
              className="bg-[#e21b70] hover:bg-pink-600 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-[#e21b70]/30 flex items-center gap-2"
            >
              <FaUtensils /> Explore Food Menu
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-2xl transition-all border border-white/20 backdrop-blur-md"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-16">
        {/* ────────────────────────────────────────────────────────── */}
        {/* STATS BANNER                                               */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100/50"
            >
              <span className="text-3xl mb-1 block">{stat.icon}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#3A0519]">{stat.value}</h3>
              <p className="text-xs text-gray-500 font-extrabold uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* OUR STORY & MISSION                                        */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-2">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3A0519] tracking-tight mb-6">
              Empowering Local Kitchens & Satisfying Food Cravings
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Food Garden was founded with a simple yet powerful mission: to revolutionize food delivery by bridging the gap between local vendors and food enthusiasts across Pakistan.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Whether you are craving flame-grilled burgers, authentic karahi, wood-fired pizza, or artisanal sweets, Food Garden provides a seamless, multi-vendor marketplace where every dish is prepared fresh and delivered hot.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-500 text-base flex-shrink-0" />
                <span className="text-sm font-extrabold text-[#3A0519]">Empowering small businesses & home chefs</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-500 text-base flex-shrink-0" />
                <span className="text-sm font-extrabold text-[#3A0519]">Transparent pricing with zero hidden fees</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-500 text-base flex-shrink-0" />
                <span className="text-sm font-extrabold text-[#3A0519]">Customizable spice levels & gourmet add-ons</span>
              </div>
            </div>
          </div>

          {/* Visual Images Mosaic */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={Cart1}
                alt="Burger Hub"
                className="rounded-3xl shadow-lg object-cover w-full h-48 sm:h-56 border border-gray-100 hover:scale-105 transition-transform duration-500"
              />
              <img
                src={Cart3}
                alt="Desi Delight"
                className="rounded-3xl shadow-lg object-cover w-full h-40 sm:h-48 border border-gray-100 hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-8">
              <img
                src={Cart4}
                alt="Pizza Craze"
                className="rounded-3xl shadow-lg object-cover w-full h-72 sm:h-80 border border-gray-100 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* WHY CHOOSE US (FEATURES GRID)                             */}
        {/* ────────────────────────────────────────────────────────── */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-2">
              Why Food Garden?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3A0519] tracking-tight">
              Designed For Ultimate Convenience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_25px_rgba(58,5,25,0.04)] hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-5 border border-pink-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-extrabold text-[#3A0519] mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* LEADERSHIP TEAM                                            */}
        {/* ────────────────────────────────────────────────────────── */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest block mb-2">
              Our Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3A0519] tracking-tight">
              Meet The Minds Behind Food Garden
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md text-center flex flex-col items-center"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full border-4 border-pink-100 shadow-md mb-4 object-cover"
                />
                <h3 className="text-xl font-black text-[#3A0519]">{member.name}</h3>
                <span className="text-xs font-extrabold text-[#e21b70] block mb-3">{member.role}</span>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* CALL TO ACTION BANNER                                      */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#1a0009] via-[#3A0519] to-[#1a0009] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
              Ready To Taste The Difference?
            </h2>
            <p className="text-gray-300 text-sm mb-8 font-medium">
              Join thousands of satisfied food lovers across Pakistan. Order your favorite meal now or partner with us as a vendor!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/menu"
                className="bg-[#e21b70] hover:bg-pink-600 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl transition shadow-lg shadow-[#e21b70]/30 flex items-center gap-2"
              >
                Order Food Now <FaArrowRight />
              </Link>
              <Link
                to="/signup?role=vendor"
                className="bg-white text-[#3A0519] hover:bg-gray-100 font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl transition shadow-lg"
              >
                Join as Vendor Partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;