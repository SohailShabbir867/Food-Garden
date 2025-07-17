// src/pages/Complaint.js

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Complaint = () => {
  const formRef = useRef();
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    type: "Product Issue",
    message: "",
    user_email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .sendForm(
        "your_service_id",      // ✅ Replace with your service ID
        "your_template_id",     // ✅ Replace with your template ID
        formRef.current,
        "your_public_key"       // ✅ Replace with your public key
      )
      .then(
        (result) => {
          setStatus("Complaint submitted. Please check your email.");
          setForm({ type: "Product Issue", message: "", user_email: "" });
        },
        (error) => {
          setStatus("Error sending complaint. Try again.");
        }
      );
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#e21b70] text-center">Submit a Complaint</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden field to pass complaint type */}
        <input type="hidden" name="type" value={form.type} />

        <label className="block">
          <span className="text-[#3A0519] font-medium">Complaint Type</span>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
          >
            <option>Product Issue</option>
            <option>Delivery Issue</option>
            <option>Other</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[#3A0519] font-medium">Your Email</span>
          <input
            type="email"
            name="user_email"
            required
            value={form.user_email}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="example@email.com"
          />
        </label>

        <label className="block">
          <span className="text-[#3A0519] font-medium">Description</span>
          <textarea
            name="message"
            required
            value={form.message}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded h-28"
            placeholder="Describe your issue..."
          />
        </label>

        <button
          type="submit"
          className="w-full bg-[#e21b70] hover:bg-[#670D2F] text-white py-2 rounded"
        >
          Submit Complaint
        </button>

        {status && (
          <p className="text-center mt-4 text-sm text-green-600">{status}</p>
        )}
      </form>
    </div>
  );
};

export default Complaint;
