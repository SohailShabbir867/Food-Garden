// src/pages/Cart.js

import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart,  } = useCart();
  const navigate = useNavigate();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0);

  return (
    <section className="py-10 px-6 sm:px-10 md:px-20 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-[#3A0519] text-center mb-10">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-48 h-48 object-cover"
                />

                <div className="p-4 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-xl font-semibold text-[#A53860]">{item.name}</h3>
                    <p className="text-[#3A0519] mt-2">{formatPKR(item.price)}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold text-[#3A0519] mb-4">Total: {formatPKR(total)}</h3>
            <button
              onClick={() => navigate("/payment")}
              className="px-6 py-2 bg-[#e21b70] hover:bg-[#670D2F] text-white rounded-full"
            >
              Pay Now
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
