"use client";

import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import LazyLoader from "@/components/ui/LazyLoader";
import NotFound from "../../not-found";
import Footer from '@/components/Footer';
import { useInView } from 'react-intersection-observer';
import confetti from 'canvas-confetti';
import Tilt from 'react-parallax-tilt';
import React from 'react';
import ProductReviews from '@/components/ProductReviews';

const TiltWrapper = (props: any) => <Tilt {...props} />;

const demoProduct = {
  name: "Noamani-p1",
  subtitle: "Parfum - Citrus and Woody Notes - Refillable",
  price: 80,
  sizes: [
    { label: "30 mL", value: 30, price: 40 },
    { label: "60 mL", value: 60, price: 60 },
    { label: "100 mL", value: 100, price: 80 },
    { label: "200 mL", value: 200, price: 120 },
  ],
  image: "/logo.png",
  images: [
    "/logo.png",
    "/productall.png",
    "/productnew.png",
    "/product1.jpg",
  ],
  description:
    "Noamani-p1 is a highly concentrated interpretation, melding extreme freshness with warm ambery tones and an animal beauty that begs to come alive on the skin. To compose Noamani-p1, inspiration is drawn from a wild, unspoiled expanse beneath a blue-tinged night sky, as the intense odors of a crackling fire rise into the air. Its trail unfurls notes of mandarin, tonka bean and sandalwood.\n\nNoamani-p1 is the fragrance of a new frontier, an interpretation with an enriched and intoxicating trail that celebrates the magic of wide-open spaces.\n\nThe 30 mL and 100 mL bottles of Noamani-p1 are refillable with the Noamani refill kit. This innovative system is part of Noamani's sustainable development initiative, which aims to improve our impact on the climate, resources and waste.",
  olfactoryNotes:
    "Noamani-p1 opens with sparkling mandarin and fresh bergamot, followed by a heart of creamy tonka bean and delicate jasmine. The base is rich sandalwood and subtle musk, creating a memorable and sophisticated trail.",
  perfumersWord:
    "Noamani-p1 is crafted for those who appreciate both freshness and depth. Our perfumers blended the finest ingredients to create a scent that is both modern and timeless, perfect for making every day feel special.",
  knowHow:
    "At Noamani, we use a unique blend of traditional and modern techniques. Each ingredient is carefully selected for purity and longevity, ensuring a luxurious experience from the first spray to the last note.",
  applicationTips:
    "Spray Noamani-p1 on your wrists, neck, and behind the ears. For best results, apply after moisturizing your skin. Avoid rubbing the fragrance in, and reapply as needed to refresh the scent throughout the day.",
};

const tabs = [
  { label: "Description", key: "description" },
  { label: "Olfactory Notes", key: "olfactoryNotes" },
  { label: "Perfumer's Word", key: "perfumersWord" },
  { label: "Know How", key: "knowHow" },
  { label: "Application Tips", key: "applicationTips" },
];

