import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Burger from '../assets/Burger.jpg';
import Piza from '../assets/Piza.jpg';
import Rools from "../assets/Rools.jpg";

const slides = [
  {
    image: Burger,
    title: 'Delicious Burger',
    text: 'Try our juicy, flame-grilled burgers made fresh to order!',
  },
  {
    image: Piza,
    title: 'Fresh Pizza',
    text: 'Hot and cheesy pizzas with your favorite toppings.',
  },
  {
    image: Rools,
    title: 'Spicy Rolls',
    text: 'Chicken Rolls Fully Loaded With Cheese',
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] sm:h-[70vh] md:h-[90vh] overflow-hidden bg-[#3A0519]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A0519] via-black/50 to-transparent flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-6">
              <motion.h2 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg tracking-tight"
              >
                {slides[current].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl drop-shadow-md mb-8 text-gray-200"
              >
                {slides[current].text}
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Link to="/menu" className="inline-block px-8 py-4 bg-[#e21b70] hover:bg-white hover:text-[#e21b70] transition-colors duration-300 text-white rounded-full font-bold text-lg shadow-lg">
                  Order Now
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#e21b70] transition-colors text-white p-4 rounded-full z-30 backdrop-blur-sm"
      >
        &#10094;
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#e21b70] transition-colors text-white p-4 rounded-full z-30 backdrop-blur-sm"
      >
        &#10095;
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? 'bg-[#e21b70] w-8' : 'bg-white/50 hover:bg-white'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
