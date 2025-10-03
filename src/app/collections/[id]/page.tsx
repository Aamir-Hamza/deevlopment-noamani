'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { products } from '@/data/products'
import { useCart } from '@/context/CartContext'

export default function CollectionPage() {
  const params = useParams()
  const { addToCart } = useCart()
  
  // Find collection products based on the collection ID
  const getCollectionProducts = () => {
    switch (params?.id) {
      case 'summer-2024':
        return products.filter(p => ['Jo Malone London', 'Marc Jacobs Daisy'].includes(p.name))
      case 'luxury':
        return products.filter(p => ['Tom Ford Black Orchid', 'Creed Aventus'].includes(p.name))
      case 'classics':
        return products.filter(p => ['Chanel N°5', 'Dior Sauvage'].includes(p.name))
      case 'spring':
        return products.filter(p => p.category === 'Women')
      case 'summer':
        return products.filter(p => p.category === 'Unisex')
      case 'fall':
        return products.filter(p => p.category === 'Men')
      case 'winter':
        return products.filter(p => ['Creed Aventus', 'Tom Ford Black Orchid', 'Bleu de Chanel'].includes(p.name))
      default:
        return []
    }
  }

  const collectionProducts = getCollectionProducts()
  
  const getCollectionTitle = () => {
    switch (params?.id) {
      case 'summer-2024':
        return 'Summer 2024 Collection'
      case 'luxury':
        return 'Luxury Collection'
      case 'classics':
        return 'Timeless Classics'
      case 'spring':
        return 'Spring Florals'
      case 'summer':
        return 'Summer Fresh'
      case 'fall':
        return 'Fall Warmth'
      case 'winter':
        return 'Winter Comfort'
      default:
        return 'Collection'
    }
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-[32px] mb-4">{getCollectionTitle()}</h1>
            <p className="text-[15px] text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of fragrances for this collection.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {collectionProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-[15px] mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[15px]">${product.price}</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[15px] text-black hover:text-gray-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 