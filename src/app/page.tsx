'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Playfair_Display } from 'next/font/google'
import { Truck, ShieldCheck, Gift, RotateCcw } from 'lucide-react'

// Lazy-load heavy sections to speed up initial paint
const FeaturedProducts = dynamic(() => import('./layout/home/FeaturedProducts'), { ssr: false })
const ProductReviews = dynamic(() => import('@/components/ProductReviews'), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] })

const trustPoints = [
  { icon: Truck, label: 'Free Shipping', subtext: 'On orders above ₹2,000' },
  { icon: ShieldCheck, label: '100% Authentic', subtext: 'Guaranteed genuine' },
  { icon: Gift, label: 'Free Samples', subtext: 'With every order' },
  { icon: RotateCcw, label: 'Easy Returns', subtext: '30-day policy' },
]

const categories = [
  { label: 'Bestsellers', href: '/bestsellers', image: '/product1.jpg' },
  { label: 'New Arrivals', href: '/new-arrivals', image: '/product3.jpg' },
  { label: 'Gifts & Sets', href: '/gifts', image: 'https://images.pexels.com/photos/3738338/pexels-photo-3738338.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2' },
  { label: 'Recreations', href: '/product/recreations', image: '/product4.jpg' },
]

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
      {/* ─── Hero ─── */}
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

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center text-white px-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-white/70 mb-5"
          >
            Noamani Fragrance House
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`mb-6 text-4xl md:text-6xl font-bold relative inline-block luxury-shimmer ${playfair.className}`}
          >
            Luxury Perfumes
            <span className="absolute left-0 top-0 w-full h-full shimmer-overlay pointer-events-none" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mb-10 text-lg md:text-xl font-serif text-gold-200/90 subtitle-shimmer"
          >
            Discover your signature scent
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/shop"
              className="rounded-full bg-white px-8 py-3 text-base font-semibold text-black transition-all duration-300 ease-in-out hover:bg-gray-200 hover:scale-105 hover:shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/quiz"
              className="rounded-full border border-white/60 px-8 py-3 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-white/10 hover:scale-105"
            >
              Find Your Scent
            </Link>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <span className="w-px h-8 bg-white/40" />
        </motion.div>
      </div>

      {/* ─── Trust Bar ─── */}
      <div className="bg-black text-white py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex items-center gap-3 justify-center md:justify-start">
              <point.icon className="w-6 h-6 text-[#bfa14a] flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium leading-tight">{point.label}</p>
                <p className="text-xs text-white/50 leading-tight hidden sm:block">{point.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Shop by Category ─── */}
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bfa14a] mb-3">
              Explore
            </p>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: 'Didot, serif' }}>
              Shop by Category
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Link href={cat.href} className="group block">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <p className="text-center text-sm sm:text-base font-medium text-gray-900 group-hover:text-[#bfa14a] transition-colors">
                    {cat.label}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Featured Products (carousel, CTA banner, quiz CTA) ─── */}
      <FeaturedProducts />

      {/* ─── Brand Story ─── */}
      <div className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bfa14a] mb-3">
                Our Heritage
              </p>
              <h2 className="text-[32px] mb-6" style={{ fontFamily: 'Didot, serif' }}>Our Story</h2>
              <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                Discover the world of <span className="font-semibold text-black">Noamani-Fragrance</span>, where artistry meets luxury. Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection. Our fragrances are designed to evoke unforgettable emotions, leaving a signature impression of elegance and sophistication. Experience the essence of true luxury—crafted for those who desire distinction in every detail.
              </p>
              <Link
                href="/about"
                className="inline-block mt-4 text-gray-800 font-semibold border-b-2 border-gray-800 hover:text-black hover:border-black transition-colors transition-all duration-300 ease-in-out hover:scale-105 hover:shadow"
              >
                Learn More About Us
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              ref={storyRef}
              className="relative aspect-square overflow-hidden w-full max-w-[400px] mx-auto rounded-2xl shadow-lg"
            >
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
            </motion.div>
          </div>
        </div>
      </div>

      <ProductReviews />
      <Footer />
    </motion.div>
  )
}
