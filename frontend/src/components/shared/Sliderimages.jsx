import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import your 8 images
import Slider1 from "../../assets/slider/Slider1.jpg";
import Slider2 from "../../assets/slider/Slider2.jpg";
import Slider3 from "../../assets/slider/Slider3.jpg";
import Slider4 from "../../assets/slider/Slider4.jpg";
import Slider5 from "../../assets/slider/Slider5.jpg";
import Slider6 from "../../assets/slider/Slider6.jpg";
import Slider7 from "../../assets/slider/Slider7.jpg";
import Slider8 from "../../assets/slider/Slider8.jpg";

const sliderItems = [
  { id: 1, name: "Zinger Burger", image: Slider1 },
  { id: 2, name: "Pizza Slice", image: Slider2 },
  { id: 3, name: "French Fries", image: Slider3 },
  { id: 4, name: "Cold Shake", image: Slider4 },
  { id: 5, name: "Nuggets", image: Slider5 },
  { id: 6, name: "Loaded Fries", image: Slider6 },
  { id: 7, name: "Biryani", image: Slider7 },
  { id: 8, name: "Club Sandwich", image: Slider8 },
];

const HorizontalSlider = () => {
  const navigate = useNavigate();
  const carouselRef = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  const handleClick = () => {
    navigate("/menu");
  };

  return (
    <section className="py-24 px-6 sm:px-10 md:px-20 bg-[#1a0009] overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Explore Our <span className="text-[#e21b70]">Food Gallery</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Swipe through our most popular and mouth-watering items freshly prepared for you.</p>
      </motion.div>

      <div className="overflow-hidden pb-10 relative">
        {/* Left and Right Gradient Fades for a smoother look */}
        <div className="absolute top-0 bottom-10 left-0 w-24 bg-gradient-to-r from-[#1a0009] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-10 right-0 w-24 bg-gradient-to-l from-[#1a0009] to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          className="flex gap-6 px-4 w-max hover:[animation-play-state:paused]"
        >
          {[...sliderItems, ...sliderItems].map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              onClick={handleClick}
              whileHover={{ scale: 1.05 }}
              className="min-w-[280px] h-80 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative group bg-black/20 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0009]/95 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
                <h3 className="text-white text-2xl font-bold tracking-wide transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:text-[#e21b70]">
                  {item.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalSlider;
