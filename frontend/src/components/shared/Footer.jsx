import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUtensils } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a0009] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4" data-aos="fade-up">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#e21b70] flex items-center justify-center">
                <FaUtensils className="text-white" />
              </div>
              <span className="text-2xl font-extrabold text-[#e21b70]">
                Food<span className="text-white">Garden</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Pakistan's freshest food delivery marketplace. Connecting local restaurants with hungry customers — fast, fresh, and delicious.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { icon: <FaFacebook />, href: "#", color: "hover:bg-blue-600" },
                { icon: <FaInstagram />, href: "#", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500" },
                { icon: <FaTwitter />, href: "#", color: "hover:bg-sky-500" },
                { icon: <FaWhatsapp />, href: "#", color: "hover:bg-green-500" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white ${s.color} transition-all duration-200`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-white font-bold text-base mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Browse Menu", path: "/menu" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Cart", path: "/cart" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 hover:text-[#e21b70] transition flex items-center gap-1.5"
                  >
                    <span className="text-[#e21b70] text-xs">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div data-aos="fade-up" data-aos-delay="150">
            <h4 className="text-white font-bold text-base mb-5">For Business</h4>
            <ul className="space-y-3">
              {[
                { name: "Sell on Food Garden", path: "/signup" },
                { name: "Vendor Dashboard", path: "/vendor/dashboard" },
                { name: "Manage Your Menu", path: "/vendor/menu" },
                { name: "Track Orders", path: "/vendor/orders" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 hover:text-[#e21b70] transition flex items-center gap-1.5"
                  >
                    <span className="text-[#e21b70] text-xs">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-white font-bold text-base mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <FaMapMarkerAlt className="text-[#e21b70] mt-0.5 shrink-0" />
                <span>Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <FaPhone className="text-[#e21b70] shrink-0" />
                <a href="tel:+923001234567" className="hover:text-[#e21b70] transition">+92-300-1234567</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <FaEnvelope className="text-[#e21b70] shrink-0" />
                <a href="mailto:hello@foodgarden.pk" className="hover:text-[#e21b70] transition">hello@foodgarden.pk</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {year} Food Garden. All rights reserved. Built with ❤️ in Pakistan.
          </p>
          <div className="flex gap-5 text-xs text-gray-600">
            <a href="#" className="hover:text-[#e21b70] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#e21b70] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#e21b70] transition">Refund Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;