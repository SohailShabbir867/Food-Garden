import React from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/shared/HeroSection";
import CartItms from "../components/shared/CartItems"
import Sliderimage from "../components/shared/Sliderimages";
import FeaturesSection from "../components/shared/FeaturesSection";
import TestimonialsSection from "../components/shared/TestimonialsSection";
import FAQSection from "../components/shared/FAQSection";


const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <HeroSection />
      <Sliderimage/>
      <FeaturesSection />
      <CartItms/>
      <TestimonialsSection />
      <FAQSection />
    </motion.div>
  );
};

export default Home;
