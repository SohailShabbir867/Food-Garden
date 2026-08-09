import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navlogo from "../../assets/logo/Navlogo.png";
import {
  FaSearch, FaShoppingCart, FaBars, FaTimes,
  FaUser, FaSignOutAlt, FaChevronDown, FaTachometerAlt, FaUtensils, FaShoppingBag, FaTruck
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const getDashboardLink = () => {
    if (user?.role === "vendor") return "/vendor/dashboard";
    if (user?.role === "admin") return "/admin/dashboard";
    return "/user/dashboard";
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path.split("?")[0]);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1a0009]/95 backdrop-blur-md shadow-xl py-2"
          : "bg-[#3A0519] py-3 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
          <motion.img
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            src={Navlogo}
            alt="Food Garden Logo"
            className="w-9 h-9 object-cover rounded-full shadow-lg border-2 border-white/20"
          />
          <span className="text-xl font-extrabold tracking-wide text-[#e21b70] group-hover:text-white transition-colors duration-300 hidden sm:block">
            Food<span className="text-white group-hover:text-[#e21b70] transition-colors duration-300">Garden</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links (pill-style active) ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#e21b70] text-white shadow-md shadow-[#e21b70]/30"
                    : "text-gray-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {isAuthenticated && user?.role === 'buyer' && (
            <>
              <Link
                to="/orders"
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive("/orders")
                    ? "bg-[#e21b70] text-white shadow-md shadow-[#e21b70]/30"
                    : "text-gray-200 hover:text-white hover:bg-white/10"
                }`}
              >
                Track Order
              </Link>
              <Link
                to="/my-orders"
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive("/my-orders")
                    ? "bg-[#e21b70] text-white shadow-md shadow-[#e21b70]/30"
                    : "text-gray-200 hover:text-white hover:bg-white/10"
                }`}
              >
                Order History
              </Link>
            </>
          )}
          {isAuthenticated && user?.role !== 'buyer' && (
            <Link
              to={getDashboardLink()}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive(getDashboardLink())
                  ? "bg-[#e21b70] text-white shadow-md shadow-[#e21b70]/30"
                  : "text-gray-200 hover:text-white hover:bg-white/10"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Search */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {showSearch && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSearch}
                  className="absolute right-10 overflow-hidden"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search food..."
                    className="w-full px-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e21b70] border border-white/20 text-sm"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <FaSearch size={15} />
            </button>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white group">
            <FaShoppingCart size={18} className="group-hover:text-[#e21b70] transition-colors" />
            <AnimatePresence>
              {cartItems?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-[#e21b70] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/20">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition text-white"
                >
                  <div className="w-7 h-7 rounded-full bg-[#e21b70] flex items-center justify-center text-xs font-bold uppercase shadow">
                    {user?.name?.[0] || "U"}
                  </div>
                  <span className="text-sm font-medium max-w-[80px] truncate">{user?.name}</span>
                  <motion.div animate={{ rotate: showUserMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FaChevronDown size={10} className="text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-[#2a0312] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                        <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
                      </div>
                      <div className="py-2">
                        {user?.role !== 'buyer' && (
                          <Link to={getDashboardLink()} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white transition text-sm">
                            <FaTachometerAlt size={12} /> Dashboard
                          </Link>
                        )}
                        <Link to={user?.role === "admin" ? "/admin/profile" : user?.role === "vendor" ? "/vendor/profile" : "/user/profile"} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white transition text-sm">
                          <FaUser size={12} /> Profile
                        </Link>
                        {user?.role === "vendor" && (
                          <Link to="/vendor/menu" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white transition text-sm">
                            <FaUtensils size={12} /> My Menu
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-sm border-t border-white/10 mt-1">
                          <FaSignOutAlt size={12} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-1.5 text-gray-200 font-medium hover:text-[#e21b70] transition text-sm">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-1.5 bg-[#e21b70] hover:bg-pink-600 text-white font-bold rounded-full transition-all shadow-md text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 text-white hover:text-[#e21b70] transition" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1a0009]/98 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-5 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-medium transition text-sm ${
                    isActive(link.path)
                      ? "bg-[#e21b70] text-white"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'buyer' && (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition text-sm ${
                      isActive("/orders")
                        ? "bg-[#e21b70] text-white"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Track Order
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition text-sm ${
                      isActive("/my-orders")
                        ? "bg-[#e21b70] text-white"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Order History
                  </Link>
                </>
              )}
              {isAuthenticated && user?.role !== 'buyer' && (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-medium transition text-sm ${
                    isActive(getDashboardLink())
                      ? "bg-[#e21b70] text-white"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <div className="pt-2 flex flex-col gap-2 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                      <div className="w-8 h-8 rounded-full bg-[#e21b70] flex items-center justify-center font-bold text-white uppercase text-sm">
                        {user?.name?.[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{user?.name}</p>
                        <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
                      </div>
                    </div>
                    {user?.role !== 'buyer' && (
                      <Link to={getDashboardLink()} className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm px-1">
                        <FaTachometerAlt size={12} /> Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition text-sm px-1">
                      <FaSignOutAlt size={12} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full text-center py-2.5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition font-medium text-sm">
                      Login
                    </Link>
                    <Link to="/signup" className="w-full text-center py-2.5 bg-[#e21b70] text-white rounded-xl hover:bg-pink-600 transition font-bold shadow-lg text-sm">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
