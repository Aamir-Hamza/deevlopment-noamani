'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Playfair_Display } from 'next/font/google'

// Lazy-load heavy sections to speed up initial paint
const FeaturedProducts = dynamic(() => import('./layout/home/FeaturedProducts'), { ssr: false })
const ProductReviews = dynamic(() => import('@/components/ProductReviews'), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] })

export default function Home() {
  // Defer hero video until after hydration for faster LCP
  const [showHeroVideo, setShowHeroVideo] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowHeroVideo(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Lazy-load secondary video when it enters viewport
  const storyRef = useRef<HTMLDivElement | null>(null)
  const [showStoryVideo, setShowStoryVideo] = useState(false)
  useEffect(() => {
    if (!storyRef.current || showStoryVideo) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowStoryVideo(true)
          observer.disconnect()
        }
      })
    }, { rootMargin: '200px' })
    observer.observe(storyRef.current)
    return () => observer.disconnect()
  }, [showStoryVideo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Hero Section with deferred video */}
      <div className="relative h-screen w-full overflow-hidden">
        {showHeroVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/Home/Home-center.jpg"
            className="absolute top-0 left-0 min-h-screen w-full object-cover"
          >
            <source src="/video/a.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/Home/Home-center.jpg"
            alt="Hero background"
            className="absolute top-0 left-0 min-h-screen w-full object-cover"
            loading="eager"
          />
        )}

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center text-white pt-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`mb-6 text-4xl md:text-5xl font-bold relative inline-block luxury-shimmer ${playfair.className}`}
          >
            Luxury Perfumes
            <span className="absolute left-0 top-0 w-full h-full shimmer-overlay pointer-events-none" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 text-lg md:text-xl font-serif text-gold-200/90 subtitle-shimmer"
          >
            Discover your signature scent
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/shop"
              className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition-all duration-300 ease-in-out hover:bg-gray-200 hover:scale-105 hover:shadow-lg"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Brand Story Section */}
      <div className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[32px] mb-6" style={{ fontFamily: 'Didot, serif' }}>Our Story</h2>
              <p className="text-[15px] text-gray-600 mb-6">
                Discover the world of <span className="font-semibold text-black">Noamani-Fragrance</span>, where artistry meets luxury. Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection. Our fragrances are designed to evoke unforgettable emotions, leaving a signature impression of elegance and sophistication. Experience the essence of true luxury—crafted for those who desire distinction in every detail.
              </p>
              <Link
                href="/about"
                className="inline-block mt-4 text-gray-800 font-semibold border-b-2 border-gray-800 hover:text-black hover:border-black transition-colors transition-all duration-300 ease-in-out hover:scale-105 hover:shadow"
              >
                Learn More About Us
              </Link>
            </div>
            <div ref={storyRef} className="relative aspect-square overflow-hidden w-full max-w-[400px] mx-auto rounded-2xl shadow-lg">
              {showStoryVideo ? (
                <video
                  src="/video/pv.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  poster="/ourstoryimg.png"
                />
              ) : (
                <img
                  src="/ourstoryimg.png"
                  alt="Our story"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductReviews />
      <Footer />
    </motion.div>
  )
}