// Helper for fade-in animation
const FadeInSection = ({ children, className = "" }: any) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={
        `transition-all duration-1000 ease-out transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ` + className
      }
    >
      {children}
    </div>
  );
};

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const defaultSizes = [
    { label: "25 mL", value: 25, priceFactor: 0.25 },
    { label: "50 mL", value: 50, priceFactor: 0.5 },
    { label: "100 mL", value: 100, priceFactor: 1 },
  ];
  const sizes = product?.sizes || defaultSizes;
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(2); // default 100ml
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIndex, setSelectedImageIndex] = useState(selectedSizeIndex);

  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const getPrice = () => {
    if (product?.sizes) {
      return selectedSize.price;
    }
    // fallback: scale price by factor
    return Math.round(product.price * selectedSize.priceFactor);
  };

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
    // When size changes, update main image unless user has manually selected a thumbnail
    setSelectedImageIndex(selectedSizeIndex);
  }, [selectedSizeIndex]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        <LazyLoader />
      </div>
    );
  if (error) return <NotFound />;
  if (!product) return <NotFound />;

  // Map tab key to product data, fallback to demoProduct if missing
  const tabContent: Record<string, string> = {
    description: product.description || demoProduct.description,
    olfactoryNotes: product.olfactoryNotes || demoProduct.olfactoryNotes,
    perfumersWord: product.perfumersWord || demoProduct.perfumersWord,
    knowHow: product.knowHow || demoProduct.knowHow,
    applicationTips: product.applicationTips || demoProduct.applicationTips,
  };

  // Short description for tab (first sentence)
  const shortDescription = product.description?.split(". ")[0] + ".";

  // Dior-style large images for grid
  const gridImages = [
    "/logo.png",
    "/productall.png",
    "/productnew.png",
    "/product1.jpg",
  ];

  const mainImage = (product?.images && product.images[selectedImageIndex]) || product?.image || demoProduct.image;

  return (
    <div className="min-h-screen bg-[#faf9f6] py-16 px-2 flex flex-col items-center font-sans relative overflow-x-hidden">
      <div className="w-full bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden" style={{maxWidth: '100vw', borderRadius: '32px'}}>
        {/* Left: Main Image with Thumbnails */}
        <div className="md:w-1/2 flex items-center justify-center bg-transparent p-10 min-h-[520px]">
          <div className="flex flex-row gap-4 items-center justify-center"> {/* Always side by side */}
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 mr-6"> {/* Always vertical thumbnails on the left */}
              {(product.images || []).map((img: string, idx: number) => (
                <button
                  key={img}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`border-2 rounded-xl overflow-hidden w-16 h-16 flex items-center justify-center bg-white transition-all duration-200 ${selectedImageIndex === idx ? 'border-[#bfa14a] shadow-lg' : 'border-gray-200'}`}
                  style={{ outline: selectedImageIndex === idx ? '2px solid #bfa14a' : 'none' }}
                  tabIndex={0}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} width={60} height={60} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
            {/* Main Image with 3D Tilt */}
            <TiltWrapper glareEnable={true} glareMaxOpacity={0.25} scale={1.07} transitionSpeed={1500} tiltMaxAngleX={15} tiltMaxAngleY={15} className="shadow-2xl rounded-2xl bg-transparent">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="relative w-[340px] h-[420px] rounded-3xl overflow-hidden shadow-xl bg-white">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </TiltWrapper>
          </div>
        </div>
        {/* Right: Details */}
        <div className="md:w-1/2 p-16 flex flex-col justify-center">
          <h1 className="text-5xl font-serif font-bold mb-2 text-gray-900 tracking-tight leading-tight bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-transparent bg-clip-text animate-pulse" style={{ fontFamily: 'Didot, serif', color: '#111' }}>
            {product.name}
          </h1>
          <div className="text-xl text-gray-500 mb-8 font-light">{product.subtitle}</div>
          <div className="mb-6 text-base text-gray-400">This product exists in {sizes.length} sizes</div>
          <div className="flex space-x-4 mb-8">
            {sizes.map((size: any, idx: number) => (
              <button
                key={size.label}
                className={`px-7 py-2 rounded-lg text-base font-medium border transition-all focus:outline-none shadow-sm ${
                  selectedSizeIndex === idx
                    ? "bg-white text-gray-900 border-gray-900 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                style={{ minWidth: 90 }}
                onClick={() => {
                  setSelectedSize(size);
                  setSelectedSizeIndex(idx);
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
          <div className="text-2xl font-bold text-[#b07a5a] mb-10">₹{getPrice()}</div>
          {/* Tabs */}
            <div className="mb-8">
            <div className="flex space-x-10 border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`pb-2 text-lg font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                  style={{ fontFamily: 'serif' }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-gray-800 text-lg min-h-[90px] font-light leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {activeTab === "description" ? (
                <>
                  {shortDescription}
                  <br />
                  <button
                    className="text-gray-500 underline hover:text-gray-900 mt-2 text-base font-medium"
                    onClick={() => setShowDrawer(true)}
                  >
                    See more
                  </button>
                </>
              ) : (
                tabContent[activeTab]
              )}
            </div>
          </div>
          <button
            className="w-full md:w-auto bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-white px-12 py-4 rounded-full text-lg font-bold shadow-lg hover:from-[#fffbe6] hover:to-[#bfa14a] transition-colors mb-6 mt-2 border-2 border-[#bfa14a] relative overflow-hidden"
            style={{ letterSpacing: 1 }}
            onClick={async () => {
              setIsAdding(true);
              await addToCart({
                id: product.id || params.id,
                name: product.name,
                price: getPrice(),
                image: product.image,
                quantity: 1,
                size: selectedSize.label,
                category: product.category,
                description: product.description,
              });
              setIsAdding(false);
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111']
              });
            }}
            disabled={isAdding}
          >
            <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-[#fffbe6] via-[#bfa14a] to-[#fffbe6] opacity-0 group-hover:opacity-20 transition-all duration-500 animate-shimmer"></span>
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
      {/* Animated SVG Divider */}
      {/**
      <div className="w-full flex justify-center items-center my-10">
        <svg width="180" height="24" viewBox="0 0 180 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12C30 2 60 22 90 12C120 2 150 22 178 12" stroke="#bfa14a" strokeWidth="3" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M2 12C30 2 60 22 90 12C120 2 150 22 178 12;M2 12C30 22 60 2 90 12C120 22 150 2 178 12;M2 12C30 2 60 22 90 12C120 2 150 22 178 12" dur="4s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
      */}
      {/* Enhanced Product Gallery */}
      <FadeInSection className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {(product.galleryImages && product.galleryImages.length === 4
          ? product.galleryImages
          : (product.images && product.images.length === 4 ? product.images : gridImages)
        ).map((img: string, idx: number) => (
          <TiltWrapper key={img} glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl group hover:scale-105 transition-transform duration-500 ease-in-out relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle at 60% 40%, #fffbe6 0%, #bfa14a22 80%, transparent 100%)' }}></div>
            <div className="w-full h-72 md:h-[340px] flex items-center justify-center z-10 relative">
              <Image
                src={img}
                alt={`Product grid image ${idx + 1}`}
                width={320}
                height={320}
                className="object-contain w-full h-full rounded-2xl"
                style={{ background: '#fff' }}
              />
            </div>
          </TiltWrapper>
        ))}
      </FadeInSection>
      {/* Luxury Features/Highlights Section */}
      <FadeInSection>
      <section className="w-full max-w-6xl mx-auto my-20 flex flex-col items-center text-center py-16">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-12 text-gray-900 tracking-tight relative inline-block">
          <span className="relative z-10">Why You'll Love It</span>
          <span className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full animate-pulse opacity-60" style={{zIndex:0}}></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          {[
            {icon:'💎',title:'Premium Ingredients',desc:'Crafted with the finest, globally sourced notes for a truly luxurious scent.'},
            {icon:'🕰️',title:'Long Lasting',desc:'Enjoy a fragrance that stays with you all day and into the night.'},
            {icon:'♻️',title:'Refillable Bottle',desc:'Eco-friendly, beautifully designed bottles you can refill again and again.'},
            {icon:'🌍',title:'Unisex Appeal',desc:'A scent designed to be loved by everyone, anytime, anywhere.'},
          ].map((f, i) => (
            <TiltWrapper key={f.title} glareEnable={true} glareMaxOpacity={0.15} scale={1.03} transitionSpeed={1000} tiltMaxAngleX={8} tiltMaxAngleY={8} className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden">
              <span className="text-5xl mb-4 animate-glow" style={{ textShadow: '0 0 16px #fffbe6,0 0 32px #bfa14a' }}>{f.icon}</span>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-transparent bg-clip-text animate-pulse">{f.title}</h3>
              <p className="text-gray-500 font-medium">{f.desc}</p>
            </TiltWrapper>
          ))}
        </div>
      </section>
      </FadeInSection>
      {/* Modern Olfactory/Ingredients Section */}
      {/**
      <FadeInSection>
      <section className="w-full max-w-4xl mx-auto mb-20 bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3] rounded-3xl shadow-xl p-12 flex flex-col items-center glassmorphism">
        <h2 className="text-3xl font-serif font-semibold mb-6 text-[#bfa14a] tracking-tight relative inline-block">
          <span className="relative z-10">Olfactory Notes</span>
          <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full animate-pulse opacity-60" style={{zIndex:0}}></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-start">
          <div className="flex-1">
            <p className="text-lg text-gray-700 mb-4 text-center md:text-left font-medium" style={{ maxWidth: 600 }}>{product.olfactoryNotes}</p>
            <h3 className="text-2xl font-serif font-semibold mb-2 text-gray-900">Perfumer's Word</h3>
            <p className="text-base text-gray-600 mb-4 text-center md:text-left" style={{ maxWidth: 600 }}>{product.perfumersWord}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-serif font-semibold mb-2 text-gray-900">Know How</h3>
            <p className="text-base text-gray-600 mb-4 text-center md:text-left" style={{ maxWidth: 600 }}>{product.knowHow}</p>
            <h3 className="text-2xl font-serif font-semibold mb-2 text-gray-900">Application Tips</h3>
            <p className="text-base text-gray-600 text-center md:text-left" style={{ maxWidth: 600 }}>{product.applicationTips}</p>
          </div>
        </div>
      </section>
      </FadeInSection>
      */}
      {/* Optional: Testimonials/Reviews Section */}
      {/**
      <FadeInSection>
      <section className="w-full max-w-4xl mx-auto mb-24">
        <h2 className="text-3xl font-serif font-semibold mb-8 text-gray-900 text-center relative inline-block">
          <span className="relative z-10">What Our Customers Say</span>
          <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full animate-pulse opacity-60" style={{zIndex:0}}></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0,1,2].map(i => (
            <TiltWrapper key={i} glareEnable={true} glareMaxOpacity={0.12} scale={1.02} transitionSpeed={900} tiltMaxAngleX={6} tiltMaxAngleY={6} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col items-center border-4 border-gradient-to-br from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden">
              <span className="text-3xl mb-2 animate-pulse" style={{ textShadow: '0 0 8px #fffbe6,0 0 16px #bfa14a' }}>★'.repeat(5)</span>
              <p className="text-gray-700 mb-2 font-medium">{"Absolutely stunning fragrance! Lasts all day and feels so premium.", "The bottle is gorgeous and I love that it's refillable. My new signature scent!", "Fresh, unique, and gets me compliments every time I wear it."}[i]}</p>
              <span className="text-sm text-gray-500">{"— Priya S.","— Aman K.","— Sarah M."}[i]</span>
            </TiltWrapper>
          ))}
        </div>
      </section>
      </FadeInSection>
      */}
      {/* Enhanced Noamani Range Section */}
      <FadeInSection>
      <section className="w-full max-w-7xl mx-auto mb-24 flex flex-col items-center py-14 luxury-section-bg">
        <h2 className="luxury-heading mb-10 text-center w-full relative inline-block">
          <span className="relative z-10">The Noamani Range</span>
          <span className="luxury-underline"></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-0">
          {/* Left: Text + Button */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left px-4 md:pr-12 py-8 md:py-0">
            <p className="luxury-desc mb-8 max-w-md">
              Fragrances that are <span className="luxury-highlight">powerful</span> and <span className="luxury-highlight">noble</span> all at once: choose from the crisp & raw Eau de Noamani, the mysterious & sensual Eau de Parfum, the smoldering & fierce Parfum, and the rare & intoxicating Elixir.
            </p>
            <button className="luxury-btn mt-4">Discover</button>
          </div>
          {/* Right: Image (Now Video) */}
          <div className="flex-1 flex items-center justify-center w-full">
            <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-img-frame shadow-2xl max-w-[500px] w-full rounded-[40px]">
              <video
                src="/video/pv.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="object-contain w-full h-full luxury-img rounded-2xl"
                style={{ borderRadius: '32px' }}
                poster="/newproduct-removebg-preview.png"
              />
            </TiltWrapper>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Animated Divider with Icon and Right-to-Left Motion */}
      {/* Divider with star has been removed as per user request */}

      <FadeInSection className="w-full">
      <section className="w-full mb-24 flex flex-col items-center py-14 luxury-section-bg">
        <h2 className="luxury-heading mb-14 text-center w-full relative inline-block">
          <span className="relative z-10">Prolong the Trail of Noamani with the Ritual:</span>
          <span className="luxury-underline"></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 px-4">
          {/* Step 1 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-card bg-white/90 rounded-[40px] shadow-2xl flex flex-col items-center p-10 w-full md:max-w-[360px] gap-6 border-2 border-transparent hover:border-[3px] hover:border-gradient-to-br hover:from-[#bfa14a] hover:to-[#fffbe6] transition-all duration-300 group bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="luxury-step text-3xl w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 animate-glow">01</span>
              <span className="text-4xl animate-bounce">🌅</span>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black uppercase text-[#bfa14a] text-center mb-2 tracking-wider drop-shadow-lg bg-white/70 px-4 py-2 rounded-xl">
                Awaken the Senses
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#bfa14a] to-[#fffbe6] rounded-full mb-4"></div>
            </div>
            <div className="luxury-img-card w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
              <Image src="/product1.jpg" alt="Awaken the Senses" width={240} height={280} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
          {/* Step 2 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-card bg-white/90 rounded-[40px] shadow-2xl flex flex-col items-center p-10 w-full md:max-w-[360px] gap-6 border-2 border-transparent hover:border-[3px] hover:border-gradient-to-br hover:from-[#bfa14a] hover:to-[#fffbe6] transition-all duration-300 group bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="luxury-step text-3xl w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 animate-glow">02</span>
              <span className="text-4xl animate-bounce">💧</span>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black uppercase text-[#bfa14a] text-center mb-2 tracking-wider drop-shadow-lg bg-white/70 px-4 py-2 rounded-xl">
                Prolong the Olfactory Experience
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#bfa14a] to-[#fffbe6] rounded-full mb-4"></div>
            </div>
            <div className="luxury-img-card w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
              <Image src="/newproduct-removebg-preview.png" alt="Prolong the Olfactory Experience" width={240} height={280} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
          {/* Step 3 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-card bg-white/90 rounded-[40px] shadow-2xl flex flex-col items-center p-10 w-full md:max-w-[360px] gap-6 border-2 border-transparent hover:border-[3px] hover:border-gradient-to-br hover:from-[#bfa14a] hover:to-[#fffbe6] transition-all duration-300 group bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="luxury-step text-3xl w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 animate-glow">03</span>
              <span className="text-4xl animate-bounce">✨</span>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black uppercase text-[#bfa14a] text-center mb-2 tracking-wider drop-shadow-lg bg-white/70 px-4 py-2 rounded-xl">
                Spray Pulse Points
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-[#bfa14a] to-[#fffbe6] rounded-full mb-4"></div>
            </div>
            <div className="luxury-img-card w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
              <Image src="/productnew.png" alt="Spray Pulse Points" width={240} height={280} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
        </div>
      </section>
    </FadeInSection>
    {/* Enhanced Discover Ritual Section */}
    <FadeInSection>
    <section className="w-full mb-28 py-10 bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="luxury-heading mb-14 text-center w-full relative inline-block">
          <span className="relative z-10">Discover the Noamani Ritual</span>
          <span className="luxury-underline"></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left: Large Image */}
          <div className="flex-[1.5] flex items-center justify-center w-full md:pr-8 mb-10 md:mb-0">
            <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-img-frame shadow-2xl">
              <Image
                src="/product1.jpg"
                alt="Noamani Ritual Banner"
                width={500}
                height={600}
                className="object-contain w-full h-full luxury-img"
                style={{ borderRadius: '32px' }}
              />
            </TiltWrapper>
          </div>
          {/* Right: Text + Button */}
          <div className="flex-1 flex flex-col items-start justify-center text-left px-4 md:pl-8" style={{ minHeight: '320px' }}>
            <div className="luxury-desc-box mb-6">
              The Noamani line is composed of products formulated with the finest natural-origin ingredients and infused with signature extracts. Prolong the trail of your Noamani fragrance with this daily ritual.
            </div>
            <button className="luxury-btn mt-4">Discover</button>
          </div>
        </div>
      </div>
    </section>
    </FadeInSection>
    {/* Side Drawer for Full Description */}
    <div className={`fixed inset-0 z-50 pointer-events-none`}>
      {/* Backdrop */}
      {showDrawer && (
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
          style={{ opacity: showDrawer ? 1 : 0 }}
          onClick={() => setShowDrawer(false)}
        ></div>
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl p-8 overflow-y-auto transition-transform duration-400 ease-in-out z-50
          ${showDrawer ? "translate-x-0" : "translate-x-full"}`}
        style={{ fontFamily: 'serif', pointerEvents: showDrawer ? 'auto' : 'none' }}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg md:text-xl font-bold tracking-widest font-serif uppercase text-gray-900" style={{ letterSpacing: 2 }}>
            Description
          </span>
          <button
            className="text-gray-400 hover:text-black text-2xl font-bold"
            onClick={() => setShowDrawer(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="text-gray-800 text-base md:text-lg leading-relaxed font-light" style={{ fontFamily: 'Georgia, serif', whiteSpace: 'pre-line' }}>
          {product.description}
        </div>
      </div>
    </div>
    {/* Add Product Reviews below product details, above Footer */}
    <ProductReviews />
    <Footer />
    {/* Google Fonts Import */}
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Marcellus&display=swap" rel="stylesheet" />
    {/* Floating Gold Particles */}
    {/* Add super-premium styles */}
    <style jsx global>{`
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes sparkle-float {
        0% { transform: translateY(0) scale(1); opacity: 0.7; }
        50% { opacity: 1; }
        100% { transform: translateY(-60px) scale(1.2); opacity: 0; }
      }
      .sparkle { pointer-events: none; z-index: 0; }
      .glassmorphism { background: rgba(255,255,255,0.7)!important; box-shadow: 0 8px 32px 0 rgba(60,60,60,0.10)!important; backdrop-filter: blur(12px)!important; border-radius: 24px!important; }
      .animate-glow { animation: glow 2s infinite alternate; }
      @keyframes glow {
        0% { filter: drop-shadow(0 0 8px #fffbe6) drop-shadow(0 0 16px #bfa14a); }
        100% { filter: drop-shadow(0 0 24px #fffbe6) drop-shadow(0 0 32px #bfa14a); }
      }
      .luxury-section-bg {
        background: #fcf8e5 !important;
        position: relative;
        overflow: visible;
      }
      .luxury-heading {
        font-family: 'Playfair Display', 'Didot', serif;
        font-size: 2.7rem;
        font-weight: 700;
        color: #1a1a1a;
        letter-spacing: 1.5px;
        position: relative;
        animation: fadeUp 1.2s cubic-bezier(.4,0,.2,1);
      }
      .luxury-underline {
        display: block;
        position: absolute;
        left: 0; right: 0; bottom: -8px;
        height: 6px;
        width: 100%;
        background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%);
        border-radius: 6px;
        opacity: 0.7;
        animation: shimmer 2.5s infinite linear;
        z-index: 0;
      }
      @keyframes shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: 200px 0; }
      }
      .luxury-desc {
        font-family: 'Marcellus', 'Georgia', serif;
        font-size: 1.18rem;
        color: #3a2e13;
        background: rgba(255,255,255,0.7);
        border-left: 5px solid #bfa14a;
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(191,161,74,0.08);
        padding: 1.1rem 1.5rem;
        font-weight: 400;
        line-height: 1.7;
        letter-spacing: 0.2px;
      }
      .luxury-desc-box {
        font-family: 'Marcellus', 'Georgia', serif;
        font-size: 1.13rem;
        color: #3a2e13;
        background: rgba(255,255,255,0.8);
        border-left: 5px solid #bfa14a;
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(191,161,74,0.10);
        padding: 1.1rem 1.5rem;
        font-weight: 400;
        line-height: 1.7;
        letter-spacing: 0.2px;
      }
      .luxury-highlight {
        color: #bfa14a;
        font-weight: 700;
        font-family: 'Playfair Display', 'Didot', serif;
        letter-spacing: 0.5px;
      }
      .luxury-btn {
        font-family: 'Marcellus', 'Georgia', serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 100%);
        border: none;
        border-radius: 999px;
        box-shadow: 0 4px 24px 0 rgba(191,161,74,0.18);
        padding: 0.9rem 2.5rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.3s, transform 0.2s;
        cursor: pointer;
        outline: none;
      }
      .luxury-btn::after {
        content: '';
        position: absolute;
        left: -75%;
        top: 0;
        width: 50%;
        height: 100%;
        background: linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.0) 100%);
        transform: skewX(-20deg);
        transition: left 0.5s;
        z-index: 1;
      }
      .luxury-btn:hover {
        box-shadow: 0 8px 32px 0 rgba(191,161,74,0.28);
        transform: scale(1.04);
      }
      .luxury-btn:hover::after {
        left: 120%;
        transition: left 0.5s;
      }
      .luxury-img-frame {
        border: none !important;
        border-image: none !important;
        box-shadow: none !important;
      }
      .luxury-img-frame:hover {
        box-shadow: 0 16px 48px 0 rgba(191,161,74,0.28), 0 4px 16px 0 rgba(0,0,0,0.08);
        border-width: 6px;
      }
      .luxury-img {
        filter: drop-shadow(0 2px 16px #bfa14a33);
        border-radius: 32px;
        transition: filter 0.3s;
      }
      .luxury-card {
        border: none !important;
        border-image: none !important;
        box-shadow: none !important;
      }
      .luxury-card:hover {
        box-shadow: 0 16px 48px 0 rgba(191,161,74,0.22), 0 4px 16px 0 rgba(0,0,0,0.08);
        border-width: 5px;
        transform: scale(1.04) translateY(-6px);
      }
      .luxury-step {
        width: 3.5rem;
        height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(120deg, #bfa14a 0%, #fffbe6 100%);
        color: #fff;
        font-size: 1.5rem;
        font-weight: 700;
        box-shadow: 0 2px 12px 0 #bfa14a55;
        margin-right: 0.75rem;
        border: 2px solid #fffbe6;
        letter-spacing: 1px;
      }
      .luxury-card-title {
        font-family: 'Playfair Display', 'Didot', serif;
        font-size: 1.18rem;
        font-weight: 700;
        color: #bfa14a;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        margin-bottom: 0.5rem;
      }
      .luxury-img-card {
        width: 100%;
        aspect-ratio: 4/5;
        max-width: 220px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 #bfa14a22;
        border: 2px solid #e5c77c;
        background: #fff;
        margin-top: 0.5rem;
      }
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      /* Floating Gold Particles */
      .luxury-particles-bg {
        pointer-events: none;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: 0;
        background: transparent;
      }
      .luxury-particles-bg::before, .luxury-particles-bg::after {
        content: '';
        position: absolute;
        width: 100vw; height: 100vh;
        background-image: radial-gradient(circle, #ffe9a7 1.5px, transparent 1.5px), radial-gradient(circle, #bfa14a 1.2px, transparent 1.2px);
        background-size: 120px 120px, 200px 200px;
        background-position: 0 0, 60px 60px;
        opacity: 0.25;
        animation: floatParticles 18s linear infinite;
      }
      .luxury-particles-bg::after {
        opacity: 0.18;
        background-size: 180px 180px, 260px 260px;
        background-position: 90px 90px, 30px 30px;
        animation-duration: 28s;
      }
      @keyframes floatParticles {
        0% { transform: translateY(0); }
        100% { transform: translateY(-40px); }
      }
      /* Glass Reflection Sheen */
      .luxury-img-frame::before, .luxury-card::before {
        content: '';
        position: absolute;
        top: -30%; left: -30%;
        width: 160%; height: 60%;
        background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 60%);
        transform: rotate(-8deg);
        pointer-events: none;
        z-index: 2;
        transition: opacity 0.4s;
        opacity: 0.7;
        animation: glassSheen 4s linear infinite;
      }
      @keyframes glassSheen {
        0% { left: -30%; opacity: 0.7; }
        50% { left: 60%; opacity: 1; }
        100% { left: 100%; opacity: 0.7; }
      }
      /* Animated Gold Border */
      .luxury-img-frame, .luxury-card {
        border-image: linear-gradient(120deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%) 1;
        border-width: 4px;
        border-style: solid;
        position: relative;
        overflow: visible;
        background-clip: padding-box;
        animation: borderGoldAnim 6s linear infinite;
      }
      @keyframes borderGoldAnim {
        0% { border-image-source: linear-gradient(120deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%); }
        50% { border-image-source: linear-gradient(240deg, #fffbe6 0%, #bfa14a 50%, #fffbe6 100%); }
        100% { border-image-source: linear-gradient(120deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%); }
      }
      /* Button Confetti (canvas) */
      .luxury-btn {
        position: relative;
        z-index: 2;
      }
      /* Super Premium SVG Backgrounds */
      .super-bg-waves {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: 0;
        pointer-events: none;
        background: linear-gradient(120deg, #fffbe6 0%, #f7f3e3 100%);
      }
      .super-bg-waves::before {
        content: '';
        position: absolute;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="%23fffbe6" fill-opacity="0.7" d="M0,160L80,170.7C160,181,320,203,480,197.3C640,192,800,160,960,133.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>');
        background-size: cover;
        opacity: 0.5;
        animation: bgWaveMove 18s linear infinite alternate;
      }
      @keyframes bgWaveMove {
        0% { background-position: 0 0; }
        100% { background-position: 0 40px; }
      }
      /* Animated Gold Section Divider */
      .super-divider {
        width: 100%;
        margin: 2.5rem 0 2rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
      }
      .super-divider svg path {
        stroke-dasharray: 300;
        stroke-dashoffset: 300;
        animation: dashAnim 2.5s cubic-bezier(.4,0,.2,1) forwards;
      }
      @keyframes dashAnim {
        to { stroke-dashoffset: 0; }
      }
      /* Animated Gold Gradient Heading with Halo */
      .luxury-heading {
        font-family: 'Playfair Display', 'Didot', serif;
        font-size: 2.7rem;
        font-weight: 700;
        background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        letter-spacing: 1.5px;
        position: relative;
        animation: fadeUp 1.2s cubic-bezier(.4,0,.2,1);
      }
      .luxury-heading::before {
        content: '';
        position: absolute;
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        width: 120%; height: 70%;
        background: radial-gradient(circle, #fffbe6 0%, #bfa14a44 60%, transparent 100%);
        filter: blur(18px);
        z-index: 0;
        opacity: 0.7;
      }
      /* Super Premium Card Redesign */
      .luxury-card {
        background: rgba(255,255,255,0.85);
        border-radius: 32px 24px 36px 28px/28px 36px 24px 32px;
        box-shadow: 0 12px 48px 0 rgba(191,161,74,0.22), 0 4px 16px 0 rgba(0,0,0,0.08);
        border: 4px solid #fffbe6;
        position: relative;
        overflow: visible;
        background-clip: padding-box;
        transition: box-shadow 0.3s, border 0.3s, transform 0.2s;
        animation: fadeUp 1.2s cubic-bezier(.4,0,.2,1);
      }
      .luxury-card::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 36px 28px 32px 24px/24px 32px 28px 36px;
        border: 3px solid;
        border-image: linear-gradient(120deg, #fffbe6 0%, #bfa14a 50%, #fffbe6 100%) 1;
        filter: blur(2px);
        opacity: 0.7;
        pointer-events: none;
        z-index: 2;
        animation: borderGoldAnim 6s linear infinite;
      }
      .luxury-card:hover {
        box-shadow: 0 24px 64px 0 rgba(191,161,74,0.32), 0 8px 32px 0 rgba(0,0,0,0.12);
        border-width: 6px;
        transform: scale(1.06) rotate(-1.5deg);
      }
      .luxury-card:hover::after {
        opacity: 1;
        filter: blur(4px);
      }
      /* Floating Sparkles on Card */
      .luxury-card::before {
        content: '';
        position: absolute;
        top: 10%; left: 10%; width: 80%; height: 80%;
        background-image: radial-gradient(circle, #ffe9a7 2px, transparent 2px), radial-gradient(circle, #bfa14a 1.2px, transparent 1.2px);
        background-size: 60px 60px, 100px 100px;
        background-position: 0 0, 30px 30px;
        opacity: 0.18;
        z-index: 1;
        pointer-events: none;
        animation: floatParticles 12s linear infinite;
      }
      /* 3D Glass Reflection */
      .luxury-img-frame::before, .luxury-card .luxury-img-card::before {
        content: '';
        position: absolute;
        top: -30%; left: -30%;
        width: 160%; height: 60%;
        background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 60%);
        transform: rotate(-8deg);
        pointer-events: none;
        z-index: 2;
        transition: opacity 0.4s;
        opacity: 0.7;
        animation: glassSheen 4s linear infinite;
      }
      /* Floating/Tilting Images */
      .luxury-img-frame, .luxury-img-card {
        box-shadow: 0 8px 32px 0 #bfa14a33, 0 2px 8px 0 rgba(0,0,0,0.04);
        border-radius: 32px;
        border: 4px solid #bfa14a;
        background: #fffbe6;
        transition: box-shadow 0.3s, border 0.3s, transform 0.2s;
        will-change: transform;
      }
      .luxury-img-frame:hover, .luxury-img-card:hover {
        box-shadow: 0 24px 64px 0 #bfa14a55, 0 8px 32px 0 rgba(0,0,0,0.12);
        border-width: 6px;
        transform: scale(1.04) rotate(1.5deg);
      }
      .luxury-img {
        filter: drop-shadow(0 2px 16px #bfa14a33);
        border-radius: 32px;
        transition: filter 0.3s;
      }
      /* Super Luxury Button */
      .luxury-btn {
        font-family: 'Marcellus', 'Georgia', serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 100%);
        border: none;
        border-radius: 999px;
        box-shadow: 0 4px 24px 0 rgba(191,161,74,0.18);
        padding: 0.9rem 2.5rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.3s, transform 0.2s;
        cursor: pointer;
        outline: none;
        z-index: 2;
      }
      .luxury-btn::after {
        content: '';
        position: absolute;
        left: -75%;
        top: 0;
        width: 50%;
        height: 100%;
        background: linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.0) 100%);
        transform: skewX(-20deg);
        transition: left 0.5s;
        z-index: 1;
      }
      .luxury-btn:hover {
        box-shadow: 0 8px 32px 0 rgba(191,161,74,0.28);
        transform: scale(1.08);
      }
      .luxury-btn:hover::after {
        left: 120%;
        transition: left 0.5s;
      }
      /* Button Ripple + Confetti */
      .luxury-btn:active {
        animation: btnRipple 0.4s;
      }
      @keyframes btnRipple {
        0% { box-shadow: 0 0 0 0 #fffbe6; }
        100% { box-shadow: 0 0 0 18px rgba(255,251,230,0); }
      }
      /* Section Entry Animation */
      .luxury-section-bg, .luxury-card, .luxury-img-frame, .luxury-heading {
        animation: fadeSlideIn 1.2s cubic-bezier(.4,0,.2,1);
      }
      @keyframes fadeSlideIn {
        0% { opacity: 0; transform: translateY(60px) scale(0.98); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      /* Remove Golden Borders for All Boxes/Images */
      .luxury-img-frame, .luxury-card, .luxury-img-card {
        border-radius: 32px !important;
        border: none !important;
        overflow: hidden;
      }
      .luxury-img-frame::before, .luxury-card::before, .luxury-card::after, .luxury-img-card::before {
        border-radius: 32px !important;
        border: none !important;
      }
      /* Force remove all borders and shadows from image frame and children */
      .luxury-img-frame, .luxury-img-frame *, .luxury-img-frame::before, .luxury-img-frame::after {
        border: none !important;
        box-shadow: none !important;
        background: none !important;
      }
    `}</style>
    <script>{`
      // Confetti on Discover button click
      if (typeof window !== 'undefined') {
        const confettiBtn = document.querySelectorAll('.luxury-btn');
        confettiBtn.forEach(btn => {
          btn.onclick = () => {
            import('canvas-confetti').then(confetti => {
              confetti.default({
                particleCount: 40,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#fffbe6', '#bfa14a', '#ffe9a7']
              });
            });
          };
        });
      }
    `}</script>
  </div>
);
}
