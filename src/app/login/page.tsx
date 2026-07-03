"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Italianno, Great_Vibes, Playfair_Display } from 'next/font/google';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const italianno = Italianno({ weight: '400', subsets: ['latin'] });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const playfair = Playfair_Display({ weight: ['400', '600', '700'], subsets: ['latin'] });

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      toast.success("Welcome back to Noamani!", { icon: "✨" });
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111']
      });
      
      window.dispatchEvent(new Event("userLogin"));
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setSocialLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      if (!res?.user) {
        toast.error("Google authentication failed");
        return;
      }

      const { displayName, email, photoURL, providerId, uid } = res.user;

      const response = await axios.post("/api/auth/google", {
        name: displayName,
        email,
        photoURL,
        providerId,
        uid,
      });

      if (response.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        toast.success("Welcome to Noamani Perfumes! 🎉");
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111']
        });
        window.dispatchEvent(new Event("userLogin"));
        window.location.href = "/";
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong during Google login");
    } finally {
      setSocialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            <h2 className="text-2xl font-bold text-[#fffbe6] tracking-wide font-sans">Sign in</h2>
            <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
              Welcome back. Enter your credentials to access your account.
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-11 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs text-[#bfa14a] hover:text-[#fffbe6] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-11 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
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
                  Connecting...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-amber-600/10"></div>
            <span className="px-3 text-xs text-gray-600 uppercase tracking-widest font-semibold">or</span>
            <div className="flex-1 border-t border-amber-600/10"></div>
          </div>

          {/* Google Authentication */}
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-2.5 bg-black border border-amber-600/10 hover:bg-[#12100e] text-white hover:text-[#fffbe6] hover:border-amber-600/20 rounded-lg h-11 transition-all duration-200"
            onClick={handleLoginWithGoogle}
            disabled={socialLoading}
          >
            {socialLoading ? (
              <Loader2 className="animate-spin w-4 h-4 text-[#bfa14a]" />
            ) : (
              <Image src="/button_icon/google.png" alt="Google Logo" width={18} height={18} />
            )}
            <span className="text-sm font-medium">Continue with Google</span>
          </Button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center border-t border-amber-600/5 pt-4">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="text-[#bfa14a] hover:text-[#fffbe6] transition-colors font-semibold"
              >
                Create an account
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