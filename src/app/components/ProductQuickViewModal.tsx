import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
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

export default function ProductQuickViewModal({ open, onClose, product }: ProductQuickViewModalProps) {
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200/80 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-0 flex flex-col md:flex-row overflow-hidden border border-gray-200"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Product Image */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-8">
              <div className="relative w-72 h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
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
            <div className="md:w-1/2 w-full p-10 flex flex-col justify-center relative">
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors z-10"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-4xl font-serif font-extrabold mb-4 text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-black tracking-wide">
                  {formatPrice(getPrice(), country)}
                </span>
                <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {selectedSize.label}
                </span>
              </div>
              {/* ml selection */}
              <div className="flex gap-2 mb-6">
                {sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 rounded-full border text-base font-medium transition-colors shadow-sm ${selectedSize.label === size.label ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-200'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              {product.description && (
                <p className="text-gray-700 mb-6 text-lg leading-relaxed font-light">
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
              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg text-lg"
                >
                  Add to Cart
                </button>
                  <Link
                  href={`/product/${product.slug || product.id}`}
                    className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-pink-600 transition-colors shadow-lg text-lg"
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