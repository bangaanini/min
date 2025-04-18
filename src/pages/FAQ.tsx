// components/FAQ.tsx
"use client";

import TOS from './TOS';
import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How to make a profit?",
      answer: "You can make a profit by connecting your wallet and start mining. The more USDT you have, the more profit you will get."
    },
    {
      question: "How do I start mining?",
      answer: "Before connecting your wallet, make sure you have USDT balance in your wallet to start connection your wallet and mining pool."
    },
    {
      question: "When can I withdraw profits?",
      answer: "You can withdraw your mining rewards anytime after 24 hours of initial deposit. Withdrawals are processed within 12-24 hours."
    },
    {
      question: "Is my investment safe?",
      answer: "You don't need to send usdt, just save usdt in your wallet, and it's very safe."
    }
  ];

  return (
    <section className="bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <button
                className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-xl font-semibold text-white">
                  {faq.question}
                </h3>
                <span className="text-white">
                  {activeIndex === index ? '-' : '+'}
                </span>
              </button>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="p-6 pt-0 text-gray-400"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;