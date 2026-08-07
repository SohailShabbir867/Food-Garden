import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Blogger",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "The best food delivery service I've ever used. The burgers were incredibly juicy and arrived piping hot. Highly recommended!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "Regular Customer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Food Garden's spicy rolls are to die for. The delivery is always on time, and the packaging keeps everything fresh.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Local Guide",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I love the 24/7 service! Ordered pizza at 2 AM and it tasted like it came straight out of the oven. Fantastic quality.",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6 sm:px-10 md:px-20 bg-[#3A0519] relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#e21b70] rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
        >
          What Our Customers Say
        </motion.h2>
        <div className="w-24 h-1 bg-[#e21b70] mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative group hover:bg-white/20 transition-colors duration-300"
          >
            <FaQuoteLeft className="text-[#e21b70] text-4xl absolute top-6 right-6 opacity-30 group-hover:opacity-60 transition-opacity" />
            
            <div className="flex items-center gap-4 mb-6">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#e21b70]"
              />
              <div>
                <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            
            <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10">
              "{testimonial.text}"
            </p>
            
            <div className="flex text-[#e21b70]">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < testimonial.rating ? "opacity-100" : "opacity-30"} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
