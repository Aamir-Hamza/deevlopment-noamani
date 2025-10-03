'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';

const discoverySets = [
  {
    id: 1,
    name: 'LUXURY DISCOVERY SET',
    subtext: '4 × 10ML SIGNATURE FRAGRANCES',
    price: 129.00,
    rating: 5,
    reviews: 186,
    tag: 'Best Seller',
    images: [
      'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 2,
    name: 'FLORAL COLLECTION SET',
    subtext: '3 × 15ML FLORAL FRAGRANCES',
    price: 99.00,
    rating: 5,
    reviews: 142,
    tag: 'New',
    images: [
      'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4110410/pexels-photo-4110410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 3,
    name: 'ORIENTAL DISCOVERY SET',
    subtext: '4 × 10ML ORIENTAL FRAGRANCES',
    price: 119.00,
    rating: 5,
    reviews: 134,
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4041393/pexels-photo-4041393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 4,
    name: 'CITRUS SUMMER SET',
    subtext: '3 × 15ML FRESH FRAGRANCES',
    price: 89.00,
    rating: 5,
    reviews: 98,
    tag: 'Limited Edition',
    images: [
      'https://images.pexels.com/photos/4110448/pexels-photo-4110448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4110449/pexels-photo-4110449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  }
];

export default function DiscoverySetsPage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const country = useCountry();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[70vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Discovery Sets Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-light mb-6"
          >
            DISCOVERY SETS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Explore our curated collections of luxury fragrances. The perfect way to discover your signature scent.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {discoverySets.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: hoveredProduct === product.id ? 0 : 1,
                    scale: hoveredProduct === product.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    scale: hoveredProduct === product.id ? 1 : 1.1
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={product.images[1]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                {product.tag && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <span className="bg-black text-white px-3 py-1 text-xs">
                      {product.tag}
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.subtext}</p>
                
                <div className="flex items-center justify-center mb-2">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <p className="text-sm font-medium mb-4">{formatPrice(product.price, country)}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  ADD TO CART
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-[4/3] overflow-hidden group">
              <Image
                src="https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Luxury Sets"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                <h3 className="text-2xl font-light mb-4">LUXURY DISCOVERY SETS</h3>
                <p className="text-lg">Experience our finest fragrances in beautifully curated collections.</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden group">
              <Image
                src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Gift Sets"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                <h3 className="text-2xl font-light mb-4">PERFECT GIFTS</h3>
                <p className="text-lg">Discover the perfect gift set for your loved ones.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center bg-gray-50 py-16 px-4"
        >
          <h2 className="text-2xl font-light mb-4">JOIN OUR NEWSLETTER</h2>
          <p className="text-gray-600 mb-6">Subscribe to receive updates about new collections and exclusive offers.</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              SUBSCRIBE
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 