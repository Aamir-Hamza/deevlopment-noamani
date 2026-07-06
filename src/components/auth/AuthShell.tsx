"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

interface AuthShellProps {
  eyebrow: string;
  quote: string;
  children: React.ReactNode;
}

export default function AuthShell({ eyebrow, quote, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-white flex font-sans overflow-x-hidden">
      {/* Left Column: Visual Showcase (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
        >
          <Image
            src="/Home/Home-center.jpg"
            alt="Noamani Luxury Scent Showcase"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Soft overlay so text stays legible over the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-1" />

        {/* Branding Info */}
        <div className="relative z-10 max-w-lg p-12 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/Brand_logo/nlogo.png"
              alt="Noamani Logo"
              width={120}
              height={120}
              className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl text-white tracking-wide mb-6 font-semibold"
            style={{ fontFamily: 'Didot, serif' }}
          >
            {eyebrow}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="w-20 h-[1.5px] bg-[#bfa14a] mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-100 font-serif leading-relaxed text-base italic"
          >
            &ldquo;{quote}&rdquo;
          </motion.p>
        </div>

        {/* Back shortcut */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm uppercase tracking-widest font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative bg-white">
        {/* Return to website button for mobile view */}
        <Link
          href="/"
          className="lg:hidden absolute top-6 left-6 z-10 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo on top of form for small screens */}
          <div className="text-center lg:hidden mb-8 flex flex-col items-center">
            <Image
              src="/Brand_logo/nlogo.png"
              alt="Noamani Logo"
              width={64}
              height={64}
              className="object-contain mb-3"
            />
            <h1 className={`text-4xl font-normal text-gray-900 ${greatVibes.className}`}>
              Noamani
            </h1>
          </div>

          {/* Title / Brand header inside form for desktop */}
          <div className="hidden lg:block mb-8">
            <h1
              className={`text-5xl font-normal text-center text-gray-900 select-none ${greatVibes.className}`}
              style={{ letterSpacing: "0.02em" }}
            >
              Noamani
            </h1>
          </div>

          {children}

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-4 text-xs text-gray-400">
            <Link href="/legal/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/legal/terms" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export const authInputClass =
  "pl-10 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#bfa14a]/40 focus:border-[#bfa14a] rounded-lg h-11 transition-all";

export const authLabelClass = "text-gray-600 text-xs font-semibold uppercase tracking-wider";

export const authPrimaryButtonClass =
  "w-full bg-black hover:bg-gray-900 text-white font-semibold rounded-lg h-11 shadow-sm hover:shadow-md transition-all duration-200";
