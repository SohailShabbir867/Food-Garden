import React from "react";
import { motion } from "framer-motion";
import { FaShippingFast, FaLeaf, FaClock, FaAward } from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaShippingFast size={40} />,
    title: "Fast Delivery",
    description: "Hot and fresh food delivered to your doorstep within 30 minutes.",
  },
  {
    id: 2,
    icon: <FaLeaf size={40} />,
    title: "Fresh Ingredients",
    description: "We use only the freshest organic ingredients from local farms.",
  },
  {
    id: 3,
    icon: <FaClock size={40} />,
    title: "24/7 Service",
    description: "Craving a midnight snack? We are open 24/7 to serve you.",
  },
  {
    id: 4,
    icon: <FaAward size={40} />,
    title: "Premium Quality",
    description: "Award-winning chefs crafting unforgettable culinary experiences.",
  },
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-20 px-6 sm:px-10 md:px-20 bg-white">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-[#3A0519] mb-4"
        >
          Why Choose Food Garden?
        </motion.h2>
        <div className="w-24 h-1 bg-[#e21b70] mx-auto rounded-full"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="bg-gray-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
          >
            <div className="w-20 h-20 mx-auto bg-[#3A0519] text-white flex items-center justify-center rounded-full mb-6 group-hover:bg-[#e21b70] transition-colors duration-300 shadow-md">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-[#3A0519] mb-4">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
