import React from "react";
import { useCart } from "../context/CartContext";
import Cart1 from "../assets/Cart1.jpg";
import Cart1h from "../assets/Cart1h.jpg";
import Cart2 from "../assets/Cart2.jpg";
import Cart2h from "../assets/Cart2h.jpg";
import Cart3 from "../assets/Cart3.jpg";
import Cart3h from "../assets/Cart3h.jpg";
import Cart4 from "../assets/Cart4.jpg";
import Cart4h from "../assets/Cart4h.jpg";
import Cart5 from "../assets/Cart5.jpg";
import Cart5h from "../assets/Cart5h.jpg";
import Cart6 from "../assets/Cart6.jpg";
import Cart6h from "../assets/Cart6h.jpg";

// Food items array
const foods = [
  {
    id: 1,
    name: "Classic Beef Burger",
    price: 599,
    image: Cart1,
    hoverImage: Cart1h,
  },
  {
    id: 2,
    name: "Cheesy Fries",
    price: 349,
    image: Cart2,
    hoverImage: Cart2h,
  },
  {
    id: 3,
    name: "Chicken Samosas",
    price: 449,
    image: Cart3,
    hoverImage: Cart3h,
  },
  {
    id: 4,
    name: "Veggie Delight Pizza",
    price: 699,
    image: Cart4,
    hoverImage: Cart4h,
  },
  {
    id: 5,
    name: "Spicy Rolls",
    price: 449,
    image: Cart5,
    hoverImage: Cart5h,
  },
  {
    id: 6,
    name: "Loaded Fries",
    price: 299,
    image: Cart6,
    hoverImage: Cart6h,
  },
];

const RecommendedFoods = () => {
  const { addToCart } = useCart();

  // Format price as PKR
  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="bg-white py-16 px-6 sm:px-10 md:px-20">
      <h2 className="text-3xl font-bold text-[#3A0519] text-center mb-10">
        Most Recommended Dishes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
          >
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={food.image}
                alt={food.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-90 hover:opacity-0"
              />
              <img
                src={food.hoverImage}
                alt={food.name + " hover"}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 hover:opacity-90"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-[#A53860] mb-2">
                {food.name}
              </h3>
              <p className="text-[#3A0519] font-bold mb-3">
                {formatPKR(food.price)}
              </p>
              <button
                onClick={() => addToCart(food , alert("Successfuuly Added to Cart")) }
                className="inline-block px-4 py-2 bg-[#e21b70] hover:bg-[#670D2F] text-white rounded-full transition font-medium"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedFoods;
