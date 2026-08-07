// src/pages/Home.js

import React from "react";
import HeroSection from "../components/shared/HeroSection";
import CartItms from "../components/shared/CartItems"
import Sliderimage from "../components/shared/Sliderimages";
import FeaturesSection from "../components/shared/FeaturesSection";
import TestimonialsSection from "../components/shared/TestimonialsSection";
import FAQSection from "../components/shared/FAQSection";


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
