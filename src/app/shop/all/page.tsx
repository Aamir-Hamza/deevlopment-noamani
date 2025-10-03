"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';
import { useCart } from '@/context/CartContext';
import ProductQuickViewModal from '@/app/components/ProductQuickViewModal';
import LazyLoader from '@/components/ui/LazyLoader';

export default function AllProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const countryObj = useCountry();
  const country = typeof countryObj === 'string' ? countryObj : countryObj.country;
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    document.body.classList.add('all-products-navbar-black');
    return () => {
      document.body.classList.remove('all-products-navbar-black');
    };
  }, []);

  const handleQuickView = (product: any, index?: number) => {
    const idx = typeof index === 'number' ? index : products.findIndex((p) => (p._id || p.id) === (product._id || product.id));
    setSelectedIndex(idx >= 0 ? idx : 0);
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handlePrev = () => {
    if (selectedIndex === null || products.length === 0) return;
    const newIndex = (selectedIndex - 1 + products.length) % products.length;
    setSelectedIndex(newIndex);
    setSelectedProduct(products[newIndex]);
  };

  const handleNext = () => {
    if (selectedIndex === null || products.length === 0) return;
    const newIndex = (selectedIndex + 1) % products.length;
    setSelectedIndex(newIndex);
    setSelectedProduct(products[newIndex]);
  };

  const handleAddToCart = async (product: any) => {
    await addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LazyLoader /></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] bg-gradient-to-br from-yellow-50 via-pink-50 to-white flex items-center justify-center pt-24 md:pt-32"
      >
        <Image
          src="/newproduct-removebg-preview.png"
          alt="All Products Hero"
          fill
          className="object-contain opacity-10"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-extrabold mb-6 text-yellow-600 drop-shadow-lg"
          >
            ALL PRODUCTS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light text-gray-700 mb-2"
          >
            Discover the complete Noamani collection. Every product is crafted with passion, luxury, and a touch of artistry—designed to elevate your senses and style. Explore our full range and find your new signature.
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg font-bold text-pink-600"
          >
            Total Products: {products.length}
          </motion.p>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product._id || product.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4"
              >
                <a href={`/product/${product._id || product.id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 cursor-pointer rounded-xl border border-gray-100 bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.subtext}</p>
                  <p className="text-xl font-extrabold text-pink-600 mb-2">
                    {typeof product.price === 'number'
                      ? formatPrice(product.price, country)
                      : product.price}
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(product.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current text-yellow-400"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>
                  </div>
                </a>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleQuickView(product, index)}
                      className="flex-1 bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-full"
                    >
                    Quick View
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 text-sm font-bold rounded-full shadow-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <ProductQuickViewModal open={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} product={selectedProduct} onPrev={handlePrev} onNext={handleNext} />
    </div>
  );
} 