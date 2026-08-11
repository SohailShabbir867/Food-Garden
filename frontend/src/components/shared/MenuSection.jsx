import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaLock, FaShoppingCart } from "react-icons/fa";

// Menu item images
import Menu1 from "../../assets/menu/Menu1.jpg";
import Menu1h from "../../assets/menu/Menu1h.jpg";
import Menu2 from "../../assets/menu/Menu2.jpg";
import Menu2h from "../../assets/menu/Menu2h.jpg";
// NOTE: Menu3-Menu8 images don't exist yet in assets/menu/. Add them there
// and re-add matching entries below when ready.

const menuItems = [
  {
    id: 101,
    name: "Chicken Karahi",
    price: 799,
    image: Menu1,
    hoverImage: Menu1h,
  },
  {
    id: 102,
    name: "Mutton Biryani",
    price: 999,
    image: Menu2,
    hoverImage: Menu2h,
  },
];

const MenuSection = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="bg-white py-16 px-6 sm:px-10 md:px-20">
      <h2 className="text-3xl font-bold text-[#3A0519] text-center mb-10">
        Explore Our Full Menu
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl"
          >
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-90 hover:opacity-0"
              />
              <img
                src={item.hoverImage}
                alt={item.name + " hover"}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 hover:opacity-90"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-[#A53860] mb-2">
                {item.name}
              </h3>
              <p className="text-[#3A0519] font-bold mb-3">
                {formatPKR(item.price)}
              </p>
              {isAuthenticated ? (
                <button
                  onClick={() => addToCart(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e21b70] hover:bg-[#670D2F] text-white rounded-full transition font-medium text-xs cursor-pointer shadow-md"
                >
                  <FaShoppingCart size={11} /> Add to Cart
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-[#3A0519] hover:text-white text-[#3A0519] rounded-full transition font-bold text-xs border border-gray-200 cursor-pointer"
                >
                  <FaLock size={10} /> Login to Order
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
