import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import your 8 images
import Slider1 from "../assets/Slider1.jpg";
import Slider2 from "../assets/Slider2.jpg";
import Slider3 from "../assets/Slider3.jpg";
import Slider4 from "../assets/Slider4.jpg";
import Slider5 from "../assets/Slider5.jpg";
import Slider6 from "../assets/Slider6.jpg";
import Slider7 from "../assets/Slider7.jpg";
import Slider8 from "../assets/Slider8.jpg";

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
    <section className="py-16 px-6 sm:px-10 md:px-20 bg-white overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#3A0519] mb-4">
          Explore Our Food Gallery
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">Swipe through our most popular and mouth-watering items freshly prepared for you.</p>
      </motion.div>

      <motion.div ref={carouselRef} className="cursor-grab overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-6 px-4"
        >
          {sliderItems.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={handleClick}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="min-w-[280px] h-80 rounded-2xl overflow-hidden shadow-xl relative group"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 pointer-events-none">
                <h3 className="text-white text-2xl font-bold">{item.name}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HorizontalSlider;
