"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  ChevronDown,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "@/context/CartContext";
import { useCountry } from "@/hooks/useCountry";
import { getPrice } from "@/lib/priceUtils";
import LazyLoader from "@/components/ui/LazyLoader";
import ProductImage from "@/components/ui/ProductImage";
import NotFound from "../../not-found";
import Footer from "@/components/Footer";
import ProductReviews from "@/components/ProductReviews";

const DEFAULT_SIZES = [
  { label: "25 mL", value: 25, priceFactor: 0.25 },
  { label: "50 mL", value: 50, priceFactor: 0.5 },
  { label: "100 mL", value: 100, priceFactor: 1 },
];

interface AccordionSection {
  label: string;
  content: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(2); // default 100 mL
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("Description");
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { country } = useCountry();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const currentId = product._id || product.id;
        setRelatedProducts(
          (Array.isArray(data) ? data : [])
            .filter((p: any) => (p._id || p.id) !== currentId)
            .slice(0, 4)
        );
      } catch {
        setRelatedProducts([]);
      }
    };
    fetchRelated();
  }, [product]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LazyLoader />
      </div>
    );
  if (error || !product) return <NotFound />;

  const images: string[] = [
    product.image,
    product.imageHover,
    ...(product.galleryImages || []),
  ].filter(Boolean);
  const mainImage = images[selectedImageIndex] || images[0];

  const basePrice = Math.round(
    product.price * DEFAULT_SIZES[selectedSizeIndex].priceFactor
  );
  const { symbol, value: displayPrice } = getPrice(basePrice, country);

  const sections: AccordionSection[] = [
    { label: "Description", content: product.description },
    ...(product.olfactoryNotes
      ? [{ label: "Olfactory Notes", content: product.olfactoryNotes }]
      : []),
    ...(product.perfumersWord
      ? [{ label: "Perfumer's Word", content: product.perfumersWord }]
      : []),
    ...(product.knowHow ? [{ label: "Know How", content: product.knowHow }] : []),
    ...(product.applicationTips
      ? [{ label: "Application Tips", content: product.applicationTips }]
      : []),
  ];

  const inStock = product.stock === undefined || product.stock > 0;
  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async () => {
    const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("userInfo");
    setIsAdding(true);
    try {
      await addToCart({
        id: product._id || product.id || params.id,
        name: product.name,
        price: displayPrice,
        image: product.image,
        quantity,
        size: DEFAULT_SIZES[selectedSizeIndex].label,
        category: product.category,
        description: product.description,
      });
      // addToCart shows its own success/error toast; only celebrate if we
      // were actually logged in (otherwise it just opened the login modal).
      if (isLoggedIn) {
        confetti({
          particleCount: 60,
          spread: 65,
          origin: { y: 0.7 },
          colors: ["#bfa14a", "#fffbe6", "#f7e7b4", "#111"],
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop/all" className="hover:text-gray-900 transition-colors">
            {product.category || "Fragrance"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 truncate max-w-[160px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ─── Gallery ─── */}
          <div>
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <ProductImage
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 border-2 transition-colors flex-shrink-0 ${
                      selectedImageIndex === idx ? "border-[#bfa14a]" : "border-gray-100 hover:border-gray-300"
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <ProductImage src={img} alt="" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Info Panel ─── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {product.category && (
              <p className="text-xs font-semibold uppercase tracking-widest text-[#bfa14a] mb-2">
                {product.category}
              </p>
            )}
            <h1
              className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2 leading-tight"
              style={{ fontFamily: "Didot, serif" }}
            >
              {product.name}
            </h1>
            {product.subtitle && (
              <p className="text-sm text-gray-500 mb-4">{product.subtitle}</p>
            )}

            {typeof product.reviews === "number" && product.reviews > 0 && (
              <div className="flex items-center gap-1.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                ))}
                <span className="text-sm text-gray-500">
                  ({product.reviews} review{product.reviews === 1 ? "" : "s"})
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-semibold text-gray-900">
                {symbol}{displayPrice}
              </span>
              {!inStock ? (
                <span className="text-sm font-medium text-red-600">Out of stock</span>
              ) : lowStock ? (
                <span className="text-sm font-medium text-amber-600">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-sm font-medium text-emerald-600">In stock</span>
              )}
            </div>

            {/* Size */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2.5">Size</p>
              <div className="flex gap-2.5">
                {DEFAULT_SIZES.map((size, idx) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      selectedSizeIndex === idx
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2.5">Quantity</p>
              <div className="inline-flex items-center border border-gray-300 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30"
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || !inStock}
              className="w-full bg-gradient-to-r from-[#bfa14a] to-[#9c7e33] hover:from-[#cfb25a] hover:to-[#bfa14a] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg h-13 py-3.5 shadow-lg shadow-[#bfa14a]/10 hover:shadow-[#bfa14a]/20 transition-all flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : !inStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-[11px] text-gray-500 leading-tight">Free shipping over ₹2,000</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-[11px] text-gray-500 leading-tight">100% authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <span className="text-[11px] text-gray-500 leading-tight">30-day returns</span>
              </div>
            </div>

            {/* Accordion */}
            <div className="mt-8 space-y-2.5">
              {sections.map((section) => (
                <div key={section.label} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenSection(openSection === section.label ? null : section.label)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#bfa14a] flex-shrink-0 transition-transform ${
                        openSection === section.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openSection === section.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center"
              style={{ fontFamily: "Didot, serif" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p._id || p.id}
                  href={`/product/${p._id || p.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                    <ProductImage
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#bfa14a] transition-colors truncate">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getPrice(p.price, country).symbol}{getPrice(p.price, country).value}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <ProductReviews />
      <Footer />
    </div>
  );
}
