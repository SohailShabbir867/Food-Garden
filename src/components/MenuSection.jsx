import React from "react";
import { useCart } from "../context/CartContext";

// Menu item images (customize these)
import Menu1 from "../assets/Menu1.jpg";
import Menu1h from "../assets/Menu1h.jpg";
import Menu2 from "../assets/Menu2.jpg";
import Menu2h from "../assets/Menu2h.jpg";
import Menu3 from "../assets/Menu3.jpg";
import Menu3h from "../assets/Menu3h.jpg";
import Menu4 from "../assets/Menu4.jpg";
import Menu4h from "../assets/Menu4h.jpg";
import Menu5 from "../assets/Menu5.jpg";
import Menu5h from "../assets/Menu5h.jpg";
import Menu6 from "../assets/Menu6.jpg";
import Menu6h from "../assets/Menu6h.jpg";
import Menu7 from "../assets/Menu7.jpg";
import Menu7h from "../assets/Menu7h.jpg";
import Menu8 from "../assets/Menu8.jpg";
import Menu8h from "../assets/Menu8h.jpg";

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
  {
    id: 103,
    name: "Tandoori Naan",
    price: 40,
    image: Menu3,
    hoverImage: Menu3h,
  },
  {
    id: 104,
    name: "Chana Chaat",
    price: 150,
    image: Menu4,
    hoverImage: Menu4h,
  },
  {
    id: 105,
    name: "Beef Seekh Kabab",
    price: 250,
    image: Menu5,
    hoverImage: Menu5h,
  },
  {
    id: 106,
    name: "Zinger Wrap",
    price: 499,
    image: Menu6,
    hoverImage: Menu6h,
  },
  {
    id: 107,
    name: "Fruit Salad",
    price: 199,
    image: Menu7,
    hoverImage: Menu7h,
  },
  {
    id: 108,
    name: "Lassi (Sweet)",
    price: 120,
    image: Menu8,
    hoverImage: Menu8h,
  },
];

const MenuSection = () => {
  const { addToCart } = useCart();

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
              <button
                onClick={() => addToCart(item)}
                className="inline-block px-4 py-2 bg-[#e21b70] hover:bg-[#670D2F] text-white rounded-full transition font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
