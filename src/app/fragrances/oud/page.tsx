'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Crown, Star, Diamond, Award } from 'lucide-react';

const fragrances = [
  {
    name: 'Royal Oud',
    description: 'A majestic blend of rare oud and precious woods',
    price: 399,
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    notes: ['Rare Oud', 'Sandalwood', 'Amber', 'Musk']
  },
  {
    name: 'Oud Mystique',
    description: 'Mysterious oud combined with exotic spices',
    price: 379,
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    notes: ['Oud Wood', 'Saffron', 'Rose', 'Patchouli']
  },
  {
    name: 'Midnight Oud',
    description: 'Dark and intense oud with smoky undertones',
    price: 389,
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    notes: ['Black Oud', 'Leather', 'Incense', 'Vanilla']
  },
  {
    name: 'Oud Royale',
    description: 'The finest oud blended with precious resins',
    price: 429,
    image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    notes: ['Royal Oud', 'Frankincense', 'Myrrh', 'Gold Amber']
  }
];

const features = [
  {
    icon: Crown,
    title: 'Royal Heritage',
    description: 'Centuries of perfumery tradition'
  },
  {
    icon: Star,
    title: 'Rare Ingredients',
    description: 'The finest oud from sustainable sources'
  },
  {
    icon: Diamond,
    title: 'Luxury Crafted',
    description: 'Masterfully blended by expert perfumers'
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Internationally recognized excellence'
  }
];

export default function OudPage() {
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
          src="https://images.pexels.com/photos/3738338/pexels-photo-3738338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Oud Collection"
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
            OUD COLLECTION
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Experience the royal essence of precious oud
          </motion.p>
        </div>
      </motion.div>

      {/* Collection Description */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-light mb-6">The Royal Art of Oud</h2>
        <p className="text-gray-600">
          Our Oud collection represents the pinnacle of luxury perfumery. Each fragrance is crafted 
          with the finest oud, sourced from sustainable agarwood trees and masterfully blended with 
          precious ingredients to create truly exceptional scents.
        </p>
      </div>

      {/* Features */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <feature.icon className="w-8 h-8 mx-auto mb-4" />
                <h3 className="text-xl font-light mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fragrances Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {fragrances.map((fragrance, index) => (
            <motion.div
              key={fragrance.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={fragrance.image}
                  alt={fragrance.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">{fragrance.description}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-light mb-2">{fragrance.name}</h3>
              <p className="text-gray-600 mb-4">{fragrance.description}</p>
              <p className="text-xl mb-4">${fragrance.price}</p>

              <div className="space-y-2">
                <p className="font-medium">Key Notes:</p>
                <div className="flex flex-wrap gap-2">
                  {fragrance.notes.map(note => (
                    <span
                      key={note}
                      className="px-3 py-1 bg-gray-100 text-sm text-gray-600"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <button className="mt-6 bg-black text-white px-8 py-3 w-full hover:bg-gray-800 transition-colors">
                ADD TO CART
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 