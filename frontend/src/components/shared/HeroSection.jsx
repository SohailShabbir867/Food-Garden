import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import {
  FaArrowRight,
  FaStar,
  FaUtensils,
  FaSearch,
  FaMotorcycle,
  FaClock,
  FaFire,
  FaShieldAlt,
  FaPercent,
} from 'react-icons/fa';
import heroBurger from '../../assets/hero/Burger.jpg';
import heroPizza from '../../assets/hero/Piza.jpg';
import heroRolls from '../../assets/hero/Rools.jpg';

const QUICK_TAGS = [
  { label: 'Burgers', icon: '🍔', query: 'Burger' },
  { label: 'Pizza', icon: '🍕', query: 'Pizza' },
  { label: 'Rolls & Wraps', icon: '🌯', query: 'Roll' },
  { label: 'Biryani', icon: '🍛', query: 'Biryani' },
  { label: 'Desserts', icon: '🍰', query: 'Dessert' },
];

const DISH_PREVIEWS = [
  {
    title: 'Gourmet Smash Burger',
    tag: 'Trending Pick',
    desc: 'Double angus beef, smoked cheese & secret sauce',
    price: 'PKR 650',
    oldPrice: 'PKR 850',
    discount: '25% OFF',
    rating: 4.9,
    reviews: '520+',
    image: heroBurger,
    query: 'Burger',
  },
  {
    title: 'Woodfired Italian Pizza',
    tag: 'Chef Special',
    desc: 'Hand-tossed crust, buffalo mozzarella & fresh basil',
    price: 'PKR 1,199',
    oldPrice: 'PKR 1,450',
    discount: '18% OFF',
    rating: 4.9,
    reviews: '680+',
    image: heroPizza,
    query: 'Pizza',
  },
  {
    title: 'Crispy Grilled Paratha Roll',
    tag: 'Local Favorite',
    desc: 'Charcoal chicken boti, garlic mayo & mint chutney',
    price: 'PKR 380',
    oldPrice: 'PKR 450',
    discount: '15% OFF',
    rating: 4.8,
    reviews: '410+',
    image: heroRolls,
    query: 'Roll',
  },
];

