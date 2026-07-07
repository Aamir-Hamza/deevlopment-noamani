"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import Image from "next/image";
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
      "You can reach us anytime via our Contact page, by emailing info@noamani.com, or call us: +91 98217 44247. We're here to help!",
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — matches /about, /gifts, /bestsellers */}
      <div className="relative h-[40vh] bg-black text-white flex items-center justify-center">
        <Image
          src="https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Frequently Asked Questions"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-light mb-4"
            style={{ fontFamily: 'Didot, serif' }}
          >
            FAQs
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg font-light"
          >
            Answers to the most common questions about orders, shipping, and returns
          </motion.p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * idx, duration: 0.4 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left text-base font-medium text-gray-900 focus:outline-none hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#bfa14a] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#bfa14a] flex-shrink-0" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5 text-gray-600 text-sm leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">Still need help?</p>
          <Link
            href="/customer-care/contact"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
