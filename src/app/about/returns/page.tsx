"use client";

import { motion } from "framer-motion";
import { Undo2, CheckCircle2, PackageCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ReturnsDetailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-yellow-100 py-16 px-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white/80 rounded-3xl shadow-2xl p-10 mb-12 border border-pink-200 backdrop-blur-lg"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 via-yellow-400 to-pink-600 bg-clip-text text-transparent tracking-wide"
        >
          <Undo2 className="inline-block w-12 h-12 mr-3 animate-bounce text-pink-400" />
          Returns & Refunds
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-lg text-gray-700 text-center mb-10"
        >
          We want you to love your purchase! If you're not completely satisfied, our easy and transparent returns process ensures a hassle-free experience.
        </motion.p>
        {/* Timeline/Stepper */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <CheckCircle2 className="w-14 h-14 text-green-500 mb-2 animate-pulse" />
            <span className="font-bold text-lg mb-1">Request Return</span>
            <span className="text-gray-500 text-sm text-center">Submit your return request within 30 days of delivery.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <PackageCheck className="w-14 h-14 text-yellow-400 mb-2 animate-spin-slow" />
            <span className="font-bold text-lg mb-1">Return Pickup</span>
            <span className="text-gray-500 text-sm text-center">We arrange a convenient pickup or drop-off for your return.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <Undo2 className="w-14 h-14 text-pink-400 mb-2 animate-bounce" />
            <span className="font-bold text-lg mb-1">Refund Processed</span>
            <span className="text-gray-500 text-sm text-center">Get your refund within 5-7 business days after we receive your return.</span>
          </motion.div>
        </div>
        {/* Policy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="bg-white/90 rounded-xl p-8 shadow-lg border border-gray-100 mb-10"
        >
          <h2 className="text-2xl font-bold mb-4 text-pink-600 flex items-center gap-2">
            <Undo2 className="w-7 h-7 text-pink-400" /> Return Policy
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Returns accepted within <span className="font-semibold">30 days</span> of delivery.</li>
            <li>Products must be unused, unopened, and in original packaging.</li>
            <li>Refunds processed to your original payment method within 5-7 business days after inspection.</li>
            <li>Return shipping is free for damaged or incorrect items.</li>
            <li>For other returns, a small restocking fee may apply.</li>
            <li>Gift returns are eligible for store credit.</li>
          </ul>
        </motion.div>
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="bg-gradient-to-r from-pink-50 via-yellow-50 to-white rounded-xl p-8 shadow-lg border border-yellow-100"
        >
          <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-yellow-400" /> Returns FAQs
          </h2>
          <ul className="space-y-4">
            <li>
              <span className="font-semibold text-gray-900">How do I start a return?</span>
              <p className="text-gray-700">Contact our support team or use the returns portal in your account dashboard to initiate a return.</p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">Can I return a used product?</span>
              <p className="text-gray-700">Only unused and unopened products in original packaging are eligible for return, unless the item is defective or damaged.</p>
            </li>
            <li>
              <span className="font-semibold text-gray-900">How long does it take to get my refund?</span>
              <p className="text-gray-700">Refunds are processed within 5-7 business days after we receive and inspect your return.</p>
            </li>
          </ul>
        </motion.div>
        <div className="text-center mt-10">
          <Link href="/customer-care/contact" className="inline-block bg-pink-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-500 transition-colors text-lg">
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