const HeroSection = () => {
  const [activeDishIdx, setActiveDishIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/menu');
    }
  };

  const handleTagClick = (tagQuery) => {
    navigate(`/menu?search=${encodeURIComponent(tagQuery)}`);
  };

  const activeDish = DISH_PREVIEWS[activeDishIdx];

  return (
    <section className="relative isolate min-h-[780px] overflow-hidden bg-[#120008] text-white lg:min-h-[820px]">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(226,27,112,0.30),transparent_38%),radial-gradient(circle_at_15%_75%,rgba(255,61,145,0.18),transparent_35%),linear-gradient(135deg,#120008_0%,#260214_50%,#15000a_100%)]" />
      
      {/* Ambient Animated Glow Spheres */}
      <div className="hero-orb absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#e21b70]/20 blur-[100px] pointer-events-none" />
      <div className="hero-orb absolute -right-24 bottom-10 h-[420px] w-[420px] rounded-full bg-pink-600/15 blur-[120px] [animation-delay:-4s] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="section-shell relative z-10 flex min-h-[780px] items-center py-20 lg:min-h-[820px] lg:py-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          
          {/* ── Left Column: Value Proposition, Search & CTA ──────────────── */}
          <div className="max-w-2xl">
            {/* Top Pill Announcement */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-950/60 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-pink-200 backdrop-blur-md shadow-lg shadow-pink-950/40"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#ff3d91] animate-pulse" />
              <FaFire className="text-amber-400" />
              <span>Pakistan&apos;s Premier Food Marketplace</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl xl:text-7xl"
            >
              Cravings, delivered <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff388c] via-[#ff6ba0] to-[#ffd166]">
                <Typewriter
                  words={['Fresher.', 'Faster.', 'Piping Hot.', 'To Your Door.']}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={75}
                  deleteSpeed={45}
                  delaySpeed={1800}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-pink-100/80 sm:text-lg"
            >
              Discover signature recipes from top-rated local kitchens &amp; artisanal home chefs—freshly cooked and delivered across town in minutes.
            </motion.p>

            {/* ── Interactive Search Bar ───────────────────────────────────── */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-8 relative flex w-full max-w-xl items-center rounded-2xl border border-white/20 bg-white/10 p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-500/30"
            >
              <div className="flex items-center pl-4 pr-2 text-pink-300">
                <FaSearch size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you craving today? (e.g. Burger, Biryani...)"
                className="w-full bg-transparent py-3 pr-3 text-sm text-white placeholder-pink-200/50 focus:outline-none sm:text-base"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#e21b70] to-[#ff2a85] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#e21b70]/35 transition hover:brightness-110 active:scale-95"
              >
                <span>Find Food</span>
                <FaArrowRight size={12} />
              </button>
            </motion.form>

            {/* ── Quick Cuisines / Food Chips ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-5 flex flex-wrap items-center gap-2 text-xs"
            >
              <span className="font-bold uppercase tracking-wider text-pink-300/80 mr-1">Popular:</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleTagClick(tag.query)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-semibold text-pink-100/90 backdrop-blur-md transition hover:border-pink-400 hover:bg-pink-500/20 hover:text-white"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                </button>
              ))}
            </motion.div>

            {/* ── Trust & Social Proof Badges ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="mt-9 grid grid-cols-3 gap-3 max-w-lg border-t border-white/10 pt-6 text-pink-100"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 border border-pink-400/30 text-yellow-300 shadow-inner">
                  <FaStar size={16} />
                </div>
                <div>
                  <p className="font-display text-base font-extrabold leading-none text-white sm:text-lg">4.9 / 5</p>
                  <p className="text-[11px] text-pink-200/70 mt-0.5">12k+ Reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 border border-pink-400/30 text-pink-300 shadow-inner">
                  <FaMotorcycle size={16} />
                </div>
                <div>
                  <p className="font-display text-base font-extrabold leading-none text-white sm:text-lg">25 mins</p>
                  <p className="text-[11px] text-pink-200/70 mt-0.5">Express Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 border border-pink-400/30 text-emerald-400 shadow-inner">
                  <FaShieldAlt size={16} />
                </div>
                <div>
                  <p className="font-display text-base font-extrabold leading-none text-white sm:text-lg">150+</p>
                  <p className="text-[11px] text-pink-200/70 mt-0.5">Verified Kitchens</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ── Right Column: Interactive Dish Showcase & Floating Badges ── */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            
            {/* Dish Switcher Tabs */}
            <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
              {DISH_PREVIEWS.map((dish, idx) => (
                <button
                  key={dish.title}
                  onClick={() => setActiveDishIdx(idx)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                    activeDishIdx === idx
                      ? 'bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30 scale-105'
                      : 'bg-white/10 text-pink-200/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {dish.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Central High-Impact Food Showcase Card */}
            <motion.div
              key={activeDish.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-[2.2rem] border border-white/20 bg-gradient-to-b from-white/15 to-white/5 p-3.5 shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              {/* Main Food Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] sm:aspect-[16/11]">
                <img
                  src={activeDish.image}
                  alt={activeDish.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15000a] via-transparent to-transparent opacity-80" />

                {/* Top Badge: Discount & Category */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/30 bg-[#e21b70] px-3.5 py-1 text-xs font-extrabold text-white shadow-md">
                    <FaFire size={11} />
                    {activeDish.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-extrabold text-amber-300 backdrop-blur-md">
                    <FaPercent size={10} />
                    {activeDish.discount}
                  </span>
                </div>

                {/* Bottom Overlay Info Inside Image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-white sm:text-2xl drop-shadow-md">
                        {activeDish.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-pink-100/90 line-clamp-1">
                        {activeDish.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="mt-3.5 flex items-center justify-between px-2 py-1">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-extrabold text-white">{activeDish.price}</span>
                    <span className="text-xs text-pink-300/60 line-through">{activeDish.oldPrice}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mt-0.5">
                    <FaStar size={11} />
                    <span>{activeDish.rating}</span>
                    <span className="text-pink-300/60 font-normal">({activeDish.reviews})</span>
                  </div>
                </div>

                <Link
                  to={`/menu?search=${encodeURIComponent(activeDish.query)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e21b70] hover:bg-pink-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-[#e21b70]/30 transition hover:-translate-y-0.5 active:scale-95"
                >
                  <FaUtensils size={11} />
                  <span>Order Now</span>
                </Link>
              </div>
            </motion.div>

            {/* ── Floating Badge 1: Delivery Time ───────────────────────── */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/95 p-3.5 text-[#3A0519] shadow-2xl backdrop-blur-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-[#e21b70]">
                <FaClock size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estimated Delivery</p>
                <p className="font-display text-lg font-black leading-tight text-[#3A0519]">
                  20 - 30 <span className="text-xs font-bold text-[#e21b70]">mins</span>
                </p>
              </div>
            </motion.div>

            {/* ── Floating Badge 2: Live Promo ──────────────────────────── */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl border border-pink-500/30 bg-[#3A0519]/90 p-3.5 text-white shadow-2xl backdrop-blur-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e21b70] text-white shadow-md">
                <FaPercent size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-pink-300 uppercase tracking-wider">Special Welcome Offer</p>
                <p className="font-display text-sm font-bold text-white">
                  Free delivery on 1st order
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
