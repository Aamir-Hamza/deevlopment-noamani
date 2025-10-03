"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Filter, Star, ChevronDown, ShoppingCart } from "lucide-react";
import { useCountry } from "@/hooks/useCountry";
import { formatPrice } from "@/lib/priceUtils";
import { useCart } from "@/context/CartContext";
import ProductQuickViewModal from "@/app/components/ProductQuickViewModal";
import { toast } from "react-hot-toast";
import { Product } from "@/types/product";
import LazyLoader from "@/components/ui/LazyLoader";
import Footer from '@/components/Footer';

const categories = ["All", "Floral", "Fresh", "Oriental", "Sets"];
const sortOptions = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Most Popular",
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { country } = useCountry();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?page=Shop All");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuickView = (product: Product, index?: number) => {
    const idx = typeof index === 'number' ? index : products.findIndex((p) => (p as any)._id === (product as any)._id || p.id === product.id);
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

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent the quick view from opening
    try {
      // Convert price to number if it's a string
      const price =
        typeof product.price === "string"
          ? parseFloat((product.price as string).replace(/[^0-9.-]+/g, ""))
          : product.price;

      await addToCart({
        id: product.id,
        name: product.name,
        price: price,
        image: product.image,
        quantity: 1,
      });
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === "All" || product.category === selectedCategory
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LazyLoader />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

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
          src="https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Shop Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-light mb-6"
            style={{ fontFamily: 'Didot, serif' }}
          >
            SHOP ALL
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Explore our complete collection of luxury fragrances
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 mb-4 md:mb-0"
          >
            <Filter className="w-5 h-5" />
            <span>Filter & Sort</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm ${
                      selectedCategory === category
                        ? "bg-black text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-2 border border-gray-200 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => {
            console.log('PRODUCT_DEBUG:', product);
            return (
              <Link href={`/product/${product.slug || product._id || product.id}`} key={product.slug || product._id || product.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 hover:-translate-y-1 cursor-pointer"
            >
              {product.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-black/80 text-white px-4 py-1 rounded-full text-xs tracking-wider shadow">
                  NEW
                </div>
              )}
              <div className="relative aspect-[3/4] flex flex-col items-center justify-center mb-4" onClick={() => handleQuickView(product, index)}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                />
              </div>
              <div className="text-center">
                <h3 className="font-didot font-bold text-lg mb-1 text-gray-900">{product.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[...Array(product.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    ({(product.reviews || 0).toLocaleString()} reviews)
                  </span>
                </div>
                <p className="text-xl font-extrabold text-pink-600 mb-4">{formatPrice(product.price, country)}</p>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-[80%] bg-black text-white py-2 text-sm rounded-full font-semibold shadow hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
            </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl font-light mb-6">
            NOT SURE WHICH FRAGRANCE TO CHOOSE?
          </h3>
          <Link
            href="/quiz"
            className="inline-block bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            TAKE THE QUIZ
          </Link>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <Footer />
    </div>
  );
}
