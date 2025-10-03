"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Simply browse our products, add your favorites to the cart, and proceed to checkout. You'll receive an order confirmation by email right away.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order in your account dashboard.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery for unused and unopened products. Please visit our Returns page for full details.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to select countries worldwide. Shipping charges and delivery times vary by destination.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us anytime via our Contact page, by emailing noamaniperfumes@gmail.com, or call us: 9821744247. We're here to help!",
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-white py-16 px-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white/80 rounded-3xl shadow-2xl p-10 mb-12 border border-yellow-200 backdrop-blur-lg"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-yellow-500 via-pink-400 to-yellow-400 bg-clip-text text-transparent tracking-wide flex items-center justify-center gap-3"
        >
          <HelpCircle className="inline-block w-12 h-12 animate-bounce text-yellow-400" />
          FAQs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-lg text-gray-700 text-center mb-10"
        >
          Find answers to the most common questions about orders, shipping, returns, and more. Still need help? Contact our support team anytime.
        </motion.p>
        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="bg-white/90 rounded-xl shadow border border-pink-100 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-lg font-semibold text-pink-700 focus:outline-none hover:bg-pink-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-6 h-6 text-yellow-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-yellow-400" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-5 text-gray-700 text-base"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/customer-care/contact" className="inline-block bg-yellow-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-500 transition-colors text-lg flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 