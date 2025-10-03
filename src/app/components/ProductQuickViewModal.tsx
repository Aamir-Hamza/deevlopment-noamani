import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/priceUtils';
import { useCountry } from '@/hooks/useCountry';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductQuickViewModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price?: number;
    basePrice?: number;
    image: string;
    description?: string;
    notes?: { top?: string; heart?: string; base?: string };
    href?: string;
    sizes?: { label: string; value: number; priceFactor: number }[];
    slug?: string; // Added slug to the product interface
  } | null;
  onPrev?: () => void;
  onNext?: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  exit: { opacity: 0, y: 40, scale: 0.98, transition: { duration: 0.2 } },
};

const defaultSizes = [
  { label: "25 mL", value: 25, priceFactor: 0.25 },
  { label: "50 mL", value: 50, priceFactor: 0.5 },
  { label: "100 mL", value: 100, priceFactor: 1 },
];

export default function ProductQuickViewModal({ open, onClose, product, onPrev, onNext }: ProductQuickViewModalProps) {
  const country = useCountry();
  const { addToCart } = useCart();
  const sizes = product?.sizes || defaultSizes;
  const basePrice = product?.basePrice || product?.price || 0;
  const [selectedSize, setSelectedSize] = useState(sizes[2]); // default 100ml

  useEffect(() => {
    setSelectedSize(sizes[2]);
  }, [product]);

  if (!product) return null;

  const getPrice = () => {
    return Math.round(basePrice * selectedSize.priceFactor);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: `${product.name} (${selectedSize.label})`,
        price: getPrice(),
        image: product.image,
        quantity: 1,
        size: selectedSize.label,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200/80 backdrop-blur-sm p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full sm:w-[90vw] p-0 flex flex-col md:flex-row overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Prev / Next Controls */}
            {onPrev && (
              <button
                aria-label="Previous product"
                onClick={onPrev}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white focus:outline-none"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
            )}
            {onNext && (
              <button
                aria-label="Next product"
                onClick={onNext}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white focus:outline-none"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            )}

            {/* Product Image */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 md:p-8">
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            {/* Product Details */}
            <div className="md:w-1/2 w-full p-6 sm:p-8 md:p-10 flex flex-col justify-center relative">
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors z-10"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              {/* Mobile Prev/Next */}
              <div className="md:hidden absolute -top-5 left-0 right-0 flex justify-between px-4">
                {onPrev && (
                  <button
                    aria-label="Previous product"
                    onClick={onPrev}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                )}
                {onNext && (
                  <button
                    aria-label="Next product"
                    onClick={onNext}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold mb-4 text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl sm:text-2xl font-bold text-black tracking-wide">
                  {formatPrice(getPrice(), country)}
                </span>
                <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {selectedSize.label}
                </span>
              </div>
              {/* ml selection */}
              <div className="flex flex-wrap gap-2 mb-6">
                {sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 sm:px-5 py-2 rounded-full border text-sm sm:text-base font-medium transition-colors shadow-sm ${selectedSize.label === size.label ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-200'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              {product.description && (
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed font-light">
                  {product.description}
                </p>
              )}
              {product.notes && (
                <ul className="mb-6 space-y-1 text-base">
                  {product.notes.top && <li><span className="font-semibold text-gray-900">Top Notes:</span> {product.notes.top}</li>}
                  {product.notes.heart && <li><span className="font-semibold text-gray-900">Heart Notes:</span> {product.notes.heart}</li>}
                  {product.notes.base && <li><span className="font-semibold text-gray-900">Base Notes:</span> {product.notes.base}</li>}
                </ul>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg text-base sm:text-lg"
                >
                  Add to Cart
                </button>
                  <Link
                  href={`/product/${product.slug || product.id}`}
                    className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-pink-600 transition-colors shadow-lg text-base sm:text-lg text-center"
                  >
                    View Details
                  </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 