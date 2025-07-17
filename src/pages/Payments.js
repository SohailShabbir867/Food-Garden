import React from "react";
import { Link } from "react-router-dom";

const Payment = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-10 md:px-20">
      <h2 className="text-3xl font-bold text-[#3A0519] text-center mb-10">
        Choose Payment Method
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* JazzCash */}
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-xl transition">
          <img
            src="https://seeklogo.com/images/J/jazzcash-logo-BF2C5728F6-seeklogo.com.png"
            alt="JazzCash"
            className="w-32 h-16 mx-auto object-contain"
          />
          <p className="text-[#3A0519] font-medium my-4">
            Pay securely using JazzCash
          </p>
          <button className="bg-[#e21b70] hover:bg-[#670D2F] text-white px-5 py-2 rounded-full">
            Pay with JazzCash
          </button>
        </div>

        {/* Easypaisa */}
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-xl transition">
          <img
            src="https://seeklogo.com/images/E/easypaisa-logo-1A542DD841-seeklogo.com.png"
            alt="Easypaisa"
            className="w-32 h-16 mx-auto object-contain"
          />
          <p className="text-[#3A0519] font-medium my-4">
            Pay securely using Easypaisa
          </p>
          <button className="bg-[#e21b70] hover:bg-[#670D2F] text-white px-5 py-2 rounded-full">
            Pay with Easypaisa
          </button>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          to="/"
          className="text-[#A53860] hover:underline text-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Payment;
