"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { auth, RecaptchaVerifier } from "@/lib/firebase";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithPhoneNumber } from "firebase/auth";
import confetti from 'canvas-confetti';

// Declare recaptchaVerifier on window for TypeScript
// @ts-ignore
if (typeof window !== 'undefined' && !('recaptchaVerifier' in window)) {
  (window as any).recaptchaVerifier = undefined;
}

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
  onLoginSuccess?: () => void;
}

export function AuthForm({ isLogin, onToggle, onLoginSuccess }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  // Removed all OTP/phone login state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // LOGIN
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
        toast.success("Welcome to Noamani Perfumes!", { icon: "🎉" });
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111']
        });
        window.dispatchEvent(new Event("userLogin"));
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
      } else {
        // SIGNUP
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userLogin"));
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      if (!res?.user) {
        toast.error("Google authentication failed");
        return;
      }

      const { displayName, email, photoURL, providerId, uid } = res.user;

      // 🔄 Use correct Google login API
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
          origin: { y: 0.7 },
          colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111']
        });
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong during Google login");
    }
  };

  // Remove handleSendOtp and handleVerifyOtp functions

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 w-full max-w-sm mx-auto glow-animation shadow-2xl border border-gold-400 bg-black/70"
    >
      {/* Toggle Buttons */}
      <div className="flex mb-6 bg-black/50 rounded-xl p-1 shadow-lg">
        <motion.button
          onClick={() => !isLogin && onToggle()}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            isLogin
              ? "bg-yellow-300 text-white shadow-lg"
              : "text-gold-200 hover:text-gray-400 text-white"
          }`}
        >
          Login
        </motion.button>
        <motion.button
          onClick={() => isLogin && onToggle()}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 text-white ${
            !isLogin ? "bg-yellow-300 shadow-lg " : "text-gold-200 "
          }`}
        >
          Sign Up
        </motion.button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Only show email/password fields */}
        <>
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-12 bg-black/60 border border-gold-400 text-yellow-200 placeholder:text-yellow-300 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 w-5 h-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-12 bg-black/60 border border-gold-400 text-yellow-200 placeholder:text-yellow-300 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 w-5 h-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-12 pr-12 bg-black/60 border border-gold-400 text-yellow-200 placeholder:text-yellow-300 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold-400 hover:text-yellow-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
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
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-12 bg-black/60 border border-gold-400 text-yellow-200 placeholder:text-yellow-300 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            variant="luxury"
            className="w-full mt-4 luxury-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading...
                Please wait
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </Button>
        </>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gold-400/30"></div>
        <span className="px-4 text-sm text-gold-300">or</span>
        <div className="flex-1 border-t border-gold-400/30"></div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100"
          size="lg"
          onClick={handleLoginWithGoogle}
        >
          <Image src="/button_icon/google.png" alt="Google Logo" width={20} height={20} />
          <span className="text-gray-700">Continue with Google</span>
        </Button>
      </div>
    </motion.div>
  );
}
