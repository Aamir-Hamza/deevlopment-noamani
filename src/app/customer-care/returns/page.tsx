'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const returnSteps = [
  {
    title: 'Request Return',
    time: 'Within 30 Days',
    description: 'Fill out our simple return form',
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Pack Items',
    time: 'Original Packaging',
    description: 'Securely pack unused items',
    image: 'https://images.pexels.com/photos/6621441/pexels-photo-6621441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Ship Back',
    time: 'Free Returns',
    description: 'Use our prepaid label',
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Refund',
    time: '3-5 Business Days',
    description: 'Quick refund processing',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Returns"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-light mb-6"
          >
            RETURNS & EXCHANGES
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Hassle-free returns within 30 days
          </motion.p>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mt-16 mb-16 px-4"
      >
        <h2 className="text-3xl font-light mb-6">RETURN PROCESS</h2>
        <p className="text-gray-600">
          We want you to be completely satisfied with your purchase.
          Our return process is simple and convenient.
        </p>
      </motion.div>

      {/* Return Steps Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {returnSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">{step.description}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-light mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Return Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Return Policy</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Return Eligibility</h3>
              <p className="text-gray-600">
                Items must be unused, unopened, and in their original packaging. Returns are accepted within 30 days of purchase with proof of purchase.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Exchange Process</h3>
              <p className="text-gray-600">
                If you'd like to exchange your item for a different fragrance, simply indicate this on your return form. We'll process your exchange as soon as we receive your return.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Refund Timeline</h3>
              <p className="text-gray-600">
                Once we receive your return, refunds are processed within 3-5 business days. The refund will be issued to your original payment method.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 px-4 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Need Help with Your Return?</h2>
          <p className="text-gray-600 mb-8">
            Our customer service team is here to assist you with the return process.
          </p>
          <button className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors">
            START RETURN
          </button>
        </div>
      </motion.div>
    </div>
  );
} 