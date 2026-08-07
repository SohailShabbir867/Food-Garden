// src/context/CartContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);



  // ✅ Add to Cart
  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  // ✅ Remove single item
  const removeFromCart = (itemToRemove) => {
    setCartItems((prev) =>
      prev.filter((item, index) => index !== prev.indexOf(itemToRemove))
    );
  };

  // ✅ Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
