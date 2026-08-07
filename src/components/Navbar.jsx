// src/components/Navbar.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navlogo from "../assets/Navlogo.png"
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Complaint", path: "/contact" },
  ];

  return (
    <header className="bg-[#3A0519] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
  <img
    src={Navlogo}
    alt="Food Garden Logo"
    className="w-10 h-10 object-contain transition-transform duration-300 hover:scale-105 mix-blend-screen"
  />
  <span className="text-2xl font-bold tracking-wide text-[#e21b70] hover:opacity-90 transition">
    Food Garden
  </span>
</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative group font-medium text-white transition duration-300"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#e21b70] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {/* 🔒 Admin Link */}
          <Link
            to="/admin"
            className="relative group font-medium text-white transition duration-300 hidden md:inline-block"
          >
            Admin
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#e21b70] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Search Input */}
        <div className="flex items-center gap-2 relative">
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              className="absolute right-20 sm:static sm:block px-2 py-1 rounded bg-white text-black placeholder-gray-600 focus:outline-none transition w-28 sm:w-40"
            />
          )}

          <button
            onClick={toggleSearch}
            aria-label="Toggle Search"
            className="p-2 rounded-full hover:bg-[#670D2F] transition z-10"
          >
            <FaSearch size={18} className="text-white" />
          </button>

          <Link
            to="/cart"
            className="relative p-2 ml-1 rounded-full hover:bg-[#670D2F] transition"
          >
            <FaShoppingCart size={20} className="text-white" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="ml-2 md:hidden p-2 rounded hover:bg-[#670D2F]"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group text-white font-medium text-lg transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#e21b70] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* 🔒 Admin Link (mobile view) */}
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="relative group text-white font-medium text-lg transition duration-300"
            >
              Admin
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#e21b70] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
