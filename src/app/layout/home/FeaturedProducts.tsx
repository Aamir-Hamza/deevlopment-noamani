"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useCountry } from "@/hooks/useCountry";
import { formatPrice } from "@/lib/priceUtils";
import LazyLoader from "@/components/ui/LazyLoader";
import ProductQuickViewModal from "@/app/components/ProductQuickViewModal";

const bundles = [
  {
    id: 1,
    name: "Oriental oud",
    description: "Experience our signature scents",
    price: 85,
    image: "/newproduct.png",
    imageHover: "/planebox-remove.png",
  },
  {
    id: 2,
    name: "Northern lights",
    description: "Perfect gift collection",
    price: 150,
    image: "/productnew.png",
    imageHover: "/planebox-remove.png",
  },
];

const features = [
  "Noamani Fragrance: Crafted for Connoisseurs",
  "Signature Scents, Unforgettable Impressions",
  "Experience Pure Luxury in Every Bottle",
  "Artistry, Elegance, and Distinction",
  "Where Passion Meets Perfumery",
  "Elevate Your Senses with Noamani"
];

const defaultSizes = [
  { label: "25 mL", value: 25, priceFactor: 0.25 },
  { label: "50 mL", value: 50, priceFactor: 0.5 },
  { label: "100 mL", value: 100, priceFactor: 1 },
];

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const allProductsScrollRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { country, setCountry } = useCountry();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(3);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        console.log("Fetched products:", data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Responsive items per page
  useEffect(() => {
    const updatePerPage = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setProductsPerPage(1);
      } else if (width < 1024) {
        setProductsPerPage(2);
      } else {
        setProductsPerPage(3);
      }
    };
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, []);

  useEffect(() => {
    setIsClient(true);
    const selected = localStorage.getItem("selectedCountry") || "IN";
    setCountry(selected);
  }, [setCountry]);

  const getPrice = (basePrice: number) => {
    switch (country) {
      case "EU":
        return { symbol: "€", value: Math.round(basePrice * 0.012) };
      case "US":
        return { symbol: "$", value: Math.round(basePrice * 0.013) };
      case "ME":
        return { symbol: "د.إ", value: Math.round(basePrice * 0.048) };
      case "IN":
      default:
        return { symbol: "₹", value: basePrice };
    }
  };

  // Pagination functions
  const getCurrentProducts = () => {
    const startIndex = currentPage * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  };

  const totalPages = Math.ceil(products.length / productsPerPage) || 1;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleAddToCart = (product: any) => {
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price.replace("$", ""))
        : product.price;
    addToCart({
      id: product.id?.toString() || product._id,
      name: product.name,
      price: price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleViewDetails = (product: any, indexInSlice?: number) => {
    const slice = getCurrentProducts();
    const index = typeof indexInSlice === 'number' ? indexInSlice : slice.findIndex((p: any) => (p._id || p.id) === (product._id || product.id));
    setQuickViewIndex(index >= 0 ? index : 0);
    setQuickViewProduct({
      ...product,
      basePrice: product.basePrice || product.price || 0,
      sizes: product.sizes || defaultSizes,
    });
    setShowQuickView(true);
  };

  const handleModalPrev = () => {
    if (quickViewIndex === null) return;
    const slice = getCurrentProducts();
    const newIndex = (quickViewIndex - 1 + slice.length) % slice.length;
    const nextProduct = slice[newIndex];
    setQuickViewIndex(newIndex);
    setQuickViewProduct({
      ...nextProduct,
      basePrice: nextProduct.basePrice || nextProduct.price || 0,
      sizes: nextProduct.sizes || defaultSizes,
    });
  };

  const handleModalNext = () => {
    if (quickViewIndex === null) return;
    const slice = getCurrentProducts();
    const newIndex = (quickViewIndex + 1) % slice.length;
    const nextProduct = slice[newIndex];
    setQuickViewIndex(newIndex);
    setQuickViewProduct({
      ...nextProduct,
      basePrice: nextProduct.basePrice || nextProduct.price || 0,
      sizes: nextProduct.sizes || defaultSizes,
    });
  };

  const scroll = (
    direction: "left" | "right",
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (ref.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        ref.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      ref.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Bestsellers Section */}
      <div className="py-10 sm:py-14 md:py-16">
        <div className="max-w-[1200px] lg:max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 sm:gap-4 text-3xl sm:text-4xl md:text-5xl font-light text-center mb-4 sm:mb-6 text-black drop-shadow-lg"
            style={{ fontFamily: 'Didot, serif', letterSpacing: 2 }}
          >
            <span>All Products</span>
            <span className="luxury-icon group relative">
              <img src="/icon/perfume.gif" alt="All Products Icon" className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />
            </span>
          </motion.h2>
          <div className="flex justify-center mb-12">
            <div className="h-1 w-16 sm:w-24 rounded-full bg-black shadow-md" />
          </div>

          <div className="relative px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Left navigation button */}
            <button
              onClick={prevPage}
              className="flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-hidden gap-4 sm:gap-6 md:gap-8 lg:gap-10 pb-6 justify-center transition-all duration-300"
              style={{ 
                maxWidth: "100%",
                margin: "0 auto"
              }}
            >
              {loading ? (
                <div className="w-full flex justify-center items-center h-40 text-lg">
                  <LazyLoader />
                </div>
              ) : products.length === 0 ? (
                <div className="w-full flex justify-center items-center h-40 text-lg">
                  No products found.
                </div>
              ) : (
                getCurrentProducts().map((product: any, index: number) => (
                  <motion.div
                    key={`${product._id || product.id || "product"}-${index}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.6,
                      type: "spring",
                    }}
                    className="flex-none w-[230px] sm:w-[260px] md:w-[280px] group px-1 sm:px-2 mx-1"
                  >
                    <div
                      className="relative aspect-[2/3] bg-gradient-to-br from-pink-100 to-blue-100 overflow-hidden mb-4 rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                      onClick={() => handleViewDetails(product, index)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        priority={index < 2}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className={`object-contain rounded-2xl transition-opacity duration-500 ${
                          product.imageHover ? "group-hover:opacity-0" : ""
                        }`}
                      />
                      {product.imageHover && (
                        <Image
                          src={product.imageHover}
                          alt={product.name + " hover"}
                          fill
                          unoptimized
                          priority={false}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain rounded-2xl absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 rounded-2xl" />
                      {product.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-black/80 text-white px-3 py-1 text-xs rounded-full shadow">
                            {product.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors duration-300" style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}>
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {product.subtext}
                      </p>
                      <p className="text-lg sm:text-xl font-extrabold text-pink-600 mb-2">
                        {isClient && typeof product.price === "number"
                          ? `${getPrice(product.price).symbol}${
                              getPrice(product.price).value
                            }`
                          : "..."}
                      </p>
                    </div>
                    <motion.div
                      className="mt-4"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-[85%] sm:w-[80%] mx-auto bg-black text-white py-1.5 text-xs sm:text-sm rounded-full font-semibold shadow-lg hover:bg-gray-800 transition-colors duration-200"
                        style={{ display: 'block' }}
                      >
                        Add to Cart
                      </button>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </div>
            {/* Right navigation button */}
            <button
              onClick={nextPage}
              className="flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* Page indicators (show max 3 dots at a time) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {(() => {
                const windowSize = 3;
                const half = Math.floor(windowSize / 2);
                let start = Math.max(0, currentPage - half);
                let end = Math.min(totalPages - 1, start + windowSize - 1);
                // If we don't have enough at the end, shift start back
                start = Math.max(0, end - windowSize + 1);
                const pages = [] as number[];
                for (let i = start; i <= end; i += 1) pages.push(i);
                return pages.map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                      currentPage === index ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Large Perfume Image Section */}
      <div className="relative h-[360px] sm:h-[480px] md:h-[600px] w-full overflow-hidden">
        <Image
          src="/Home/Home-center.jpg"
          alt="Luxury Perfume"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-5xl font-light mb-2 sm:mb-4 text-center px-4"
            style={{ fontFamily: 'Didot, serif' }}
          >
            Discover Your Signature Scent
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-xl mb-4 sm:mb-8 px-4 text-center"
          >
            Explore our collection of luxury fragrances
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 transition-colors text-sm"
          >
            Shop Now
          </motion.button>
        </div>
      </div>

      {/* Features Banner */}
      <div className="py-6 sm:py-8 bg-gray-50 overflow-hidden">
        <div className="flex items-center justify-start gap-4 animate-scroll">
          {features.concat(features).map((feature, index) => (
            <span
              key={index}
              className="text-gray-600 whitespace-nowrap text-xs sm:text-sm"
            >
              {feature} <span className="mx-4">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bundles Section */}
      {/*
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-light text-center mb-12"
            >
              LUXURY BUNDLES
            </motion.h2>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {bundles.map((bundle, index) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={bundle.image}
                      alt={bundle.name}
                      layout="fill"
                      objectFit="contain"
                      className={`transition-opacity duration-700 ease-in-out ${
                        bundle.imageHover ? "group-hover:opacity-0" : ""
                      }`}
                    />
                    {bundle.imageHover && (
                      <Image
                        src={bundle.imageHover}
                        alt={`${bundle.name} hover`}
                        layout="fill"
                        objectFit="contain"
                        className="opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                      />
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold">{bundle.name}</h3>
                    <p className="text-gray-500 mb-4">{bundle.description}</p>
                    <p className="text-lg font-medium text-gray-900 mb-4">
                      {formatPrice(bundle.price, country)}
                    </p>
                    <motion.button
                      className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(bundle)}
                    >
                      SHOP NOW
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      */}

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        open={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={quickViewProduct}
        onPrev={handleModalPrev}
        onNext={handleModalNext}
      />

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: flex;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .luxury-icon svg {
          filter: drop-shadow(0 2px 8px #ffe08280);
        }
        .luxury-icon:hover svg {
          animation: luxury-bounce 0.7s;
        }
        @keyframes luxury-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px) scale(1.1); }
          60% { transform: translateY(2px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
