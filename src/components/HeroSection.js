import React, { useState, useEffect } from 'react';
import Burger from '../assets/Burger.jpg';
import Piza from '../assets/Piza.jpg'
import Rools from "../assets/Rools.jpg"

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
    title: 'Rools',
    text: 'Chicked Rools Fully Loaded With Chees',
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
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[80vh] sm:h-[70vh] md:h-[90vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Caption: 15px above dots */}
          <div className="absolute bottom-[65px] w-full flex items-center justify-center px-4 z-20">
            <div className="text-center text-white max-w-xl bg-black/40 p-4 rounded-md">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl drop-shadow-md">
                {slide.text}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full z-30"
      >
        &#10094;
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full z-30"
      >
        &#10095;
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full border border-white ${
              index === current ? 'bg-white' : 'bg-transparent'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
