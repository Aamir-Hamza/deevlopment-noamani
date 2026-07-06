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
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

const inputClass =
  "pl-10 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#bfa14a]/40 focus:border-[#bfa14a] rounded-lg h-11 transition-all";
const labelClass = "text-gray-600 text-xs font-semibold uppercase tracking-wider";
const primaryButtonClass =
  "w-full bg-black hover:bg-gray-900 text-white font-semibold rounded-lg h-11 shadow-sm hover:shadow-md transition-all duration-200";

type AuthMode = "login" | "signup" | "forgot";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialMode?: AuthMode;
}

export function LoginModal({ onClose, onLoginSuccess, initialMode = "login" }: LoginModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
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
    toast.success(mode === "login" ? "Welcome back to Noamani!" : "Welcome to Noamani!", { icon: "🎉" });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#bfa14a', '#111', '#f5f0e1']
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

    if (mode === "forgot") {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        toast.success('If an account exists, a reset email has been sent.');
      } catch (err: any) {
        toast.error(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body = mode === "login"
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

      const idToken = await res.user.getIdToken();

      const response = await axios.post("/api/auth/google", { idToken });

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

  const heading =
    mode === "login" ? "Sign in" : mode === "signup" ? "Sign up" : "Forgot password";
  const subheading =
    mode === "login"
      ? "Welcome back. Enter your credentials to access your account."
      : mode === "signup"
      ? "Create an account to start your luxury fragrance journey."
      : "Enter your email and we'll send you a reset link.";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
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
          className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Column: Visual Showcase (hidden on small/medium screens) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 items-center justify-center overflow-hidden h-full">
          {/* Background image zoom animation */}
          <motion.div
            className="absolute inset-0 z-0"
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-1" />

          {/* Branding Info */}
          <div className="relative z-10 p-12 text-center flex flex-col items-center max-w-lg">
            <div className="mb-8">
              <Image
                src="/Brand_logo/nlogo.png"
                alt="Noamani Logo"
                width={110}
                height={110}
                className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
              />
            </div>

            <h2 className="text-4xl text-white tracking-wide mb-6 font-semibold" style={{ fontFamily: 'Didot, serif' }}>
              {mode === "signup" ? "Discover the Scent" : "Artistry in Scent"}
            </h2>

            <div className="w-20 h-[1.5px] bg-[#bfa14a] mb-6" />

            <p className="text-gray-100 font-serif leading-relaxed text-base italic">
              {mode === "signup"
                ? "“Crafted with care, designed to evoke emotions and leave an unforgettable signature impression.”"
                : "“Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection.”"}
            </p>
          </div>
        </div>

        {/* Right Column: Clean form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-12 md:p-16 flex items-center justify-center relative bg-white h-full overflow-y-auto">
          <div className="w-full max-w-md relative z-10 py-8">
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

            {/* Header / Brand text for desktop */}
            <div className="hidden lg:block mb-8 text-center">
              <h1
                className={`text-5xl font-normal text-gray-900 select-none ${greatVibes.className}`}
                style={{ letterSpacing: "0.02em" }}
              >
                Noamani
              </h1>
            </div>

            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 tracking-wide">{heading}</h2>
              <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{subheading}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="modal-name" className={labelClass}>
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="modal-name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={inputClass}
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <Label htmlFor="modal-email" className={labelClass}>
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="modal-email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode !== "forgot" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <Label htmlFor="modal-password" className={labelClass}>
                        Password
                      </Label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-xs text-[#a88d3f] hover:text-gray-900 transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="modal-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pr-10 ${inputClass}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="modal-confirmPassword" className={labelClass}>
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="modal-confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`pr-10 ${inputClass}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
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

              <Button type="submit" className={`${primaryButtonClass} mt-2`} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    {mode === "forgot" ? "Sending..." : "Connecting..."}
                  </>
                ) : mode === "login" ? (
                  "Continue"
                ) : mode === "signup" ? (
                  "Create Account"
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>

            {mode !== "forgot" && (
              <>
                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-3 text-xs text-gray-400 uppercase tracking-widest font-semibold">or</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Google Authentication */}
                <Button
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-lg h-11 transition-all duration-200"
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
              </>
            )}

            {/* Toggle / back links */}
            <div className="mt-6 text-center border-t border-gray-100 pt-4">
              {mode === "forgot" ? (
                <p className="text-gray-500 text-sm">
                  Remembered your password?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-gray-900 hover:text-[#a88d3f] transition-colors font-semibold focus:outline-none"
                  >
                    Back to sign in
                  </button>
                </p>
              ) : (
                <p className="text-gray-500 text-sm">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-gray-900 hover:text-[#a88d3f] transition-colors font-semibold focus:outline-none"
                  >
                    {mode === "login" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export { LoginModal as default };
