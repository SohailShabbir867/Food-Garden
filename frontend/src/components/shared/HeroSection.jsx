import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import { FaArrowRight, FaPlay, FaStar, FaUtensils } from 'react-icons/fa';
import heroImage from '../../assets/hero/menuePage.jpg';

const HeroSection = () => (
  <section className="relative isolate min-h-[760px] overflow-hidden bg-[#1a0009] text-white sm:min-h-[720px]">
    <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${heroImage})` }} />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(226,27,112,0.28),transparent_26%),linear-gradient(105deg,rgba(20,0,9,0.98)_0%,rgba(42,3,22,0.92)_52%,rgba(24,0,10,0.62)_100%)]" />
    <div className="hero-orb absolute -left-28 top-28 h-72 w-72 rounded-full bg-[#e21b70]/25 blur-3xl" />
    <div className="hero-orb absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-purple-700/30 blur-3xl [animation-delay:-3s]" />

    <div className="section-shell relative z-10 flex min-h-[760px] items-center py-28 sm:min-h-[720px]">
      <div className="grid w-full items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-400/25 bg-pink-950/50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-pink-200 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#ff3d91] shadow-[0_0_0_5px_rgba(226,27,112,0.15)]" />
            Pakistan&apos;s local food marketplace
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }} className="font-display text-[2.7rem] font-extrabold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Cravings, delivered <span className="block text-[#ff3d91]"><Typewriter words={['fresher.', 'faster.', 'better.']} loop={0} cursor cursorStyle="|" typeSpeed={90} deleteSpeed={50} delaySpeed={1700} /></span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="mt-6 max-w-xl text-base leading-7 text-pink-50/75 sm:text-lg">
            Discover exceptional dishes from nearby restaurants and home chefs—made to order and brought straight to your door.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.28 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/menu" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e21b70] px-6 py-4 text-sm font-extrabold shadow-[0_16px_32px_rgba(226,27,112,0.35)] transition hover:-translate-y-1 hover:bg-pink-600"><FaUtensils /> Explore the menu <FaArrowRight size={12} /></Link>
            <Link to="/about" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"><FaPlay size={10} /> Our story</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold text-pink-100/75"><span className="flex items-center gap-2"><FaStar className="text-yellow-300" /> 4.9 average rating</span><span>•</span><span>Freshly prepared</span><span>•</span><span>Local kitchens</span></motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9, rotateY: -8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 0.8, delay: 0.18, type: 'spring' }} className="relative mx-auto hidden w-full max-w-md lg:block [perspective:1200px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-3 shadow-[0_35px_80px_rgba(0,0,0,0.42)] [transform:rotateY(-5deg)_rotateX(3deg)]">
            <img src={heroImage} alt="Fresh Food Garden dishes" className="h-full w-full rounded-[2rem] object-cover" />
            <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-t from-[#1a0009]/85 via-transparent to-transparent" />
            <div className="absolute bottom-9 left-9 right-9 rounded-3xl border border-white/20 bg-[#3a0519]/75 p-4 backdrop-blur-xl"><p className="text-xs font-bold uppercase tracking-widest text-pink-200">Today&apos;s pick</p><p className="mt-1 font-display text-xl font-bold">A better way to eat local.</p></div>
          </div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-7 -left-10 rounded-2xl border border-white/50 bg-white px-5 py-4 text-[#3A0519] shadow-2xl"><p className="text-xs font-bold text-gray-400">Delivery time</p><p className="font-display text-2xl font-extrabold">25 <span className="text-sm">mins</span></p></motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
