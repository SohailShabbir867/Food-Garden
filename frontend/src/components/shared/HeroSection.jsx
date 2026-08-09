import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import { FaUtensils } from 'react-icons/fa';

import heroImage from '../../assets/hero/menuePage.jpg';

const HeroSection = () => (
  <section
    className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-[#1a0009] bg-cover bg-center text-white"
    style={{ backgroundImage: `url(${heroImage})` }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-[#1a0009]/95 via-[#3A0519]/90 to-[#1a0009]/95 backdrop-blur-[2px]" />
    <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#e21b70] opacity-25 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-purple-900 opacity-25 blur-3xl pointer-events-none" />

    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-950/60 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#e21b70]">
        <span className="h-2 w-2 rounded-full bg-[#e21b70] animate-pulse" />
        Welcome to Food Garden
      </motion.span>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
        Discover Pakistan&apos;s Finest&nbsp;
        <span className="text-[#e21b70] whitespace-nowrap">
          <Typewriter words={['Flavors', 'Recipes', 'Deals', 'Burgers']} loop={0} cursor cursorStyle="|" typeSpeed={90} deleteSpeed={55} delaySpeed={1600} />
        </span>
        <br /> Delivered to Your Doorstep
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-300 sm:text-lg">
        Explore local restaurants and home chefs, order your favourites with ease, and enjoy fresh food delivered right to you.
      </motion.p>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/menu" className="inline-flex items-center gap-2 rounded-2xl bg-[#e21b70] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#e21b70]/30 transition-all hover:bg-pink-600">
          <FaUtensils /> Explore Food Menu
        </Link>
        <Link to="/contact" className="rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-extrabold text-white backdrop-blur-md transition-all hover:bg-white/20">
          Contact Support
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-wide text-gray-300">
        <span>Fresh &amp; Local</span><span className="text-[#e21b70]">•</span><span>Easy Ordering</span><span className="text-[#e21b70]">•</span><span>Fast Delivery</span>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
