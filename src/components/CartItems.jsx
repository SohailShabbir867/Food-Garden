import React from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import Cart1 from "../assets/Cart1.jpg";
import Cart1h from "../assets/Cart1h.jpg";
import Cart2 from "../assets/Cart2.jpg";
import Cart2h from "../assets/Cart2h.jpg";
import Cart3 from "../assets/Cart3.jpg";
import Cart3h from "../assets/Cart3h.jpg";
import Cart4 from "../assets/Cart4.jpg";
import Cart4h from "../assets/Cart4h.jpg";
import Cart5 from "../assets/Cart5.jpg";
import Cart5h from "../assets/Cart5h.jpg";
import Cart6 from "../assets/Cart6.jpg";
import Cart6h from "../assets/Cart6h.jpg";

// Food items array
const foods = [
  {
    id: 1,
    name: "Classic Beef Burger",
    price: 599,
    image: Cart1,
    hoverImage: Cart1h,
  },
  {
    id: 2,
    name: "Cheesy Fries",
    price: 349,
    image: Cart2,
    hoverImage: Cart2h,
  },
  {
    id: 3,
    name: "Chicken Samosas",
    price: 449,
    image: Cart3,
    hoverImage: Cart3h,
  },
  {
    id: 4,
    name: "Veggie Delight Pizza",
    price: 699,
    image: Cart4,
    hoverImage: Cart4h,
  },
  {
    id: 5,
    name: "Spicy Rolls",
    price: 449,
    image: Cart5,
    hoverImage: Cart5h,
  },
  {
    id: 6,
    name: "Loaded Fries",
    price: 299,
    image: Cart6,
    hoverImage: Cart6h,
  },
];

const RecommendedFoods = () => {
  const { addToCart } = useCart();

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleAddToCart = (food) => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="bg-gray-50 py-20 px-6 sm:px-10 md:px-20">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-[#3A0519] mb-4"
        >
          Most Recommended Dishes
        </motion.h2>
        <div className="w-24 h-1 bg-[#e21b70] mx-auto rounded-full"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
      >
        {foods.map((food) => (
          <motion.div
            key={food.id}
            variants={itemVariants}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="relative w-full h-64 overflow-hidden">
              <img
                src={food.image}
                alt={food.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 group-hover:opacity-0"
              />
              <img
                src={food.hoverImage}
                alt={food.name + " hover"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100"
              />
              <div className="absolute top-4 right-4 bg-[#e21b70] text-white font-bold py-1 px-3 rounded-full shadow-md z-10">
                {formatPKR(food.price)}
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-[#3A0519] mb-4">
                {food.name}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(food)}
                className="w-full py-3 bg-[#e21b70] text-white rounded-xl font-bold hover:bg-[#3A0519] transition-colors duration-300 shadow-md"
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default RecommendedFoods;
