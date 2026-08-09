import React, { useState, useMemo, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaStore,
  FaArrowRight,
  FaShoppingCart,
  FaUtensils,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { fetchFoods } from "../services/api";
import { toast } from "react-toastify";
import menuHeroImg from "../assets/hero/menuePage.jpg";

const ITEMS_PER_PAGE = 12;

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended' | 'price-low' | 'price-high' | 'rating'
  const [currentPage, setCurrentPage] = useState(1);
  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const menuGridRef = useRef(null);

  useEffect(() => {
    fetchFoods()
      .then(setFoods)
      .catch((error) => toast.error(error.message || "Unable to load the menu"))
      .finally(() => setLoadingFoods(false));
  }, []);

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Filter & Sort Logic
  const filteredFoods = useMemo(() => {
    return foods
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.basePrice - b.basePrice;
        if (sortBy === "price-high") return b.basePrice - a.basePrice;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.id - b.id;
      });
  }, [foods, selectedCategory, searchQuery, sortBy]);

  const categories = ["All", ...new Set(foods.map((food) => food.category).filter(Boolean))];

  // Reset to Page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFoods = useMemo(() => {
    return filteredFoods.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFoods, startIndex]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      menuGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleQuickAdd = (food, e) => {
    e.stopPropagation();
    const cartItem = {
      id: food.id,
      name: food.name,
      price: food.basePrice,
      image: food.images[0],
      spice: food.spiceLevels ? food.spiceLevels[0].label : "Regular",
      addOns: [],
      quantity: 1,
      vendorName: food.vendorName,
    };
    addToCart(cartItem);
    toast.success(`${food.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ──────────────────────────────────────────────── */}
      {/* HERO HEADER SECTION WITH DARK IMAGE BACKGROUND    */}
      {/* ──────────────────────────────────────────────── */}
      <div
        className="relative text-white pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center shadow-2xl"
        style={{ backgroundImage: `url(${menuHeroImg})` }}
      >
        {/* Dark theme overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0009]/95 via-[#3A0519]/90 to-[#1a0009]/95 backdrop-blur-[2px]"></div>

        {/* Background glow blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e21b70] opacity-25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900 opacity-25 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#e21b70] font-extrabold text-xs uppercase tracking-widest bg-pink-950/60 border border-pink-500/20 px-4 py-1.5 rounded-full inline-block mb-3"
          >
            Explore & Taste 🍕🍔
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight leading-tight"
          >
            Our Marketplace <span className="text-[#e21b70]">Menu</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium"
          >
            Discover freshly prepared meals from top local vendors across Pakistan.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative"
          >
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search for burgers, pizza, wraps, vendor names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-14 pr-12 text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:border-[#e21b70] focus:ring-4 focus:ring-[#e21b70]/20 transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div ref={menuGridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* ──────────────────────────────────────────────── */}
        {/* CATEGORIES & SORT CONTROLS BAR                   */}
        {/* ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex-shrink-0 flex items-center gap-2 cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-[#e21b70]"
              }`}
            >
              <FaUtensils size={12} /> All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex-shrink-0 flex items-center gap-2 cursor-pointer ${
                  selectedCategory === cat.name
                    ? "bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30"
                    : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-[#e21b70]"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
            <FaFilter className="text-gray-400 text-xs" />
            <span className="text-xs font-bold text-gray-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 text-[#3A0519] font-bold text-xs sm:text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#e21b70] cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* ──────────────────────────────────────────────── */}
        {/* FOOD ITEMS GRID                                  */}
        {/* ──────────────────────────────────────────────── */}
        {filteredFoods.length === 0 ? (
          /* Empty Search Result State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-md my-8 max-w-lg mx-auto"
          >
            <div className="w-20 h-20 bg-pink-50 text-[#e21b70] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
              🔍
            </div>
            <h3 className="text-2xl font-bold text-[#3A0519] mb-2">No food items found</h3>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find anything matching "<span className="font-bold text-[#3A0519]">{searchQuery}</span>". Try clearing your search filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-3 bg-[#e21b70] hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-lg transition hover:scale-105 cursor-pointer"
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedFoods.map((food) => (
                <motion.div
                  key={food.id}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/food/${food.id}`)}
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(226,27,112,0.15)] transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer group"
                >
                  {/* Image Container with Hover Swap */}
                  <div className="relative w-full h-60 overflow-hidden bg-gray-100">
                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#3A0519] text-xs font-extrabold py-1.5 px-3 rounded-full shadow-sm z-20">
                      {food.category}
                    </span>

                    {/* Price Tag */}
                    <span className="absolute top-4 right-4 bg-[#e21b70] text-white font-extrabold py-1.5 px-4 rounded-full shadow-lg z-20 text-sm shadow-[#e21b70]/30">
                      {formatPKR(food.basePrice)}
                    </span>

                    {/* Primary Image */}
                    <img
                      src={food.images[0]}
                      alt={food.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    />
                    {/* Secondary Image on Hover */}
                    <img
                      src={food.images[1] || food.images[0]}
                      alt={food.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-500 transform scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Info Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-[#3A0519] group-hover:text-[#e21b70] transition-colors mb-2 line-clamp-1">
                        {food.name}
                      </h3>

                      {/* Vendor & Ratings */}
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span className="text-gray-500 text-xs font-medium flex items-center gap-1.5">
                          <FaStore className="text-gray-400" /> {food.vendorName}
                        </span>
                        <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-800 font-extrabold px-2.5 py-1 rounded-lg border border-yellow-200">
                          <FaStar className="text-yellow-400" /> {food.rating} ({food.reviews})
                        </span>
                      </div>

                      {/* Description snippet */}
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                        {food.description}
                      </p>
                    </div>

                    {/* Buttons Action Row */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/food/${food.id}`)}
                        className="py-3 px-3 bg-gray-50 hover:bg-gray-100 text-[#3A0519] text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-gray-200 cursor-pointer"
                      >
                        Details <FaArrowRight size={10} />
                      </button>
                      <button
                        onClick={(e) => handleQuickAdd(food, e)}
                        className="py-3 px-3 bg-[#e21b70] hover:bg-pink-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-[#e21b70]/25 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <FaShoppingCart size={11} /> Quick Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ──────────────────────────────────────────────── */}
            {/* PAGINATION CONTROLS BAR                         */}
            {/* ──────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <span className="text-xs sm:text-sm font-bold text-gray-500">
                  Showing <span className="text-[#3A0519] font-extrabold">{startIndex + 1}</span> to{" "}
                  <span className="text-[#3A0519] font-extrabold">
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredFoods.length)}
                  </span>{" "}
                  of <span className="text-[#e21b70] font-extrabold">{filteredFoods.length}</span> items
                </span>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-[#3A0519] text-white hover:bg-[#520723] shadow-md"
                    }`}
                  >
                    <FaChevronLeft size={10} /> Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-[#e21b70] text-white shadow-lg shadow-[#e21b70]/30 scale-105"
                            : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-[#e21b70]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                        : "bg-[#3A0519] text-white hover:bg-[#520723] shadow-md"
                    }`}
                  >
                    Next <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;


