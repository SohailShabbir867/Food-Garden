// src/pages/AdminPage.js

import React, { useState } from "react";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [product, setProduct] = useState({ name: "", price: "", image: "" });

  const adminKey = "SohailShabbir25598@";

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === adminKey) {
      setIsAuthenticated(true);
    } else {
      alert("You are not admin");
    }
    setPassword("");
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingProducts = JSON.parse(localStorage.getItem("menuItems")) || [];
    const newProduct = { ...product, id: Date.now() };
    localStorage.setItem("menuItems", JSON.stringify([...existingProducts, newProduct]));

    alert("Product Added!");
    setProduct({ name: "", price: "", image: "" });
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#3A0519]">Just For Admin</h1>

      {!isAuthenticated ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#e21b70] hover:bg-[#670D2F] text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full px-4 py-2 border rounded"
            value={product.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (PKR)"
            className="w-full px-4 py-2 border rounded"
            value={product.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            className="w-full px-4 py-2 border rounded"
            value={product.image}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#e21b70] hover:bg-[#670D2F] text-white py-2 rounded"
          >
            Add Product
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPage;
