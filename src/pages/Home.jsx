// src/pages/Home.js

import React from "react";
import HeroSection from "../components/HeroSection";
import CartItms from "../components/CartItems"
import Sliderimage from "../components/Sliderimages";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";


const Home = () => {
  return (
    <>
      <HeroSection />
      <Sliderimage/>
      <FeaturesSection />
      <CartItms/>
      <TestimonialsSection />
      <FAQSection />
    </>
  );
};

export default Home;
