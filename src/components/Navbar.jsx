import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navlogo from "../assets/Navlogo.png";
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  // Handle Scroll to add glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Complaint", path: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#3A0519]/90 backdrop-blur-md shadow-lg py-2" : "bg-[#3A0519] py-4 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.img
            whileHover={{ rotate: 10, scale: 1.1 }}
            src={Navlogo}
            alt="Food Garden Logo"
            className="w-12 h-12 object-contain mix-blend-screen"
          />
          <span className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#e21b70] transition-colors group-hover:text-white">
            Food<span className="text-white group-hover:text-[#e21b70]">Garden</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium text-lg transition duration-300 hover:text-[#e21b70] ${
                  isActive ? "text-[#e21b70]" : "text-gray-200"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="underline" 
                    className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#e21b70] rounded-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          {/* Animated Search Bar */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {showSearch && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder="Search food..."
                  className="absolute right-10 px-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e21b70] border border-white/20 backdrop-blur-sm"
                />
              )}
            </AnimatePresence>
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <FaSearch size={20} />
            </button>
          </div>

          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white group">
            <FaShoppingCart size={22} className="group-hover:text-[#e21b70] transition-colors" />
            <AnimatePresence>
              {cartItems?.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#e21b70] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Login / Signup Buttons (Desktop) */}
          <div className="hidden md:flex gap-3 ml-2 border-l border-white/20 pl-4">
            <Link to="/admin" className="px-4 py-2 text-white font-medium hover:text-[#e21b70] transition">
              Admin
            </Link>
            <Link to="/login" className="px-5 py-2 bg-[#e21b70] hover:bg-white hover:text-[#e21b70] text-white font-bold rounded-full transition-all shadow-md">
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white hover:text-[#e21b70] transition"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#3A0519]/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col items-center py-6 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl font-medium transition ${
                    location.pathname === link.path ? "text-[#e21b70]" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="w-24 h-px bg-white/20 my-2"></div>
              
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-xl font-medium text-gray-300 hover:text-white"
              >
                Admin Panel
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-8 py-3 bg-[#e21b70] text-white font-bold rounded-full text-lg w-10/12 text-center"
              >
                Login / Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
