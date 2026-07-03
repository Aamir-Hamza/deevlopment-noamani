"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import confetti from 'canvas-confetti';
import { useCart } from "@/context/CartContext";
import { Italianno, Great_Vibes, Playfair_Display } from 'next/font/google';
import Link from "next/link";

const italianno = Italianno({ weight: '400', subsets: ['latin'] });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const playfair = Playfair_Display({ weight: ['400', '600', '700'], subsets: ['latin'] });

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { addToCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSuccess = async (user: any) => {
    localStorage.setItem("userInfo", JSON.stringify(user));
    toast.success(isLogin ? "Welcome back to Noamani!" : "Welcome to Noamani!", { icon: "🎉" });
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111']
    });

    window.dispatchEvent(new Event("userLogin"));
    
    if (onLoginSuccess) {
      onLoginSuccess();
    }

    // Check for pending cart item in localStorage
    const pendingItem = localStorage.getItem("pendingCartItem");
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem);
        await addToCart(item);
        localStorage.removeItem("pendingCartItem");
      } catch (error) {
        console.error("Error adding pending item to cart:", error);
      }
    }

    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      await handleSuccess(data.user);
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
        await handleSuccess(response.data.user);
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#060504]">
      {/* Full-Screen Modal Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full flex overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 p-2.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Column: Visual Showcase (hidden on small/medium screens) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#0e0c0a] items-center justify-center overflow-hidden h-full">
          {/* Background image zoom animation */}
          <motion.div 
            className="absolute inset-0 z-0 opacity-45"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
          >
            <Image
              src="/Home/Home-center.jpg"
              alt="Noamani Scent Showcase"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-tr from-[#060504] via-transparent to-transparent z-1" />
          <div className="absolute inset-0 bg-black/40 z-1" />

          {/* Branding Info */}
          <div className="relative z-10 p-12 text-center flex flex-col items-center max-w-lg">
            <div className="mb-8">
              <Image
                src="/Brand_logo/nlogo.png"
                alt="Noamani Logo"
                width={130}
                height={130}
                className="object-contain filter drop-shadow-[0_4px_12px_rgba(191,161,74,0.4)]"
              />
            </div>

            <h2 className={`text-4xl text-[#fffbe6] tracking-wider mb-6 font-semibold ${playfair.className}`}>
              {isLogin ? "Artistry in Scent" : "Discover the Scent"}
            </h2>

            <div className="w-20 h-[1.5px] bg-[#bfa14a] mb-6" />

            <p className="text-gray-300 font-serif leading-relaxed text-base italic">
              {isLogin 
                ? "“Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection.”"
                : "“Crafted with care, designed to evoke emotions and leave an unforgettable signature impression.”"}
            </p>
          </div>
        </div>

        {/* Right Column: Clean transparent form with NO card container */}
        <div className="w-full lg:w-1/2 p-6 sm:p-12 md:p-16 flex items-center justify-center relative bg-[#090807] h-full overflow-y-auto">
          {/* Decorative background glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#bfa14a]/5 blur-[100px] pointer-events-none" />

          <div className="w-full max-w-md relative z-10 py-8">
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

            {/* Header / Brand text for desktop */}
            <div className="hidden lg:block mb-8 text-center">
              <h1 className={`text-5xl font-normal text-white select-none ${greatVibes.className}`} style={{ letterSpacing: "0.02em" }}>
                Noamani
              </h1>
            </div>

            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-[#fffbe6] tracking-wide font-sans">
                {isLogin ? "Sign in" : "Sign up"}
              </h2>
              <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                {isLogin 
                  ? "Welcome back. Enter your credentials to access your account." 
                  : "Create an account to start your luxury fragrance journey."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="modal-name" className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <Input
                        id="modal-name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-11 transition-all"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <Label htmlFor="modal-email" className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="modal-email"
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
                  <Label htmlFor="modal-password" className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                    Password
                  </Label>
                  {isLogin && (
                    <Link href="/forgot-password" onClick={onClose} className="text-xs text-[#bfa14a] hover:text-[#fffbe6] transition-colors">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="modal-password"
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

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="modal-confirmPassword" className="text-gray-300 text-xs font-semibold uppercase tracking-wider">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <Input
                        id="modal-confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-11 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#bfa14a] to-[#9c7e33] hover:from-[#cfb25a] hover:to-[#bfa14a] text-black font-semibold rounded-lg h-11 shadow-lg shadow-[#bfa14a]/10 hover:shadow-[#bfa14a]/20 hover:scale-[1.01] transition-all duration-200 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Connecting...
                  </>
                ) : isLogin ? (
                  "Continue"
                ) : (
                  "Create Account"
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

            {/* Toggle switch between Login / Signup */}
            <div className="mt-6 text-center border-t border-amber-600/5 pt-4">
              <p className="text-gray-400 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#bfa14a] hover:text-[#fffbe6] transition-colors font-semibold focus:outline-none"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
export { LoginModal as default };
