// src/pages/PaymentPage.jsx

import React, { useState } from "react";

const PaymentPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "PayFast",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 👉 Here, you'd typically call your backend or redirect to PayFast
    console.log("Form Submitted", form);
    alert("Redirecting to payment gateway...");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-[#3A0519] text-center mb-6">
          Payment Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e21b70]"
              placeholder="Your full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e21b70]"
              placeholder="e.g. 0300-1234567"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e21b70]"
              placeholder="you@example.com"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Delivery Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#e21b70]"
              placeholder="Street, City, ZIP Code"
              rows="3"
            ></textarea>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Select Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e21b70]"
            >
              <option value="PayFast">PayFast (Recommended)</option>
              <option value="BankTransfer">Bank Transfer</option>
              <option value="CashOnDelivery">Cash on Delivery</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#e21b70] hover:bg-[#670D2F] text-white font-semibold rounded-full shadow transition duration-300"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
