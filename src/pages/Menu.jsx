// src/pages/Menu.js

import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const Menu = () => {
  const mockMenu = [
    { id: 1, name: "Delicious Burger", price: 800, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Fresh Pizza", price: 1500, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Spicy Wraps", price: 600, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80" }
  ];
  const [menuItems, setMenuItems] = useState(mockMenu);
  const { addToCart } = useCart();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleAddToCart = (item) => {
    addToCart(item); // ✅ Add to cart on click
  };

  return (
    <section className="py-10 px-6 sm:px-10 md:px-20 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-[#3A0519] text-center mb-10">Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-[#A53860] mb-2">{item.name}</h3>
              <p className="text-[#3A0519] font-bold mb-3">{formatPKR(item.price)}</p>
              <button
                onClick={() => handleAddToCart(item ,item.img)}
                className="px-4 py-2 bg-[#e21b70] hover:bg-[#670D2F] text-white rounded-full transition font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
