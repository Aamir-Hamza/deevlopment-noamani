'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const shippingOptions = [
  {
    title: 'Standard Shipping',
    time: '3-5 Business Days',
    price: '$5.99',
    description: 'For orders under $50',
    image: 'https://images.pexels.com/photos/5624977/pexels-photo-5624977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Express Shipping',
    time: '1-2 Business Days',
    price: '$12.99',
    description: 'Fast delivery nationwide',
    image: 'https://images.pexels.com/photos/6621441/pexels-photo-6621441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Free Shipping',
    time: '3-5 Business Days',
    price: 'FREE',
    description: 'For orders over $50',
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function ShippingPage() {
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
          src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Shipping"
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
            SHIPPING INFORMATION
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Fast and reliable delivery to your doorstep
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
        <h2 className="text-3xl font-light mb-6">DELIVERY OPTIONS</h2>
        <p className="text-gray-600">
          Choose from our range of shipping options to suit your needs.
          We ensure safe and secure delivery of your luxury fragrances.
        </p>
      </motion.div>

      {/* Shipping Options Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shippingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">{option.description}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-light mb-2">{option.price}</h3>
                <p className="text-lg mb-2">{option.title}</p>
                <p className="text-gray-600">{option.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shipping Policies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Shipping Policies</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Order Processing</h3>
              <p className="text-gray-600">
                Orders are processed within 24-48 hours of being placed. You will receive a confirmation email with tracking information once your order has been shipped.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Delivery Areas</h3>
              <p className="text-gray-600">
                We currently ship to all 50 states in the United States. For international shipping inquiries, please contact our customer service team.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Tracking Your Order</h3>
              <p className="text-gray-600">
                Once your order ships, you will receive a tracking number via email. You can track your package's status and estimated delivery date using this number.
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
          <h2 className="text-3xl font-light mb-6">Need Help?</h2>
          <p className="text-gray-600 mb-8">
            Our customer service team is available to assist you with any shipping-related questions.
          </p>
          <button className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors">
            CONTACT US
          </button>
        </div>
      </motion.div>
    </div>
  );
} 