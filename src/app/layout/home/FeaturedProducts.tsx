"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useCountry } from "@/hooks/useCountry";
import { formatPrice } from "@/lib/priceUtils";
import LazyLoader from "@/components/ui/LazyLoader";
import EmptyState from "@/components/ui/EmptyState";
import ProductQuickViewModal from "@/app/components/ProductQuickViewModal";
import { useTranslation } from "react-i18next";

type SizeOption = { label: string; value: number; priceFactor: number };
type ProductItem = {
  id?: string;
  _id?: string;
  name: string;
  price?: number | string;
  basePrice?: number;
  image: string;
  imageHover?: string;
  category?: string;
  subtext?: string;
  sizes?: SizeOption[];
  slug?: string;
};

type QuickViewProduct = {
  id: string;
  name: string;
  price?: number;
  basePrice?: number;
  image: string;
  description?: string;
  notes?: { top?: string; heart?: string; base?: string };
  href?: string;
  sizes?: SizeOption[];
  slug?: string;
};

const defaultSizes = [
  { label: "25 mL", value: 25, priceFactor: 0.25 },
  { label: "50 mL", value: 50, priceFactor: 0.5 },
  { label: "100 mL", value: 100, priceFactor: 1 },
];

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCountry, countryData } = useCountry();
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);
  const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
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
      if (width < 640) setProductsPerPage(1);
      else if (width < 1024) setProductsPerPage(2);
      else if (width < 1280) setProductsPerPage(3);
      else setProductsPerPage(4);
    };
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  useEffect(() => {
    setIsClient(true);
    const selected = localStorage.getItem("selectedCountry") || "IN";
    setCountry(selected);
  }, [setCountry]);

  const coercePriceToNumber = (value?: number | string): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9.]/g, "");
      const parsed = parseFloat(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const getCurrentProducts = (): ProductItem[] => {
    const startIndex = currentPage * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  };

  const totalPages = Math.ceil(products.length / productsPerPage) || 1;

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const handleAddToCart = (product: ProductItem) => {
    const price =
      typeof product.price === "string" ? parseFloat(product.price.replace("$", "")) : product.price;
    addToCart({
      id: (product.id ?? product._id ?? "").toString(),
      name: product.name,
      price: price || 0,
      image: product.image,
      quantity: 1,
    });
  };

  const handleViewDetails = (product: ProductItem, indexInSlice?: number) => {
    const slice = getCurrentProducts();
    const index =
      typeof indexInSlice === "number"
        ? indexInSlice
        : slice.findIndex((p) => (p._id || p.id) === (product._id || product.id));
    setQuickViewIndex(index >= 0 ? index : 0);
    setQuickViewProduct({
      id: (product.id ?? product._id ?? "").toString(),
      name: product.name,
      image: product.image,
      slug: product.slug,
      description: product.subtext,
      basePrice: coercePriceToNumber(product.basePrice ?? product.price),
      sizes: product.sizes || defaultSizes,
    });
    setShowQuickView(true);
  };

  const handleModalPrev = () => {
    if (quickViewIndex === null) return;
    const slice = getCurrentProducts();
    const newIndex = (quickViewIndex - 1 + slice.length) % slice.length;
    const nextProduct = slice[newIndex];
    if (!nextProduct) return;
    setQuickViewIndex(newIndex);
    setQuickViewProduct({
      id: (nextProduct.id ?? nextProduct._id ?? "").toString(),
      name: nextProduct.name,
      image: nextProduct.image,
      slug: nextProduct.slug,
      description: nextProduct.subtext,
      basePrice: coercePriceToNumber(nextProduct.basePrice ?? nextProduct.price),
      sizes: nextProduct.sizes || defaultSizes,
    });
  };

  const handleModalNext = () => {
    if (quickViewIndex === null) return;
    const slice = getCurrentProducts();
    const newIndex = (quickViewIndex + 1) % slice.length;
    const nextProduct = slice[newIndex];
    if (!nextProduct) return;
    setQuickViewIndex(newIndex);
    setQuickViewProduct({
      id: (nextProduct.id ?? nextProduct._id ?? "").toString(),
      name: nextProduct.name,
      image: nextProduct.image,
      slug: nextProduct.slug,
      description: nextProduct.subtext,
      basePrice: coercePriceToNumber(nextProduct.basePrice ?? nextProduct.price),
      sizes: nextProduct.sizes || defaultSizes,
    });
  };

  return (
    <div className="bg-white">
      {/* ─── Bestsellers Carousel ─── */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bfa14a] mb-3">
              {t('home.curatedKicker')}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light" style={{ fontFamily: "Didot, serif" }}>
              {t('home.bestsellingFragrances')}
            </h2>
          </motion.div>

          <div className="relative">
            {totalPages > 1 && (
              <button
                onClick={prevPage}
                className="hidden sm:flex absolute -left-4 lg:-left-6 top-[38%] -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:border-gray-900 transition-colors"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LazyLoader />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title={t('shop.noProductsFound')}
                subtitle={t('shop.noProductsSubtitle')}
                ctaLabel={t('shop.browseBestsellers')}
                ctaHref="/bestsellers"
              />
            ) : (
              <div
                ref={scrollContainerRef}
                className="grid gap-6 sm:gap-8"
                style={{ gridTemplateColumns: `repeat(${productsPerPage}, minmax(0, 1fr))` }}
              >
                {getCurrentProducts().map((product, index) => (
                  <motion.div
                    key={`${product._id || product.id || "product"}-${currentPage}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="group"
                  >
                    <div
                      className="relative aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden mb-4 rounded-2xl cursor-pointer"
                      onClick={() => handleViewDetails(product, index)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        priority={index < 2}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className={`object-contain p-6 transition-opacity duration-500 ${
                          product.imageHover ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform"
                        }`}
                      />
                      {product.imageHover && (
                        <Image
                          src={product.imageHover}
                          alt={`${product.name} alternate view`}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain p-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                      {product.category && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full shadow-sm">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-medium text-gray-900 mb-1 group-hover:text-[#bfa14a] transition-colors">
                        {product.name}
                      </h3>
                      {product.subtext && (
                        <p className="text-xs text-gray-500 mb-2 truncate">{product.subtext}</p>
                      )}
                      <p className="text-lg font-semibold text-gray-900 mb-3">
                        {isClient && typeof product.price === "number" ? formatPrice(product.price, countryData?.currency) : "…"}
                      </p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-black text-white py-2 text-xs font-semibold uppercase tracking-wide rounded-full hover:bg-gray-800 transition-colors"
                      >
                        {t('common.addToCart')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <button
                onClick={nextPage}
                className="hidden sm:flex absolute -right-4 lg:-right-6 top-[38%] -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:border-gray-900 transition-colors"
                aria-label="Next products"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10 sm:hidden">
              <button
                onClick={prevPage}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentPage === i ? "bg-gray-900" : "bg-gray-300"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextPage}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300"
                aria-label="Next products"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}

          <div className="text-center mt-14">
            <Link
              href="/shop/all"
              className="inline-block border border-gray-900 text-gray-900 px-10 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors rounded-full"
            >
              {t('home.viewAllProducts')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Full-bleed CTA banner ─── */}
      <div className="relative h-[420px] sm:h-[480px] md:h-[560px] w-full overflow-hidden">
        <Image src="/Home/Home-center.jpg" alt="Luxury Perfume" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 text-center"
            style={{ fontFamily: "Didot, serif" }}
          >
            {t('home.discoverSignatureScent')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg mb-8 text-center max-w-md text-white/85"
          >
            {t('home.exploreCollection')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/shop"
              className="inline-block bg-white text-black px-9 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm font-semibold uppercase tracking-wide"
            >
              {t('common.shopNow')}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ─── Fragrance Quiz CTA ─── */}
      <section className="py-16 sm:py-20 bg-[#faf8f4]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-[#bfa14a] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-light mb-3" style={{ fontFamily: "Didot, serif" }}>
            {t('home.quizCtaTitle')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('home.quizCtaSubtitle')}
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-black text-white px-10 py-3.5 text-sm font-semibold uppercase tracking-wide rounded-full hover:bg-gray-800 transition-colors"
          >
            {t('home.takeTheQuiz')}
          </Link>
        </div>
      </section>

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        open={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={quickViewProduct}
        onPrev={handleModalPrev}
        onNext={handleModalNext}
      />
    </div>
  );
}
