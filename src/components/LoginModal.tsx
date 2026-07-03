"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Eye, EyeOff, Loader2, X, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import confetti from 'canvas-confetti';
import { useCart } from "@/context/CartContext";
import { Italianno, Great_Vibes, Playfair_Display } from 'next/font/google';
import { AdminLogin } from "@/components/AdminLogin";

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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl h-[min(640px,90vh)] bg-[#090807] border border-amber-600/10 rounded-3xl overflow-hidden flex shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Showcase (hidden on small screens) */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#0e0c0a] items-center justify-center overflow-hidden">
          {/* Background image zoom animation */}
          <motion.div 
            className="absolute inset-0 z-0 opacity-40"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
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
          <div className="absolute inset-0 bg-black/30 z-1" />

          {/* Branding Info */}
          <div className="relative z-10 p-10 text-center flex flex-col items-center">
            <div className="mb-6">
              <Image
                src="/Brand_logo/nlogo.png"
                alt="Noamani Logo"
                width={100}
                height={100}
                className="object-contain filter drop-shadow-[0_4px_12px_rgba(191,161,74,0.35)]"
              />
            </div>

            <h2 className={`text-3xl text-[#fffbe6] tracking-wider mb-4 font-semibold ${playfair.className}`}>
              {isLogin ? "Artistry in Scent" : "Discover the Scent"}
            </h2>

            <div className="w-16 h-[1px] bg-[#bfa14a] mb-5" />

            <p className="text-gray-300 font-serif leading-relaxed text-sm italic max-w-sm">
              {isLogin 
                ? "&ldquo;Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection.&rdquo;"
                : "&ldquo;Crafted with care, designed to evoke emotions and leave an unforgettable signature impression.&rdquo;"}
            </p>
          </div>
        </div>

        {/* Right Column: Clean transparent form with NO card container */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative bg-gradient-to-b from-[#0e0c0a] to-[#090807] overflow-y-auto">
          {/* Decorative background glows */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#bfa14a]/5 blur-[80px] pointer-events-none" />

          <div className="w-full relative z-10">
            {/* Header / Brand text */}
            <div className="text-center mb-6">
              <h1 className={`text-4xl font-normal text-white select-none ${greatVibes.className}`} style={{ letterSpacing: "0.02em" }}>
                Noamani
              </h1>
            </div>

            <div className="mb-5 text-center md:text-left">
              <h2 className="text-xl font-bold text-[#fffbe6] tracking-wide font-sans">
                {isLogin ? "Sign in" : "Sign up"}
              </h2>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                {isLogin 
                  ? "Welcome back. Enter your credentials to access your account." 
                  : "Create an account to start your luxury fragrance journey."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="modal-name" className="text-gray-300 text-[10px] font-semibold uppercase tracking-wider">
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
                        className="pl-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-10 transition-all text-sm"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <Label htmlFor="modal-email" className="text-gray-300 text-[10px] font-semibold uppercase tracking-wider">
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
                    className="pl-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-10 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="modal-password" className="text-gray-300 text-[10px] font-semibold uppercase tracking-wider">
                    Password
                  </Label>
                  {isLogin && (
                    <Link href="/forgot-password" onClick={onClose} className="text-[10px] text-[#bfa14a] hover:text-[#fffbe6] transition-colors">
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
                    className="pl-10 pr-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-10 transition-all text-sm"
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
                    <Label htmlFor="modal-confirmPassword" className="text-gray-300 text-[10px] font-semibold uppercase tracking-wider">
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
                        className="pl-10 pr-10 bg-[#0d0b0a]/90 border border-amber-600/10 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#bfa14a] focus:border-[#bfa14a] focus:bg-black rounded-lg h-10 transition-all text-sm"
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
                className="w-full bg-gradient-to-r from-[#bfa14a] to-[#9c7e33] hover:from-[#cfb25a] hover:to-[#bfa14a] text-black font-semibold rounded-lg h-10 shadow-lg shadow-[#bfa14a]/10 hover:shadow-[#bfa14a]/20 hover:scale-[1.01] transition-all duration-200 mt-2 text-sm"
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
            <div className="my-5 flex items-center">
              <div className="flex-1 border-t border-amber-600/10"></div>
              <span className="px-3 text-[10px] text-gray-600 uppercase tracking-widest font-semibold">or</span>
              <div className="flex-1 border-t border-amber-600/10"></div>
            </div>

            {/* Google Authentication */}
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-black border border-amber-600/10 hover:bg-[#12100e] text-white hover:text-[#fffbe6] hover:border-amber-600/20 rounded-lg h-10 transition-all duration-200"
              onClick={handleLoginWithGoogle}
              disabled={socialLoading}
            >
              {socialLoading ? (
                <Loader2 className="animate-spin w-4 h-4 text-[#bfa14a]" />
              ) : (
                <Image src="/button_icon/google.png" alt="Google Logo" width={16} height={16} />
              )}
              <span className="text-xs font-medium">Continue with Google</span>
            </Button>

            {/* Toggle switch between Login / Signup */}
            <div className="mt-5 text-center border-t border-amber-600/5 pt-3">
              <p className="text-gray-400 text-xs">
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

            {/* Admin trigger button for Login */}
            {isLogin && (
              <div className="mt-3">
                <Button
                  onClick={() => setShowAdminLogin(true)}
                  className="w-full bg-[#181614] border border-[#262320] text-gray-400 hover:text-white hover:bg-[#201d1a] rounded-lg h-9 transition-all flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider"
                >
                  <ShieldAlert className="w-3 h-3 text-[#bfa14a]" />
                  Admin Access Only
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Admin Login Modal overlay */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
}
export { LoginModal as default };
