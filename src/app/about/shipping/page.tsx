"use client";

import { motion } from "framer-motion";
import { Truck, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ShippingDetailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-yellow-100 py-16 px-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white/80 rounded-3xl shadow-2xl p-10 mb-12 border border-yellow-200 backdrop-blur-lg mt-20"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-yellow-500 via-yellow-300 to-pink-400 bg-clip-text text-transparent tracking-wide"
        >
          <Truck className="inline-block w-12 h-12 mr-3 animate-bounce text-yellow-400" />
          Shipping & Delivery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-lg text-gray-700 text-center mb-10"
        >
          We deliver luxury to your doorstep. Enjoy fast, secure, and reliable shipping on all orders. Here's everything you need to know about our shipping process.
        </motion.p>
        {/* Timeline/Stepper */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <ShieldCheck className="w-14 h-14 text-green-500 mb-2 animate-pulse" />
            <span className="font-bold text-lg mb-1">Order Placed</span>
            <span className="text-gray-500 text-sm text-center">Your order is confirmed and processed with utmost care.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <Clock className="w-14 h-14 text-blue-400 mb-2 animate-spin-slow" />
            <span className="font-bold text-lg mb-1">Dispatched</span>
            <span className="text-gray-500 text-sm text-center">We carefully pack and dispatch your order within 1-2 business days.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <Truck className="w-14 h-14 text-yellow-500 mb-2 animate-bounce" />
            <span className="font-bold text-lg mb-1">On the Way</span>
            <span className="text-gray-500 text-sm text-center">Track your shipment as it makes its way to you, safely and swiftly.</span>
          </motion.div>
        </div>
        {/* Policy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="bg-white/90 rounded-xl p-8 shadow-lg border border-gray-100 mb-10"
        >
          <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-green-400" /> Shipping Policy
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Free shipping on all orders over <span className="font-semibold">₹1000</span>.</li>
            <li>Standard delivery time: <span className="font-semibold">3-5 business days</span> (metro cities), <span className="font-semibold">5-8 business days</span> (other locations).</li>
            <li>Express shipping available at checkout for select locations.</li>
            <li>All orders are insured and trackable.</li>
            <li>Signature required on delivery for your security.</li>
            <li>We ship Monday to Saturday, excluding public holidays.</li>
          </ul>
        </motion.div>
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="bg-gradient-to-r from-yellow-50 via-pink-50 to-white rounded-xl p-8 shadow-lg border border-pink-100"
        >
          <h2 className="text-2xl font-bold mb-4 text-pink-600 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-pink-400" /> Shipping FAQs
          </h2>
          <ul className="space-y-4">
            <li>
              <span className="font-semibold text-gray-900">How can I track my order?</span>
              <p className="text-gray-700">You will receive a tracking link via email and SMS once your order is dispatched. You can also track your order in your account dashboard.</p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Do you ship internationally?</span>
              <p className="text-gray-700">Yes, we offer international shipping to select countries. Shipping charges and delivery times vary by destination.</p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">What if my package is delayed or lost?</span>
              <p className="text-gray-700">Contact our support team immediately. All shipments are insured, and we will assist you in resolving any issues promptly.</p>
            </li>
          </ul>
        </motion.div>
        <div className="text-center mt-10">
          <Link href="/customer-care/contact" className="inline-block bg-yellow-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-500 transition-colors text-lg">
            Contact Customer Care
          </Link>
        </div>
      </motion.div>
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 