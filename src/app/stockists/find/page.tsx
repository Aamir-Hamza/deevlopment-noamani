'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const stockists = [
  {
    id: 1,
    name: 'Noamani Perfumes',
    address: 'J19C, Ground Floor, Thokar No. 4, Abul Fazal, Delhi, India',
    phone: '+91 98217 44247',
    image: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'Our Office'
  },
];

export default function FindStockist() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/6621441/pexels-photo-6621441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Find a Stockist"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-light mb-6"
          >
VISIT US
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Discover our luxury fragrances at our office
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Stockists Grid */}
        <div className="grid grid-cols-1 max-w-sm mx-auto gap-8">
          {stockists.map((stockist) => (
            <motion.div
              key={stockist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[4/3] mb-4 overflow-hidden">
                <Image
                  src={stockist.image}
                  alt={stockist.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">{stockist.name}</h3>
              <p className="text-gray-600 mb-1">{stockist.address}</p>
              <p className="text-gray-600 mb-2">{stockist.phone}</p>
              <span className="text-sm text-gray-500">{stockist.type}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16 px-4 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Have a Question?</h2>
          <p className="text-gray-600 mb-8">
            Our customer service team is here to help.
          </p>
          <Link href="/customer-care/contact" className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
            CONTACT US
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 