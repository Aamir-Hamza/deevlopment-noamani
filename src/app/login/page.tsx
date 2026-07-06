"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Great_Vibes } from 'next/font/google';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

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
        colors: ['#bfa14a', '#111', '#f5f0e1']
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

      const idToken = await res.user.getIdToken();

      const response = await axios.post("/api/auth/google", { idToken });

      if (response.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        toast.success("Welcome to Noamani Perfumes! 🎉");
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#bfa14a', '#111', '#f5f0e1']
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

        {/* Soft light overlay so text stays legible over the photo */}
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
            className="text-gray-100 font-serif leading-relaxed text-base italic"
          >
            &ldquo;Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection.&rdquo;
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

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 tracking-wide">Sign in</h2>
            <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
              Welcome back. Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#bfa14a]/40 focus:border-[#bfa14a] rounded-lg h-11 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs text-[#a88d3f] hover:text-gray-900 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#bfa14a]/40 focus:border-[#bfa14a] rounded-lg h-11 transition-all"
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
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold rounded-lg h-11 shadow-sm hover:shadow-md transition-all duration-200"
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

          {/* Sign Up Link */}
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-gray-900 hover:text-[#a88d3f] transition-colors font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-4 text-xs text-gray-400">
            <Link
              href="/legal/privacy"
              className="hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link
              href="/legal/terms"
              className="hover:text-gray-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
