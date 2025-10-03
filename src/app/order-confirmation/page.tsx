'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-light mb-4"
        >
          Thank You for Your Order!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-8"
        >
          Your order has been successfully placed. We'll send you an email with your order details and tracking information once your package ships.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <Link
            href="/shop"
            className="block w-full bg-black text-white py-3 hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
          
          <Link
            href="/"
            className="block w-full border border-black py-3 hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 