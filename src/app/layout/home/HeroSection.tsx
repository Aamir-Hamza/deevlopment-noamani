"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Kolker_Brush, Italianno } from 'next/font/google';

const kolker = Kolker_Brush({ subsets: ['latin'], weight: ['400'] });
const italianno = Italianno({ weight: '400', subsets: ['latin'] });

export default function HeroSection() {
  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')" }}>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      {/* Noamani Heading */}
      <div className="absolute top-10 sm:top-14 md:top-16 left-0 w-full flex justify-center z-20 pointer-events-none select-none px-4">
        <motion.h1
          className={italianno.className}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontSize: "clamp(2.5rem, 10vw, 5rem)",
            fontWeight: 400,
            color: "#fff",
            letterSpacing: "2px",
            textShadow: "0 4px 32px #fff8, 0 1px 1px #00000055",
            zIndex: 50,
            position: "relative",
          }}
        >
          Noamani
        </motion.h1>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-serif font-light tracking-wider mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Discover Your Signature Scent
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Luxury fragrances and skincare crafted with the finest ingredients for
          the modern individual
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link
            href="/shop"
            className="inline-block bg-white text-brand-dark px-6 sm:px-8 py-2.5 sm:py-3 rounded-sm font-medium tracking-wider text-xs sm:text-sm uppercase hover:bg-brand-pink transition-colors duration-300 mr-2 sm:mr-4"
          >
            Shop Now
          </Link>
          <Link
            href="/quiz/start"
            className="inline-block bg-transparent border border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-sm font-medium tracking-wider text-xs sm:text-sm uppercase hover:bg-white/20 transition-colors duration-300"
          >
            Find Your Scent
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
