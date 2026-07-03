'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const collections = [
  {
    id: 'summer-2024',
    title: 'Summer 2024',
    description: 'Light and refreshing fragrances for warm days',
    image: '/product1.jpg',
    products: ['Northern Lights', 'Oriental Oud']
  },
  {
    id: 'luxury',
    title: 'Luxury Collection',
    description: 'Premium and exclusive fragrances',
    image: '/product2.jpg',
    products: ['Oriental Oud', 'Signature Scent']
  },
  {
    id: 'classics',
    title: 'Timeless Classics',
    description: 'Iconic fragrances that never go out of style',
    image: '/product3.jpg',
    products: ['Northern Lights', 'Morning Dew']
  }
];

const seasonalHighlights = [
  {
    id: 'spring',
    title: 'Spring Florals',
    image: '/product1.jpg'
  },
  {
    id: 'summer',
    title: 'Summer Fresh',
    image: '/product2.jpg'
  },
  {
    id: 'fall',
    title: 'Fall Warmth',
    image: '/product4.jpg'
  },
  {
    id: 'winter',
    title: 'Winter Comfort',
    image: '/product3.jpg'
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — matches /shop, /bestsellers, /gifts */}
      <div className="relative h-[45vh] bg-black text-white flex items-center justify-center">
        <Image
          src="https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Our Collections"
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
            OUR COLLECTIONS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg font-light"
          >
            Curated collections of luxury fragrances, each telling its own story
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Collections */}
        <div className="py-20">
          <h2 className="text-[22px] mb-12" style={{ fontFamily: 'Didot, serif' }}>Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <Link href={`/collections/${collection.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-50 rounded-xl border border-gray-100">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-[18px] mb-2">{collection.title}</h3>
                  <p className="text-[15px] text-gray-600">{collection.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Seasonal Highlights */}
        <div className="pb-20">
          <h2 className="text-[22px] mb-12" style={{ fontFamily: 'Didot, serif' }}>Seasonal Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {seasonalHighlights.map((season, index) => (
              <motion.div
                key={season.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/collections/${season.id}`}>
                  <div className="relative aspect-square overflow-hidden mb-4 bg-gray-50 rounded-xl border border-gray-100">
                    <Image
                      src={season.image}
                      alt={season.title}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-[15px]">{season.title}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-20 border-t">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[22px] mb-4" style={{ fontFamily: 'Didot, serif' }}>Stay Updated</h2>
            <p className="text-[15px] text-gray-600 mb-8">
              Subscribe to receive updates about new collections and exclusive offers.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-full text-[15px] focus:outline-none focus:border-black"
              />
              <button className="px-8 py-2 bg-black text-white rounded-full text-[15px] hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
