import React from "react";
import { motion } from "framer-motion";
import { FaShippingFast, FaUtensils, FaComments, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaShippingFast size={40} />,
    title: "Fast Delivery",
    description: "Get your favorite meals delivered straight to your doorstep quickly and reliably.",
  },
  {
    id: 2,
    icon: <FaUtensils size={40} />,
    title: "Endless Choices",
    description: "Browse diverse menus from top local restaurants and talented home-based cooks.",
  },
  {
    id: 3,
    icon: <FaComments size={40} />,
    title: "Direct Chat",
    description: "Message sellers directly in real-time to customize orders or coordinate pickup.",
  },
  {
    id: 4,
    icon: <FaShieldAlt size={40} />,
    title: "Trusted Platform",
    description: "A secure, admin-moderated marketplace ensuring safety, quality, and seamless checkout.",
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
    <section className="relative overflow-hidden bg-[#fffafb] py-20 sm:py-28">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-100/60 blur-3xl" />
      <div className="section-shell relative">
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-[#e21b70]">Made for easy ordering</span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#3A0519] sm:text-5xl"
        >
          Why Choose Food Garden?
        </motion.h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">A warm, effortless food experience from discovering your next meal to receiving it at your door.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={itemVariants}
            whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
            className="elevated-card group rounded-[1.8rem] p-7 text-left transition-all duration-300 [transform-style:preserve-3d]"
          >
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3A0519] text-white shadow-lg shadow-[#3a0519]/20 transition-all duration-300 group-hover:rotate-6 group-hover:bg-[#e21b70] group-hover:shadow-[#e21b70]/30">
              {feature.icon}
            </div>
            <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-[#3A0519]">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
