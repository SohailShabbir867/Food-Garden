// src/context/CartContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("food_garden_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("food_garden_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  // Helper to build a unique key for items with distinct options
  const generateCartItemId = (item) => {
    const spiceKey = item.spice || "default";
    const addOnsKey = item.addOns ? [...item.addOns].sort().join(",") : "none";
    return `${item.id}_${spiceKey}_${addOnsKey}`;
  };

  // ✅ Add to Cart
  const addToCart = (newItem) => {
    const cartItemId = newItem.cartItemId || generateCartItemId(newItem);
    const itemToAdd = {
      ...newItem,
      cartItemId,
      quantity: newItem.quantity || 1,
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (newItem.quantity || 1),
        };
        return updated;
      }
      return [...prev, itemToAdd];
    });
  };

  // ✅ Update Item Quantity
  const updateQuantity = (cartItemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // ✅ Remove single item
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => (item.cartItemId || item.id) !== cartItemId));
  };

  // ✅ Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Total items count
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // ✅ Total price calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
