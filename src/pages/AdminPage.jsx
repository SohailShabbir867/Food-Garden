// src/pages/AdminPage.js

import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [product, setProduct] = useState({ name: "", price: "", image: "" });
  const [menuItems, setMenuItems] = useState([]);

  const adminKey = "SohailShabbir25598@";

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("menuItems")) || [];
    setMenuItems(storedProducts);
  }, []);

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

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = { ...product, id: Date.now() };

    const updatedProducts = [...menuItems, newProduct];
    localStorage.setItem("menuItems", JSON.stringify(updatedProducts));
    setMenuItems(updatedProducts);

    alert("Product Added!");
    setProduct({ name: "", price: "", image: "" });
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = menuItems.filter((item) => item.id !== id);
    localStorage.setItem("menuItems", JSON.stringify(updatedProducts));
    setMenuItems(updatedProducts);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10">
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
        <>
          {/* Add Product Form */}
          <form onSubmit={handleAddProduct} className="space-y-4 mb-8">
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

          {/* Show Products */}
          <h2 className="text-xl font-semibold mb-4 text-[#3A0519]">Product List</h2>
          {menuItems.length === 0 ? (
            <p className="text-gray-600">No products added yet.</p>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border p-4 rounded shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-bold text-[#3A0519]">{item.name}</h3>
                      <p className="text-gray-700">PKR {item.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(item.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
