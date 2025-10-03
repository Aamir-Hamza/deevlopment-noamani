'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';

const collections = [
  {
    id: 'summer-2024',
    title: 'Summer 2024',
    description: 'Light and refreshing fragrances for warm days',
    image: 'https://images.unsplash.com/photo-1527903789995-dc8ad2ad6de0?q=80&w=800&auto=format&fit=crop',
    products: ['Jo Malone London', 'Marc Jacobs Daisy']
  },
  {
    id: 'luxury',
    title: 'Luxury Collection',
    description: 'Premium and exclusive fragrances',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800&auto=format&fit=crop',
    products: ['Tom Ford Black Orchid', 'Creed Aventus']
  },
  {
    id: 'classics',
    title: 'Timeless Classics',
    description: 'Iconic fragrances that never go out of style',
    image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop',
    products: ['Chanel N°5', 'Dior Sauvage']
  }
];

const seasonalHighlights = [
  {
    id: 'spring',
    title: 'Spring Florals',
    image: 'https://images.unsplash.com/photo-1557774346-1635e89be612?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'summer',
    title: 'Summer Fresh',
    image: 'https://images.unsplash.com/photo-1595425964272-5437c8a18827?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'fall',
    title: 'Fall Warmth',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'winter',
    title: 'Winter Comfort',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop'
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-[32px] mb-4">Our Collections</h1>
            <p className="text-[15px] text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections of luxury fragrances, 
              each telling its own unique story through captivating scents.
            </p>
          </motion.div>
        </div>

        {/* Featured Collections */}
        <div className="mb-20">
          <h2 className="text-[22px] mb-12">Featured Collections</h2>
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
                  <div className="aspect-[3/4] overflow-hidden mb-4">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          <h2 className="text-[22px] mb-12">Seasonal Highlights</h2>
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
                  <div className="aspect-square overflow-hidden mb-4">
                    <img
                      src={season.image}
                      alt={season.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
            <h2 className="text-[22px] mb-4">Stay Updated</h2>
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