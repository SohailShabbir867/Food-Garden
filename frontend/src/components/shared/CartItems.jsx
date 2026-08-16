import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStore, FaArrowRight } from "react-icons/fa";
import { fetchFoods } from "../../services/api";

const RecommendedFoods = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods().then(setFoods).catch(() => setFoods([]));
  }, []);

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleViewDetails = (id) => {
    navigate(`/food/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#fff8fb] py-20 sm:py-28">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#e21b70] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#3A0519] opacity-5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="section-shell relative z-10">
      <div className="mb-12 text-center sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-3 block text-xs font-extrabold uppercase tracking-[0.2em] text-[#e21b70]">
            Curated For You
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#3A0519] sm:text-5xl">
            Most Recommended Dishes
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Discover the highest-rated meals from our top local vendors, freshly prepared and delivered to your door.
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {foods.map((food) => (
          <motion.div
            key={food.id}
            variants={itemVariants}
            whileHover={{ y: -8, rotateX: 1 }}
            className="elevated-card group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-56 w-full cursor-pointer overflow-hidden sm:h-60">
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#3A0519] text-xs font-bold py-1.5 px-3 rounded-full shadow-sm z-20">
                {food.category}
              </div>
              
              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-[#e21b70] text-white font-bold py-1.5 px-4 rounded-full shadow-lg z-20 shadow-[#e21b70]/40">
                {formatPKR(food.basePrice)}
              </div>

              <img
                src={food.images[0]}
                alt={food.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 group-hover:opacity-0"
              />
              <img
                src={food.images[1] || food.images[0]}
                alt={food.name + " hover"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100"
              />
              
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            </div>

            {/* Content Container */}
            <div className="flex flex-grow flex-col p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-[#3A0519] transition-colors duration-300 group-hover:text-[#e21b70] line-clamp-1">
                  {food.name}
                </h3>
              </div>

              {/* Vendor & Rating Info */}
              <div className="flex justify-between items-center mb-6 text-sm">
                <div className="flex items-center text-gray-500 gap-1.5">
                  <FaStore className="text-gray-400" />
                  <span className="font-medium truncate max-w-[120px]">{food.vendorName}</span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                  <FaStar className="text-yellow-400 w-3.5 h-3.5" />
                  <span className="font-bold text-gray-700">{food.rating}</span>
                  <span className="text-gray-400 text-xs">({food.reviews})</span>
                </div>
              </div>

              <div className="mt-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewDetails(food.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3.5 text-sm font-bold text-[#3A0519] shadow-sm transition-all duration-300 hover:border-[#e21b70] hover:bg-[#e21b70] hover:text-white"
                >
                  <FaArrowRight />
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  );
};

export default RecommendedFoods;
