import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    id: 1,
    question: "How long does delivery take?",
    answer: "Our standard delivery time is 30-45 minutes depending on your location and the current traffic conditions. We always aim to deliver your food hot and fresh!",
  },
  {
    id: 2,
    question: "Do you offer vegetarian or vegan options?",
    answer: "Absolutely! We have a dedicated section on our menu for vegetarian and vegan dishes, prepared with the finest plant-based ingredients.",
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, PayPal, and cash on delivery. Online payments are secured with end-to-end encryption.",
  },
  {
    id: 4,
    question: "How can I track my order?",
    answer: "Once your order is confirmed, you will receive a tracking link via SMS and email. You can track your rider's exact location in real-time.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 sm:px-10 md:px-20 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-[#3A0519] mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="w-24 h-1 bg-[#e21b70] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
              >
                <span className={`text-lg font-semibold transition-colors duration-300 ${activeIndex === index ? "text-[#e21b70]" : "text-[#3A0519]"}`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown className={activeIndex === index ? "text-[#e21b70]" : "text-gray-400"} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
