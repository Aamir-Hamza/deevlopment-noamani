'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Mock data for stockists
const stockists = [
  {
    id: 1,
    name: 'Luxury Beauty Store',
    address: '123 Fifth Avenue, New York, NY 10001',
    phone: '+1 (212) 555-0123',
    image: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'Flagship Store'
  },
  {
    id: 2,
    name: 'Perfume Paradise',
    address: '456 Oxford Street, London, W1C 1AP',
    phone: '+44 20 7123 4567',
    image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'Boutique'
  },
  {
    id: 3,
    name: 'Scent & Sensibility',
    address: '789 Rue du Faubourg, Paris, 75008',
    phone: '+33 1 23 45 67 89',
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: 'Department Store'
  },
];

export default function FindStockist() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredStockists = stockists.filter(stockist => {
    const matchesSearch = stockist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stockist.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || stockist.type === selectedType;
    return matchesSearch && matchesType;
  });

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
            FIND A STOCKIST
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Discover our luxury fragrances at a store near you
          </motion.p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-black"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-6 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-black"
          >
            <option value="All">All Locations</option>
            <option value="Flagship Store">Flagship Stores</option>
            <option value="Boutique">Boutiques</option>
            <option value="Department Store">Department Stores</option>
          </select>
        </div>

        {/* Stockists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStockists.map((stockist) => (
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
          <h2 className="text-3xl font-light mb-6">Need Help Finding a Store?</h2>
          <p className="text-gray-600 mb-8">
            Our customer service team is here to help you locate the nearest stockist.
          </p>
          <button className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors">
            CONTACT US
          </button>
        </div>
      </motion.div>
    </div>
  );
} 