"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { Great_Vibes, Playfair_Display } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const playfair = Playfair_Display({ weight: ['400', '600', '700'], subsets: ['latin'] });

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      toast.success('If an account exists, an email has been sent.');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060504] flex font-sans overflow-x-hidden">
      {/* Left Column: Visual Showcase (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0e0c0a] items-center justify-center overflow-hidden">
        {/* Background Image with slow Ken Burns effect */}
        <motion.div
          className="absolute inset-0 z-0 opacity-45"
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

        {/* Ambient overlay shadows */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#060504] via-transparent to-transparent z-1" />
        <div className="absolute inset-0 bg-black/40 z-1" />

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
              width={140}
              height={140}
              className="object-contain filter drop-shadow-[0_4px_12px_rgba(191,161,74,0.4)]"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-4xl text-[#fffbe6] tracking-wider mb-6 font-semibold ${playfair.className}`}
          >
            Artistry in Scent
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
            className="text-gray-300 font-serif leading-relaxed text-base italic"
          >
            &ldquo;Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection.&rdquo;
          </motion.p>
        </div>

        {/* Back shortcut */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Right Column: Form (No container border or box) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative bg-[#090807]">
        {/* Decorative corner background glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#bfa14a]/5 blur-[100px] pointer-events-none" />

        {/* Return to website button for mobile view */}
        <Link
          href="/"
          className="lg:hidden absolute top-6 left-6 z-10 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo on top of form for small screens */}
          <div className="text-center lg:hidden mb-8 flex flex-col items-center">
            <Image
              src="/Brand_logo/nlogo.png"
              alt="Noamani Logo"
              width={70}
              height={70}
              className="object-contain mb-3 filter drop-shadow-[0_2px_8px_rgba(191,161,74,0.3)]"
            />
            <h1 className={`text-4xl font-normal text-white ${greatVibes.className}`}>
              Noamani
            </h1>
          </div>

          {/* Title / Brand header inside form for desktop */}
          <div className="hidden lg:block mb-8">
            <h1 className={`text-5xl font-normal text-center text-white select-none ${greatVibes.className}`} style={{ letterSpacing: "0.02em" }}>
              Noamani
            </h1>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-[#fffbe6] tracking-wide font-sans">Forgot password</h2>
            <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-11 transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#bfa14a] to-[#9c7e33] hover:from-[#cfb25a] hover:to-[#bfa14a] text-black font-semibold rounded-lg h-11 shadow-lg shadow-[#bfa14a]/10 hover:shadow-[#bfa14a]/20 hover:scale-[1.01] transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          {/* Back to Sign In Link */}
          <div className="mt-6 text-center border-t border-amber-600/5 pt-4">
            <p className="text-gray-400 text-sm">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="text-[#bfa14a] hover:text-[#fffbe6] transition-colors font-semibold"
              >
                Back to sign in
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-4 text-xs text-gray-600">
            <Link
              href="/legal/privacy"
              className="hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link
              href="/legal/terms"
              className="hover:text-gray-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
