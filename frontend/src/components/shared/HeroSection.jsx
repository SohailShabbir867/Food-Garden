import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import { FaArrowRight } from 'react-icons/fa';

import Burger from '../../assets/hero/Burger.jpg';
import Piza from '../../assets/hero/Piza.jpg';
import Rools from '../../assets/hero/Rools.jpg';

const slides = [
  {
    image: Burger,
    keyword: 'Burgers',
    subtitle: ['LOCAL RESTAURANTS', 'FAST DELIVERY', 'SECURE PAYMENT'],
  },
  {
    image: Piza,
    keyword: 'Pizza',
    subtitle: ['HOME CHEFS', 'HOT & FRESH', 'EASY ORDERING'],
  },
  {
    image: Rools,
    keyword: 'Rolls',
    subtitle: ['DIRECT CHAT', 'MULTIPLE VENDORS', 'GREAT DEALS'],
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const goToNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goToPrev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════ */}
      {/*  HERO — Full-width image + overlay      */}
      {/* ═══════════════════════════════════════ */}
      <div className="relative w-full min-h-screen overflow-hidden bg-[#1a0009]">

        {/* Slideshow Background */}
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={slides[current].image}
              alt={slides[current].keyword}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient — stronger at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/80" />
          </motion.div>
        </AnimatePresence>

        {/* ── Hero Content ── */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 bg-[#e21b70]/20 border border-[#e21b70]/40 rounded-full px-5 py-1.5 text-sm text-pink-300 font-semibold tracking-wider uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-[#e21b70] animate-pulse" />
            Welcome to Food Garden
          </motion.div>

          {/* Headline with Typewriter */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight max-w-4xl"
          >
            Order the Best Local{' '}
            <span className="text-[#e21b70] italic font-extrabold">
              <Typewriter
                key={current}
                words={[slides[current].keyword]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
              />
            </span>{' '}
            From Any Vendor
          </motion.h1>

          {/* Bullet pills */}
          <motion.div
            key={`pills-${current}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3 mt-5 flex-wrap justify-center"
          >
            {slides[current].subtitle.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-gray-200 font-medium">
                <span className="text-[#e21b70]">🍴</span> {item}
                {i < slides[current].subtitle.length - 1 && (
                  <span className="text-gray-500 mx-1">–</span>
                )}
              </span>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex gap-4"
          >
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#e21b70] hover:bg-pink-600 text-white font-bold rounded-full transition-all shadow-lg shadow-[#e21b70]/30 text-base"
            >
              See Our Menu <FaArrowRight size={13} />
            </Link>
          </motion.div>
        </div>

        {/* ── Prev / Next arrows ── */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-[#e21b70] text-white transition-colors flex items-center justify-center backdrop-blur-sm"
        >
          &#10094;
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-[#e21b70] text-white transition-colors flex items-center justify-center backdrop-blur-sm"
        >
          &#10095;
        </button>

        {/* ── Slide dots ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-[#e21b70] w-8' : 'bg-white/50 w-3 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

    </>
  );
};

export default HeroSection;
