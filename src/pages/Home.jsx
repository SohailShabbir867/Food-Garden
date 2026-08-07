// src/pages/Home.js

import React from "react";
import HeroSection from "../components/HeroSection";
import CartItms from "../components/CartItems.js"
import Sliderimage from "../components/Sliderimages.js"


const Home = () => {
  return (
    <>
      <HeroSection />
      <Sliderimage/>
      <CartItms/>
      {/* You can add more sections here like FeaturedMenu, Categories, etc. */}
    </>
  );
};

export default Home;
