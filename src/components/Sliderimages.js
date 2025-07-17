import React from "react";
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

  const handleClick = () => {
    navigate("/menu");
  };

  return (
    <section className="py-12 px-6 sm:px-10 md:px-20 bg-[#fff4f8]">
      <h2 className="text-3xl font-bold text-[#3A0519] mb-6 text-center">
        Explore Our Food Gallery
      </h2>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {sliderItems.map((item) => (
          <div
            key={item.id}
            onClick={handleClick}
            className="min-w-[250px] h-72 rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalSlider;
